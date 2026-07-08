"use client";

import { useState } from "react";
import Image from "next/image";

export function Features() {
  const [activeTab, setActiveTab] = useState(0);

  const section1Features = [
    {
      title: "Find jobs that actually fit",
      description:
        "Search by title and location or paste a job link. Get matched roles you can quickly scan.",
    },
    {
      title: "Know the Company Before You Apply",
      description:
        "Stop guessing what a company is about. Smart Apply browses their site and gives you everything you need to apply with confidence.",
    },
    {
      title: "Keep track of every application",
      description:
        "Keep a clear view of every job you've found, tailored. Your activity and progress all stay in one simple place.",
    },
  ];

  const section2Features = [
    {
      title: "Understand your match score",
      description:
        "See how your profile lines up with each role before you apply. Get a clear breakdown of what fits and what's missing.",
    },
    {
      title: "AI-Powered Job Matching",
      description:
        "Stop guessing which jobs are worth applying to. Smart Apply scores every role against your actual skills so you focus on the ones that matter.",
    },
    {
      title: "Focus on the right roles",
      description:
        "Filter out low fit jobs and stay on the ones that actually matter. Spend less time sorting and more time applying.",
    },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* Feature Section 1: Manage Your Job Search */}
      <section className="w-full py-20 px-6 bg-surface">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text & Tabs */}
          <div className="flex flex-col gap-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight">
              Manage Your Job<br className="hidden sm:inline" /> Search With Ease
            </h2>

            <div className="flex flex-col border-l-2 border-border gap-2">
              {section1Features.map((feat, idx) => {
                const isActive = activeTab === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`text-left pl-6 py-4 -ml-[2px] transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "border-l-4 border-accent bg-background/50 rounded-r-xl"
                        : "border-l-4 border-transparent hover:bg-background/20 rounded-r-xl"
                    }`}
                  >
                    <h3
                      className={`text-base font-semibold transition-colors duration-150 ${
                        isActive ? "text-text-primary" : "text-text-secondary"
                      }`}
                    >
                      {feat.title}
                    </h3>
                    <p
                      className={`text-sm mt-1.5 leading-relaxed transition-colors duration-150 ${
                        isActive ? "text-text-secondary font-normal" : "text-text-muted font-normal"
                      }`}
                    >
                      {feat.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Jobs List Image Card */}
          <div className="flex justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-[480px] aspect-[2364/1778] hover:scale-[1.02] transition-all duration-300">
              <Image
                src="/images/jobs-lists.png"
                alt="Job pilot matching lists mockup"
                fill
                className="object-contain"
                sizes="(max-w-768px) 100vw, 480px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2: Apply With More Confidence */}
      <section className="w-full py-20 px-6 bg-background relative overflow-hidden">
        {/* Subtle diagonal lines background or mesh effect */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Agent Log Image Card */}
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start w-full">
            <div className="relative w-full max-w-[480px] aspect-[2144/1656] hover:scale-[1.02] transition-all duration-300">
              <Image
                src="/images/agnet-log.png"
                alt="Agent run log console mockup"
                fill
                className="object-contain"
                sizes="(max-w-768px) 100vw, 480px"
              />
            </div>
          </div>

          {/* Right Column: Text & Features */}
          <div className="order-1 lg:order-2 flex flex-col gap-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight">
              Apply With More<br className="hidden sm:inline" /> Confidence, Every Time
            </h2>

            <div className="flex flex-col gap-6">
              {section2Features.map((feat, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <h3 className="text-base font-semibold text-text-primary">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed font-normal">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
