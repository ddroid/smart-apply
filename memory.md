# Memory — Resume Upload & Parsing Fixes

Last updated: 2026-06-07 19:30:00

## What was built

- Fixed the drag-and-drop file upload UI states in `components/profile/ResumeSection.tsx`
- Modified file upload logic in `ResumeSection.tsx` to generate unique file names (`resume-[timestamp].pdf`) to bypass CDN caching issues.
- Updated the secure backend extraction API (`app/api/resume/extract/route.ts`) to fetch the dynamically named file via the database `resume_pdf_url`, restoring InsForge SDK authentication to prevent 401s.
- Drastically improved the Groq LLM Zod `extractionSchema` to include full mappings for `work_experience` and `education` arrays, and tightened prompting rules for `linkedin_url`, `experience_level`, etc., to avoid nulls or hallucinations.
- Fully wired up dynamic React state in `components/profile/ProfileInformationForm.tsx` to display, edit, and save extracted arrays for `workExperiences` and `educations`, enforcing strict TypeScript interfaces (`WorkExperience`, `Education`) and stable React keys.

## Decisions made

- Instead of forcing cache invalidations across Supabase and Next.js for a static `resume.pdf` filename, we architecturally shifted to unique filenames per upload.
- React keys for array mapping in the profile form are now strictly handled by a client-generated `id` (`crypto.randomUUID()`) which is stripped back out securely during the `handleSubmit` payload assembly.

## Problems solved

- Stale text being extracted even after a new PDF upload (fixed via unique filenames).
- HTTP 401 Unauthorized errors during PDF extraction (fixed by reverting a raw `fetch` hack to the authenticated `insforge.storage.from().download()` SDK method, while querying the exact path from the DB).
- Work Experience and Education not saving or displaying despite successful extraction (fixed by replacing static HTML placeholders with fully mapped React state in `ProfileInformationForm.tsx`).

## Current state

- The end-to-end "Upload Resume -> AI Extract -> Display in Form -> Save to DB" loop is fully working, strictly typed, and secure.

## Next session starts with

- Wait for the developer's instructions on what feature to tackle next (e.g., PDF generation, dashboard features, etc.).

## Open questions

- None. The feature is production ready.
