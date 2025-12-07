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
    const { id } = await context.params; // 👈 IMPORTANT: await the params Promise

    if (!id || typeof id !== "string" || !isValidUuid(id)) {
      return badRequest("Invalid file id", { code: "INVALID_FILE_ID" });
    }

    // Parse body
    let body: { ocrText?: string };
    try {
      body = (await request.json()) as { ocrText?: string };
    } catch {
      return badRequest("Invalid JSON body", {
        code: "INVALID_JSON_BODY",
      });
    }

    if (!body.ocrText || typeof body.ocrText !== "string" || !body.ocrText.trim()) {
      return badRequest("Missing or invalid ocrText", {
        code: "INVALID_OCR_TEXT",
      });
    }

    const supabase = getSupabaseServerClient();

    // Load file to get company_id and ensure it exists
    const { data: file, error: fileError } = await supabase
      .from("files")
      .select("id, company_id")
      .eq("id", id)
      .maybeSingle();

    if (fileError) {
      console.error("[/api/files/[id]/ocr-text] File lookup error", fileError);
      return serverError("Failed to look up file", {
        code: "FILE_LOOKUP_FAILED",
      });
    }

    if (!file) {
      return notFound("File not found", {
        code: "FILE_NOT_FOUND",
      });
    }

    // RLS guard (dev bypass handled inside assertUserBelongsToCompany)
    await assertUserBelongsToCompany({
      userId: user.userId,
      companyId: file.company_id as string,
    });

    const { error: updateError } = await supabase
      .from("files")
      .update({
        ocr_text: body.ocrText,
      })
      .eq("id", id)
      .eq("company_id", file.company_id);

    if (updateError) {
      console.error(
        "[/api/files/[id]/ocr-text] Failed to update OCR text",
        updateError
      );
      return serverError("Failed to save OCR text", {
        code: "OCR_TEXT_SAVE_FAILED",
      });
    }

    return ok({
      file_id: id,
      status: "ocr_text_saved",
    });
  } catch (error) {
    console.error("[/api/files/[id]/ocr-text] Unexpected error", error);

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

    return serverError("Unexpected error while saving OCR text", {
      code: "OCR_TEXT_UNEXPECTED_ERROR",
    });
  }
}
