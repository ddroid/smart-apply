"use client";

import { Search, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";

type SearchControlsProps = {
  onSearch: (jobTitle: string, location: string) => void;
  isSearching: boolean;
  hasSearched: boolean;
  stats: { found: number; strong: number };
};

export function SearchControls({ onSearch, isSearching, hasSearched, stats }: SearchControlsProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    if (!jobTitle) return; // job title is required
    onSearch(jobTitle, location);
  };

  return (
    <div className="bg-surface border border-border shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] rounded-2xl p-6 w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 flex flex-col gap-2 w-full">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            Job Title
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Frontend Engineer"
              className="w-full bg-surface border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2 w-full">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Remote, New York..."
            className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>

        <button 
          onClick={handleSearch}
          disabled={isSearching || !jobTitle}
          className="bg-accent hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed text-accent-foreground rounded-xl px-6 py-2.5 font-bold text-sm h-[42px] flex items-center gap-2 flex-shrink-0 transition-colors"
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {isSearching ? "Searching..." : "Find Jobs"}
        </button>
      </div>

      {isSearching || stats.found > 0 ? (
        <div className="bg-success-lightest border border-success-light rounded-xl px-4 py-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-success" />
          <span className="text-sm font-medium text-success-dark">
            {isSearching ? `Found ${stats.found} jobs so far and saved ${stats.strong} strong matches...` : `Found ${stats.found} jobs and saved ${stats.strong} strong matches.`}
          </span>
        </div>
      ) : hasSearched && !isSearching && stats.found === 0 ? (
        <div className="bg-warning-lightest border border-warning-light rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="text-sm font-medium text-warning-dark">
            No jobs found for this search. Try different keywords or location.
          </span>
        </div>
      ) : null}
    </div>
  );
}
