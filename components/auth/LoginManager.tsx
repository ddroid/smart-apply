"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { insforge } from "@/lib/insforge-client";

export function LoginManager() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check if user is already authenticated
  useEffect(() => {
    let active = true;
    async function checkUser() {
      try {
        const { data } = await insforge.auth.getCurrentUser();
        if (active) {
          if (data?.user) {
            const params = new URLSearchParams(window.location.search);
            const redirectTo = params.get("redirectTo");
            if (redirectTo) {
              // Mismatch: client has local session, but server redirected to login (missing cookies)
              await insforge.auth.signOut();
              setCheckingAuth(false);
            } else {
              router.push("/dashboard");
            }
          } else {
            setCheckingAuth(false);
          }
        }
      } catch (err) {
        console.error("[login/auth-check]", err);
        if (active) {
          setCheckingAuth(false);
        }
      }
    }
    checkUser();
    return () => {
      active = false;
    };
  }, [router]);

  const handleOAuthLogin = async (provider: "google" | "github") => {
    try {
      setLoadingProvider(provider);
      setErrorMessage(null);
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirectTo");
      const callbackUrl = new URL("/callback", window.location.origin);
      if (redirectTo) callbackUrl.searchParams.set("next", redirectTo);

      const { data, error } = await insforge.auth.signInWithOAuth(provider, {
        redirectTo: callbackUrl.toString(),
      });
      if (error) throw new Error(error.message);
      if (data?.url) window.location.assign(data.url);
    } catch (err: any) {
      console.error(`[login/${provider}]`, err);
      setErrorMessage(err.message || `Failed to sign in with ${provider}.`);
      setLoadingProvider(null);
    }
  };

  const renderSocialButtons = () => (
    <div className="flex flex-col gap-3 w-full z-10">
      {/* Google */}
      <button
        onClick={() => handleOAuthLogin("google")}
        disabled={loadingProvider !== null}
        className="w-full flex items-center justify-center gap-3 px-6 py-2.5 rounded-full text-sm font-medium border border-border-light text-text-primary bg-surface hover:bg-surface-secondary focus:ring-2 focus:ring-accent-light active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none shadow-sm cursor-pointer"
      >
        {loadingProvider === "google" ? (
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-text-muted animate-spin"></div>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="var(--color-google-blue)"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.12h4.02c2.36-2.17 3.72-5.37 3.72-9.14z"
            />
            <path
              fill="var(--color-google-green)"
              d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-4.02-3.12c-1.12.75-2.55 1.19-3.94 1.19-3.03 0-5.6-2.05-6.51-4.82H1.31v3.23A12 12 0 0 0 12 24z"
            />
            <path
              fill="var(--color-google-yellow)"
              d="M5.49 14.34A7.13 7.13 0 0 1 5 12c0-.83.14-1.64.41-2.39V6.38H1.31A12 12 0 0 0 0 12c0 2.22.6 4.3 1.66 6.13l3.83-3.79z"
            />
            <path
              fill="var(--color-google-red)"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.92 11.92 0 0 0 12 0 12 12 0 0 0 1.31 6.38l3.83 3.79c.91-2.77 3.48-4.82 6.51-4.82z"
            />
          </svg>
        )}
        <span>Continue with Google</span>
      </button>

      {/* GitHub */}
      <button
        onClick={() => handleOAuthLogin("github")}
        disabled={loadingProvider !== null}
        className="w-full flex items-center justify-center gap-3 px-6 py-2.5 rounded-full text-sm font-medium border border-border-light text-text-primary bg-surface hover:bg-surface-secondary focus:ring-2 focus:ring-accent-light active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none shadow-sm cursor-pointer"
      >
        {loadingProvider === "github" ? (
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-text-muted animate-spin"></div>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
            />
          </svg>
        )}
        <span>Continue with GitHub</span>
      </button>
    </div>
  );

  const renderError = () =>
    errorMessage && (
      <div className="bg-error/10 border border-error/20 text-error rounded-xl p-3.5 text-xs font-medium text-center flex items-center justify-center gap-2 w-full animate-shake z-10">
        <span className="text-sm">⚠️</span>
        {errorMessage}
      </div>
    );

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-accent-light"></div>
          <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Login Panel (White background) */}
      <div className="flex flex-1 flex-col justify-center items-center py-12 px-6 lg:px-12 bg-surface relative">
        {/* Logo at the top-left (stays in the same screen position, now on white background for high contrast) */}
        <div className="absolute top-12 left-12 md:top-16 md:left-16 z-10">
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="Smart Apply logo"
              width={159}
              height={54}
              priority
              style={{ width: "auto" }}
              className="object-contain transition-transform duration-150 group-hover:scale-102"
            />
          </Link>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-sm flex flex-col gap-8 mt-16 md:mt-24">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
                Get Started
              </h2>
              <p className="text-sm text-text-secondary mt-1.5">
                Sign in with GitHub or Google to instantiate your session.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {renderError()}
            {renderSocialButtons()}
          </div>

          <div className="border-t border-border pt-5 mt-2 text-center">
            <Link href="/" className="text-xs font-semibold text-accent hover:underline">
              ← Return to local home instance
            </Link>
          </div>
        </div>
      </div>

      {/* Right Fluid Art & Editorial Panel (Dark background) */}
      <div className="hidden lg:flex lg:flex-1 bg-surface-dark text-white p-16 flex-col justify-between relative overflow-hidden">
        {/* Animated Fluid Blob backgrounds using Catppuccin Latte Lime and Yellow tokens */}
        <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-latte-lime to-latte-yellow opacity-20 blur-[90px] -top-20 -left-20 animate-pulse duration-[6000ms]" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-latte-yellow to-latte-lime opacity-25 blur-[100px] -bottom-20 -right-10 animate-pulse duration-[8000ms]" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Reverted size text & side-by-side product preview image */}
        <div className="my-auto w-full max-w-4xl flex flex-col xl:flex-row items-center gap-12 relative z-10">
          {/* Reverted Typography Content */}
          <div className="flex-1 max-w-md flex flex-col gap-6">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
              Find the match.<br />Autopilot the research.
            </h1>
            <p className="text-sm text-white/70 leading-relaxed font-light">
              An intelligent, developer-first agent designed to crawl target company platforms, decode their architecture, analyze your fit, and outline interview talk tracks.
            </p>
          </div>

          {/* Product Preview Image Block */}
          <div className="flex-1 w-full max-w-md relative aspect-[2364/1778] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src="/images/jobs-lists.png"
              alt="Jobs List Preview"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="text-xs text-white/35 font-light relative z-10">
          © 2026 Smart Apply. All rights reserved.
        </div>
      </div>
    </div>
  );
}
