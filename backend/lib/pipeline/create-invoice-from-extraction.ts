import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { ExtractedDocument } from "../ai/document-extraction-schema";
import type { FileStatus, FileType } from "../../../frontend/types/file";

const FileRowSchema = z.object({
  id: z.string(),
  company_id: z.string(),
});

type FileRow = z.infer<typeof FileRowSchema>;

export interface CreateInvoiceFromExtractionArgs {
  supabase: SupabaseClient;
  file: FileRow;
  extracted: ExtractedDocument;
}

function deriveFileType(extracted: ExtractedDocument): FileType {
  if (extracted.documentType === "invoice" || extracted.documentType === "receipt") {
    return extracted.documentType;
  }
  return extracted.invoiceNumber ? "invoice" : "receipt";
}

function deriveFileStatus(extracted: ExtractedDocument): FileStatus {
  const hasVendor = !!extracted.vendorName && extracted.vendorName.trim().length > 0;
  const hasInvoiceNumber = !!extracted.invoiceNumber && extracted.invoiceNumber.trim().length > 0;
  const hasDate = !!extracted.issueDate && extracted.issueDate.trim().length > 0;
  const hasCurrency = !!extracted.currency && extracted.currency.trim().length > 0;
  const hasTotal = typeof extracted.totalAmount === "number" && Number.isFinite(extracted.totalAmount);
  const hasLineItems = Array.isArray(extracted.lineItems) && extracted.lineItems.length > 0;

  const isComplete = hasVendor && hasInvoiceNumber && hasDate && hasCurrency && hasTotal && hasLineItems;
  return isComplete ? "processed" : "needs_review";
}

async function resolveVendorId(params: {
  supabase: SupabaseClient;
  companyId: string;
  vendorName: string | null;
}): Promise<string | null> {
  const { supabase, companyId, vendorName } = params;
  if (!vendorName || vendorName.trim().length === 0) {
    return null;
  }

  const { data, error } = await supabase
    .from("vendors")
    .select("id, name")
    .eq("company_id", companyId)
    .ilike("name", vendorName.trim())
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.id ?? null;
}

async function resolveVatCodeId(params: {
  supabase: SupabaseClient;
  companyId: string;
  vatCode: string | null;
}): Promise<string | null> {
  const { supabase, companyId, vatCode } = params;
  if (!vatCode || vatCode.trim().length === 0) {
    return null;
  }

  const { data, error } = await supabase
    .from("vat_codes")
    .select("id, code")
    .eq("company_id", companyId)
    .eq("code", vatCode.trim())
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.id ?? null;
}

export async function createInvoiceFromExtraction(
  args: CreateInvoiceFromExtractionArgs
): Promise<{
  invoice: Record<string, any>;
  lineItems: Record<string, any>[];
  fileType: FileType;
  fileStatus: FileStatus;
}> {
  const parsedFile = FileRowSchema.parse(args.file);
  const { supabase, extracted } = args;

  const vendorId = await resolveVendorId({
    supabase,
    companyId: parsedFile.company_id,
    vendorName: extracted.vendorName ?? null,
  });

  const vatCodeId = await resolveVatCodeId({
    supabase,
    companyId: parsedFile.company_id,
    vatCode: extracted.vatCode ?? null,
  });

  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      company_id: parsedFile.company_id,
      file_id: parsedFile.id,
      vendor_id: vendorId,
      invoice_number: extracted.invoiceNumber ?? null,
      date: extracted.issueDate,
      due_date: extracted.dueDate ?? null,
      total_amount: extracted.totalAmount,
      currency: extracted.currency,
      vat_amount: extracted.vatAmount ?? null,
      vat_code_id: vatCodeId,
      type: "supplier",
      status: "unpaid",
    })
    .select("*")
    .maybeSingle();

  if (invoiceError || !invoice) {
    throw invoiceError ?? new Error("Failed to insert invoice");
  }

  const lineItemsPayload = extracted.lineItems.map((item) => ({
    invoice_id: invoice.id,
    description: item.description,
    quantity: item.quantity ?? null,
    unit_price: item.unitPrice ?? null,
    net_amount: item.netAmount,
    vat_amount: item.vatAmount ?? null,
    category_id: null,
  }));

  const { data: lineItems, error: lineItemsError } = await supabase
    .from("invoice_line_items")
    .insert(lineItemsPayload)
    .select("*");

  if (lineItemsError || !lineItems) {
    throw lineItemsError ?? new Error("Failed to insert invoice line items");
  }

  const fileType = deriveFileType(extracted);
  const fileStatus = deriveFileStatus(extracted);

  const { error: fileUpdateError } = await supabase
    .from("files")
    .update({
      type: fileType,
      status: fileStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsedFile.id);

  if (fileUpdateError) {
    throw fileUpdateError;
  }

  return { invoice, lineItems, fileType, fileStatus };
}
