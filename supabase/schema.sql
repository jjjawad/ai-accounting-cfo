-- Ensure UUID generation support
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Application users
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

-- Companies
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  base_currency text NOT NULL DEFAULT 'AED',
  vat_registered boolean NOT NULL DEFAULT false,
  vat_number text,
  fiscal_year_start_month integer NOT NULL DEFAULT 1 CHECK (fiscal_year_start_month BETWEEN 1 AND 12),
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

-- Bank accounts
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  iban text,
  currency text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (company_id, name)
);

-- Bank transaction status enum (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'bank_transaction_status'
  ) THEN
    CREATE TYPE bank_transaction_status AS ENUM ('raw', 'categorized', 'reconciled');
  END IF;
END
$$;

-- Bank transactions
CREATE TABLE IF NOT EXISTS public.bank_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  bank_account_id uuid NOT NULL REFERENCES public.bank_accounts(id) ON DELETE CASCADE,
  date date NOT NULL,
  description_raw text NOT NULL,
  amount numeric(18, 2) NOT NULL,
  currency text NOT NULL,
  balance_after numeric(18, 2),
  source_file_id uuid,
  category_id uuid,
  vendor_id uuid,
  vat_code_id uuid,
  status bank_transaction_status NOT NULL DEFAULT 'raw',
  confidence_score numeric(3, 2),
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

-- File type enum (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'file_type'
  ) THEN
    CREATE TYPE file_type AS ENUM ('bank_statement', 'invoice', 'receipt', 'pdc', 'other');
  END IF;
END
$$;

-- File status enum (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'file_status'
  ) THEN
    CREATE TYPE file_status AS ENUM ('uploaded', 'processing', 'processed', 'error');
  END IF;
END
$$;

-- Files metadata
CREATE TABLE IF NOT EXISTS public.files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  type file_type NOT NULL,
  original_name text NOT NULL,
  mime_type text NOT NULL,
  size_bytes bigint NOT NULL,
  ocr_text text,
  status file_status NOT NULL DEFAULT 'uploaded',
  error_message text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

-- Invoice type enum (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'invoice_type'
  ) THEN
    CREATE TYPE invoice_type AS ENUM ('supplier', 'customer');
  END IF;
END
$$;

-- Invoice status enum (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'invoice_status'
  ) THEN
    CREATE TYPE invoice_status AS ENUM ('unpaid', 'part_paid', 'paid');
  END IF;
END
$$;

-- Invoices
CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  vendor_id uuid,
  file_id uuid,
  invoice_number text,
  date date NOT NULL,
  due_date date,
  total_amount numeric(18, 2) NOT NULL,
  currency text NOT NULL,
  vat_amount numeric(18, 2),
  vat_code_id uuid,
  type invoice_type NOT NULL,
  status invoice_status NOT NULL DEFAULT 'unpaid',
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT invoices_company_fk FOREIGN KEY (company_id) REFERENCES public.companies (id),
  CONSTRAINT invoices_vendor_fk FOREIGN KEY (vendor_id) REFERENCES public.vendors (id),
  CONSTRAINT invoices_file_fk FOREIGN KEY (file_id) REFERENCES public.files (id),
  CONSTRAINT invoices_vat_code_fk FOREIGN KEY (vat_code_id) REFERENCES public.vat_codes (id)
);

-- Invoice line items
CREATE TABLE IF NOT EXISTS public.invoice_line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL,
  description text NOT NULL,
  quantity numeric(18, 3),
  unit_price numeric(18, 3),
  net_amount numeric(18, 2) NOT NULL,
  vat_amount numeric(18, 2),
  category_id uuid,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT invoice_line_items_invoice_fk FOREIGN KEY (invoice_id) REFERENCES public.invoices (id),
  CONSTRAINT invoice_line_items_category_fk FOREIGN KEY (category_id) REFERENCES public.categories (id)
);

-- Journal entries
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  date date NOT NULL,
  description text NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('bank_tx', 'invoice', 'pdc', 'manual')),
  source_id uuid,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT journal_entries_company_fk FOREIGN KEY (company_id) REFERENCES public.companies (id)
);

-- Journal lines
CREATE TABLE IF NOT EXISTS public.journal_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_entry_id uuid NOT NULL,
  account_code text NOT NULL,
  debit numeric(18, 2) NOT NULL DEFAULT 0,
  credit numeric(18, 2) NOT NULL DEFAULT 0,
  vat_code_id uuid,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT journal_lines_entry_fk FOREIGN KEY (journal_entry_id) REFERENCES public.journal_entries (id),
  CONSTRAINT journal_lines_vat_code_fk FOREIGN KEY (vat_code_id) REFERENCES public.vat_codes (id)
);

-- PDC type enum (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'pdc_type'
  ) THEN
    CREATE TYPE pdc_type AS ENUM ('issued', 'received');
  END IF;
END
$$;

-- PDC status enum (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'pdc_status'
  ) THEN
    CREATE TYPE pdc_status AS ENUM ('scheduled', 'cleared', 'bounced', 'cancelled');
  END IF;
END
$$;

-- PDC items
CREATE TABLE IF NOT EXISTS public.pdc_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  bank_account_id uuid,
  cheque_number text,
  party_name text NOT NULL,
  amount numeric(18, 2) NOT NULL,
  currency text NOT NULL,
  issue_date date,
  due_date date NOT NULL,
  type pdc_type NOT NULL,
  status pdc_status NOT NULL DEFAULT 'scheduled',
  linked_transaction_id uuid,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT pdc_items_company_fk FOREIGN KEY (company_id) REFERENCES public.companies (id),
  CONSTRAINT pdc_items_bank_account_fk FOREIGN KEY (bank_account_id) REFERENCES public.bank_accounts (id),
  CONSTRAINT pdc_items_linked_tx_fk FOREIGN KEY (linked_transaction_id) REFERENCES public.bank_transactions (id)
);

-- Cashflow snapshots (forecast summaries)
CREATE TABLE IF NOT EXISTS public.cashflow_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  as_of_date date NOT NULL,
  projected_days integer NOT NULL,
  series jsonb NOT NULL,
  burn_rate_monthly numeric(18, 2) NOT NULL,
  runway_days integer NOT NULL,
  assumptions jsonb,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

-- Membership role enum (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'membership_role'
  ) THEN
    CREATE TYPE membership_role AS ENUM ('owner', 'member', 'admin');
  END IF;
END
$$;

-- User-company memberships
CREATE TABLE IF NOT EXISTS public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  role membership_role NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (user_id, company_id)
);

-- Example manual journal test (commented)
-- INSERT INTO public.journal_entries (company_id, date, description, source_type, source_id)
-- VALUES ('<company_uuid>', CURRENT_DATE, 'Test manual journal', 'manual', NULL)
-- RETURNING id;
--
-- INSERT INTO public.journal_lines (journal_entry_id, account_code, debit, credit)
-- VALUES
--   ('<journal_entry_id>', '1000', 100.00, 0),
--   ('<journal_entry_id>', '2000', 0, 100.00);
