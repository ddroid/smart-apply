"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { insforge } from "@/lib/insforge-client";
import posthog from "posthog-js";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    let active = true;
    async function fetchUser() {
      try {
        const { data } = await insforge.auth.getCurrentUser();
        if (active && data?.user) {
          setUser(data.user);
        } else if (active) {
          setUser(null);
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

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await insforge.auth.signOut();

      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      });

      posthog.reset();
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

  const navLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ease-in-out ${
      isActive
        ? "bg-accent-light text-accent font-semibold"
        : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface px-6 h-16 flex items-center justify-between">
      <Link href="/" className="flex items-center group">
        <Image
          src="/logo.png"
          alt="Smart Apply logo"
          width={106}
          height={36}
          priority
          style={{ width: "auto" }}
          className="object-contain transition-transform duration-150 group-hover:scale-102"
        />
      </Link>

      {user && (
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={navLinkClass(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}

      <div className="flex items-center gap-3 relative">
        {user && (
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden w-9 h-9 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-secondary flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none"
            aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileNavOpen}
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        {user ? (
          <>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-9 h-9 rounded-full bg-accent-light text-accent hover:bg-accent/20 flex items-center justify-center font-bold text-sm border border-accent/10 shadow-sm transition-all duration-150 cursor-pointer focus:outline-none"
              aria-label="Open account menu"
            >
              {user.email ? user.email.charAt(0).toUpperCase() : "U"}
            </button>

            {(userMenuOpen || mobileNavOpen) && (
              <div
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => {
                  setUserMenuOpen(false);
                  setMobileNavOpen(false);
                }}
              />
            )}

            {mobileNavOpen && (
              <div className="absolute right-0 top-11 z-50 w-56 md:hidden bg-surface border border-border rounded-xl shadow-lg p-2 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-150">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${navLinkClass(item.href)} block text-center`}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {userMenuOpen && (
              <div className="absolute right-0 top-11 z-50 w-64 bg-surface border border-border rounded-xl shadow-lg p-2.5 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3.5 py-2.5 border-b border-border/50 flex flex-col gap-0.5">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                    Signed in as
                  </span>
                  <span className="text-sm text-text-primary font-medium truncate">
                    {user.email}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
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
