"use client";

import { Search, ChevronDown, Building2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { JobType } from "./FindJobsClient";
import { useRouter } from "next/navigation";
import { AdzunaCredit } from "./AdzunaCredit";

type JobListProps = {
  jobs: JobType[];
};

type MatchFilter = "all" | "high" | "low";
type SortOption = "score" | "newest" | "oldest";

function SourceBadge({ source }: { source?: "search" | "url" }) {
  if (source === "url") {
    return (
      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-surface-secondary text-text-secondary">
        URL
      </span>
    );
  }

  return (
    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-accent-light text-accent">
      Search
    </span>
  );
}

export function JobList({ jobs }: JobListProps) {
  const router = useRouter();
  const [matchFilter, setMatchFilter] = useState<MatchFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("score");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (matchFilter === "high" && job.match_score < 70) return false;
      if (matchFilter === "low" && job.match_score >= 70) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !job.company.toLowerCase().includes(query) &&
          !job.title.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, matchFilter, searchQuery]);

  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      if (sortBy === "score") {
        return b.match_score - a.match_score;
      }
      if (sortBy === "newest") {
        return new Date(b.found_at).getTime() - new Date(a.found_at).getTime();
      }
      return new Date(a.found_at).getTime() - new Date(b.found_at).getTime();
    });
  }, [filteredJobs, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortedJobs.length, matchFilter, searchQuery, sortBy]);

  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage);
  const paginatedJobs = sortedJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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
    <div className="flex flex-col gap-3 w-full">
      <div className="bg-surface border border-border shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] rounded-2xl w-full flex flex-col overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 border-b border-border bg-surface flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by company or role..."
              className="w-full bg-surface-secondary/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent/50 transition-shadow"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <select
                value={matchFilter}
                onChange={(e) => setMatchFilter(e.target.value as MatchFilter)}
                className="appearance-none bg-surface border border-border rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/50 cursor-pointer"
              >
                <option value="all">All Matches</option>
                <option value="high">High Match (≥70)</option>
                <option value="low">Low Match (&lt;70)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-surface border border-border rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/50 cursor-pointer"
              >
                <option value="score">Match Score</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/20 text-xs font-bold text-text-secondary uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Company</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold">Match Score</th>
                <th className="px-6 py-4 font-bold">Salary Est.</th>
                <th className="px-6 py-4 font-bold">Source</th>
                <th className="px-6 py-4 font-bold">Date Found</th>
              </tr>
            </thead>
            <tbody>
              {paginatedJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-text-muted">
                    {jobs.length === 0
                      ? "No jobs found yet. Try searching above!"
                      : "No jobs match your filters."}
                  </td>
                </tr>
              ) : (
                paginatedJobs.map((job) => (
                  <tr
                    key={job.id}
                    onClick={() => router.push(`/find-jobs/${job.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
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
                      <span className="text-sm text-text-secondary font-medium">
                        {job.salary || "Not specified"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <SourceBadge source={job.source} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-secondary">{formatTimeAgo(job.found_at)}</span>
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
            Showing{" "}
            <span className="font-bold text-text-primary">
              {sortedJobs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-bold text-text-primary">
              {Math.min(currentPage * itemsPerPage, sortedJobs.length)}
            </span>{" "}
            of <span className="font-bold text-text-primary">{sortedJobs.length}</span> results
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
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
                      className={`w-8 h-8 flex items-center justify-center text-sm rounded-lg transition-colors ${
                        currentPage === i + 1
                          ? "text-accent bg-accent/10 border border-accent/20 font-bold"
                          : "text-text-secondary font-medium hover:bg-surface-secondary"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                }
                if (Math.abs(currentPage - 1 - i) === 2) {
                  return (
                    <span key={i} className="text-text-muted px-1">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <AdzunaCredit />
    </div>
  );
}
