"use client";

import { Search, ChevronDown, Building2, Filter, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { JobType } from "./FindJobsClient";
import { useRouter } from "next/navigation";

type JobListProps = {
  jobs: JobType[];
};

export function JobList({ jobs }: JobListProps) {
  const router = useRouter();
  const [searchedFilter, setSearchedFilter] = useState("all"); 
  const [uploadedFilter, setUploadedFilter] = useState("all");
  const [minScore, setMinScore] = useState(0);
  const [deselectedRoles, setDeselectedRoles] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate role frequencies for top 5 / top 25
  const roleFrequencies = useMemo(() => {
    const freqs: Record<string, number> = {};
    jobs.forEach(j => {
      freqs[j.title] = (freqs[j.title] || 0) + 1;
    });
    return Object.entries(freqs).sort((a, b) => b[1] - a[1]);
  }, [jobs]);

  const allRoles = useMemo(() => roleFrequencies.map(r => r[0]), [roleFrequencies]);
  const top5Roles = useMemo(() => roleFrequencies.slice(0, 5).map(r => r[0]), [roleFrequencies]);
  const top25Roles = useMemo(() => roleFrequencies.slice(0, 25).map(r => r[0]), [roleFrequencies]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const foundDate = new Date(job.found_at);
      const postedDate = job.posted_at ? new Date(job.posted_at) : foundDate;
      const now = new Date();
      const diffHoursSearched = (now.getTime() - foundDate.getTime()) / (1000 * 60 * 60);
      const diffHoursUploaded = (now.getTime() - postedDate.getTime()) / (1000 * 60 * 60);

      // Searched filter
      if (searchedFilter === "24h" && diffHoursSearched > 24) return false;
      if (searchedFilter === "1w" && diffHoursSearched > 24 * 7) return false;
      if (searchedFilter === "1m" && diffHoursSearched > 24 * 30) return false;

      // Uploaded filter
      if (uploadedFilter === "24h" && diffHoursUploaded > 24) return false;
      if (uploadedFilter === "3d" && diffHoursUploaded > 24 * 3) return false;
      if (uploadedFilter === "1w" && diffHoursUploaded > 24 * 7) return false;
      if (uploadedFilter === "1m" && diffHoursUploaded > 24 * 30) return false;

      // Match Score
      if (job.match_score < minScore) return false;

      // Roles
      if (deselectedRoles.includes(job.title)) return false;

      // Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!job.company.toLowerCase().includes(query) && !job.title.toLowerCase().includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, searchedFilter, uploadedFilter, minScore, deselectedRoles, searchQuery]);

  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.found_at).getTime() - new Date(a.found_at).getTime();
      }
      if (sortBy === "score") {
        return b.match_score - a.match_score;
      }
      if (sortBy === "salary") {
        const getSal = (s: string | null) => s ? parseInt(s.replace(/[^0-9]/g, "")) || 0 : 0;
        return getSal(b.salary) - getSal(a.salary);
      }
      return 0;
    });
  }, [filteredJobs, sortBy]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortedJobs.length, searchedFilter, uploadedFilter, minScore, deselectedRoles, searchQuery, sortBy]);

  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage);
  const paginatedJobs = sortedJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetFilters = () => {
    setSearchedFilter("all");
    setUploadedFilter("all");
    setMinScore(0);
    setDeselectedRoles([]);
    setSearchQuery("");
    setSortBy("date");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-info";
    return "bg-warning";
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
    <div className="bg-surface border border-border shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] rounded-2xl w-full flex flex-col overflow-hidden">
      
      {/* Search & Top Pills Bar */}
      <div className="p-4 border-b border-border bg-surface flex flex-col gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company or role..."
            className="w-full bg-surface-secondary/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-muted transition-shadow"
          />
        </div>
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
             <button 
                onClick={() => setDeselectedRoles([])}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${deselectedRoles.length === 0 ? 'bg-text-primary text-background' : 'bg-surface-secondary text-text-primary hover:bg-surface-muted'}`}
             >
                All
             </button>
             {top5Roles.map(role => {
                const isOnlyThisSelected = deselectedRoles.length === allRoles.length - 1 && !deselectedRoles.includes(role);
                return (
                  <button 
                    key={role}
                    onClick={() => setDeselectedRoles(allRoles.filter(r => r !== role))}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${isOnlyThisSelected ? 'bg-text-primary text-background' : 'bg-surface-secondary text-text-primary hover:bg-surface-muted'}`}
                  >
                    {role}
                  </button>
                )
             })}
          </div>
          <div className="flex items-center gap-2 shrink-0">
             <button 
                onClick={() => setShowFilters(true)} 
                className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-text-primary hover:bg-surface-secondary rounded-lg transition-colors border border-transparent hover:border-border"
             >
               Filters <Filter className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>

      {/* YouTube-style Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/60 p-4" onClick={() => setShowFilters(false)}>
          <div className="bg-surface border border-border rounded-xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-medium text-text-primary">Search filters</h2>
              <button onClick={() => setShowFilters(false)} className="text-text-muted hover:text-text-primary transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex flex-col gap-10">
              {/* Top Section: 4 Columns */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex flex-col gap-5">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border pb-3">Searched</h3>
                  <div className="flex flex-col gap-3.5 text-sm">
                    {[{label: "Last 24 hours", val: "24h"}, {label: "Last week", val: "1w"}, {label: "Last month", val: "1m"}, {label: "All time", val: "all"}].map(opt => (
                      <button 
                        key={opt.val} 
                        onClick={() => setSearchedFilter(opt.val)}
                        className={`text-left transition-colors ${searchedFilter === opt.val ? 'text-text-primary font-bold' : 'text-text-secondary hover:text-text-primary'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border pb-3">Upload Date</h3>
                  <div className="flex flex-col gap-3.5 text-sm">
                    {[{label: "Last 24 hours", val: "24h"}, {label: "Last 3 days", val: "3d"}, {label: "Last week", val: "1w"}, {label: "Last month", val: "1m"}, {label: "All time", val: "all"}].map(opt => (
                      <button 
                        key={opt.val} 
                        onClick={() => setUploadedFilter(opt.val)}
                        className={`text-left transition-colors ${uploadedFilter === opt.val ? 'text-text-primary font-bold' : 'text-text-secondary hover:text-text-primary'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border pb-3">Match Score</h3>
                  <div className="flex flex-col gap-3.5 text-sm">
                    <span className="text-text-secondary">Minimum: {minScore}%</span>
                    <input type="range" min="0" max="100" value={minScore} onChange={e => setMinScore(Number(e.target.value))} className="w-full accent-text-primary" />
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border pb-3">Sort By</h3>
                  <div className="flex flex-col gap-3.5 text-sm">
                    {[{label: "Date Found", val: "date"}, {label: "Match Score", val: "score"}, {label: "Salary", val: "salary"}].map(opt => (
                      <button 
                        key={opt.val} 
                        onClick={() => setSortBy(opt.val)}
                        className={`text-left transition-colors ${sortBy === opt.val ? 'text-text-primary font-bold' : 'text-text-secondary hover:text-text-primary'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Section: Roles (Horizontal) */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Roles</h3>
                  <button onClick={() => setDeselectedRoles([])} className="text-xs text-accent hover:text-accent-dark font-medium">Select All</button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-[20vh] overflow-y-auto custom-scrollbar pr-2">
                  {top25Roles.map(role => {
                    const isSelected = !deselectedRoles.includes(role);
                    return (
                      <button 
                        key={role} 
                        onClick={() => {
                          if (isSelected) setDeselectedRoles([...deselectedRoles, role]);
                          else setDeselectedRoles(deselectedRoles.filter(r => r !== role));
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors border ${isSelected ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-surface border-border text-text-muted hover:text-text-primary line-through opacity-60'}`}
                        title={role}
                      >
                        {role}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-border flex justify-end gap-4 bg-surface-secondary/10">
               <button onClick={resetFilters} className="px-5 py-2.5 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors">
                 Reset
               </button>
               <button onClick={() => setShowFilters(false)} className="px-6 py-2.5 text-sm font-bold bg-text-primary text-background rounded-lg hover:opacity-90 transition-opacity">
                 Apply Filters
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Area */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px] text-left">
          <thead>
            <tr className="border-b border-border bg-surface-secondary/20 text-xs font-bold text-text-secondary uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">Company</th>
              <th className="px-6 py-4 font-bold">Role</th>
              <th className="px-6 py-4 font-bold">Match Score</th>
              <th className="px-6 py-4 font-bold">Salary Est.</th>
              <th className="px-6 py-4 font-bold">Date Found</th>
            </tr>
          </thead>
          <tbody>
            {paginatedJobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-text-muted">
                  {jobs.length === 0 ? "No jobs found yet. Try searching above!" : "No jobs match your filters."}
                </td>
              </tr>
            ) : (
              paginatedJobs.map((job) => (
                <tr 
                  key={job.id} 
                  onClick={() => router.push(`/find-jobs/${job.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.push(`/find-jobs/${job.id}`);
                    }
                  }}
                  tabIndex={0}
                  className="border-b border-border-light hover:bg-surface-secondary/40 transition-colors last:border-b-0 cursor-pointer focus:outline-none focus:bg-surface-secondary/60"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center flex-shrink-0 border border-border">
                        <Building2 className="w-5 h-5 text-text-muted" />
                      </div>
                      <span className="font-bold text-text-primary text-sm">{job.company}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-text-primary">{job.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1.5 bg-surface-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getScoreColor(job.match_score)} rounded-full`}
                          style={{ width: `${job.match_score}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-text-primary">{job.match_score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-text-secondary font-medium">{job.salary || "Not specified"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-text-secondary">
                      {formatTimeAgo(job.found_at)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border flex items-center justify-between bg-surface">
        <div className="text-sm text-text-secondary">
          Showing <span className="font-bold text-text-primary">{sortedJobs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-bold text-text-primary">{Math.min(currentPage * itemsPerPage, sortedJobs.length)}</span> of <span className="font-bold text-text-primary">{sortedJobs.length}</span> results
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-3 py-1.5 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => {
               if (i === 0 || i === totalPages - 1 || Math.abs(currentPage - 1 - i) <= 1) {
                  return (
                    <button 
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 flex items-center justify-center text-sm rounded-lg transition-colors ${currentPage === i + 1 ? 'text-accent bg-accent/10 border border-accent/20 font-bold' : 'text-text-secondary font-medium hover:bg-surface-secondary'}`}
                    >
                      {i + 1}
                    </button>
                  );
               }
               if (Math.abs(currentPage - 1 - i) === 2) {
                  return <span key={i} className="text-text-muted px-1">...</span>;
               }
               return null;
            })}

            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-3 py-1.5 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
}
