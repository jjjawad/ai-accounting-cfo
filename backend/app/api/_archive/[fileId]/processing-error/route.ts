import { NextRequest } from "next/server";
import { z } from "zod";
import { badRequest, notFound, ok, serverError } from "../../../../../server/api/_utils/responses";
import { getSupabaseServerClient } from "../../../../../lib/supabase/server-client";
import { markFileAsError } from "../../../../../lib/pipeline/file-error";

const BodySchema = z.object({
  error_code: z.string().min(1, "error_code is required"),
});

// n8n should call this endpoint when upstream OCR steps fail (e.g., Google Vision errors, unsupported file).
// error_code examples: OCR_FAILED, UNSUPPORTED_FILE_TYPE, OCR_TEXT_PERSIST_FAILED.
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await context.params;

    if (!fileId || typeof fileId !== "string") {
      return badRequest("Missing or invalid fileId", { code: "INVALID_FILE_ID" });
    }

    const supabase = getSupabaseServerClient();
    const { data: file, error: fetchError } = await supabase
      .from("files")
      .select("id")
      .eq("id", fileId)
      .maybeSingle();

    if (fetchError) {
      return serverError("Failed to load file", { code: "FILE_LOOKUP_FAILED" });
    }

    if (!file) {
      return notFound("File not found", { code: "FILE_NOT_FOUND" });
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

    await markFileAsError(fileId, parsed.data.error_code);

    await supabase.from("system_logs").insert({
      company_id: null,
      level: "error",
      source: "pipeline_error",
      message: "Pipeline reported error",
      context: {
        fileId,
        errorCode: parsed.data.error_code,
        source: "n8n",
      },
    });

    return ok({
      file_id: fileId,
      status: "error",
      error_code: parsed.data.error_code,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    return serverError("Unexpected error while handling pipeline error", {
      code: "PIPELINE_ERROR_HANDLER_FAILED",
    });
  }
}
