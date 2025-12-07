import { buildDocumentExtractionMessages } from "../lib/ai/document-extraction-prompt";

const sampleOcrText = `
  TAX INVOICE
  Vendor: ABC Trading LLC
  TRN: 123456789
  Date: 2025-01-15
  Due Date: 2025-02-14
  Item: Advisory Services 1 x 1,500.00
  VAT 5%: 75.00
  Total (incl. VAT): AED 1,575.00
`;

const messages = buildDocumentExtractionMessages({
  ocrText: sampleOcrText.trim(),
  fileTypeHint: "invoice",
  currencyHint: "AED",
  localeHint: "en-AE",
  companyNameHint: "Sample Client LLC",
});

console.log("System message content:\n", messages[0]?.content ?? "");
console.log("\nUser message content:\n", messages[1]?.content ?? "");
