import { AlertCircle } from "lucide-react";

type ProfileAlertProps = {
  percentage: number;
  missingFields: string[];
};

const CIRCLE_CIRCUMFERENCE = 251.2;

export function ProfileAlert({ percentage, missingFields }: ProfileAlertProps) {
  const strokeDashoffset =
    CIRCLE_CIRCUMFERENCE - (CIRCLE_CIRCUMFERENCE * percentage) / 100;

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
        {missingFields.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {missingFields.map((field) => (
              <span
                key={field}
                className="px-3 py-1 rounded-full bg-error/10 text-error text-[10px] font-bold uppercase tracking-wider"
              >
                {field}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
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
            strokeDasharray={CIRCLE_CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-xl font-bold text-text-primary">
          {percentage}%
        </span>
      </div>
    </div>
  );
}
