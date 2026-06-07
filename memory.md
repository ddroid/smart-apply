# Memory — Authentication Proxy and Session Sync Fixes

Last updated: 2026-06-08T02:32:49+05:00

## What was built

- Fixed API authentication failures by updating the `matcher` regex in `proxy.ts` so that `/api/*` routes are intercepted. This ensures that `updateSession` correctly refreshes server-side cookies for all API calls.
- Preserved session cookies during `proxy.ts` redirects by actively copying the `Set-Cookie` headers from the token refresh response onto the new `redirectResponse` object.
- Fixed the "forever spinning wheel" infinite redirect loop at `/login` by updating `components/auth/LoginManager.tsx` to detect client-server session mismatches (via the `redirectTo` URL param) and explicitly call `insforge.auth.signOut()` to clear the stale client session.
- Fixed the Next.js `Image` missing `sizes` prop warning for the preview image in `LoginManager.tsx`.
- Silenced noisy PostHog console warnings (`max: 1` errors) by removing the `debug: true` flag and an invalid `defaults` property from `posthog.init` in both `instrumentation-client.ts` and `lib/posthog-client.ts`.

## Decisions made

- Maintained the use of the modern `proxy.ts` convention for session handling and authentication checks instead of resorting to the legacy `middleware.ts` structure.
- Resolved local vs. server state desynchronization by treating the server's redirect behavior as the source of truth, forcing the client SDK to dump its session if it contradicts the server.

## Problems solved

- **API 401s when "logged in":** Solved by ensuring `proxy.ts` runs on API routes to keep tokens refreshed.
- **Lost Cookies on Redirect:** Solved by copying cookies when returning a `NextResponse.redirect` in `proxy.ts`.
- **Infinite Login Loop:** Solved by detecting the specific scenario where `hasAccessToken` is false on the server, but the client SDK `localStorage` evaluates as true.
- **PostHog Debug Spam:** Solved by disabling development debug mode for the PostHog initialization, which suppressed internal bounding box calculation warnings.

## Current state

- The authentication proxy, login flow, and server-side session persistence are fully functional and rock solid.
- API requests correctly receive refreshed tokens.
- The browser console is completely clean of warnings and PostHog spam.

## Next session starts with

- Review `context/build-plan.md` to identify and begin work on the next pending feature from the 17-feature roadmap.

## Open questions

- Are there any other areas in the app assuming a legacy middleware approach that need to be audited for `proxy.ts` compatibility?
