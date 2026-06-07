import { createInsforgeServer } from "@/lib/insforge-server";

function formatTimeAgo(dateInput: string) {
  if (!dateInput) return "Just now";
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function RecentActivity({ userId }: { userId: string }) {
  const insforge = await createInsforgeServer();

  const [ { data: runs }, { data: jobs } ] = await Promise.all([
    insforge.database
      .from("agent_runs")
      .select("id, jobs_found, job_title_searched, completed_at")
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(10),

    insforge.database
      .from("jobs")
      .select("id, company, found_at")
      .eq("user_id", userId)
      .not("company_research", "is", null)
      .order("found_at", { ascending: false })
      .limit(10)
  ]);

  const rawRuns = runs || [];
  const rawJobs = jobs || [];

  const combined = [
    ...rawRuns.map((r) => ({
      id: `run-${r.id}`,
      title: `Found ${r.jobs_found || 0} jobs for ${r.job_title_searched || "unknown role"}`,
      timeStr: formatTimeAgo(r.completed_at),
      rawDate: new Date(r.completed_at || Date.now()).getTime(),
      type: "success"
    })),
    ...rawJobs.map((j) => ({
      id: `job-${j.id}`,
      title: `Researched ${j.company || "company"}`,
      timeStr: formatTimeAgo(j.found_at),
      rawDate: new Date(j.found_at || Date.now()).getTime(),
      type: "info"
    }))
  ];

  combined.sort((a, b) => b.rawDate - a.rawDate);
  const activities = combined.slice(0, 5);

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] h-full">
      <h2 className="text-base font-semibold text-text-primary mb-6">Recent Activity</h2>
      
      {activities.length === 0 ? (
        <div className="flex items-center justify-center h-full text-sm text-text-muted pb-6">
          No recent activity found.
        </div>
      ) : (
        <div className="flex flex-col">
          {activities.map((activity, index) => {
            const isLast = index === activities.length - 1;
            
            let outerBg = "bg-accent-light";
            let innerBg = "bg-accent";
            
            if (activity.type === "info") {
              outerBg = "bg-info-light";
              innerBg = "bg-info";
            } else if (activity.type === "success") {
              outerBg = "bg-success-light";
              innerBg = "bg-success-alt";
            }

            return (
              <div key={activity.id} className="flex relative">
                {/* Timeline line */}
                {!isLast && (
                  <div className="absolute top-6 left-2 bottom-[-4px] w-px bg-surface-secondary -ml-px" />
                )}
                
                {/* Dot */}
                <div className="relative mt-1 mr-4 shrink-0">
                  <div className={`w-4 h-4 rounded-full ${outerBg} flex items-center justify-center border-2 border-surface`}>
                    <div className={`w-2 h-2 rounded-full ${innerBg}`} />
                  </div>
                </div>
                
                {/* Content */}
                <div className="pb-6">
                  <p className="text-[14px] text-text-primary leading-[20px]">{activity.title}</p>
                  <p className="text-[12px] text-text-muted font-light mt-1">{activity.timeStr}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
