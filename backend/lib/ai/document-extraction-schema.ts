import { z } from "zod";

export const ExtractedLineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().nonnegative().nullable().optional(),
  unitPrice: z.number().nonnegative().nullable().optional(),
  netAmount: z.number().nonnegative(),
  vatAmount: z.number().nonnegative().nullable().optional(),
  categoryHint: z.string().min(1).nullable().optional(),
});

export const ExtractedDocumentSchema = z.object({
  documentType: z.enum(["invoice", "receipt"]),
  supplierCustomerType: z.enum(["supplier", "customer"]).nullable().optional(),
  vendorName: z.string().min(1),
  vendorVatNumber: z.string().min(1).nullable().optional(),
  invoiceNumber: z.string().min(1).nullable().optional(),
  issueDate: z.string(),
  dueDate: z.string().nullable().optional(),
  currency: z.string().min(1),
  netAmount: z.number().nonnegative(),
  vatAmount: z.number().nonnegative().nullable().optional(),
  totalAmount: z.number().nonnegative(),
  vatRate: z.number().nonnegative().nullable().optional(),
  vatCode: z.string().min(1).nullable().optional(),
  confidence: z.number().min(0).max(1).nullable().optional(),
  lineItems: z.array(ExtractedLineItemSchema).min(1),
});

export type ExtractedLineItem = z.infer<typeof ExtractedLineItemSchema>;
export type ExtractedDocument = z.infer<typeof ExtractedDocumentSchema>;

// Mapping notes to Supabase models:
// - ExtractedDocument.documentType -> files.type (invoice/receipt) and informs invoices.type alongside supplierCustomerType.
// - ExtractedDocument.supplierCustomerType -> invoices.type ('supplier' or 'customer').
// - ExtractedDocument.vendorName -> resolve/create vendors.name -> invoices.vendor_id.
// - ExtractedDocument.vendorVatNumber -> used when resolving vendor and VAT compliance checks.
// - ExtractedDocument.invoiceNumber -> invoices.invoice_number.
// - ExtractedDocument.issueDate -> invoices.date (ISO date string expected).
// - ExtractedDocument.dueDate -> invoices.due_date.
// - ExtractedDocument.currency -> invoices.currency (ISO currency code).
// - ExtractedDocument.netAmount -> invoices.total_amount minus vat_amount; also sum of lineItems.netAmount.
// - ExtractedDocument.vatAmount -> invoices.vat_amount.
// - ExtractedDocument.totalAmount -> invoices.total_amount (gross amount).
// - ExtractedDocument.vatRate -> useful for VAT calculations and deriving vat_amount if not provided.
// - ExtractedDocument.vatCode -> lookup vat_codes.code -> invoices.vat_code_id.
// - ExtractedDocument.confidence -> informs files.status or downstream QA thresholds.
// - ExtractedDocument.lineItems -> invoice_line_items rows.
//   - description -> invoice_line_items.description
//   - quantity -> invoice_line_items.quantity
//   - unitPrice -> invoice_line_items.unit_price
//   - netAmount -> invoice_line_items.net_amount
//   - vatAmount -> invoice_line_items.vat_amount
//   - categoryHint -> used to resolve categories.name -> invoice_line_items.category_id
