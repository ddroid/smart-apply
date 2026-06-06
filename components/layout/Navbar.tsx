"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { insforge } from "@/lib/insforge-client";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    async function fetchUser() {
      try {
        const { data } = await insforge.auth.getCurrentUser();
        if (active && data?.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("[navbar/fetch-user]", err);
      }
    }
    fetchUser();
    return () => {
      active = false;
    };
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      // Terminate backend session
      await insforge.auth.signOut();
      
      // Clear local server cookies
      await fetch("/api/auth/logout", { method: "POST" });

      setUser(null);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("[navbar/sign-out]", err);
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Find Jobs", href: "/find-jobs" },
    { label: "Profile", href: "/profile" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface px-6 h-16 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center group">
        <Image
          src="/logo.png"
          alt="JobPilot Logo"
          width={106}
          height={36}
          priority
          className="object-contain transition-transform duration-150 group-hover:scale-102"
        />
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ease-in-out ${
                isActive
                  ? "bg-accent-light text-accent font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Auth State Control */}
      <div className="flex items-center gap-4 relative">
        {user ? (
          <>
            {/* User Avatar Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 rounded-full bg-accent-light text-accent hover:bg-accent/20 flex items-center justify-center font-bold text-sm border border-accent/10 shadow-sm transition-all duration-150 cursor-pointer focus:outline-none"
            >
              {user.email ? user.email.charAt(0).toUpperCase() : "U"}
            </button>

            {/* Click Outside Overlay */}
            {menuOpen && (
              <div
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setMenuOpen(false)}
              />
            )}

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 top-11 z-50 w-64 bg-surface border border-border rounded-xl shadow-lg p-2.5 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* User Details */}
                <div className="px-3.5 py-2.5 border-b border-border/50 flex flex-col gap-0.5">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                    Signed in as
                  </span>
                  <span className="text-sm text-text-primary font-medium truncate">
                    {user.email}
                  </span>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-error hover:bg-error/10 active:scale-98 transition-all duration-150 cursor-pointer flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 012 2v2h-2V4H4v16h10v-2h2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h10z" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </>
        ) : (
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-full text-sm font-medium bg-overlay hover:bg-overlay-dark text-white transition-all duration-200 ease-in-out shadow-sm hover:shadow active:scale-98"
          >
            Start for free
          </Link>
        )}
      </div>
    </header>
  );
}
