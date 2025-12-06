import crypto from "node:crypto";
import { NextRequest } from "next/server";
import { FileUploadRequestSchema } from "../../../../lib/validation/file-schema";
import { badRequest, forbidden, ok, serverError } from "../../../../server/api/_utils/responses";
import { assertUserBelongsToCompany, requireUser } from "../../../../lib/auth/server-auth";
import { StorageUploadError, uploadFileToStorage } from "../../../../lib/supabase/storage";
import { getSupabaseServerClient } from "../../../../lib/supabase/server-client";

async function autoTriggerFileProcessing(request: NextRequest, fileId: string): Promise<void> {
  const currentUrl = new URL(request.url);
  const processUrl = new URL(`/api/files/${fileId}/process`, currentUrl.origin);

  const headers: HeadersInit = {};
  const authHeader = request.headers.get("authorization");
  const cookieHeader = request.headers.get("cookie");

  if (authHeader) {
    headers["authorization"] = authHeader;
  }

  if (cookieHeader) {
    headers["cookie"] = cookieHeader;
  }

  const response = await fetch(processUrl.toString(), {
    method: "POST",
    headers,
  });

  if (!response.ok) {
    console.error(
      "[/api/files/upload] Auto-trigger processing failed",
      fileId,
      response.status,
      response.statusText
    );
    throw new Error(`AUTO_TRIGGER_FAILED_${response.status}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request as unknown as Request);
    const formData = await request.formData();

    const file = formData.get("file");
    const companyId = formData.get("company_id");
    const type = formData.get("type");

    const fileIsBlob = typeof Blob !== "undefined" && file instanceof Blob;
    const companyIdValue = typeof companyId === "string" ? companyId : null;

    if (!fileIsBlob || !companyIdValue) {
      return badRequest("Invalid upload payload", {
        code: "INVALID_UPLOAD_PAYLOAD",
        details: { hasFile: fileIsBlob, companyId: companyIdValue },
      });
    }

    const payload = {
      company_id: companyIdValue,
      type: typeof type === "string" ? type : undefined,
    };

    const parsed = FileUploadRequestSchema.safeParse(payload);

    if (!parsed.success) {
      return badRequest("Invalid upload payload", {
        code: "INVALID_UPLOAD_PAYLOAD",
        details: parsed.error.format(),
      });
    }

    const validated = parsed.data;

    await assertUserBelongsToCompany({
      userId: user.userId,
      companyId: validated.company_id,
    });

    const arrayBuffer = await file.arrayBuffer();
    const fileBody = Buffer.from(arrayBuffer);
    const originalName = (file as File).name || "upload";
    const contentType = (file as File).type || "application/octet-stream";
    const fileId =
      typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `tmp_${Date.now().toString(36)}`;

    const { storagePath } = await uploadFileToStorage({
      companyId: validated.company_id,
      type: validated.type,
      fileId,
      originalName,
      contentType,
      fileBody,
    });

    const supabase = getSupabaseServerClient();

    const { data, error: insertError } = await supabase
      .from("files")
      .insert({
        company_id: validated.company_id,
        storage_path: storagePath,
        type: validated.type ?? "other",
        original_name: originalName,
        mime_type: contentType,
        size_bytes: (file as File).size ?? fileBody.byteLength,
        ocr_text: null,
        status: "uploaded",
        error_message: null,
      })
      .select("id")
      .single();

    if (insertError || !data) {
      return serverError("Failed to create file record", {
        code: "FILE_INSERT_FAILED",
      });
    }

    try {
      await autoTriggerFileProcessing(request, data.id as string);
    } catch (err) {
      console.error("[/api/files/upload] Auto-trigger processing error", data.id, err);
    }

    return ok({
      file_id: data.id,
      status: "uploaded",
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    if (error instanceof Error) {
      if (error.message === "NOT_COMPANY_MEMBER") {
        return forbidden("User is not a member of this company", {
          code: "NOT_COMPANY_MEMBER",
        });
      }

      if (error.message === "MEMBERSHIP_LOOKUP_FAILED") {
        return serverError("Could not verify company membership", {
          code: "MEMBERSHIP_LOOKUP_FAILED",
        });
      }

      if (error instanceof StorageUploadError || error.name === "StorageUploadError") {
        return serverError("Failed to upload file to storage", {
          code: "STORAGE_UPLOAD_FAILED",
        });
      }
    }

    return serverError("Unexpected error while handling file upload", {
      code: "UPLOAD_UNEXPECTED_ERROR",
    });
  }
}
