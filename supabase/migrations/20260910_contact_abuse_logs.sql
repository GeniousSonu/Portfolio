-- ─────────────────────────────────────────────────────────────
-- Supabase Migration: 20260910_contact_abuse_logs.sql
-- Description: Defense-in-depth telemetry for contact form abuse,
-- spam detection, and GDPR-compliant 30-day log retention.
-- ─────────────────────────────────────────────────────────────

-- 1. Create contact_abuse_logs Table
CREATE TABLE IF NOT EXISTS public.contact_abuse_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip TEXT NOT NULL,
  reason TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Performance & Analytics Indexes
CREATE INDEX IF NOT EXISTS idx_contact_abuse_logs_created_at ON public.contact_abuse_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_abuse_logs_reason ON public.contact_abuse_logs (reason);
CREATE INDEX IF NOT EXISTS idx_contact_abuse_logs_ip ON public.contact_abuse_logs (ip);

-- 3. Row-Level Security (RLS)
ALTER TABLE public.contact_abuse_logs ENABLE ROW LEVEL SECURITY;

-- 4. Revoke access from untrusted public roles; grant full access to service_role
REVOKE ALL ON public.contact_abuse_logs FROM anon, authenticated;
GRANT ALL ON public.contact_abuse_logs TO service_role;

-- 5. GDPR Compliance & Database Hygiene: 30-day retention cleanup function
CREATE OR REPLACE FUNCTION public.purge_expired_contact_abuse_logs(retention_days INT DEFAULT 30)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  deleted_count INT;
BEGIN
  DELETE FROM public.contact_abuse_logs
  WHERE created_at < (now() - (retention_days || ' days')::INTERVAL);
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.purge_expired_contact_abuse_logs(INT) TO service_role;
