"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Ambulance,
  ArrowRight,
  Building2,
  ChevronRight,
  Clock,
  CreditCard,
  Layers,
  Menu,
  PhoneCall,
  Radio,
  ShieldCheck,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LandingPageView() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between selection:bg-primary-light selection:text-primary overflow-x-hidden">
      {/* 1. Header & Navigation */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 focus:outline-hidden group"
          >
            <Image
              src="/lifedispatch-logo-header.png"
              alt="LifeDispatch"
              width={160}
              height={40}
              className="h-8 sm:h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav
            className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary"
            aria-label="Main Navigation"
          >
            <a
              href="#features"
              className="hover:text-primary transition-colors py-2"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-primary transition-colors py-2"
            >
              How It Works
            </a>
            <a
              href="#network"
              className="hover:text-primary transition-colors py-2"
            >
              Hospital Network
            </a>
            <Link
              href="/dev/components"
              className="hover:text-primary transition-colors py-2 flex items-center gap-1.5 text-xs text-secondary font-semibold"
            >
              <Layers className="h-3.5 w-3.5" aria-hidden="true" />
              Dev Gallery
            </Link>
          </nav>

          {/* Desktop Auth CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="min-h-[44px] text-text-secondary hover:text-text-primary hover:bg-muted font-medium cursor-pointer"
              >
                Patient Login
              </Button>
            </Link>
            <Link href="/login?role=staff">
              <Button className="min-h-[44px] bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-5 rounded-lg shadow-xs cursor-pointer transition-colors">
                <Radio className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Staff Portal
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button (responsive.md §2B: min 44x44px, aria-label) */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              className="min-h-[44px] min-w-[44px] p-2 text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg focus:outline-hidden flex items-center justify-center cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-primary" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav Menu (responsive.md §2B) */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-surface px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-1">
              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-muted hover:text-primary transition-colors min-h-[44px] flex items-center cursor-pointer"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("how-it-works")}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-muted hover:text-primary transition-colors min-h-[44px] flex items-center cursor-pointer"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("network")}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-muted hover:text-primary transition-colors min-h-[44px] flex items-center cursor-pointer"
              >
                Hospital Network
              </button>
              <Link
                href="/dev/components"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-secondary hover:bg-secondary-light/40 transition-colors min-h-[44px] flex items-center gap-2"
              >
                <Layers className="h-4 w-4" aria-hidden="true" />
                Dev Component Gallery
              </Link>
            </nav>

            <div className="pt-3 border-t border-border flex flex-col gap-2.5">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full min-h-[44px] border-border text-text-primary font-medium"
                >
                  Patient Login
                </Button>
              </Link>
              <Link
                href="/login?role=staff"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="w-full min-h-[44px] bg-primary hover:bg-primary-dark text-primary-foreground font-semibold">
                  <Radio className="h-4 w-4 mr-2" aria-hidden="true" />
                  Staff Portal
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[400px] bg-primary-light/80 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Emergency Tagline Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-light border border-primary/20 text-primary text-xs sm:text-sm font-semibold shadow-2xs"
          >
            <Activity className="h-4 w-4 animate-pulse" aria-hidden="true" />
            <span>
              Intelligent Emergency Medical Dispatch & Ambulance Fleet
              Coordination
            </span>
          </motion.div>

          {/* Main Title (Fluid clamp scale per responsive.md §2C) */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.15]"
          >
            Every Second Matters in Critical Care.{" "}
            <span className="text-primary block mt-1">
              We Cut Response Time by 65%.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            LifeDispatch connects patients, advanced life-support ambulances,
            and tertiary emergency rooms through real-time GPS telematics,
            automated scoring, and live diversion tracking.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto sm:max-w-none"
          >
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto min-h-[48px] px-8 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Patient Login</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>

            <Link href="/login?role=staff" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-h-[48px] px-7 border-border hover:border-primary text-text-primary hover:bg-surface font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Radio className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Operations Staff Login</span>
              </Button>
            </Link>
          </motion.div>

          {/* Quick Dial Hotline Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-4 flex items-center justify-center gap-2 text-xs text-text-muted"
          >
            <PhoneCall
              className="h-3.5 w-3.5 text-primary shrink-0"
              aria-hidden="true"
            />
            <span>
              Metropolitan Emergency Dispatch Direct Hotline:{" "}
              <strong className="text-text-primary font-semibold">
                +880 2 999 111
              </strong>
            </span>
          </motion.div>
        </div>

        {/* Live Operational Metrics Ribbon */}
        <div className="mt-14 sm:mt-20 max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              label: "Target P1 Response",
              value: "< 8 Mins",
              icon: Clock,
              note: "National emergency SLA",
            },
            {
              label: "Fleet Ready",
              value: "35 Units",
              icon: Ambulance,
              note: "ALS, BLS, Neonatal",
            },
            {
              label: "Partner Hospitals",
              value: "14 Facilities",
              icon: Building2,
              note: "Real-time bed telemetry",
            },
            {
              label: "Audit Compliance",
              value: "100%",
              icon: ShieldCheck,
              note: "Cryptographic timeline",
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="bg-surface border border-border rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-text-muted mb-2">
                  <span className="text-xs font-medium text-text-secondary">
                    {stat.label}
                  </span>
                  <div className="h-8 w-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight font-mono">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">
                    {stat.note}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Feature Highlights (4 Cards - Deliverable 2.1) */}
      <section
        id="features"
        className="py-16 sm:py-24 bg-surface border-y border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3 py-1 rounded-full border border-primary/20">
              Platform Features
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight mt-3">
              Engineered for Mission-Critical Emergency Medicine
            </h2>
            <p className="mt-2 text-sm sm:text-base text-text-secondary">
              LifeDispatch transforms chaotic triage into a deterministic,
              real-time workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Activity,
                title: "Haversine Distance Telematics",
                description:
                  "Dynamic GPS vehicle tracking calculates composite proximity, equipment capability, and crew readiness with zero manual guesswork.",
                tag: "Algorithmic Match",
              },
              {
                icon: Building2,
                title: "Hospital Bed & Diversion Sync",
                description:
                  "Live ER bed telemetry prevents ambulances from arriving at saturated emergency rooms by auto-detecting hospital diversion statuses.",
                tag: "Zero Bottlenecks",
              },
              {
                icon: Clock,
                title: "2-Minute Fail-Safe Timeout",
                description:
                  "Strict acceptance countdown timers ensure drivers acknowledge dispatches immediately, triggering automatic unit reassignment if unclaimed.",
                tag: "Fail-Safe Protocol",
              },
              {
                icon: ShieldCheck,
                title: "Full Immutable Audit Logs",
                description:
                  "Every status change, priority upgrade, and timestamped milestone is cryptographically recorded for regulatory compliance and safety oversight.",
                tag: "Enterprise Trust",
              },
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-background border border-border hover:border-primary rounded-2xl p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-12 w-12 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-2xs">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>

                    <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block mb-1">
                      {feat.tag}
                    </span>

                    <h3 className="text-base sm:text-lg font-bold text-text-primary group-hover:text-primary transition-colors leading-snug">
                      {feat.title}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border flex items-center text-xs font-semibold text-primary">
                    <span>Learn capability</span>
                    <ChevronRight
                      className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform"
                      aria-hidden="true"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. How It Works (5-Step Flow - Deliverable 2.1) */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3 py-1 rounded-full border border-primary/20">
              End-to-End Workflow
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight mt-3">
              How LifeDispatch Coordinates Rapid Response
            </h2>
            <p className="mt-2 text-sm sm:text-base text-text-secondary">
              A 5-step synchronized flow connecting patient distress calls to
              hospital bed handovers.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-border -translate-y-6 -z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
              {[
                {
                  step: "01",
                  title: "Distress Call Logged",
                  desc: "Patient or bystander submits emergency type, vital notes, and precise geolocation.",
                  icon: PhoneCall,
                },
                {
                  step: "02",
                  title: "Algorithmic Unit Scoring",
                  desc: "System ranks nearby ambulances by distance (50%), priority (30%), and capability class (20%).",
                  icon: Activity,
                },
                {
                  step: "03",
                  title: "Driver Assignment",
                  desc: "Driver receives mobile assignment with 2-minute countdown timer and navigation routes.",
                  icon: Radio,
                },
                {
                  step: "04",
                  title: "Hospital Bed Lock",
                  desc: "Destination hospital confirms ER bed availability and medical staff stands by in resuscitation bay.",
                  icon: Building2,
                },
                {
                  step: "05",
                  title: "Handover & Settled Fare",
                  desc: "Seamless ER clinical handover completed with instant transparent BDT invoice generation.",
                  icon: CreditCard,
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.1 }}
                    className="bg-surface border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between text-left relative"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xl font-extrabold text-primary/80 bg-primary-light px-2.5 py-1 rounded-md">
                          {item.step}
                        </span>
                        <div className="h-8 w-8 rounded-lg bg-background border border-border flex items-center justify-center text-text-secondary">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-text-primary mb-1.5 leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-xs text-text-secondary leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Hospital Network & Fleet Trust Banner */}
      <section id="network" className="py-14 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Integrated with Metropolitan Dhaka Tertiary Healthcare Centers
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-sm font-semibold text-text-secondary opacity-80">
            <span className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
              Dhaka Medical College (DMCH)
            </span>
            <span className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
              Evercare Hospital Dhaka
            </span>
            <span className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
              United Hospital Limited
            </span>
            <span className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
              Square Hospital
            </span>
            <span className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
              Kurmitola General Hospital
            </span>
          </div>
        </div>
      </section>

      {/* 6. Pre-Footer Call to Action Banner */}
      <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-light via-surface to-background border-t border-border">
        <div className="max-w-4xl mx-auto text-center space-y-6 bg-surface border border-primary/20 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto shadow-2xs">
            <Ambulance className="h-7 w-7" aria-hidden="true" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Ready to Experience Modern Emergency Dispatch?
          </h2>

          <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
            Access patient services, review fleet operational telemetry, or
            explore our interactive shared design components.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/register">
              <Button
                size="lg"
                className="min-h-[44px] bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-8 shadow-xs cursor-pointer"
              >
                Create Free Account
              </Button>
            </Link>

            <Link href="/dev/components">
              <Button
                size="lg"
                variant="outline"
                className="min-h-[44px] border-border hover:border-primary text-text-primary font-semibold px-6 cursor-pointer"
              >
                <Layers
                  className="h-4 w-4 mr-2 text-secondary"
                  aria-hidden="true"
                />
                Dev Component Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-border bg-surface py-10 px-4 sm:px-6 lg:px-8 text-xs text-text-secondary">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Image
              src="/lifedispatch-logo-header.png"
              alt="LifeDispatch"
              width={130}
              height={32}
              className="h-7 w-auto object-contain"
            />
            <span className="hidden sm:inline text-text-muted">•</span>
            <span className="text-text-muted">
              Intelligent Emergency Medical Dispatch & Ambulance Coordination
              Platform
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-text-muted">
            <Link
              href="/login"
              className="hover:text-primary transition-colors"
            >
              Patient Sign In
            </Link>
            <Link
              href="/register"
              className="hover:text-primary transition-colors"
            >
              Register
            </Link>
            <Link
              href="/login?role=staff"
              className="hover:text-primary transition-colors"
            >
              Staff Portal
            </Link>
            <Link
              href="/payment/result?status=success"
              className="hover:text-primary transition-colors"
            >
              Receipt Preview
            </Link>
            <Link
              href="/dev/components"
              className="hover:text-primary text-secondary font-medium transition-colors"
            >
              Dev Gallery
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 mt-6 border-t border-border text-center text-text-muted text-[11px]">
          © {new Date().getFullYear()} LifeDispatch Inc. All rights reserved.
          Standard Light-Mode Clinical Healthcare UI Design System.
        </div>
      </footer>
    </div>
  );
}
