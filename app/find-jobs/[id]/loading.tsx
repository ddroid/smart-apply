import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChevronLeft } from "lucide-react";

export default function LoadingJobDetails() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />
      
      <main className="flex-1 p-8 w-full flex flex-col">
        <div className="w-full max-w-[1024px] mx-auto mb-6">
          <div className="inline-flex items-center gap-2 text-sm text-text-secondary">
            <ChevronLeft className="w-4 h-4" />
            Back to Jobs
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-[1024px] mx-auto animate-pulse">
          {/* Header Card Skeleton */}
          <div className="bg-surface border border-border shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-surface-secondary/50 shrink-0"></div>
              <div className="flex flex-col gap-3">
                <div className="h-6 w-48 bg-surface-secondary/50 rounded-lg"></div>
                <div className="flex items-center gap-3">
                  <div className="h-4 w-24 bg-surface-secondary/50 rounded-lg"></div>
                  <div className="h-6 w-28 bg-surface-secondary/50 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="h-11 w-36 bg-surface-secondary/50 rounded-full"></div>
          </div>

          {/* 4 Info Cards Skeleton */}
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-secondary/50 shrink-0"></div>
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-16 bg-surface-secondary/50 rounded-lg"></div>
                  <div className="h-3 w-12 bg-surface-secondary/50 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Large Section Skeleton */}
          <div className="bg-surface border border-border shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] rounded-2xl p-8 flex flex-col gap-4">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-surface-secondary/50 shrink-0"></div>
                <div className="h-4 w-32 bg-surface-secondary/50 rounded-lg"></div>
             </div>
             <div className="h-4 w-full bg-surface-secondary/50 rounded-lg"></div>
             <div className="h-4 w-[90%] bg-surface-secondary/50 rounded-lg"></div>
             <div className="h-4 w-[80%] bg-surface-secondary/50 rounded-lg"></div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
