import type { ExtractedDocument } from "./document-extraction-schema";
import type { ChatMessage } from "../external/openai";

export type FileTypeHint = "invoice" | "receipt" | "unknown";

export interface BuildDocumentExtractionMessagesArgs {
  ocrText: string;
  fileTypeHint?: FileTypeHint;
  currencyHint?: string;
  localeHint?: string;
  companyNameHint?: string | null;
}

/**
 * Builds system + user chat messages instructing the LLM to output ONLY JSON
 * that matches ExtractedDocument (invoice/receipt with vendor, invoice number, dates, currency, net/vat/total, VAT rate/code, and lineItems).
 * If OCR text is not an invoice/receipt or is unclear, the model must still return the same JSON shape,
 * preferring nulls/empty strings and minimal amounts over hallucination (downstream Zod validation will enforce correctness in Step 10.7).
 */
export function buildDocumentExtractionMessages(
  args: BuildDocumentExtractionMessagesArgs
): ChatMessage[] {
  const {
    ocrText,
    fileTypeHint = "unknown",
    currencyHint,
    localeHint,
  companyNameHint,
} = args;

  const systemContent = [
    "You are an AI engine that converts OCR text from UAE invoices or receipts into structured JSON for bookkeeping.",
    "Always follow UAE context: prefer AED when clearly printed or implied; standard VAT 5% unless text shows zero-rated, exempt, out-of-scope, or reverse-charge. If currency is ambiguous, use the provided currency hint or leave null.",
    "Use ONLY fields from the ExtractedDocument schema (camelCase):",
    '- documentType: "invoice" | "receipt".',
    '- supplierCustomerType: "supplier" | "customer" | null (maps to invoice type).',
    "- vendorName: required string; vendorVatNumber: string | null.",
    "- invoiceNumber: string | null.",
    "- issueDate: ISO date string (yyyy-mm-dd); dueDate: ISO date string or null.",
    "- currency: ISO currency (default AED if clearly UAE); netAmount, vatAmount (nullable), totalAmount numbers.",
    "- vatRate: number | null (e.g., 0.05); vatCode: string | null (STANDARD_5, ZERO, EXEMPT, OUT_OF_SCOPE, REVERSE_CHARGE, etc.).",
    "- confidence: number | null between 0 and 1.",
    "- lineItems: array of { description, quantity (number|null), unitPrice (number|null), netAmount, vatAmount (number|null), categoryHint (string|null) }.",
    "Rules:",
    "- Dates: pick the date explicitly labeled as Tax Invoice Date / Invoice Date. If multiple dates appear, prefer the invoice date over statement/print dates; dueDate only if explicitly labeled.",
    "- Totals: totalAmount must be the payable amount including VAT. netAmount is before VAT. If multiple totals, choose the one labeled 'Total Amount (incl. VAT)' or 'Total AED'. Do not use subtotals or ex-VAT amounts as totalAmount.",
    "- VAT: if VAT is absent or 0%, set vatAmount to 0 or null and vatRate to 0 or null; do not invent VAT.",
    "- Vendor: vendorName must be the clean legal name only (no address, no TRN). Put TRN/Tax ID into vendorVatNumber when present.",
    "- Line items: keep separate items; do not merge unrelated lines. Preserve discounts/shipping/fees as separate items if present. Quantities/units go to quantity; keep unitPrice when shown.",
    "- Output must be raw JSON only. No markdown, code fences, or explanations.",
    "- Use double quotes for all keys/strings; no trailing commas; produce a single JSON object.",
    "- Do not invent totals or VAT; use null when unclear. Sum of line net amounts should align with netAmount; vatAmount sums line VAT when available.",
    "- If text is not an invoice/receipt or is too noisy, still return this JSON shape with nulls/zeros and best-effort single line item describing what is known.",
    "UAE VAT hints:",
    "- Standard 5% applies to most domestic goods/services.",
    "- Zero-rated for exports/international transport/qualifying goods; Exempt for financial services/residential rent; Out-of-scope for tips/donations; Reverse-charge when buyer accounts for VAT on imports/b2b cross-border.",
  ].join("\n");

  const userContent = [
    "Extract the document into the JSON object described above.",
    "When multiple totals exist, choose the payable amount that explicitly includes VAT (e.g., 'Total Amount (Incl VAT)' or 'Total AED').",
    "When multiple dates exist, prefer 'Tax Invoice Date'/'Invoice Date'; only fall back to other dates if no invoice date is present.",
    "Vendor name must exclude addresses/TRN; capture TRN in vendorVatNumber.",
    `FILE_TYPE_HINT: ${fileTypeHint}`,
    `CURRENCY_HINT: ${currencyHint ?? "unknown"}`,
    `LOCALE_HINT: ${localeHint ?? "unknown"}`,
    `COMPANY_NAME_HINT: ${companyNameHint ?? "null"}`,
    "OCR_TEXT:",
    ocrText,
    "",
    "Return only valid JSON for a single ExtractedDocument. Do not include any explanation before or after the JSON.",
  ].join("\n");

  return [
    { role: "system", content: systemContent },
    { role: "user", content: userContent },
  ];
}

// Export type to keep linkage with the extraction schema visible to callers.
export type { ExtractedDocument };
