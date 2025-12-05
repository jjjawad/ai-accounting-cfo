-- Chat role enum (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'chat_role'
  ) THEN
    CREATE TYPE chat_role AS ENUM ('user', 'assistant', 'system');
  END IF;
END
$$;

-- System log level enum (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'system_log_level'
  ) THEN
    CREATE TYPE system_log_level AS ENUM ('info', 'warn', 'error');
  END IF;
END
$$;

-- Chat messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  user_id uuid NULL,
  role chat_role NOT NULL,
  content text NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT chat_messages_company_fk FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE,
  CONSTRAINT chat_messages_user_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL
);

-- System logs
CREATE TABLE IF NOT EXISTS public.system_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NULL,
  level system_log_level NOT NULL,
  source text NOT NULL,
  message text NOT NULL,
  context jsonb,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT system_logs_company_fk FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL
);

-- Example inserts (commented)
-- INSERT INTO public.chat_messages (company_id, user_id, role, content)
-- VALUES
--   ('<company_uuid>', '<user_uuid>', 'user', 'How is my cashflow looking this month?'),
--   ('<company_uuid>', '<user_uuid>', 'assistant', 'Your cashflow is positive with a 60-day runway.');
--
-- INSERT INTO public.system_logs (company_id, level, source, message, context)
-- VALUES (
--   '<company_uuid>',
--   'info',
--   'backend.api.chat',
--   'Chat answer generated successfully',
--   '{"request_id": "test-123", "latency_ms": 250}'::jsonb
-- );
