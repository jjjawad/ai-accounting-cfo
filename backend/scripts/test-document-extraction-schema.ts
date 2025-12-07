import { ExtractedDocumentSchema } from "../lib/ai/document-extraction-schema";

const sample = {
  documentType: "invoice",
  supplierCustomerType: "supplier",
  vendorName: "ACME Trading LLC",
  vendorVatNumber: "AE123456789",
  invoiceNumber: "INV-001",
  issueDate: "2025-01-15",
  dueDate: "2025-02-14",
  currency: "AED",
  netAmount: 1500,
  vatAmount: 75,
  totalAmount: 1575,
  vatRate: 0.05,
  vatCode: "STANDARD_5",
  confidence: 0.95,
  lineItems: [
    {
      description: "Consulting services",
      quantity: 1,
      unitPrice: 1500,
      netAmount: 1500,
      vatAmount: 75,
      categoryHint: "Professional Services",
    },
  ],
};

try {
  const parsed = ExtractedDocumentSchema.parse(sample);
  console.log("[Step 10.1] ExtractedDocumentSchema sample parsed OK:", parsed);
} catch (error) {
  console.error("[Step 10.1] ExtractedDocumentSchema sample FAILED:", error);
  process.exitCode = 1;
}
