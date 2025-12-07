# Document Extraction QA Notes

## QA Round 1 — December 7, 2025

### Sample Set
- 5 UAE VAT invoices/receipts: telecom, utilities, supermarket (English/Arabic mix), SaaS subscription, fuel receipt.
- Mix of native PDFs and scanned images with stamps and QR codes.

### Issues Observed
- Dates: model sometimes picked statement/print date instead of tax invoice date; due date was occasionally swapped.
- Totals/VAT: occasionally used subtotal (excl. VAT) as total; VAT 0% invoices returned vatAmount instead of null/0.
- Vendor: vendorName occasionally included address/TRN lines; TRN captured inside vendorName instead of vendorVatNumber.
- Line items: multi-line descriptions merged; discounts/shipping dropped; currency inferred incorrectly when AED not explicitly printed.

### Prompt Changes (applied in 10.12)
- Clarified date selection: prefer explicit “Tax invoice date”/“Invoice date”; only use other dates if no invoice date is present; due date must be labeled or omitted.
- Clarified totals: totalAmount must be the payable amount incl. VAT; netAmount is pre-VAT; if multiple totals, pick the one labeled “Total Amount (incl VAT)”/“Total AED”.
- Vendor hygiene: vendorName must be the clean legal name without TRN/address; TRN goes to vendorVatNumber.
- Line items: keep separate items, keep discounts/shipping/fees as separate lines, do not merge; retain quantities if present.
- Currency: default to AED for UAE context when explicit, otherwise use the printed currency code; avoid guessing alternate currencies.

### Schema Changes
- None for this round (prompt-only refinements).

