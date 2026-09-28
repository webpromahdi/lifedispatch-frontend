import Link from "next/link";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="4.5" cy="4" r="2.2" />
      <rect x="2.3" y="8.5" width="4.4" height="12.5" rx="0.5" />
      <path d="M9.8 8.5H14v1.9h.1c.6-1.1 2-2.1 4-2.1 4.3 0 5 2.8 5 6.5V21h-4.4v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9.8V8.5z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
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

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    label: "Follow LifeDispatch on LinkedIn",
    icon: LinkedInIcon,
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    label: "Follow LifeDispatch on Twitter",
    icon: TwitterIcon,
  },
  {
    name: "X",
    href: "https://x.com",
    label: "Follow LifeDispatch on X",
    icon: XIcon,
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    label: "Follow LifeDispatch on Instagram",
    icon: InstagramIcon,
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-background text-text-primary pt-10 sm:pt-12 pb-12 sm:pb-16 text-center overflow-x-hidden">
      {/* Top Angular Circuit Border Treatment (CSS vector line matching reference) */}
      <div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none select-none mb-8 sm:mb-9"
        aria-hidden="true"
      >
        <svg
          className="w-full h-4 sm:h-5 text-slate-200"
          preserveAspectRatio="none"
          viewBox="0 0 1200 20"
          fill="none"
        >
          <title>Footer circuit wireframe</title>
          <path
            d="M0 4 L260 4 L280 16 L920 16 L940 4 L1200 4"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* 1. Social Links */}
        <nav
          aria-label="Social media links"
          className="flex items-center justify-center gap-5 sm:gap-6"
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
                className="size-11 sm:size-9 min-w-[44px] min-h-[44px] sm:min-w-9 sm:min-h-9 rounded-[6px] border border-[#2dd4bf]/80 hover:border-primary text-slate-800 hover:text-primary bg-background hover:bg-primary-light/40 transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </nav>

        {/* 2. Product Description */}
        <div className="mt-7 sm:mt-8 max-w-lg mx-auto text-center px-2">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Need help with LifeDispatch?
          </h3>
          <p className="mt-2 text-base text-slate-500 font-normal leading-relaxed">
            Learn how LifeDispatch connects patients, dispatchers, ambulances,
            and hospitals in one coordinated emergency response.
          </p>
        </div>

        {/* Horizontal Divider Line */}
        <div
          className="w-full max-w-5xl mx-auto my-7 sm:my-8 border-t border-slate-200"
          aria-hidden="true"
        />

        {/* 3. Copyright */}
        <div className="text-center text-sm text-slate-500 font-normal space-y-1">
          <p>© 2026 LifeDispatch. All rights reserved.</p>
          <p>Emergency Response Coordination Platform.</p>
        </div>

        {/* 4. Footer Links */}
        <nav
          aria-label="Legal and general links"
          className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 mt-4 sm:mt-5 text-sm text-slate-500"
        >
          <Link
            href="/contact"
            className="min-h-[44px] inline-flex items-center px-1.5 text-slate-500 hover:text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-600 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
          >
            Contact Us
          </Link>
          <span className="text-slate-400 select-none" aria-hidden="true">
            •
          </span>
          <Link
            href="/about"
            className="min-h-[44px] inline-flex items-center px-1.5 text-slate-500 hover:text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-600 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
          >
            About Us
          </Link>
          <span className="text-slate-400 select-none" aria-hidden="true">
            •
          </span>
          <Link
            href="/privacy"
            className="min-h-[44px] inline-flex items-center px-1.5 text-slate-500 hover:text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-600 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
          >
            Privacy Policy
          </Link>
          <span className="text-slate-400 select-none" aria-hidden="true">
            •
          </span>
          <Link
            href="/terms"
            className="min-h-[44px] inline-flex items-center px-1.5 text-slate-500 hover:text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-600 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
          >
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
}
