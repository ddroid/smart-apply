import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createInsforgeServer } from "@/lib/insforge-server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { JobInfo } from "@/components/job-details/JobInfo";
import { MatchScore } from "@/components/job-details/MatchScore";
import { JobDescription } from "@/components/job-details/JobDescription";
import { CompanyResearch } from "@/components/job-details/CompanyResearch";
import { AdzunaCredit } from "@/components/find-jobs/AdzunaCredit";

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { data: job, error } = await insforge.database
    .from("jobs")
    .select("*")
    .eq("id", resolvedParams.id)
    .eq("user_id", user.id)
    .single();

  if (error || !job) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />
      
      <main className="flex-1 p-8 w-full flex flex-col">
        <div className="w-full max-w-[1024px] mx-auto mb-6">
          <Link href="/find-jobs" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Jobs
          </Link>
        </div>

        <JobInfo job={job} />
        <MatchScore job={job} />
        <JobDescription job={job} />
        <CompanyResearch jobId={job.id} companyName={job.company} initialDossier={job.company_research} />

        {job.external_apply_url || job.source_url ? (
          <div className="w-full max-w-[1024px] mx-auto mt-2 mb-4">
            <a
              href={job.external_apply_url || job.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full py-4 bg-accent hover:bg-accent-dark text-white rounded-xl text-base font-bold transition-colors shadow-sm"
            >
              Apply Now at {job.company}
            </a>
          </div>
        ) : null}

        <div className="w-full max-w-[1024px] mx-auto mb-12">
          <AdzunaCredit />
        </div>
      </main>

      <Footer />
    </div>
  );
}
