import { Ambulance, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className="py-14 sm:py-20 lg:py-24 bg-background relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Technical Circuit Frame Wrapper */}
        <div className="relative p-2 sm:p-3">
          {/* Outer Circuit Perimeter Traces & Geometric Nodes */}
          <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
            {/* SVG Circuit Border with Chamfered Corners */}
            <svg
              className="w-full h-full text-primary/40"
              preserveAspectRatio="none"
              viewBox="0 0 1000 200"
              fill="none"
            >
              <title>Outer circuit border frame</title>
              {/* Outer boundary circuit line with chamfered top-right and bottom-left */}
              <path
                d="M 20 8 L 940 8 L 980 48 L 980 192 L 60 192 L 20 152 Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>

            {/* Top-Right Circuit Nodes */}
            <div className="absolute top-1 right-2 sm:right-3 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-primary" />
              <span className="w-2.5 h-2.5 border border-primary bg-background" />
            </div>

            {/* Bottom-Left Circuit Nodes */}
            <div className="absolute bottom-1 left-2 sm:left-3 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 border border-primary bg-background" />
              <span className="w-2.5 h-2.5 bg-primary" />
            </div>
          </div>

          {/* Main Inner Card */}
          <div className="relative bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col lg:flex-row items-center justify-between gap-8 z-10">
            {/* Left Content Group: Icon + Title & Description */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-5 sm:gap-6 text-center sm:text-left">
              {/* Ambulance Icon Container */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary-light border-2 border-primary/40 text-primary flex items-center justify-center shrink-0 shadow-xs">
                <Ambulance className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={2} aria-hidden="true" />
              </div>

              {/* Text Block */}
              <div>
                <h2
                  id="cta-heading"
                  className="text-2xl sm:text-3xl lg:text-[32px] font-black text-slate-900 tracking-tight leading-[1.15]"
                >
                  Ready to Coordinate
                  <span className="block sm:inline"> Emergency Response?</span>
                </h2>
                <p className="mt-2 text-base text-slate-500 font-normal leading-relaxed max-w-xl">
                  Bring patients, ambulances, dispatchers, and hospitals into one connected emergency response platform.
                </p>
              </div>
            </div>

            {/* Right Buttons: Stacked on desktop matching the reference image */}
            <div className="flex flex-col gap-3 w-full sm:w-auto shrink-0">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  className="w-full sm:w-[220px] min-h-[48px] px-6 bg-primary hover:bg-primary-dark text-white font-bold text-sm sm:text-base rounded-[3px] border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] hover:shadow-[1px_1px_0px_0px_#0f172a] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                </Button>
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-[220px] min-h-[48px] px-6 bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm sm:text-base rounded-[3px] border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] hover:shadow-[1px_1px_0px_0px_#0f172a] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Explore the Platform</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
