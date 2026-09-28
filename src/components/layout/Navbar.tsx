"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setScrolled(y > 4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={[
        "fixed left-0 right-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-200",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_16px_0_rgba(15,23,42,0.04)]"
          : "bg-transparent border-b-0 shadow-none",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-16 sm:h-[70px] grid grid-cols-[auto_1fr_auto] items-center gap-6">

        {/* ── Logo (left zone) ── */}
        <Link
          href="/"
          className="flex items-center focus:outline-hidden shrink-0"
          aria-label="LifeDispatch Home"
        >
          <Image
            src="/lifedispatch-logo-header.png"
            alt="LifeDispatch"
            width={220}
            height={52}
            className="h-[40px] sm:h-[46px] w-auto object-contain"
            priority
          />
        </Link>

        {/* ── Centered Nav Links (center zone) ── */}
        <nav
          className="hidden md:flex items-center justify-center gap-8 text-[13.5px] font-medium text-slate-500"
          aria-label="Main Navigation"
        >
          {[
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Hospital Network", href: "#network" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-1 hover:text-slate-900 transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* ── Right zone: Login CTA + mobile hamburger ── */}
        <div className="flex items-center gap-3 justify-end">
          {/* Desktop: Technical Login Button */}
          <Link href="/login" className="hidden md:block">
            <Button
              variant="outline"
              size="sm"
              className="h-[38px] px-5 rounded-[3px] border-2 border-slate-900 bg-white text-slate-900 font-bold text-sm shadow-[2px_2px_0px_0px_#0f172a] hover:bg-slate-50 hover:text-slate-900 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              Login
            </Button>
          </Link>

          {/* Mobile: hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="md:hidden min-h-[44px] min-w-[44px] p-2 text-slate-900 bg-white border-2 border-slate-900 rounded-[3px] shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none focus:outline-hidden flex items-center justify-center cursor-pointer transition-all"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-primary" strokeWidth={2.5} aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5 text-slate-900" strokeWidth={2.5} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile slide-down menu ── */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          role="dialog"
          aria-label="Mobile navigation"
          className="md:hidden border-t-2 border-slate-200 bg-white/98 backdrop-blur-md px-6 pt-4 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-1 duration-150"
        >
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            {[
              { label: "Features", id: "features" },
              { label: "How It Works", id: "how-it-works" },
              { label: "Hospital Network", id: "network" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="w-full text-left px-3 py-3 rounded-[3px] text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-primary transition-colors min-h-[44px] flex items-center cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="pt-3 border-t-2 border-slate-200">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="outline"
                className="w-full min-h-[44px] border-2 border-slate-900 rounded-[3px] bg-white text-slate-900 font-bold shadow-[2px_2px_0px_0px_#0f172a] hover:bg-slate-50"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
