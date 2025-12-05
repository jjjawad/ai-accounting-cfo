-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NULL REFERENCES public.companies(id),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense', 'asset', 'liability', 'equity')),
  gl_account_code text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

-- VAT codes
CREATE TABLE IF NOT EXISTS public.vat_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NULL REFERENCES public.companies(id),
  code text NOT NULL,
  rate numeric NOT NULL,
  description text NOT NULL,
  recoverable boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

-- Vendors
CREATE TABLE IF NOT EXISTS public.vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id),
  name text NOT NULL,
  default_category_id uuid NULL REFERENCES public.categories(id),
  default_vat_code_id uuid NULL REFERENCES public.vat_codes(id),
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);
