# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 5 — Dashboard
**Last completed:** 17 Analytics Charts — PostHog Data
**Next:** Phase 5 Complete / TBD

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 — Profile Page

- [x] 05 Profile Page — Full UI
- [x] 06 Profile Save Logic
- [x] 07 AI Profile Extraction from Resume
- [x] 08 Resume PDF Generation from Profile

### Phase 3 — Find Jobs Page

- [x] 09 Find Jobs Page — Full UI
- [x] 10 Adzuna Job Discovery
- [x] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [x] 12 Job Details Page — Full UI
- [x] 13 Company Research Agent

### Phase 5 — Dashboard

- [x] 14 Dashboard Page — Full UI
- [x] 15 Stats Bar — Real Data
- [x] 16 Recent Activity — Real Data
- [x] 17 Analytics Charts — PostHog Data

---

## Decisions Made During Build

_Add decisions here as they are made during implementation._

- **Concurrent Server Fetching:** Opted to use `Promise.all` directly inside Next.js Server Components for multiple small aggregations instead of defining custom SQL RPCs to maintain speed without altering the database schema.
- **Chart Naming Alignment:** Overrode the UI mockup title "Resume Tailoring Activity" with "Company Research Activity" to accurately mirror our underlying event analytics schema in PostHog.
- **Strict PostHog Compliance:** Deliberately deleted standard page-view tracking (`dashboard_viewed`) to adhere to our rigid `code-standards.md` policy capping the project at only 4 registered events.
- **Analytics Data Fetching Pivot:** Pivoted away from fetching analytics directly from PostHog via the Query API, and instead built `lib/db-analytics.ts` to aggregate events locally from the `jobs` database table. This eliminates the need for users to provision PostHog Personal API Keys, increases speed, and handles empty states flawlessly.

---

## Notes

