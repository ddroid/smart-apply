-- Database Schema Setup for JobPilot

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  location text,
  current_title text,
  experience_level text CHECK (experience_level IN ('junior', 'mid', 'senior', 'lead')),
  years_experience integer,
  skills text[] DEFAULT '{}',
  industries text[] DEFAULT '{}',
  work_experience jsonb DEFAULT '[]',
  education jsonb DEFAULT '[]',
  job_titles_seeking text[] DEFAULT '{}',
  remote_preference text CHECK (remote_preference IN ('remote', 'onsite', 'hybrid', 'any')),
  preferred_locations text[] DEFAULT '{}',
  salary_expectation text,
  cover_letter_tone text CHECK (cover_letter_tone IN ('formal', 'casual', 'enthusiastic')),
  linkedin_url text,
  portfolio_url text,
  work_authorization text CHECK (work_authorization IN ('citizen', 'permanent_resident', 'visa_required')),
  resume_pdf_url text,
  is_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Agent Runs Table
CREATE TABLE IF NOT EXISTS public.agent_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  job_title_searched text NOT NULL,
  location_searched text,
  jobs_found integer NOT NULL DEFAULT 0,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

-- 3. Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid REFERENCES public.agent_runs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source text NOT NULL DEFAULT 'search' CHECK (source IN ('search', 'url')),
  source_url text NOT NULL,
  external_apply_url text,
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  salary text,
  job_type text NOT NULL DEFAULT 'fulltime',
  about_role text,
  responsibilities text[] DEFAULT '{}',
  requirements text[] DEFAULT '{}',
  nice_to_have text[] DEFAULT '{}',
  benefits text[] DEFAULT '{}',
  about_company text,
  match_score integer CHECK (match_score >= 0 AND match_score <= 100),
  match_reason text,
  matched_skills text[] DEFAULT '{}',
  missing_skills text[] DEFAULT '{}',
  company_research jsonb DEFAULT NULL,
  found_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Agent Logs Table
CREATE TABLE IF NOT EXISTS public.agent_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES public.agent_runs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  level text NOT NULL DEFAULT 'info' CHECK (level IN ('info', 'success', 'warning', 'error')),
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;

-- 5. Row Level Security Policies

-- Profiles
CREATE POLICY select_own_profile ON public.profiles 
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY update_own_profile ON public.profiles 
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY insert_own_profile ON public.profiles 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Agent Runs
CREATE POLICY select_own_runs ON public.agent_runs 
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY insert_own_runs ON public.agent_runs 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_own_runs ON public.agent_runs 
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY delete_own_runs ON public.agent_runs 
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Jobs
CREATE POLICY select_own_jobs ON public.jobs 
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY insert_own_jobs ON public.jobs 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_own_jobs ON public.jobs 
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY delete_own_jobs ON public.jobs 
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Agent Logs
CREATE POLICY select_own_logs ON public.agent_logs 
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY insert_own_logs ON public.agent_logs 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_own_logs ON public.agent_logs 
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY delete_own_logs ON public.agent_logs 
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 6. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_agent_runs_user_id ON public.agent_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_started_at ON public.agent_runs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_run_id ON public.jobs(run_id);
CREATE INDEX IF NOT EXISTS idx_jobs_found_at ON public.jobs(found_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_match_score ON public.jobs(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_agent_logs_user_id ON public.agent_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_logs_run_id ON public.agent_logs(run_id);
CREATE INDEX IF NOT EXISTS idx_agent_logs_created_at ON public.agent_logs(created_at DESC);

-- 7. Trigger to automatically update updated_at on profiles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Trigger to create a profile automatically when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.profile->>'full_name',
      NEW.profile->>'name',
      NEW.metadata->>'full_name',
      NEW.metadata->>'name',
      ''
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
