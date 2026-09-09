-- ─────────────────────────────────────────────────────────────
-- Supabase Migration: Shared Space Instant Sync Rooms
-- Generated: 2026-09-09
-- Architecture: Dedicated multi-device sync rooms with 48h auto-expiry
-- Security: RLS enabled, service_role only (serverless APIs only)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.shared_space_rooms (
  room_id TEXT PRIMARY KEY,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '48 hours')
);

-- Enable Row Level Security
ALTER TABLE public.shared_space_rooms ENABLE ROW LEVEL SECURITY;

-- Explicitly revoke access from public roles; grant full access to service_role only
REVOKE ALL ON public.shared_space_rooms FROM anon, authenticated;
GRANT ALL ON public.shared_space_rooms TO service_role;

-- Fast index for query lookups and lifecycle expiration cleanups
CREATE INDEX IF NOT EXISTS idx_shared_space_rooms_expires_at ON public.shared_space_rooms (expires_at);
CREATE INDEX IF NOT EXISTS idx_shared_space_rooms_updated_at ON public.shared_space_rooms (updated_at);

-- Optional: Automated daily cleanup of expired rooms if pg_cron extension is installed
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'purge-expired-space-rooms',
      '15 3 * * *', -- Daily at 03:15 UTC
      $CRON$DELETE FROM public.shared_space_rooms WHERE expires_at < now()$CRON$
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;
