"use client";

import { Building2, Search, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

interface CompanyResearchProps {
  jobId: string;
  companyName: string;
  initialDossier?: any;
}

export function CompanyResearch({ jobId, companyName, initialDossier }: CompanyResearchProps) {
  const [dossier, setDossier] = useState<any | null>(initialDossier || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResearch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch("/api/agent/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to research company.");
      }
      
      setDossier(data.dossier);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1024px] mx-auto mt-6 mb-6">
      <div className="bg-surface border border-border shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] rounded-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-accent" />
            </div>
            <h2 className="text-base font-bold text-text-primary">Company Research</h2>
          </div>
          {!dossier && (
            <button 
              onClick={handleResearch} 
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark disabled:opacity-70 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {isLoading ? "Researching..." : "Research Company"}
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 m-6 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 leading-relaxed">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!dossier && !isLoading && !error && (
          <div className="p-16 flex flex-col items-center justify-center bg-surface">
            <div className="w-16 h-16 rounded-2xl bg-surface-secondary/50 border border-border-light flex items-center justify-center mb-6">
              <Building2 className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-2">No research yet</h3>
            <p className="text-sm text-text-muted text-center max-w-[360px] leading-relaxed">
              Click &quot;Research Company&quot; to let the AI browse<br/>{companyName}&apos;s public pages and build a<br/>dossier.
            </p>
          </div>
        )}

        {/* Loading State */}
        {!dossier && isLoading && (
          <div className="p-16 flex flex-col items-center justify-center bg-surface">
            <div className="w-16 h-16 rounded-2xl bg-accent-light border border-accent/20 flex items-center justify-center mb-6">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-2">Building Dossier...</h3>
            <p className="text-sm text-text-muted text-center max-w-[360px] leading-relaxed">
              Stagehand is currently exploring {companyName}&apos;s website. This usually takes 15-30 seconds.
            </p>
          </div>
        )}

        {/* Filled State */}
        {dossier && (
          <div className="p-6 flex flex-col gap-8 bg-surface">
            {/* Overview & Why This Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Company Overview</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{dossier.companyOverview}</p>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Why This Role Exists</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{dossier.whyThisRole}</p>
              </div>
            </div>

            {/* Tech Stack & Culture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {dossier.techStack?.map((tech: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-surface-secondary text-text-secondary rounded-lg text-xs font-semibold whitespace-nowrap">
                      {tech}
                    </span>
                  ))}
                  {(!dossier.techStack || dossier.techStack.length === 0) && (
                    <span className="text-sm text-text-muted">Not explicitly mentioned</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Values & Culture</h3>
                <ul className="flex flex-col gap-2">
                  {dossier.culture?.map((item: string, i: number) => (
                    <li key={i} className="text-sm text-text-secondary leading-relaxed flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent/50 shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Strategy: Edge & Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-accent-light rounded-xl border border-accent/20">
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-accent-dark flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Your Edge
                </h3>
                <ul className="flex flex-col gap-2">
                  {dossier.yourEdge?.map((item: string, i: number) => (
                    <li key={i} className="text-sm text-accent-dark leading-relaxed flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-amber-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Gaps to Address
                </h3>
                <ul className="flex flex-col gap-2">
                  {dossier.gapsToAddress?.map((item: string, i: number) => (
                    <li key={i} className="text-sm text-amber-800 leading-relaxed flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Smart Questions & Interview Prep */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Smart Questions to Ask</h3>
                <ul className="flex flex-col gap-2">
                  {dossier.smartQuestions?.map((item: string, i: number) => (
                    <li key={i} className="text-sm text-text-secondary leading-relaxed flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-text-muted shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Interview Prep Topics</h3>
                <ul className="flex flex-col gap-2">
                  {dossier.interviewPrep?.map((item: string, i: number) => (
                    <li key={i} className="text-sm text-text-secondary leading-relaxed flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-text-muted shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sources */}
            <div className="pt-4 mt-2 border-t border-border flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider mr-2">Sources:</span>
              {dossier.sources?.map((url: string, i: number) => {
                let hostname = url;
                try { hostname = new URL(url).hostname; } catch(e) {}
                return (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline truncate max-w-[200px]">
                    {hostname}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
