import { FileText, ExternalLink } from "lucide-react";

export function JobDescription({ job }: { job: any }) {
  const linkUrl = job.external_apply_url || job.source_url || "#";

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1024px] mx-auto mt-6">
      <div className="bg-surface border border-border shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] rounded-2xl p-8 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-text-secondary" />
          </div>
          <h2 className="text-base font-bold text-text-primary">Job Description</h2>
        </div>
        
        <div className="mt-2">
          <div className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
            {job.about_role || "No description provided."}
            
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="mt-4">
                <span className="font-bold">Responsibilities:</span>
                <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
                  {job.responsibilities.map((req: string) => (
                    <li key={req}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <div className="mt-4">
                <span className="font-bold">Requirements:</span>
                <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
                  {job.requirements.map((req: string) => (
                    <li key={req}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Warning & External Link */}
        <div className="mt-4 p-5 bg-surface-secondary/40 border border-border-light rounded-xl flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-sm text-text-secondary leading-relaxed">
            This job board only provides a preview that ends mid-sentence. Open original listing to read full description.
          </p>
          {linkUrl !== "#" && (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-text-primary bg-surface border border-border rounded-xl hover:bg-surface-secondary transition-colors shrink-0 shadow-sm"
            >
              <ExternalLink className="w-4 h-4 text-text-muted" />
              View Full Job Post
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
