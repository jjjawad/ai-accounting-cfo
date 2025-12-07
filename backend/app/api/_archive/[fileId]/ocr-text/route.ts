import { NextRequest } from "next/server";
import { z } from "zod";
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from "../../../../../server/api/_utils/responses";
import { assertUserBelongsToCompany, requireUser } from "../../../../../lib/auth/server-auth";
import { getSupabaseServerClient } from "../../../../../lib/supabase/server-client";

const BodySchema = z.object({
  ocrText: z.string().min(1, "ocrText is required"),
  status: z.enum(["processing", "processed_ocr"]).optional(),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ fileId: string }> }
) {
  try {
    const user = await requireUser(request as unknown as Request);
    const { fileId } = await context.params;

    if (!fileId || typeof fileId !== "string") {
      return badRequest("Missing or invalid fileId", {
        code: "INVALID_FILE_ID",
        details: { fileId },
      });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return badRequest("Invalid JSON body", { code: "INVALID_JSON" });
    }

    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Invalid payload", {
        code: "INVALID_BODY",
        details: parsed.error.format(),
      });
    }

    const supabase = getSupabaseServerClient();

    const { data: file, error: fetchError } = await supabase
      .from("files")
      .select("id, company_id")
      .eq("id", fileId)
      .maybeSingle();

    if (fetchError) {
      return serverError("Failed to look up file", {
        code: "FILE_LOOKUP_FAILED",
      });
    }

    if (!file) {
      return notFound("File not found", { code: "FILE_NOT_FOUND" });
    }

    await assertUserBelongsToCompany({ userId: user.userId, companyId: file.company_id });

    const requestedStatus = parsed.data.status ?? "processed_ocr";
    // Map to an allowed DB status until file_status enum includes processed_ocr.
    const dbStatus = requestedStatus === "processed_ocr" ? "processing" : requestedStatus;

    const { data: updated, error: updateError } = await supabase
      .from("files")
      .update({
        ocr_text: parsed.data.ocrText,
        status: dbStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", fileId)
      .eq("company_id", file.company_id)
      .select("id, status")
      .maybeSingle();

    if (updateError || !updated) {
      return serverError("Failed to update file OCR text", {
        code: "FILE_OCR_UPDATE_FAILED",
      });
    }

    return ok({
      file_id: updated.id,
      status: updated.status,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    return serverError("Unexpected error while storing OCR text", {
      code: "OCR_TEXT_STORE_FAILED",
    });
  }
}
