-- Migration: 20260909_site_visit_log.sql
-- Description: Creates the site_visit_log table for tracking unique visitors per day,
-- with strict RLS and hardened SECURITY DEFINER counting function.

-- 1. Create table for daily visitor tracking
CREATE TABLE IF NOT EXISTS public.site_visit_log (
  id BIGSERIAL PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  visited_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT site_visit_log_daily_unique UNIQUE (visitor_id, visited_date)
);

-- 2. Fast index for distinct visitor queries
CREATE INDEX IF NOT EXISTS idx_site_visit_log_visitor_id ON public.site_visit_log (visitor_id);
CREATE INDEX IF NOT EXISTS idx_site_visit_log_visited_date ON public.site_visit_log (visited_date);

-- 3. Enable Row-Level Security (RLS)
ALTER TABLE public.site_visit_log ENABLE ROW LEVEL SECURITY;

-- 4. Revoke public access (only service_role key can read/write)
REVOKE ALL ON public.site_visit_log FROM anon, authenticated;

-- 5. Hardened SECURITY DEFINER function to compute distinct total visitors
-- Explicitly pins search_path to prevent privilege escalation footguns
CREATE OR REPLACE FUNCTION public.get_total_visitors()
RETURNS BIGINT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT count(DISTINCT visitor_id) FROM public.site_visit_log;
$$;

-- Allow service_role to execute the function
GRANT EXECUTE ON FUNCTION public.get_total_visitors() TO service_role;
