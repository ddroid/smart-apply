<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into JobPilot. Here is a summary of what was set up:

- **Client-side initialization** via `instrumentation-client.ts` using the Next.js 15.3+ pattern — no provider component needed. PostHog is initialized with a reverse proxy (`/ingest`) to avoid ad-blockers, exception tracking enabled, and debug mode in development.
- **Reverse proxy rewrites** added to `next.config.ts` so all PostHog traffic routes through the app's own domain (`/ingest/*`).
- **Server-side client** created at `lib/posthog-server.ts` for tracking critical API route events.
- **User identification** wired up in `app/(auth)/callback/page.tsx` — PostHog's `identify()` is called immediately after OAuth completes, using the InsForge user ID as the distinct ID and email as a property. The distinct ID is also passed via `X-POSTHOG-DISTINCT-ID` header to the `set-tokens` API route so server-side events are correlated to the same user.
- **Error tracking** added via `posthog.captureException()` in the auth callback and login manager error paths.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `login_started` | User clicks a social login button (Google or GitHub) | `components/auth/LoginManager.tsx` |
| `login_oauth_failed` | OAuth sign-in fails before the provider redirect | `components/auth/LoginManager.tsx` |
| `login_completed` | OAuth callback processed successfully; session established | `app/(auth)/callback/page.tsx` |
| `login_failed` | OAuth callback processing fails for any reason | `app/(auth)/callback/page.tsx` |
| `sign_out` | Authenticated user signs out via the navbar dropdown | `components/layout/Navbar.tsx` |
| `cta_clicked` | Homepage CTA clicked — `location: hero`, `cta: get_started \| find_first_match` | `components/homepage/Hero.tsx` |
| `cta_clicked` | Homepage bottom CTA clicked — `location: bottom_cta` | `components/homepage/BottomCTA.tsx` |
| `dashboard_viewed` | Authenticated user lands on the dashboard (server-side) | `app/dashboard/page.tsx` |
| `auth_tokens_set` | Server successfully writes auth tokens to cookies after OAuth | `app/api/auth/set-tokens/route.ts` |
| `auth_tokens_set_failed` | Server fails to write auth tokens to cookies | `app/api/auth/set-tokens/route.ts` |
| `auth_logout_completed` | Server clears auth cookies on sign-out | `app/api/auth/logout/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/457207/dashboard/1678454)
- [Auth Conversion Funnel (wizard)](https://us.posthog.com/project/457207/insights/MCsatSKx) — Login started → completed funnel with 1-hour conversion window
- [CTA Clicks by Location (wizard)](https://us.posthog.com/project/457207/insights/9CsXN7xf) — Homepage CTA clicks broken down by hero vs bottom section
- [Login Success vs Failure (wizard)](https://us.posthog.com/project/457207/insights/7Kq00RwI) — Daily login_completed vs login_failed vs login_oauth_failed
- [Dashboard Views (wizard)](https://us.posthog.com/project/457207/insights/xFfyklvA) — Daily active users reaching the product dashboard
- [User Retention: Login to Dashboard (wizard)](https://us.posthog.com/project/457207/insights/ZM89EwZt) — Active users vs sign-outs as a churn signal

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
