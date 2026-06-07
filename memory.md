# Memory — Dashboard Phase (Features 14, 15, 16)

Last updated: 2026-06-08

## What was built
- **Feature 14 (Dashboard Page — Full UI):** Installed `recharts` and established the main Dashboard grid layout. Created static baseline components: `ProfileAlert.tsx`, `StatsBar.tsx`, `RecentActivity.tsx`, and `AnalyticsCharts.tsx`.
- **Feature 15 (Stats Bar — Real Data):** Upgraded `StatsBar.tsx` into a Server Component. Wired it to the `insforge.database` using 4 concurrent queries (with `count: "exact", head: true` for pure zero-payload counts) to render live statistics.
- **Feature 16 (Recent Activity — Real Data):** Upgraded `RecentActivity.tsx` to fetch the top 10 rows from both `agent_runs` and `jobs` (where `company_research` is present). Merged, formatted, and sorted the results in-memory into a unified timeline capped at the top 5 recent events.

## Decisions made
- **Concurrent Server Fetching:** Opted to use `Promise.all` directly inside Next.js Server Components for multiple small aggregations instead of defining custom SQL RPCs to maintain speed without altering the database schema.
- **Chart Naming Alignment:** Overrode the UI mockup title "Resume Tailoring Activity" with "Company Research Activity" to accurately mirror our underlying event analytics schema in PostHog.
- **Strict PostHog Compliance:** Deliberately deleted standard page-view tracking (`dashboard_viewed`) to adhere to our rigid `code-standards.md` policy capping the project at only 4 registered events.

## Problems solved
- **SDK Drift:** Handled `insforge.auth.getUser()` and `insforge.from()` crashing by updating method calls to match the project's exact installed `@insforge/sdk` version (`insforge.auth.getCurrentUser()` and `insforge.database.from()`).

## Current state
- The project is deep in Phase 5. The core Dashboard UI is complete, fully responsive, and successfully populating real database aggregations and timeline activities. The `ui-registry.md` and `code-standards.md` are completely up-to-date.

## Next session starts with
- **Feature 17 (Analytics Charts — PostHog Data):** Wiring the 3 placeholder Recharts implementations in `AnalyticsCharts.tsx` directly to the PostHog API to retrieve historical trends.

## Open questions
- Since Recharts is a client component, what will be the preferred strategy for fetching PostHog Server API data: embedding a data-fetching Server Component wrapper, or exposing a Next.js API route?
