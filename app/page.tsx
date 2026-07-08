import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/homepage/Hero";
import { Features } from "@/components/homepage/Features";
import { Testimonial } from "@/components/homepage/Testimonial";
import { BottomCTA } from "@/components/homepage/BottomCTA";
import { Footer } from "@/components/layout/Footer";
import { createInsforgeServer } from "@/lib/insforge-server";
import { redirect } from "next/navigation";

export default async function Home() {
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  const ctaHref = "/login";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        <Hero ctaHref={ctaHref} />
        <Features />
        <Testimonial />
        <BottomCTA ctaHref={ctaHref} />
      </main>
      <Footer />
    </div>
  );
}
