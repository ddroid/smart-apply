import { Sparkles, Check, X } from "lucide-react";

export function MatchScore({ job }: { job: any }) {
  const matchedSkills = job.matched_skills || [];
  const missingSkills = job.missing_skills || [];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1024px] mx-auto mt-6">
      {/* AI Match Reasoning Card */}
      <div className="bg-surface border border-border shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] rounded-2xl p-8 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-success-light flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-success" />
          </div>
          <h2 className="text-xs font-bold text-text-secondary uppercase tracking-wider">AI Match Reasoning</h2>
        </div>
        <p className="text-sm text-text-primary leading-relaxed">
          {job.match_reason || "No reasoning available for this match."}
        </p>
      </div>

      {/* Required Skills vs Your Profile Card */}
      <div className="bg-surface border border-border shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] rounded-2xl p-8 flex flex-col gap-6">
        <h2 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Required Skills vs Your Profile</h2>
        
        <div className="flex flex-col gap-3">
          <h3 className="text-sm text-text-secondary">You have</h3>
          <div className="flex flex-wrap gap-3">
            {matchedSkills.length > 0 ? matchedSkills.map((skill: string) => (
              <div key={skill} className="flex items-center gap-1.5 px-3 py-1.5 bg-success-light rounded-full border border-success/10">
                <Check className="w-3.5 h-3.5 text-success" />
                <span className="text-xs font-medium text-success">{skill}</span>
              </div>
            )) : (
              <span className="text-sm text-text-muted">No matching skills found.</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <h3 className="text-sm text-text-secondary">Gap skills</h3>
          <div className="flex flex-wrap gap-3">
            {missingSkills.length > 0 ? missingSkills.map((skill: string) => (
              <div key={skill} className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-light rounded-full border border-accent/10">
                <X className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-medium text-accent">{skill}</span>
              </div>
            )) : (
              <span className="text-sm text-text-muted">No gap skills found.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
