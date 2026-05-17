-- ─────────────────────────────────────────────────────────────────────────────
-- AdPilot AI — Supabase Schema
-- ─────────────────────────────────────────────────────────────────────────────
-- HOW TO USE:
--   1. Open your Supabase project dashboard
--   2. Go to SQL Editor → New Query
--   3. Paste and run this entire file
--   4. Verify tables appear in Table Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable the pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ─── profiles ─────────────────────────────────────────────────────────────────
-- One row per auth user. Created automatically by the trigger below.

CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid        REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email       text        NOT NULL,
  full_name   text        DEFAULT '',
  language    text        DEFAULT 'en'  CHECK (language IN ('en', 'ru')),
  country     text        DEFAULT '',
  niche       text        DEFAULT '',
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

-- RLS: users can only access their own profile row
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: select own"  ON public.profiles FOR SELECT  USING (auth.uid() = id);
CREATE POLICY "profiles: insert own"  ON public.profiles FOR INSERT  WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles: update own"  ON public.profiles FOR UPDATE  USING (auth.uid() = id);
CREATE POLICY "profiles: delete own"  ON public.profiles FOR DELETE  USING (auth.uid() = id);


-- ─── rsa_generations ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.rsa_generations (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  input       jsonb       NOT NULL DEFAULT '{}',
  output      jsonb       NOT NULL DEFAULT '{}',
  created_at  timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS rsa_generations_user_id_idx
  ON public.rsa_generations (user_id, created_at DESC);

ALTER TABLE public.rsa_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rsa: select own"  ON public.rsa_generations FOR SELECT  USING (auth.uid() = user_id);
CREATE POLICY "rsa: insert own"  ON public.rsa_generations FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rsa: update own"  ON public.rsa_generations FOR UPDATE  USING (auth.uid() = user_id);
CREATE POLICY "rsa: delete own"  ON public.rsa_generations FOR DELETE  USING (auth.uid() = user_id);


-- ─── moderation_checks ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.moderation_checks (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  input       jsonb       NOT NULL DEFAULT '{}',
  output      jsonb       NOT NULL DEFAULT '{}',
  created_at  timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS moderation_checks_user_id_idx
  ON public.moderation_checks (user_id, created_at DESC);

ALTER TABLE public.moderation_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "moderation: select own"  ON public.moderation_checks FOR SELECT  USING (auth.uid() = user_id);
CREATE POLICY "moderation: insert own"  ON public.moderation_checks FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "moderation: update own"  ON public.moderation_checks FOR UPDATE  USING (auth.uid() = user_id);
CREATE POLICY "moderation: delete own"  ON public.moderation_checks FOR DELETE  USING (auth.uid() = user_id);


-- ─── ctr_analyses ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.ctr_analyses (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  input       jsonb       NOT NULL DEFAULT '{}',
  output      jsonb       NOT NULL DEFAULT '{}',
  created_at  timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS ctr_analyses_user_id_idx
  ON public.ctr_analyses (user_id, created_at DESC);

ALTER TABLE public.ctr_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ctr: select own"  ON public.ctr_analyses FOR SELECT  USING (auth.uid() = user_id);
CREATE POLICY "ctr: insert own"  ON public.ctr_analyses FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ctr: update own"  ON public.ctr_analyses FOR UPDATE  USING (auth.uid() = user_id);
CREATE POLICY "ctr: delete own"  ON public.ctr_analyses FOR DELETE  USING (auth.uid() = user_id);


-- ─── Auto-create profile on signup ───────────────────────────────────────────
-- This trigger fires whenever a new auth.users row is inserted (i.e. signup).
-- It creates a matching profiles row using the user's email and optional
-- full_name from user_metadata (set during signUp options.data).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;   -- idempotent: safe to re-run
  RETURN NEW;
END;
$$;

-- Drop + recreate to avoid duplicate trigger errors on re-runs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ─── Updated_at auto-maintenance ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
