import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProfileAlert } from "@/components/profile/ProfileAlert";
import { ProfileClient } from "@/components/profile/ProfileClient";
import { createInsforgeServer } from "@/lib/insforge-server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await insforge.database
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />
      <main className="flex-1 flex flex-col items-center p-8 max-w-[1440px] mx-auto w-full">
        <ProfileAlert />
        <ProfileClient initialProfile={profile || {}} />
      </main>
      <Footer />
    </div>
  );
}