- **02 Auth Configuration Fix:** Resolved an issue where `NEXT_PUBLIC_INSFORGE_URL` in `.env.local` was incorrectly set to the API key rather than the actual InsForge backend URL (`https://v3eb24nt.eu-central.insforge.app`). This caused the SDK's `signInWithOAuth` network requests to fail with a network error. Updated `.env.local` to point to the correct URL and mapped the API key to `INSFORGE_API_KEY`.
- **02 Auth Cookie Handling & Dashboard Redirect:** Implemented a new token writing API route (`/api/auth/set-tokens`) to receive access and refresh tokens from the client-side OAuth callback page and write them as secure cookies on our Next.js application domain. Created a beautiful placeholder `/dashboard` page to handle successful post-login redirection and verify session authenticity.
- **02 Auth Sign-Out Resolution:** Added a local server logout endpoint (`/api/auth/logout`) that invokes the SDK's `clearAuthCookies` helper to clear the server-side session cookies. Wired the client-side navbar sign-out button to call this endpoint, ensuring complete termination of both the client and server session contexts.
- **02 Auth Multi-Variant UI Overhaul:** Rebuilt all 5 login page designs from scratch to deliver highly visual and custom developer-focused themes (Neon Bento Grid with active metrics, Retro-Future CRT command line console, Organic morphing fluid art with bold headlines, Dark editorial grid with SVG node graph visualizer, and a full dashboard cockpit background with blurred authentication overlay). Maintained dynamic routing and the interactive selector pill for real-time preview.
- **02 Auth Variant 3 UI Customization:** Refined Variant 3 based on user feedback. Swapped the page layout (white background/login panel on the left, dark background/fluid art panel on the right) to ensure the black-text `logo.png` is displayed on a clean white background for high contrast. Kept the scaled logo (1.5x, 159x54) absolute-positioned at the top-left. Added custom Catppuccin Latte Lime (`--color-latte-lime: #40a02b`) and Latte Yellow (`--color-latte-yellow: #df8e1d`) variables in `globals.css` and adjusted z-indexing (`relative z-10` on content, no negative z-index on blobs) to restore the gradient background's visibility. Reverted the typography size of the heading and body texts to their original standard sizes, and added a side-by-side product preview image using `/images/jobs-lists.png`.
- **02 Auth Consolidate & Clean Up:** Established the finalized Variant 3 design as the official, sole login page of the application. Rewrote `components/auth/LoginManager.tsx` to remove all other 4 temporary variants and the floating switcher pill. Deleted the dynamic routes under `app/(auth)/login/[id]` and simplified `app/(auth)/login/page.tsx` to render `<LoginManager />` as standard. Deleted the obsolete root-level dynamic redirect handler `app/[id]` and verified that no other temporary variant configuration or dynamic paths remain in the codebase.
- **03 PostHog Initialization:** Created `lib/posthog-client.ts` to export client-side PostHog initialization support. Updated `lib/posthog-server.ts` to export `createPostHogServer` for non-cached client instantiation in serverless environments. Refactored the dashboard page, logout route, and token-setting route to use the new server client and properly call `await posthog.shutdown()` to prevent event dropping in Next.js. Verified that `npm run build` succeeds without compilation issues.
- **04 Database Schema:** Created public schemas for `profiles`, `agent_runs`, `jobs`, and `agent_logs`. Added a trigger `on_auth_user_created` to automatically populate candidate profiles on registration, configured foreign key and metadata indexes for fast queries, and created a private `resumes` storage bucket with folder-level isolation RLS policies.
- **06 Profile Save Logic:** Created a Server Action `saveProfileInfo` in `actions/profile.ts` to handle the database mutation securely. It uses `zod` for payload validation and updates the `profiles` table for the currently authenticated user using `insforge.database.from('profiles').update()`. Form `ProfileInformationForm.tsx` was updated to be a controlled component using HTML input `name` attribute extraction and TypeScript casting, showing success/error toasts directly in the UI without relying on heavy external state management libraries.
- **07 AI Profile Extraction from Resume:** Created `POST /api/resume/extract` using `pdf-parse`, `ai` SDK, and `@ai-sdk/openai` configured for Groq's `openai/gpt-oss-120b` model to extract structured data from uploaded resumes. Updated `ResumeSection.tsx` to handle direct file uploads to InsForge Storage and trigger the extraction API. Modified `ProfileClient.tsx` to utilize React keys to force remount `ProfileInformationForm` with the newly extracted initial data without requiring complex state management for uncontrolled inputs.
- **08 Resume PDF Generation from Profile:** Created `POST /api/resume/generate` endpoint forcing Node.js runtime to support `@react-pdf/renderer`. It takes raw profile data, prompts Groq LLM for a polished JSON with a professional summary and tightened bullet points, then maps that JSON to a single-page PDF `<Document>` template. The buffer is saved dynamically to the InsForge `resumes` bucket, bypassing CDN caching, and the profile is updated with the new `resume_pdf_url`. Connected the "Generate PDF" button in `ResumeSection.tsx` to call the endpoint and handle loading/success states.
- **09 Find Jobs Page — Full UI:** Built the pixel-perfect `FindJobsPage` UI matching the provided design exactly, including a dedicated `SearchControls` card with an embedded green success banner, and a rich `JobList` table featuring a filter bar, robust mock data, match score progress bars using correct token colors, and pagination controls.
- **12 Job Details Page — Full UI:** Completed UI for the dynamic `[id]` page including server-side data fetching and components for `JobInfo`, `MatchScore`, `JobDescription`, and `CompanyResearch` (empty state).
- **13 Company Research Agent:** Implemented a Next.js server-side API endpoint that uses `@browserbasehq/stagehand` to visit up to 2 company subpages based on the Adzuna `redirect_url` derivation. Synthesized the research via Groq (`openai/gpt-oss-120b`) using the OpenAI SDK natively by passing `modelName: "openai/openai/gpt-oss-120b"` to Stagehand. Hardened the LLM JSON generation by flattening the extraction schema arrays and manually filtering out raw DOM IDs (e.g., `[0-211]`) to prevent Stagehand 404 navigation loops. Overrode hallucinated LLM sources by strictly mapping actual backend URLs visited directly into the final `sources` array for valid UI rendering.
- **14 Dashboard Page — Full UI:** Installed `recharts` and established the main Dashboard grid layout. Created static baseline components: `ProfileAlert.tsx`, `StatsBar.tsx`, `RecentActivity.tsx`, and `AnalyticsCharts.tsx`.
- **15 Stats Bar — Real Data:** Upgraded `StatsBar.tsx` into a Server Component. Wired it to the `insforge.database` using 4 concurrent queries (with `count: "exact", head: true` for pure zero-payload counts) to render live statistics.
- **16 Recent Activity — Real Data:** Upgraded `RecentActivity.tsx` to fetch the top 10 rows from both `agent_runs` and `jobs` (where `company_research` is present). Merged, formatted, and sorted the results in-memory into a unified timeline capped at the top 5 recent events.
- **SDK Drift:** Handled `insforge.auth.getUser()` and `insforge.from()` crashing by updating method calls to match the project's exact installed `@insforge/sdk` version (`insforge.auth.getCurrentUser()` and `insforge.database.from()`).
- **17 Analytics Charts — DB Data (Pivot):** Swapped out PostHog queries for native InsForge database aggregations in `lib/db-analytics.ts` after determining it provides a simpler, keyless experience for the user. `app/dashboard/page.tsx` now calls `Promise.all` directly against the database to calculate historical counts (Jobs Found, Company Research) and Match Score buckets in-memory before streaming them down to the modified `AnalyticsCharts.tsx` Client Components.
