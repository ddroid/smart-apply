"use client";

import Link from "next/link";

export function BottomCTA() {
  return (
    <section className="relative w-full py-24 px-6 overflow-hidden flex flex-col items-center border-t border-border">
      {/* Background glow effects */}
      <div className="absolute inset-x-0 bottom-0 h-full w-full bg-gradient-to-t from-accent-light/30 via-background/10 to-background -z-10" />
      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] bg-gradient-to-tr from-accent/5 via-[#7287fd]/10 to-accent-light/25 blur-[90px] rounded-full -z-10" />

      {/* Content */}
      <div className="max-w-[700px] text-center flex flex-col items-center gap-6 z-10">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary leading-tight">
          Your next job search can feel<br />
          a lot less overwhelming
        </h2>
        
        <p className="text-base text-text-secondary max-w-[500px] leading-relaxed font-normal">
          Set up your profile, upload your resume, and start finding matches in minutes.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto justify-center">
          <Link
            href="/login"
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
            className="px-6 py-3 rounded-full text-sm font-medium border border-border-light hover:bg-accent-light text-accent transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 active:scale-98 bg-surface"
          >
            Find Your First Match
          </Link>
        </div>
      </div>
    </section>
  );
}
