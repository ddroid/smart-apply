"use client";

import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

export function Hero() {
  return (
    <section className="relative w-full pt-16 pb-20 px-6 overflow-hidden flex flex-col items-center">
      {/* Premium glowing background mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[450px] bg-gradient-to-tr from-accent/10 via-[#7287fd]/15 to-accent-light/35 blur-[100px] rounded-full -z-10" />

      {/* Main Content */}
      <div className="max-w-[800px] text-center flex flex-col items-center gap-6 z-10">
        <h1 className="text-4xl sm:text-5xl md:text-[54px] font-bold tracking-tight text-text-primary leading-[1.15]">
          Job hunting is hard.<br />
          <span className="text-text-primary">Your tools shouldn't be.</span>
        </h1>
        
        <p className="text-base sm:text-lg text-text-secondary max-w-[640px] leading-relaxed font-normal">
          Stop applying blind. JobPilot finds the jobs, researches the companies, and
          gives you everything you need to stand out.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto justify-center">
          <Link
            href="/login"
            onClick={() => posthog.capture("cta_clicked", { location: "hero", cta: "get_started" })}
            className="px-6 py-3 rounded-full text-sm font-medium bg-overlay hover:bg-overlay-dark text-white flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-98"
          >
            Get Started
            <svg
              className="w-3 h-3 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </Link>
          <Link
            href="/login"
            onClick={() => posthog.capture("cta_clicked", { location: "hero", cta: "find_first_match" })}
            className="px-6 py-3 rounded-full text-sm font-medium border border-border-light hover:bg-accent-light text-accent transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 active:scale-98 bg-surface"
          >
            Find Your First Match
          </Link>
        </div>
      </div>

      {/* Browser Mockup Container */}
      <div className="w-full max-w-[1000px] mt-16 px-2 sm:px-4">
        <div className="w-full rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
          {/* Browser Top Bar */}
          <div className="w-full h-10 px-4 flex items-center bg-surface-secondary border-b border-border gap-3 select-none">
            {/* Window Controls */}
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            {/* Address Bar */}
            <div className="flex-1 max-w-[480px] mx-auto h-6 rounded-md bg-surface border border-border flex items-center justify-center gap-1.5 text-xs text-text-muted">
              {/* Lock Icon */}
              <svg
                className="w-3 h-3 text-text-muted fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
              jobpilot.ai/dashboard
            </div>
            <div className="w-[52px] hidden sm:block" /> {/* Spacer to balance controls */}
          </div>
          {/* Screenshot Content */}
          <div className="relative w-full aspect-[4788/2416] bg-surface-tertiary">
            <Image
              src="/images/dashboard-demo.png"
              alt="JobPilot Dashboard Overview"
              fill
              priority
              className="object-cover"
              sizes="(max-w-1000px) 100vw, 1000px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
