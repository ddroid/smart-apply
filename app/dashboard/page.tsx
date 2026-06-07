import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createInsforgeServer } from "@/lib/insforge-server";
import { redirect } from "next/navigation";
import { ProfileAlert } from "@/components/dashboard/ProfileAlert";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { JobsFoundChart, CompanyResearchChart, MatchScoreChart } from "@/components/dashboard/AnalyticsCharts";
import { getAnalyticsData } from "@/lib/db-analytics";

export default async function DashboardPage() {
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Check if profile is complete
  const { data: profile } = await insforge.database
    .from("profiles")
    .select("is_complete")
    .eq("id", user.id)
    .single();

  const isComplete = profile?.is_complete ?? false;
  
  // Fetch PostHog analytics data
  const { jobsData, researchData, scoreData } = await getAnalyticsData(user.id);

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />
      <main className="flex-1 flex flex-col p-8 max-w-[1440px] mx-auto w-full">
        {!isComplete && <ProfileAlert />}
        <StatsBar userId={user.id} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            <RecentActivity userId={user.id} />
            <JobsFoundChart data={jobsData} />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            <CompanyResearchChart data={researchData} />
            <MatchScoreChart data={scoreData} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
