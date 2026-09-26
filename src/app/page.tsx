import {
  Activity,
  ArrowRight,
  Hospital,
  Layers,
  Radio,
  Shield,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between">
      {/* Navigation header */}
      <header className="h-16 border-b border-border bg-surface px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/lifedispatch-logo-header.png"
            alt="LifeDispatch"
            width={140}
            height={36}
            className="h-8 w-auto object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dev/components">
            <Button
              variant="outline"
              className="min-h-[44px] border-primary/30 text-primary hover:bg-primary-light cursor-pointer"
            >
              <Layers className="h-4 w-4 mr-2" aria-hidden="true" />
              Dev Gallery
            </Button>
          </Link>
          <Link href="/dashboard/dispatcher">
            <Button className="min-h-[44px] bg-primary hover:bg-primary-dark text-primary-foreground cursor-pointer">
              Launch Console
              <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-light border border-primary/20 text-primary text-xs font-semibold mb-6">
          <Activity className="h-3.5 w-3.5" aria-hidden="true" />
          <span>LifeDispatch v3 — Design System & Static UI Scaffolding</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary max-w-3xl leading-tight">
          Intelligent Emergency Medical Dispatch & Ambulance Fleet Coordination
        </h1>

        <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">
          Engineered for mission-critical response times in high-density
          metropolitan environments. Phase 1 design tokens, shared UI
          components, and static data schemas are active.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/dev/components">
            <Button
              size="lg"
              className="min-h-[44px] bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-6 shadow-sm cursor-pointer"
            >
              <Layers className="h-4 w-4 mr-2" aria-hidden="true" />
              Open /dev/components Gallery
            </Button>
          </Link>
          <Link href="/dashboard/dispatcher">
            <Button
              size="lg"
              variant="outline"
              className="min-h-[44px] border-border text-text-primary hover:bg-surface hover:border-primary cursor-pointer"
            >
              <Radio className="h-4 w-4 mr-2 text-primary" aria-hidden="true" />
              Open Dispatcher Dashboard
            </Button>
          </Link>
        </div>

        {/* 6 Demo Role Quick Jump */}
        <div className="mt-16 w-full pt-10 border-t border-border text-left">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4 text-center sm:text-left">
            Explore 6 Demo Role Dashboards:
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              {
                name: "Super Admin",
                role: "super-admin",
                icon: Shield,
                desc: "Platform audit",
              },
              {
                name: "System Admin",
                role: "admin",
                icon: Activity,
                desc: "Fleet & hospital config",
              },
              {
                name: "Dispatcher",
                role: "dispatcher",
                icon: Radio,
                desc: "Live triage desk",
              },
              {
                name: "Fleet Driver",
                role: "driver",
                icon: Truck,
                desc: "Mobile dispatch card",
              },
              {
                name: "Patient",
                role: "patient",
                icon: User,
                desc: "Emergency request",
              },
              {
                name: "Hospital Staff",
                role: "hospital-staff",
                icon: Hospital,
                desc: "ER diversion board",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.role}
                  href={`/dashboard/${item.role}`}
                  className="bg-surface border border-border hover:border-primary rounded-xl p-4 transition-all duration-200 hover:shadow-xs group min-h-[44px] flex flex-col justify-between"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary-light text-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-text-muted mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-6 px-4 text-center text-xs text-text-muted">
        <p>
          © 2026 LifeDispatch Operations. Light Mode Minimal Medical Design
          System.
        </p>
      </footer>
    </div>
  );
}
