# Memory — Feature 04 Database Schema

Last updated: 2026-06-07 01:15:00

## What was built

- **Database Schema**:
  - Created [db/schema.sql](file:///home/ddroid/Projects/job-pilot/db/schema.sql) which defines the core tables: `profiles`, `agent_runs`, `jobs`, and `agent_logs`.
  - Implemented Row Level Security (RLS) policies for all tables to ensure data isolation.
  - Added a trigger `on_auth_user_created` to automatically create a profile in the `profiles` table when a new user signs up.
  - Added a trigger `update_profiles_updated_at` to handle automatic timestamp updates for profiles.
- **Storage Policies**:
  - Created [db/storage_policies.sql](file:///home/ddroid/Projects/job-pilot/db/storage_policies.sql) to manage RLS for the `resumes` storage bucket, ensuring folder-level isolation based on `auth.uid()`.
- **Progress Tracking Updated**:
  - Marked Step 04 Database Schema as completed in [progress-tracker.md](file:///home/ddroid/Projects/job-pilot/context/progress-tracker.md).
  - Advanced the current status to Phase 2 — Profile Page.

## Decisions made

- **Profile Automation**: Decided to use a Postgres trigger (`on_auth_user_created`) on the `auth.users` table to ensure every registered user has a corresponding row in `public.profiles` immediately, simplifying frontend logic.
- **Data Isolation**: Chose to enforce strict RLS policies where `auth.uid() = user_id` (or `id` for profiles) to guarantee that users can only access their own data.
- **Storage Structure**: Adopted a folder-per-user structure (`bucket/user_id/file`) for resumes to allow granular RLS control in Supabase/InsForge storage.

## Problems solved

- **Initial Setup**: Established the foundational data model for the entire application, including the relationship between users, agent runs, jobs found, and detailed logs.

## Current state

- Phase 1 Foundation is complete.
- Database schema is fully defined and ready for deployment.
- Storage policies are configured for secure resume handling.
- Development is now moving into Phase 2: Profile Page.

## Next session starts with

- **05 Profile Page — Full UI**: Implement the comprehensive profile editor UI as defined in the Phase 2 build plan, allowing users to complete their candidate profiles.

## Open questions

- None.
