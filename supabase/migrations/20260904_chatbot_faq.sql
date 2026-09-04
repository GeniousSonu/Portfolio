-- ─────────────────────────────────────────────────────────────
-- Supabase Migration: Chatbot FAQ and Persistent Rate Limiting
-- Generated: 2026-09-04
-- ─────────────────────────────────────────────────────────────

-- 1. Create chatbot_faq Table
CREATE TABLE IF NOT EXISTS public.chatbot_faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Service role client bypasses RLS; anon/authenticated are blocked)
ALTER TABLE public.chatbot_faq ENABLE ROW LEVEL SECURITY;

-- Explicitly revoke access from public roles
REVOKE ALL ON public.chatbot_faq FROM anon, authenticated;
GRANT ALL ON public.chatbot_faq TO service_role;

-- 2. Create chatbot_rate_limits Table for Serverless Rate Limiting
CREATE TABLE IF NOT EXISTS public.chatbot_rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  reset_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on rate limits table
ALTER TABLE public.chatbot_rate_limits ENABLE ROW LEVEL SECURITY;

-- Explicitly revoke access from public roles
REVOKE ALL ON public.chatbot_rate_limits FROM anon, authenticated;
GRANT ALL ON public.chatbot_rate_limits TO service_role;

-- 3. Stored procedure for atomic rate checking and sliding window increments
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key TEXT,
  p_max INT,
  p_window_seconds INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record RECORD;
  v_now TIMESTAMPTZ := clock_timestamp();
  v_reset_at TIMESTAMPTZ;
  v_count INT;
BEGIN
  SELECT * INTO v_record FROM public.chatbot_rate_limits WHERE key = p_key FOR UPDATE;
  
  IF NOT FOUND OR v_record.reset_at <= v_now THEN
    v_reset_at := v_now + (p_window_seconds || ' seconds')::INTERVAL;
    v_count := 1;
    INSERT INTO public.chatbot_rate_limits (key, count, reset_at, updated_at)
    VALUES (p_key, v_count, v_reset_at, v_now)
    ON CONFLICT (key) DO UPDATE
    SET count = 1, reset_at = v_reset_at, updated_at = v_now;
    
    RETURN jsonb_build_object('allowed', true, 'remaining', p_max - 1, 'reset_at', v_reset_at);
  ELSIF v_record.count < p_max THEN
    v_count := v_record.count + 1;
    UPDATE public.chatbot_rate_limits
    SET count = v_count, updated_at = v_now
    WHERE key = p_key;
    
    RETURN jsonb_build_object('allowed', true, 'remaining', p_max - v_count, 'reset_at', v_record.reset_at);
  ELSE
    RETURN jsonb_build_object('allowed', false, 'remaining', 0, 'reset_at', v_record.reset_at);
  END IF;
END;
$$;

-- 4. Seed initial placeholder FAQs for Sahinur
INSERT INTO public.chatbot_faq (category, question, answer)
VALUES
  (
    'career',
    'Who is SK Sahinur Islam?',
    'SK Sahinur Islam is a Senior Web Application Developer at Ib Arts, Co-Founder of WEFIK, and an IT Engineer based in Kolkata, India. He holds an IoT patent in vaccine preservation and specializes in backend architecture, DevOps, and cloud systems.'
  ),
  (
    'career',
    'Where does Sahinur work currently?',
    'Sahinur is currently a Senior Web Application Developer at Ib Arts, where he builds scalable enterprise systems, REST APIs, and automated cloud workflows.'
  ),
  (
    'tech_stack',
    'What technologies does Sahinur specialize in?',
    'His core stack includes Node.js, Next.js, React, Linux Systems Administration, PostgreSQL, Supabase, Docker, DevOps CI/CD pipelines, and IoT protocols.'
  ),
  (
    'patent',
    'What is Sahinur''s IoT patent about?',
    'Sahinur holds an Indian Patent (Patent No. 544062) for an IoT-based system and method for real-time monitoring and alert generation for temperature-sensitive vaccine storage and cold-chain logistics.'
  ),
  (
    'projects',
    'What is WEFIK?',
    'WEFIK is a creative digital agency co-founded by Sahinur in March 2021, delivering high-performance web applications, digital products, and technical consulting.'
  ),
  (
    'hobbies',
    'What does Sahinur do in his free time?',
    'Outside engineering, Sahinur enjoys exploring cybersecurity CTFs, homelabbing, listening to synthwave and ambient music, reading science fiction and tech philosophy, and watching cinema.'
  ),
  (
    'books',
    'What are Sahinur''s favorite books?',
    'Some of his top recommendations include "Designing Data-Intensive Applications" by Martin Kleppmann, "The Phoenix Project", and sci-fi classics like "Dune" by Frank Herbert.'
  ),
  (
    'movies',
    'What movies and shows does Sahinur enjoy?',
    'He loves mind-bending sci-fi and thrillers like Mr. Robot, Blade Runner 2049, Interstellar, Dark, and Silicon Valley.'
  )
ON CONFLICT DO NOTHING;
