import { createInsforgeServer } from "@/lib/insforge-server";

export function formatTrendData(jobs: any[], dateField: string) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const trend = new Map<string, number>();
  
  // Initialize last 7 days with 0 in chronological order
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    trend.set(days[d.getDay()], 0);
  }
  
  if (jobs) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    
    jobs.forEach(job => {
      const d = new Date(job[dateField]);
      if (d >= sevenDaysAgo) {
        const dayName = days[d.getDay()];
        if (trend.has(dayName)) {
          trend.set(dayName, trend.get(dayName)! + 1);
        }
      }
    });
  }
  
  return Array.from(trend.entries()).map(([name, value]) => ({ name, value }));
}

export function formatScoreData(jobs: any[]) {
  const buckets = {
    "50-60%": 0,
    "60-70%": 0,
    "70-80%": 0,
    "80-90%": 0,
    "90-100%": 0,
  };
  
  if (jobs) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    
    jobs.forEach(job => {
      const d = new Date(job.found_at);
      if (d >= thirtyDaysAgo) {
        const score = job.match_score || 0;
        if (score >= 90) buckets["90-100%"]++;
        else if (score >= 80) buckets["80-90%"]++;
        else if (score >= 70) buckets["70-80%"]++;
        else if (score >= 60) buckets["60-70%"]++;
        else if (score >= 50) buckets["50-60%"]++;
      }
    });
  }
  
  return Object.entries(buckets).map(([name, value]) => ({ name, value }));
}

export async function getAnalyticsData(userId: string) {
  const insforge = await createInsforgeServer();
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [ { data: jobsFound }, { data: researched } ] = await Promise.all([
    insforge.database
      .from("jobs")
      .select("found_at, match_score")
      .eq("user_id", userId)
      .gte("found_at", thirtyDaysAgo.toISOString()),
      
    insforge.database
      .from("jobs")
      .select("researched_at")
      .eq("user_id", userId)
      .not("researched_at", "is", null)
      .gte("researched_at", sevenDaysAgo.toISOString())
  ]);

  const jobsData = formatTrendData(jobsFound || [], "found_at");
  const researchData = formatTrendData(researched || [], "researched_at");
  const scoreData = formatScoreData(jobsFound || []);

  return { jobsData, researchData, scoreData };
}
