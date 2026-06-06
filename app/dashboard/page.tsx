import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createInsforgeServer } from "@/lib/insforge-server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const insforge = await createInsforgeServer();
  const { data: { user }, error } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 max-w-[1440px] mx-auto w-full">
        <div className="bg-surface border border-border shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] rounded-2xl p-8 max-w-lg w-full text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-success-light text-success flex items-center justify-center text-3xl">
            ✓
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Welcome to JobPilot!
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              You have successfully authenticated via InsForge.
            </p>
          </div>

          <div className="w-full bg-surface-secondary rounded-xl p-4 text-left border border-border flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-muted font-medium">Email Address:</span>
              <span className="text-text-primary font-semibold">{user.email}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted font-medium">User ID:</span>
              <span className="text-text-primary font-mono">{user.id}</span>
            </div>
          </div>

          <p className="text-xs text-text-muted">
            The full dashboard widgets and analytics will be implemented in Phase 5.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
