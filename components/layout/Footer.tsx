import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface py-8 px-8 mt-auto">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Logo & Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-accent to-lavender shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="Smart Apply logo"
              width={20}
              height={20}
              className="object-contain invert brightness-200"
              style={{ width: "auto" }}
            />
          </div>
          <span className="text-base font-bold text-text-primary tracking-tight">
            Smart Apply
          </span>
        </Link>

        {/* Right Side: Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link
            href="/dashboard"
            className="text-text-secondary hover:text-text-primary transition-colors duration-150"
          >
            Dashboard
          </Link>
          <Link
            href="/privacy-policy"
            className="text-text-secondary hover:text-text-primary transition-colors duration-150"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-and-conditions"
            className="text-text-secondary hover:text-text-primary transition-colors duration-150"
          >
            Terms & Condition
          </Link>
        </div>
      </div>
    </footer>
  );
}
