"use client";

import { ArrowUp, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="4.9" cy="4" r="2.2" />
      <rect x="2.7" y="8.5" width="4.4" height="12.5" rx="0.5" />
      <path d="M9.8 8.5H14v1.9h.1c.6-1.1 2-2.1 4-2.1 4.3 0 5 2.8 5 6.5V21h-4.4v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9.8V8.5z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.186 24C5.503 24 0 18.591 0 12.015 0 5.438 5.503 0 12.186 0c6.627 0 12.097 5.378 12.097 12.015 0 4.19-2.07 7.744-5.27 9.539l-1.332-1.996c2.585-1.455 4.225-4.328 4.225-7.543 0-5.321-4.407-9.638-9.72-9.638-5.313 0-9.805 4.317-9.805 9.638 0 5.321 4.492 9.638 9.805 9.638 3.513 0 6.634-1.859 8.358-4.717l2.007 1.258C20.378 21.657 16.533 24 12.186 24zm-1.847-15.584c-1.334.204-2.392 1.055-2.83 2.274a3.86 3.86 0 0 0-.21 1.458c.088 1.408.823 2.593 1.968 3.172.935.473 2.083.565 3.076.245.45-.145.859-.387 1.218-.717.06-.056.12-.113.176-.174v-1.785a4.062 4.062 0 0 1-.726.602c-.672.435-1.472.56-2.257.353-.787-.206-1.41-.75-1.708-1.492a3.3 3.3 0 0 1-.168-1.572c.115-.98.718-1.815 1.614-2.235.632-.296 1.344-.383 2.05-.252.793.148 1.477.585 1.93 1.233.272.39.45.83.53 1.307.037.225.056.452.056.68v4.992c0 .488.136.953.393 1.346.257.393.633.684 1.088.84.456.157.954.167 1.442.03.488-.138.909-.425 1.218-.83.618-.81.954-1.82.954-2.868 0-4.667-3.805-8.458-8.483-8.458z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function EcgHeartLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 280 40"
      className={className ?? "h-8 w-auto text-primary"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Left baseline and ECG pulse */}
      <path d="M 0 20 L 84 20 L 88 24 L 96 6 L 104 34 L 110 17 L 115 20 L 121 20" />
      {/* Centered Heart Outline */}
      <path d="M 140 31 C 131 23 121 16 121 9.5 C 121 4.5 125.5 2 130.5 4.5 C 134.5 6.5 138 9.5 140 12 C 142 9.5 145.5 6.5 149.5 4.5 C 154.5 2 159 4.5 159 9.5 C 159 16 149 23 140 31 Z" />
      {/* Right ECG pulse and baseline */}
      <path d="M 159 20 L 165 20 L 170 24 L 178 6 L 186 34 L 192 17 L 197 20 L 280 20" />
    </svg>
  );
}

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    label: "Follow LifeDispatch on LinkedIn",
    icon: LinkedInIcon,
  },
  {
    name: "X",
    href: "https://x.com",
    label: "Follow LifeDispatch on X",
    icon: XIcon,
  },
  {
    name: "Threads",
    href: "https://threads.net",
    label: "Follow LifeDispatch on Threads",
    icon: ThreadsIcon,
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    label: "Follow LifeDispatch on Instagram",
    icon: InstagramIcon,
  },
];

const navigationSections = [
  {
    title: "Platform",
    links: [
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Features", href: "/#features" },
      { label: "Why LifeDispatch", href: "/#why-lifedispatch" },
      { label: "About Us", href: "/about-us" },
    ],
  },
  {
    title: "For Users",
    links: [
      { label: "Patients", href: "/dashboard/patient" },
      { label: "Dispatchers", href: "/dashboard/dispatcher" },
      { label: "Drivers", href: "/dashboard/driver" },
      { label: "Hospital Staff", href: "/dashboard/hospital-staff" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Emergency Workflow", href: "/#how-it-works" },
      { label: "Payment & Invoices", href: "/dashboard/patient/payment" },
      { label: "Help Center", href: "/contact-us" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact Us", href: "/contact-us" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-background border-t border-slate-200/80 pt-12 sm:pt-16 pb-8 sm:pb-12 text-slate-600 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main upper content: Left brand info + Right 4-column navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0 items-start">
          {/* Left Column: Brand summary, logo & social icons */}
          <div className="lg:col-span-4 lg:pr-8 xl:pr-12 lg:border-r lg:border-slate-200">
            <Link
              href="/"
              className="inline-flex items-center outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
              aria-label="LifeDispatch Home"
            >
              <Image
                src="/lifedispatch-logo-header.png"
                alt="LifeDispatch"
                width={175}
                height={40}
                className="h-8 sm:h-9 w-auto object-contain"
                priority
              />
            </Link>

            <p className="mt-4 text-sm sm:text-[14.5px] text-slate-500 font-normal leading-relaxed max-w-xs">
              From emergency requests to hospital arrival, we connect every step
              of emergency response.
            </p>

            {/* Social media badges */}
            <nav
              aria-label="Social media links"
              className="mt-6 flex items-center gap-2.5 sm:gap-3"
            >
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-11 h-11 min-w-11 min-h-11 sm:w-9 sm:h-9 sm:min-w-9 sm:min-h-9 rounded-[8px] border border-slate-200 bg-white text-slate-800 hover:text-primary hover:border-primary shadow-2xs hover:shadow-xs transition-all flex items-center justify-center outline-hidden focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Right Navigation: 4 Columns */}
          <div className="lg:col-span-8 lg:pl-8 xl:pl-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {navigationSections.map((section) => (
              <div key={section.title} className="flex flex-col">
                <h4 className="text-[15px] sm:text-base font-bold text-slate-900 tracking-tight mb-3.5 sm:mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2.5 sm:space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors py-1.5 min-h-10 sm:min-h-8 focus-visible:ring-2 focus-visible:ring-primary rounded-xs outline-hidden"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Top button: Positioned on the right above the divider line */}
        <div className="flex justify-end mt-6 sm:mt-8 mb-4">
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="w-11 h-11 min-w-11 min-h-11 rounded-full bg-primary text-white flex items-center justify-center shadow-xs hover:bg-primary-dark hover:shadow-md active:scale-95 transition-all cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
          </button>
        </div>

        {/* Bottom Horizontal Divider */}
        <div className="w-full border-t border-slate-200" aria-hidden="true" />

        {/* Bottom Row: Copyright + Centered Teal ECG Heart-Line + Built for Better Emergency Response */}
        <div className="pt-6 sm:pt-7 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-[13.5px] text-slate-500 font-normal">
          <div className="order-2 md:order-1 text-center md:text-left md:flex-1">
            <p>© 2026 LifeDispatch. All rights reserved.</p>
          </div>

          <div
            className="order-1 md:order-2 flex items-center justify-center shrink-0 text-primary py-1 md:py-0"
            aria-hidden="true"
          >
            <EcgHeartLine className="h-7 sm:h-8 w-auto max-w-[220px] sm:max-w-[260px]" />
          </div>

          <div className="order-3 md:order-3 text-center md:text-right md:flex-1">
            <p>Built for Better Emergency Response.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
