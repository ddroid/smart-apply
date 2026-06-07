"use client";

import { useState } from "react";
import { SearchControls } from "./SearchControls";
import { JobList } from "./JobList";

export type JobType = {
  id: string;
  company: string;
  title: string;
  match_score: number;
  salary: string | null;
  posted_at?: string;
  found_at: string;
};

export function FindJobsClient({ initialJobs = [] }: { initialJobs?: JobType[] }) {
  const [jobs, setJobs] = useState<JobType[]>(initialJobs);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [stats, setStats] = useState({ found: 0, strong: 0 });

  const handleSearch = async (jobTitle: string, location: string) => {
    setIsSearching(true);
    setHasSearched(true);
    setStats({ found: 0, strong: 0 });

    try {
      const res = await fetch("/api/agent/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, location }),
      });

      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      let currentFound = 0;
      let currentStrong = 0;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            if (dataStr === "[DONE]") {
               break;
            }
            try {
              const job = JSON.parse(dataStr);
              setJobs((prev) => [job, ...prev]);
              currentFound++;
              if (job.match_score >= 80) currentStrong++; // Strong match threshold
              setStats({ found: currentFound, strong: currentStrong });
            } catch (e) {
              console.error("Failed to parse SSE data", dataStr);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <SearchControls onSearch={handleSearch} isSearching={isSearching} hasSearched={hasSearched} stats={stats} />
      <JobList jobs={jobs} />
    </div>
  );
}
