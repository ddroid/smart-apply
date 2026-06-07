import { AlertCircle } from "lucide-react";

export function ProfileAlert() {
  return (
    <div className="bg-surface border border-error/20 rounded-2xl p-6 shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] flex items-center justify-between w-full max-w-3xl mx-auto mb-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-error" />
          <h2 className="text-base font-bold text-text-primary">
            Profile needs attention
          </h2>
        </div>
        <p className="text-sm text-text-secondary">
          Complete the missing fields to improve your chance of getting
          tailored matches and generating quality resumes.
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-3 py-1 rounded-full bg-error/10 text-error text-[10px] font-bold uppercase tracking-wider">
            Phone
          </span>
          <span className="px-3 py-1 rounded-full bg-error/10 text-error text-[10px] font-bold uppercase tracking-wider">
            Location
          </span>
          <span className="px-3 py-1 rounded-full bg-error/10 text-error text-[10px] font-bold uppercase tracking-wider">
            Education
          </span>
        </div>
      </div>
      <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
        {/* Simple SVG circle progress */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="var(--color-surface-secondary)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="var(--color-error)"
            strokeWidth="8"
            strokeDasharray="251.2"
            strokeDashoffset="75.36" /* 251.2 - (251.2 * 0.7) */
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-xl font-bold text-text-primary">70%</span>
      </div>
    </div>
  );
}
