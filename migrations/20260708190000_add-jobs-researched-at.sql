-- Add researched_at timestamp for company research analytics
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS researched_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_jobs_researched_at
  ON public.jobs (researched_at DESC);

-- Backfill existing researched jobs so analytics and activity feed have timestamps
UPDATE public.jobs
SET researched_at = found_at
WHERE company_research IS NOT NULL
  AND researched_at IS NULL;
