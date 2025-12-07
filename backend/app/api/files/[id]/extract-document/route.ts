import { NextRequest } from "next/server";
import {
  badRequest,
  forbidden,
  notFound,
  ok,
  serverError,
} from "../../../../../server/api/_utils/responses";
import {
  assertUserBelongsToCompany,
  getUserOrDevBypass,
} from "../../../../../lib/auth/server-auth";
import { getSupabaseServerClient } from "../../../../../lib/supabase/server-client";

const DEV_BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === "true";

function isValidUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Dev-only auth bypass enabled via getUserOrDevBypass for local testing.
    const user = await getUserOrDevBypass(request as unknown as Request);
    const { id } = await context.params; // params is a Promise in app routes

    if (!id || typeof id !== "string" || !isValidUuid(id)) {
      return badRequest("Invalid file id", { code: "INVALID_FILE_ID" });
    }

    const supabase = getSupabaseServerClient();

    // Load file with ocr_text so we know there's something to extract
    const { data: file, error: fileError } = await supabase
      .from("files")
      .select("id, company_id, ocr_text, status, type")
      .eq("id", id)
      .maybeSingle();

    if (fileError) {
      console.error(
        "[/api/files/[id]/extract-document] File lookup error",
        fileError
      );
      return serverError("Failed to look up file", {
        code: "FILE_LOOKUP_FAILED",
      });
    }

    if (!file) {
      return notFound("File not found", { code: "FILE_NOT_FOUND" });
    }

    // RLS guard (dev-bypass is handled inside assertUserBelongsToCompany)
    await assertUserBelongsToCompany({
      userId: user.userId,
      companyId: file.company_id as string,
    });

    if (!file.ocr_text || typeof file.ocr_text !== "string") {
      return badRequest("File has no OCR text to extract from", {
        code: "MISSING_OCR_TEXT",
      });
    }

    const isDevStub =
      DEV_BYPASS_AUTH && process.env.NODE_ENV !== "production";

    if (isDevStub) {
      // 🔹 DEV STUB MODE
      // We *pretend* we extracted an invoice and just mark the file as processed.
      const { data: updatedFile, error: updateError } = await supabase
        .from("files")
        .update({
          status: "processed",
          type: file.type ?? "invoice",
          error_message: null,
        })
        .eq("id", id)
        .eq("company_id", file.company_id)
        .select("id, status, type")
        .maybeSingle();

      if (updateError || !updatedFile) {
        console.error(
          "[/api/files/[id]/extract-document] Failed to update file status",
          updateError
        );
        return serverError("Failed to update file status", {
          code: "FILE_STATUS_UPDATE_FAILED",
        });
      }

      return ok({
        file_id: updatedFile.id,
        status: updatedFile.status,
        mode: "dev_stub",
      });
    }

    // 🔹 REAL PIPELINE (future, when n8n is wired)
    // For now, if we're not in dev stub mode, just say it's not configured.
    return serverError("Extraction pipeline not configured", {
      code: "EXTRACTION_NOT_CONFIGURED",
    });
  } catch (error) {
    console.error(
      "[/api/files/[id]/extract-document] Unexpected error",
      error
    );

    if (error instanceof Response) {
      return error;
    }

    if (error instanceof Error) {
      if (error.message === "NOT_COMPANY_MEMBER") {
        return forbidden("User is not a member of this company", {
          code: "FILE_CROSS_COMPANY_ACCESS",
        });
      }

      if (error.message === "MEMBERSHIP_LOOKUP_FAILED") {
        return serverError("Could not verify company membership", {
          code: "MEMBERSHIP_LOOKUP_FAILED",
        });
      }
    }

    return serverError("Unexpected error while extracting document", {
      code: "EXTRACT_DOCUMENT_UNEXPECTED_ERROR",
    });
  }
}