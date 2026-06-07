import { Building2, ExternalLink, DollarSign, MapPin, Briefcase, Calendar } from "lucide-react";

export function JobInfo({ job }: { job: any }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success bg-success-lightest";
    if (score >= 60) return "text-info bg-info-lightest";
    return "text-warning bg-surface-secondary";
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1024px] mx-auto">
      {/* Header Card */}
      <div className="bg-surface border border-border shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-surface-secondary/30 flex items-center justify-center border border-border shrink-0">
            <Building2 className="w-7 h-7 text-text-muted" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-text-primary">{job.title}</h1>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-text-secondary font-medium">{job.company}</span>
              <span className="text-text-muted">•</span>
              <span className={`font-bold ${getScoreColor(job.match_score)} px-3 py-1 rounded-full text-xs`}>
                {job.match_score}% Match Score
              </span>
            </div>
          </div>
        </div>
        {job.external_apply_url || job.source_url ? (
          <a
            href={job.external_apply_url || job.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-6 py-3 text-sm font-bold text-text-primary border border-border rounded-full hover:bg-surface-secondary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Job Post
          </a>
        ) : null}
      </div>

      {/* 4 Info Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-success-light flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5 text-success" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-text-primary">{job.salary || "—"}</span>
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Salary Est.</span>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-info-light flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-info" />
          </div>
          <div className="flex flex-col gap-0.5 overflow-hidden">
            <span className="text-sm font-bold text-text-primary truncate" title={job.location}>{job.location || "Remote"}</span>
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Location</span>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5 text-accent" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-text-primary capitalize">{job.job_type || "—"}</span>
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Job Type</span>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-text-secondary" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-text-primary">{formatTimeAgo(job.found_at)}</span>
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Date Found</span>
          </div>
        </div>
      </div>
    </div>
  );
}
