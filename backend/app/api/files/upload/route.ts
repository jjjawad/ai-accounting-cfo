import crypto from "node:crypto";
import { NextRequest } from "next/server";

import { FileUploadRequestSchema } from "../../../../lib/validation/file-schema";
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from "../../../../server/api/_utils/responses";
import {
  assertUserBelongsToCompany,
  getUserOrDevBypass,
} from "../../../../lib/auth/server-auth";
import {
  StorageUploadError,
  uploadFileToStorage,
} from "../../../../lib/supabase/storage";
import { getSupabaseServerClient } from "../../../../lib/supabase/server-client";

const DEV_BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === "true";
const DEV_COMPANY_ID = process.env.DEV_COMPANY_ID;

async function autoTriggerFileProcessing(
  request: NextRequest,
  fileId: string
): Promise<void> {
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
    // Dev-only auth bypass is handled inside getUserOrDevBypass for local testing.
    const user = await getUserOrDevBypass(request as unknown as Request);

    const formData = await request.formData();

    const file = formData.get("file");
    const companyId = formData.get("company_id");
    const type = formData.get("type");

    // Be defensive about the file type – just check that it has arrayBuffer()
    const hasFile =
      file != null && typeof (file as any).arrayBuffer === "function";
    const companyIdValue = typeof companyId === "string" ? companyId : null;

    if (!hasFile || !companyIdValue) {
      console.error("[/api/files/upload] Invalid upload payload", {
        hasFile,
        companyIdValue,
        rawType: typeof type,
      });

      return badRequest("Invalid upload payload", {
        code: "INVALID_UPLOAD_PAYLOAD",
        details: { hasFile, companyId: companyIdValue },
      });
    }

    const payload = {
      company_id: companyIdValue,
      type: typeof type === "string" ? type : undefined,
    };

    const parsed = FileUploadRequestSchema.safeParse(payload);

    if (!parsed.success) {
      console.error("[/api/files/upload] Upload payload schema error", {
        issues: parsed.error.format(),
      });

      return badRequest("Invalid upload payload", {
        code: "INVALID_UPLOAD_PAYLOAD",
        details: parsed.error.format(),
      });
    }

    const validated = parsed.data;

    // 🔹 Dev-only company remap: turn "company_1" into a real UUID from DEV_COMPANY_ID
    const devMode =
      DEV_BYPASS_AUTH && process.env.NODE_ENV !== "production";

    const effectiveCompanyId =
      devMode && DEV_COMPANY_ID ? DEV_COMPANY_ID : validated.company_id;

    if (devMode && DEV_COMPANY_ID) {
      console.warn(
        "[/api/files/upload] DEV_BYPASS_AUTH=true - remapping company_id",
        { from: validated.company_id, to: effectiveCompanyId }
      );
    }

    // RLS / membership guard (skips DB check in dev because of assertUserBelongsToCompany dev bypass)
    await assertUserBelongsToCompany({
      userId: user.userId,
      companyId: effectiveCompanyId,
    });

    // Read file binary
    const fileLike = file as any;
    const arrayBuffer = await fileLike.arrayBuffer();
    const fileBody = Buffer.from(arrayBuffer);

    const originalName =
      (fileLike.name as string | undefined) || "upload";
    const contentType =
      (fileLike.type as string | undefined) || "application/octet-stream";
    const sizeBytes =
      typeof fileLike.size === "number"
        ? fileLike.size
        : fileBody.byteLength;

    const fileId =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `tmp_${Date.now().toString(36)}`;

    // 🔹 STORAGE SECTION
    // In dev (DEV_BYPASS_AUTH=true) we skip real Supabase Storage upload
    // and just synthesize a fake storagePath so the rest of the pipeline works.
    let storagePath: string;

    if (DEV_BYPASS_AUTH && process.env.NODE_ENV !== "production") {
      storagePath = `dev/${effectiveCompanyId}/${fileId}-${originalName}`;
      console.warn(
        "[/api/files/upload] DEV_BYPASS_AUTH=true - skipping Supabase Storage upload, using fake storagePath",
        storagePath
      );
    } else {
      const storageResult = await uploadFileToStorage({
        companyId: effectiveCompanyId,
        type: validated.type,
        fileId,
        originalName,
        contentType,
        fileBody,
      });

      storagePath = storageResult.storagePath;
    }

    // Create DB record
    const supabase = getSupabaseServerClient();

    const { data, error: insertError } = await supabase
      .from("files")
      .insert({
        company_id: effectiveCompanyId,
        storage_path: storagePath,
        type: validated.type ?? "other",
        original_name: originalName,
        mime_type: contentType,
        size_bytes: sizeBytes,
        ocr_text: null,
        status: "uploaded",
        error_message: null,
      })
      .select("id")
      .single();

    if (insertError || !data) {
      console.error("[/api/files/upload] File insert error", insertError);

      return serverError("Failed to create file record", {
        code: "FILE_INSERT_FAILED",
      });
    }

    // Best-effort auto trigger – failure is logged but does not break upload
    try {
      await autoTriggerFileProcessing(request, data.id as string);
    } catch (err) {
      console.error(
        "[/api/files/upload] Auto-trigger processing error",
        data.id,
        err
      );
    }

    return ok({
      file_id: data.id,
      status: "uploaded",
    });
  } catch (error: any) {
    console.error("[/api/files/upload] Unexpected error", error);

    if (error instanceof Response) {
      // In case some helper already constructed a Response
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

      if (
        error instanceof StorageUploadError ||
        error.name === "StorageUploadError"
      ) {
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
