"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

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

      {/* Auth Button */}
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="px-6 py-2.5 rounded-full text-sm font-medium bg-overlay hover:bg-overlay-dark text-white transition-all duration-200 ease-in-out shadow-sm hover:shadow active:scale-98"
        >
          Start for free
        </Link>
      </div>
    </header>
  );
}
