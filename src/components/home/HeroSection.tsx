"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Ambulance,
  ArrowRight,
  CheckCircle2,
  Clock,
  Hospital,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-headline"
      className="relative overflow-hidden bg-background"
    >
      {/* Subtle ambient teal background glow */}
      <div
        aria-hidden="true"
        className="absolute -top-32 right-0 w-[500px] h-[500px] bg-primary-light/50 rounded-full blur-3xl pointer-events-none"
      />

      {/* ── Technical Wireframe & HUD Background Accents (From Reference Image) ── */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Top perimeter circuit line with 45° step notches */}
        <svg
          className="absolute top-16 sm:top-[70px] left-0 w-full h-8 text-slate-200"
          preserveAspectRatio="none"
          viewBox="0 0 1200 32"
          fill="none"
        >
          <title>Top decorative circuit wireframe</title>
          <path
            d="M0 8 L180 8 L200 24 L1000 24 L1020 8 L1200 8"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>

        {/* Bottom perimeter circuit line with 45° step notches */}
        <svg
          className="absolute bottom-4 left-0 w-full h-8 text-slate-200"
          preserveAspectRatio="none"
          viewBox="0 0 1200 32"
          fill="none"
        >
          <title>Bottom decorative circuit wireframe</title>
          <path
            d="M0 24 L220 24 L240 8 L960 8 L980 24 L1200 24"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-center">
          {/* ── LEFT: Content column ── */}
          <div className="flex flex-col gap-6 lg:gap-7">
            {/* Eyebrow Badge (Chamfered Corner + Solid Teal Accent Tab) */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="relative inline-flex items-center h-8 sm:h-9 pl-3 pr-7 bg-white border-2 border-primary rounded-[2px] shadow-[2px_2px_0px_0px_#14B8A6] overflow-hidden"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
                }}
              >
                <Activity
                  className="h-4 w-4 text-primary mr-2 shrink-0"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800">
                  Real-Time Emergency Dispatch
                </span>
                {/* Solid teal corner notch from reference */}
                <span
                  className="absolute top-0 right-0 w-3 h-full bg-primary"
                  aria-hidden="true"
                />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              id="hero-headline"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] font-black tracking-tight text-slate-900 leading-[1.12]"
            >
              <span className="block">Every Second Matters</span>
              <span className="block">
                When Response{" "}
                <span className="text-primary">Can&apos;t Wait.</span>
              </span>
            </motion.h1>

            {/* Supporting text */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-[500px] font-normal"
            >
              LifeDispatch connects patients, ambulances, dispatchers, and
              hospitals to coordinate emergency response in real time.
            </motion.p>

            {/* Feature indicators (Framed compact technical elements) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.24 }}
              className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2.5"
              aria-label="Key capabilities"
            >
              {[
                { icon: Zap, label: "Real-Time Dispatch" },
                { icon: Activity, label: "Smart Ambulance Matching" },
                { icon: Hospital, label: "Hospital Coordination" },
              ].map((item, index) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 border-2 border-primary/50 bg-primary-light/50 flex items-center justify-center rounded-[2px] text-primary shrink-0">
                      <item.icon
                        className="h-3.5 w-3.5"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-xs sm:text-[13px] font-bold text-slate-800">
                      {item.label}
                    </span>
                  </div>
                  {index < 2 && (
                    <span
                      className="hidden sm:inline-block h-3.5 w-[1.5px] bg-slate-200"
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </motion.div>

            {/* CTA buttons (Offset Shadow + 2px Dark Border) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.32 }}
              className="flex flex-col sm:flex-row gap-3.5 pt-2"
            >
              <Link href="/login" className="w-full sm:w-auto">
                <Button className="min-h-[48px] px-6 bg-primary hover:bg-primary-dark text-white font-bold text-sm sm:text-base rounded-[3px] border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] hover:shadow-[1px_1px_0px_0px_#0f172a] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer flex items-center gap-2.5 w-full sm:w-auto justify-center">
                  <Ambulance
                    className="h-4 w-4"
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
                  <span>Request Emergency</span>
                  <ArrowRight
                    className="h-4 w-4 ml-0.5"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="min-h-[48px] px-6 bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm sm:text-base rounded-[3px] border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] hover:shadow-[1px_1px_0px_0px_#0f172a] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer flex items-center gap-2.5 w-full sm:w-auto justify-center"
                >
                  <span>Explore Platform</span>
                  <ArrowRight
                    className="h-4 w-4"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* ── RIGHT: Framed Image with Chamfered Cuts + Floating Status Cards ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            {/* Vertical telemetry boxes on right edge */}
            <div
              className="hidden sm:flex flex-col gap-1.5 absolute -right-6 top-16 pointer-events-none"
              aria-hidden="true"
            >
              <span className="w-2 h-2 bg-slate-700" />
              <span className="w-2 h-2 border border-slate-400" />
              <span className="w-2 h-2 border border-slate-400" />
            </div>

            {/* Bottom telemetry indicators: 1 teal square, 3 gray squares */}
            <div
              className="absolute -bottom-7 right-2 sm:right-6 flex items-center gap-1.5 pointer-events-none"
              aria-hidden="true"
            >
              <span className="w-2.5 h-2.5 bg-primary" />
              <span className="w-2.5 h-2.5 bg-slate-300" />
              <span className="w-2.5 h-2.5 bg-slate-300" />
              <span className="w-2.5 h-2.5 bg-slate-300" />
              <span className="w-10 sm:w-16 h-[1.5px] bg-slate-300 ml-1" />
            </div>

            {/* Top-right circuit trace line */}
            <div
              className="hidden sm:block absolute -top-3 -right-6 w-16 h-8 pointer-events-none"
              aria-hidden="true"
            >
              <svg
                className="w-full h-full text-slate-300"
                viewBox="0 0 64 32"
                fill="none"
              >
                <title>Top-right circuit trace</title>
                <path
                  d="M0 24 L16 8 L48 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect x="48" y="6" width="4" height="4" fill="currentColor" />
              </svg>
            </div>

            {/* Bottom-left circuit trace line */}
            <div
              className="hidden sm:block absolute -bottom-5 -left-6 w-20 h-8 pointer-events-none"
              aria-hidden="true"
            >
              <svg
                className="w-full h-full text-slate-300"
                viewBox="0 0 80 32"
                fill="none"
              >
                <title>Bottom-left circuit trace</title>
                <path
                  d="M80 8 L60 24 L20 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Image Container with 45° Chamfered Corners & 2px Dark Border */}
            <div className="relative w-full max-w-[580px] aspect-4/3 filter drop-shadow-[4px_4px_0px_#0f172a]">
              {/* Dark border shell (2px outline via 2px padding on clipped container) */}
              <div
                className="w-full h-full bg-slate-900 p-[2px]"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%)",
                }}
              >
                {/* Inner image container */}
                <div
                  className="relative w-full h-full bg-slate-950 overflow-hidden"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 27px) 0, 100% 27px, 100% calc(100% - 27px), calc(100% - 27px) 100%, 0 100%)",
                  }}
                >
                  <Image
                    src="https://i.ibb.co.com/M598dxsK/lifedispatch-hero-emergency-response.png"
                    alt="Emergency response coordination in action"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 580px"
                    className="object-cover"
                    priority
                    unoptimized
                  />
                  {/* Subtle bottom contrast gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

            {/* ── Floating card 1: Dispatch Accepted — top-left ── */}
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.55 }}
              aria-hidden="true"
              className="absolute -top-3 left-4 sm:-top-4 sm:left-2 z-20 pointer-events-none"
            >
              {/* Structured UI Component with bottom-right chamfer and subtle depth */}
              <div
                className="relative bg-slate-900 p-[1.5px] drop-shadow-[2px_2px_0px_rgba(15,23,42,0.18)]"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
                }}
              >
                <div
                  className="relative bg-white px-3 py-2 sm:px-3.5 sm:py-2.5 flex items-center gap-2.5 min-w-[145px] sm:min-w-[155px] overflow-hidden"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)",
                  }}
                >
                  {/* Small vertical teal accent tab on top right */}
                  <span
                    className="absolute top-0 right-0 w-2 h-4.5 bg-primary"
                    style={{
                      clipPath:
                        "polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 4px))",
                    }}
                    aria-hidden="true"
                  />
                  <span className="h-6 w-6 sm:h-7 sm:w-7 rounded-[4px] bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold leading-none mb-1">
                      Dispatch
                    </p>
                    <p className="text-xs sm:text-[13px] font-extrabold text-slate-900 leading-none tracking-tight">
                      Accepted
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Floating card 2: ETA — center-right ── */}
            <motion.div
              initial={{ opacity: 0, x: 16, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.68 }}
              aria-hidden="true"
              className="absolute top-1/2 -translate-y-1/2 -right-3 sm:-right-6 z-20 pointer-events-none"
            >
              {/* Structured UI Component with technical chamfered corners and subtle depth */}
              <div
                className="relative bg-slate-900 p-[1.5px] drop-shadow-[2px_2px_0px_rgba(15,23,42,0.18)]"
                style={{
                  clipPath:
                    "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)",
                }}
              >
                <div
                  className="relative bg-white px-3 py-2 sm:px-3.5 sm:py-2.5 flex items-center gap-2.5 min-w-[135px] sm:min-w-[145px] overflow-hidden"
                  style={{
                    clipPath:
                      "polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)",
                  }}
                >
                  {/* Small vertical teal accent tab on right edge */}
                  <span
                    className="absolute top-0 right-0 w-2 h-5 bg-primary"
                    style={{
                      clipPath:
                        "polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 4px))",
                    }}
                    aria-hidden="true"
                  />
                  <span className="h-6 w-6 sm:h-7 sm:w-7 rounded-[4px] bg-teal-50 border border-teal-200/80 text-primary flex items-center justify-center shrink-0">
                    <Clock
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">
                      ETA
                    </p>
                    <p className="text-xs sm:text-sm font-extrabold text-slate-900 font-mono tracking-tight leading-none">
                      04:32
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Floating card 3: Hospital Ready — bottom-left ── */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.8 }}
              aria-hidden="true"
              className="absolute -bottom-3 left-4 sm:-bottom-4 sm:left-4 z-20 pointer-events-none"
            >
              {/* Structured UI Component with bottom-right chamfer and subtle depth */}
              <div
                className="relative bg-slate-900 p-[1.5px] drop-shadow-[2px_2px_0px_rgba(15,23,42,0.18)]"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
                }}
              >
                <div
                  className="relative bg-white px-3 py-2 sm:px-3.5 sm:py-2.5 flex items-center gap-2.5 min-w-[145px] sm:min-w-[155px] overflow-hidden"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)",
                  }}
                >
                  {/* Small vertical purple accent tab on top right */}
                  <span
                    className="absolute top-0 right-0 w-2 h-4.5 bg-secondary"
                    style={{
                      clipPath:
                        "polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 4px))",
                    }}
                    aria-hidden="true"
                  />
                  <span className="h-6 w-6 sm:h-7 sm:w-7 rounded-[4px] bg-purple-50 border border-purple-200/80 text-secondary flex items-center justify-center shrink-0">
                    <Hospital
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold leading-none mb-1">
                      Hospital
                    </p>
                    <p className="text-xs sm:text-[13px] font-extrabold text-slate-900 leading-none tracking-tight">
                      Ready
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
