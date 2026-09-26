import { ArrowLeft, HeartPulse, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between relative overflow-hidden">
      {/* Subtle background ambient gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-primary-light/60 to-transparent pointer-events-none -z-10" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 focus:outline-hidden group"
        >
          <Image
            src="/lifedispatch-logo-header.png"
            alt="LifeDispatch"
            width={140}
            height={36}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-text-secondary hover:text-primary transition-colors min-h-[44px] px-2 focus:outline-hidden"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span>LifeDispatch Medical Emergency Dispatch Platform</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <ShieldCheck
              className="h-3.5 w-3.5 text-status"
              aria-hidden="true"
            />
            256-bit TLS Encrypted
          </span>
          <span>•</span>
          <Link
            href="/dev/components"
            className="hover:text-primary transition-colors"
          >
            Dev Gallery
          </Link>
        </div>
      </footer>
    </div>
  );
}
