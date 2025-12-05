-- Step 8.12: RLS policies for company isolation

-- Drop potential broad default policies (safe no-op if absent)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.companies;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.memberships;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.bank_accounts;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.bank_transactions;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.files;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.vendors;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.vat_codes;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.invoices;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.invoice_line_items;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.pdc_items;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.journal_entries;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.journal_lines;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.vat_returns;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.cashflow_snapshots;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.chat_messages;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.system_logs;

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vat_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdc_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vat_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashflow_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- Helper membership predicate is repeated inline per table

-- Companies
CREATE POLICY companies_select_by_membership
ON public.companies
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
      AND m.company_id = companies.id
  )
);

-- Memberships
CREATE POLICY memberships_select_own
ON public.memberships
FOR SELECT
USING (memberships.user_id = auth.uid());

-- Bank accounts
CREATE POLICY bank_accounts_select_by_membership
ON public.bank_accounts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
      AND m.company_id = bank_accounts.company_id
  )
);

-- Bank transactions
CREATE POLICY bank_transactions_select_by_membership
ON public.bank_transactions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
      AND m.company_id = bank_transactions.company_id
  )
);

-- Files
CREATE POLICY files_select_by_membership
ON public.files
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
      AND m.company_id = files.company_id
  )
);

-- Vendors
CREATE POLICY vendors_select_by_membership
ON public.vendors
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
      AND m.company_id = vendors.company_id
  )
);

-- Categories (global or company)
CREATE POLICY categories_select_global_or_by_membership
ON public.categories
FOR SELECT
USING (
  categories.company_id IS NULL
  OR EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
      AND m.company_id = categories.company_id
  )
);

-- VAT codes (global or company)
CREATE POLICY vat_codes_select_global_or_by_membership
ON public.vat_codes
FOR SELECT
USING (
  vat_codes.company_id IS NULL
  OR EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
      AND m.company_id = vat_codes.company_id
  )
);

-- Invoices
CREATE POLICY invoices_select_by_membership
ON public.invoices
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
      AND m.company_id = invoices.company_id
  )
);

-- Invoice line items
CREATE POLICY invoice_line_items_select_by_membership
ON public.invoice_line_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
      AND m.company_id = (
        SELECT company_id FROM public.invoices i WHERE i.id = invoice_line_items.invoice_id
      )
  )
);

-- PDC items
CREATE POLICY pdc_items_select_by_membership
ON public.pdc_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
      AND m.company_id = pdc_items.company_id
  )
);

-- Journal entries
CREATE POLICY journal_entries_select_by_membership
ON public.journal_entries
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
      AND m.company_id = journal_entries.company_id
  )
);

-- Journal lines
CREATE POLICY journal_lines_select_by_membership
ON public.journal_lines
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
      AND m.company_id = (
        SELECT company_id FROM public.journal_entries je WHERE je.id = journal_lines.journal_entry_id
      )
  )
);

-- VAT returns
CREATE POLICY vat_returns_select_by_membership
ON public.vat_returns
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
      AND m.company_id = vat_returns.company_id
  )
);

-- Cashflow snapshots
CREATE POLICY cashflow_snapshots_select_by_membership
ON public.cashflow_snapshots
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
      AND m.company_id = cashflow_snapshots.company_id
  )
);

-- Chat messages
CREATE POLICY chat_messages_select_by_membership
ON public.chat_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
      AND m.company_id = chat_messages.company_id
  )
);

-- System logs
CREATE POLICY system_logs_select_by_membership
ON public.system_logs
FOR SELECT
USING (
  system_logs.company_id IS NULL
  OR EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
      AND m.company_id = system_logs.company_id
  )
);
