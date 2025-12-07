import { NextRequest } from "next/server";
import { z } from "zod";
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from "../../../../../server/api/_utils/responses";
import { requireUser, assertUserBelongsToCompany } from "../../../../../lib/auth/server-auth";
import { getSupabaseServerClient } from "../../../../../lib/supabase/server-client";
import {
  buildDocumentExtractionMessages,
  type BuildDocumentExtractionMessagesArgs,
} from "../../../../../lib/ai/document-extraction-prompt";
import {
  ExtractedDocumentSchema,
  type ExtractedDocument,
} from "../../../../../lib/ai/document-extraction-schema";
import { callOpenAIChatJSON } from "../../../../../lib/external/openai";
import { createInvoiceFromExtraction } from "../../../../../lib/pipeline/create-invoice-from-extraction";
import { markFileAsError } from "../../../../../lib/pipeline/file-error";

const FileRowSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  type: z.string().nullable(),
  ocr_text: z.string().nullable(),
  currency: z.string().nullable().optional(),
});

type FileRow = z.infer<typeof FileRowSchema>;

function cleanJsonString(raw: string): string {
  return raw.trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
}

async function logExtractionError(params: {
  fileId: string;
  companyId: string | null;
  error: unknown;
  raw?: string | null;
}) {
  const supabase = getSupabaseServerClient();
  const context: Record<string, unknown> = {
    fileId: params.fileId,
  };

  if (params.raw) {
    context.raw = params.raw;
  }

  if (params.error instanceof Error) {
    context.error = params.error.message;
    context.stack = params.error.stack;
  } else if (typeof params.error === "string") {
    context.error = params.error;
  } else {
    context.error = JSON.stringify(params.error);
  }

  await supabase.from("system_logs").insert({
    company_id: params.companyId,
    level: "error",
    source: "document_extraction",
    message: "Document extraction failed",
    context,
  });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ fileId: string }> }
) {
  try {
    const user = await requireUser(request as unknown as Request);
    const { fileId } = await context.params;

    if (!fileId || typeof fileId !== "string") {
      return badRequest("Missing or invalid fileId", { code: "INVALID_FILE_ID" });
    }

    const supabase = getSupabaseServerClient();

    const { data: file, error: fetchError } = await supabase
      .from("files")
      .select("id, company_id, type, ocr_text, currency")
      .eq("id", fileId)
      .maybeSingle();

    if (fetchError) {
      return serverError("Failed to load file", { code: "FILE_LOOKUP_FAILED" });
    }

    if (!file) {
      return notFound("File not found", { code: "FILE_NOT_FOUND" });
    }

    const parsedFile: FileRow = FileRowSchema.parse(file);

    await assertUserBelongsToCompany({ userId: user.userId, companyId: parsedFile.company_id });

    if (!parsedFile.ocr_text || parsedFile.ocr_text.trim().length === 0) {
      return badRequest("File has no OCR text yet. Run OCR before extraction.", {
        code: "MISSING_OCR_TEXT",
      });
    }

    const fileTypeHint: BuildDocumentExtractionMessagesArgs["fileTypeHint"] =
      parsedFile.type === "invoice" || parsedFile.type === "receipt" ? parsedFile.type : "unknown";

    const messages = buildDocumentExtractionMessages({
      ocrText: parsedFile.ocr_text,
      fileTypeHint,
      currencyHint: parsedFile.currency ?? undefined,
      localeHint: "en-AE",
      companyNameHint: null,
    });

    let rawContent: string;
    try {
      rawContent = await callOpenAIChatJSON(messages);
    } catch (error) {
      await logExtractionError({
        fileId: parsedFile.id,
        companyId: parsedFile.company_id,
        error,
      });
      await markFileAsError(parsedFile.id, "EXTRACTION_OPENAI_ERROR");
      return serverError("OpenAI extraction call failed", { code: "OPENAI_EXTRACTION_FAILED" });
    }

    const cleaned = cleanJsonString(rawContent);

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(cleaned);
    } catch (error) {
      await logExtractionError({
        fileId: parsedFile.id,
        companyId: parsedFile.company_id,
        error,
        raw: cleaned,
      });
      await markFileAsError(parsedFile.id, "EXTRACTION_INVALID_JSON");
      return serverError("Extraction returned invalid JSON", { code: "EXTRACTION_JSON_PARSE_FAILED" });
    }

    const validated = ExtractedDocumentSchema.safeParse(parsedJson);
    if (!validated.success) {
      await logExtractionError({
        fileId: parsedFile.id,
        companyId: parsedFile.company_id,
        error: validated.error,
        raw: cleaned,
      });
      await markFileAsError(parsedFile.id, "EXTRACTION_VALIDATION_FAILED");
      return badRequest("Extraction JSON failed schema validation", {
        code: "EXTRACTION_SCHEMA_FAILED",
        details: validated.error.format(),
      });
    }

    const extractedDocument: ExtractedDocument = validated.data;

    try {
      const { invoice, lineItems, fileStatus, fileType } = await createInvoiceFromExtraction({
        supabase,
        file: parsedFile,
        extracted: extractedDocument,
      });

      return ok({
        fileId: parsedFile.id,
        status: "ok",
        extractedDocument,
        invoice: {
          id: invoice.id,
          lineItemCount: lineItems.length,
        },
        file: {
          type: fileType,
          status: fileStatus,
        },
      });
    } catch (error) {
      await logExtractionError({
        fileId: parsedFile.id,
        companyId: parsedFile.company_id,
        error,
      });
      return serverError("Failed to create invoice from extraction", {
        code: "INVOICE_CREATION_FAILED",
      });
    }
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    return serverError("Unexpected error during document extraction", {
      code: "EXTRACTION_UNEXPECTED_ERROR",
    });
  }
}
