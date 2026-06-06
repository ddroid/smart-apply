"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { insforge } from "@/lib/insforge-client";
import posthog from "posthog-js";

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function handleAuth() {
      try {
        // Retrieve user to verify successful login (getCurrentUser automatically awaits OAuth callback detection)
        const { data, error: userError } = await insforge.auth.getCurrentUser();

        if (!active) return;

        if (userError) {
          setError(userError.message || "Authentication failed during user check.");
          setTimeout(() => router.push("/login?error=auth_failed"), 3000);
          return;
        }

        if (data?.user) {
          // Identify user in PostHog now that we have their identity
          posthog.identify(data.user.id, {
            email: data.user.email,
          });

          // Extract the active tokens from the SDK client
          const httpClient = insforge.getHttpClient();
          const accessToken = (httpClient as any).userToken;
          const refreshToken = (httpClient as any).refreshToken;

          // Write tokens to the local Next.js server cookies
          const cookieRes = await fetch("/api/auth/set-tokens", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-POSTHOG-DISTINCT-ID": data.user.id,
              "X-POSTHOG-SESSION-ID": posthog.get_session_id() ?? "",
            },
            body: JSON.stringify({ accessToken, refreshToken, userId: data.user.id }),
          });

          if (!cookieRes.ok) {
            throw new Error("Failed to persist session cookies on server.");
          }

          posthog.capture("login_completed", {
            user_id: data.user.id,
            email: data.user.email,
          });

          router.push("/dashboard");
        } else {
          posthog.capture("login_failed", { reason: "no_session" });
          setError("No user session found. Please try logging in again.");
          setTimeout(() => router.push("/login?error=no_session"), 3000);
        }
      } catch (err) {
        if (!active) return;
        console.error("[auth/callback]", err);
        posthog.capture("login_failed", {
          reason: "unexpected_error",
          error_message: err instanceof Error ? err.message : String(err),
        });
        posthog.captureException(err);
        setError("An unexpected error occurred during redirect processing.");
        setTimeout(() => router.push("/login?error=unexpected"), 3000);
      }
    }

    handleAuth();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-surface rounded-2xl p-8 shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] border border-border text-center flex flex-col items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent to-[#7287fd] flex items-center justify-center text-white font-bold text-xl shadow-sm">
          JP
        </div>
        
        {!error ? (
          <>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              Completing Login
            </h1>
            <p className="text-sm text-text-secondary">
              Securely processing authentication tokens with InsForge. You will be redirected shortly.
            </p>
            <div className="relative w-12 h-12 mt-2">
              <div className="absolute inset-0 rounded-full border-4 border-accent-light"></div>
              <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
            </div>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error text-2xl font-semibold">
              !
            </div>
            <h1 className="text-xl font-bold text-error tracking-tight">
              Authentication Error
            </h1>
            <p className="text-sm text-text-secondary">
              {error}
            </p>
            <p className="text-xs text-text-muted">
              Redirecting back to login...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
