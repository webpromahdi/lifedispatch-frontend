import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col overflow-x-hidden">
      {/* Full screen background image covering entire page background */}
      <div
        className="fixed inset-0 pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <Image
          src="https://i.ibb.co.com/MyxnLRtc/Sunrise-Hospital-Arrival-with-Ambulance.png"
          alt="Decorative background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft white overlay to ensure high contrast and readability */}
        <div className="absolute inset-0 bg-white/75 backdrop-blur-[0.5px]" />
      </div>

      {/* Header — sits above the background image */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-4 sm:pt-8 sm:pb-5 flex items-center justify-between relative z-20">
        <Link
          href="/"
          className="flex items-center gap-2 focus:outline-hidden group"
          aria-label="LifeDispatch Home"
        >
          <Image
            src="/lifedispatch-logo-header.png"
            alt="LifeDispatch"
            width={240}
            height={80}
            className="h-10 sm:h-12 md:h-[50px] w-auto object-contain transition-transform group-hover:scale-[1.02]"
            priority
          />
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-slate-700 hover:text-primary transition-colors min-h-[44px] px-3 py-2 focus:outline-hidden"
        >
          <ChevronLeft className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full relative z-10">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}
