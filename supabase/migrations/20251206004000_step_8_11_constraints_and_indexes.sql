-- Step 8.11: add missing foreign keys/uniques and key indexes for core tables

-- Foreign keys for bank_transactions to optional references
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bank_transactions_source_file_fk'
  ) THEN
    ALTER TABLE public.bank_transactions
    ADD CONSTRAINT bank_transactions_source_file_fk FOREIGN KEY (source_file_id) REFERENCES public.files(id);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bank_transactions_category_fk'
  ) THEN
    ALTER TABLE public.bank_transactions
    ADD CONSTRAINT bank_transactions_category_fk FOREIGN KEY (category_id) REFERENCES public.categories(id);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bank_transactions_vendor_fk'
  ) THEN
    ALTER TABLE public.bank_transactions
    ADD CONSTRAINT bank_transactions_vendor_fk FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bank_transactions_vat_code_fk'
  ) THEN
    ALTER TABLE public.bank_transactions
    ADD CONSTRAINT bank_transactions_vat_code_fk FOREIGN KEY (vat_code_id) REFERENCES public.vat_codes(id);
  END IF;
END
$$;

-- Indexes: multi-tenancy helpers
CREATE INDEX IF NOT EXISTS memberships_user_id_idx ON public.memberships (user_id);
CREATE INDEX IF NOT EXISTS memberships_company_id_idx ON public.memberships (company_id);

-- Bank & transactions
CREATE INDEX IF NOT EXISTS bank_accounts_company_id_idx ON public.bank_accounts (company_id);
CREATE INDEX IF NOT EXISTS bank_transactions_company_date_idx ON public.bank_transactions (company_id, date);
CREATE INDEX IF NOT EXISTS bank_transactions_status_idx ON public.bank_transactions (status);
CREATE INDEX IF NOT EXISTS bank_transactions_vendor_idx ON public.bank_transactions (vendor_id);
CREATE INDEX IF NOT EXISTS bank_transactions_category_idx ON public.bank_transactions (category_id);
CREATE INDEX IF NOT EXISTS bank_transactions_vat_code_idx ON public.bank_transactions (vat_code_id);

-- Files
CREATE INDEX IF NOT EXISTS files_company_id_idx ON public.files (company_id);
CREATE INDEX IF NOT EXISTS files_company_type_idx ON public.files (company_id, type);

-- Vendors / Categories / VAT codes
CREATE INDEX IF NOT EXISTS vendors_company_id_idx ON public.vendors (company_id);
CREATE INDEX IF NOT EXISTS categories_company_id_idx ON public.categories (company_id);
CREATE INDEX IF NOT EXISTS categories_type_idx ON public.categories (type);
CREATE INDEX IF NOT EXISTS vat_codes_company_id_idx ON public.vat_codes (company_id);
CREATE UNIQUE INDEX IF NOT EXISTS vat_codes_company_code_unique_idx ON public.vat_codes (company_id, code);

-- Invoices
CREATE INDEX IF NOT EXISTS invoices_company_date_idx ON public.invoices (company_id, date);
CREATE INDEX IF NOT EXISTS invoices_company_due_date_idx ON public.invoices (company_id, due_date);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON public.invoices (status);
CREATE INDEX IF NOT EXISTS invoices_vendor_idx ON public.invoices (vendor_id);
CREATE INDEX IF NOT EXISTS invoices_vat_code_idx ON public.invoices (vat_code_id);

-- Invoice line items
CREATE INDEX IF NOT EXISTS invoice_line_items_invoice_idx ON public.invoice_line_items (invoice_id);
CREATE INDEX IF NOT EXISTS invoice_line_items_category_idx ON public.invoice_line_items (category_id);

-- PDC items
CREATE INDEX IF NOT EXISTS pdc_items_company_due_date_idx ON public.pdc_items (company_id, due_date);
CREATE INDEX IF NOT EXISTS pdc_items_status_idx ON public.pdc_items (status);
CREATE INDEX IF NOT EXISTS pdc_items_bank_account_idx ON public.pdc_items (bank_account_id);
CREATE INDEX IF NOT EXISTS pdc_items_linked_transaction_idx ON public.pdc_items (linked_transaction_id);

-- Journals
CREATE INDEX IF NOT EXISTS journal_entries_company_date_idx ON public.journal_entries (company_id, date);
CREATE INDEX IF NOT EXISTS journal_entries_source_idx ON public.journal_entries (source_type, source_id);
CREATE INDEX IF NOT EXISTS journal_lines_journal_entry_idx ON public.journal_lines (journal_entry_id);
CREATE INDEX IF NOT EXISTS journal_lines_account_code_idx ON public.journal_lines (account_code);
CREATE INDEX IF NOT EXISTS journal_lines_vat_code_idx ON public.journal_lines (vat_code_id);

-- VAT returns
CREATE INDEX IF NOT EXISTS vat_returns_company_period_idx ON public.vat_returns (company_id, period_start, period_end);
CREATE INDEX IF NOT EXISTS vat_returns_status_idx ON public.vat_returns (status);

-- Cashflow snapshots
CREATE INDEX IF NOT EXISTS cashflow_snapshots_company_as_of_idx ON public.cashflow_snapshots (company_id, as_of_date);

-- Chat & logs
CREATE INDEX IF NOT EXISTS chat_messages_company_created_idx ON public.chat_messages (company_id, created_at);
CREATE INDEX IF NOT EXISTS system_logs_company_created_idx ON public.system_logs (company_id, created_at);
CREATE INDEX IF NOT EXISTS system_logs_level_idx ON public.system_logs (level);
CREATE INDEX IF NOT EXISTS system_logs_source_idx ON public.system_logs (source);
