CREATE TABLE IF NOT EXISTS public.vat_returns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id),
  period_start date NOT NULL,
  period_end date NOT NULL,
  total_output_vat numeric(18, 2) NOT NULL DEFAULT 0,
  total_input_vat numeric(18, 2) NOT NULL DEFAULT 0,
  net_vat_due numeric(18, 2) NOT NULL DEFAULT 0,
  status text NOT NULL CHECK (status IN ('draft', 'finalized')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
