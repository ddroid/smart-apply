import { createInsforgeServer } from "@/lib/insforge-server";

export async function StatsBar({ userId }: { userId: string }) {
  const insforge = await createInsforgeServer();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoISO = sevenDaysAgo.toISOString();

  const [
    { count: totalJobs },
    { count: researched },
    { count: thisWeek },
    { data: scoresData }
  ] = await Promise.all([
    // Total Jobs
    insforge.database
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
      
    // Companies Researched
    insforge.database
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .not("company_research", "is", null),
      
    // Jobs This Week
    insforge.database
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("found_at", sevenDaysAgoISO),
      
    // Match Scores
    insforge.database
      .from("jobs")
      .select("match_score")
      .eq("user_id", userId)
      .not("match_score", "is", null)
  ]);

  let avgMatchRate = 0;
  if (scoresData && scoresData.length > 0) {
    const sum = scoresData.reduce((acc, curr) => acc + (curr.match_score || 0), 0);
    avgMatchRate = Math.round(sum / scoresData.length);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-8">
      {/* Total Jobs Found */}
      <div className="bg-surface rounded-2xl p-6 shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)]">
        <h3 className="text-sm font-medium text-text-secondary mb-3">Total Jobs Found</h3>
        <p className="text-[30px] font-bold text-text-primary leading-[36px] mb-3">{totalJobs || 0}</p>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-light text-text-muted">Total matching your profile</span>
        </div>
      </div>

      {/* Avg. Match Rate */}
      <div className="bg-surface rounded-2xl p-6 shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)]">
        <h3 className="text-sm font-medium text-text-secondary mb-3">Avg. Match Rate</h3>
        <p className="text-[30px] font-bold text-text-primary leading-[36px] mb-3">{avgMatchRate}%</p>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-light text-text-muted">Across all scored jobs</span>
        </div>
      </div>

      {/* Companies Researched */}
      <div className="bg-surface rounded-2xl p-6 shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)]">
        <h3 className="text-sm font-medium text-text-secondary mb-3">Companies Researched</h3>
        <p className="text-[30px] font-bold text-text-primary leading-[36px] mb-3">{researched || 0}</p>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-light text-text-muted">Total dossiers generated</span>
        </div>
      </div>

      {/* Jobs This Week */}
      <div className="bg-surface rounded-2xl p-6 shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)]">
        <h3 className="text-sm font-medium text-text-secondary mb-3">Jobs This Week</h3>
        <p className="text-[30px] font-bold text-text-primary leading-[36px] mb-3">{thisWeek || 0}</p>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-light text-text-muted">Found in the last 7 days</span>
        </div>
      </div>
    </div>
  );
}
