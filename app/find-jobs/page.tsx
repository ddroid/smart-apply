import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FindJobsClient } from "@/components/find-jobs/FindJobsClient";
import { createInsforgeServer } from "@/lib/insforge-server";
import { redirect } from "next/navigation";

export default async function FindJobsPage() {
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { data: initialJobs } = await insforge.database
    .from("jobs")
    .select("*")
    .eq("user_id", user.id)
    .order("found_at", { ascending: false });

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />
      <main className="flex-1 p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-6">
        <FindJobsClient initialJobs={initialJobs || []} />
      </main>
      <Footer />
    </div>
  );
}
