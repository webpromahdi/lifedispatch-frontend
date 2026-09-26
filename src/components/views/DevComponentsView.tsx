"use client";

import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Ambulance as AmbulanceIcon,
  Bell,
  CheckCircle2,
  Clock,
  DollarSign,
  Info,
  Layers,
  Plus,
  Radio,
  RefreshCw,
  Sparkles,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/common/DataTable";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { StatCard } from "@/components/common/StatCard";
// Shared common components
import { StatusBadge } from "@/components/common/StatusBadge";

// Dispatch components
import { CountdownTimer } from "@/components/dispatch/CountdownTimer";
import { DispatchCard } from "@/components/dispatch/DispatchCard";
import { RecommendationList } from "@/components/dispatch/RecommendationList";
import { DemoRoleSwitcher } from "@/components/layout/DemoRoleSwitcher";

// UI primitives
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { seedAmbulances } from "@/lib/dummy/ambulances";
import { seedDispatches } from "@/lib/dummy/dispatches";
import { seedDrivers } from "@/lib/dummy/drivers";
// Dummy data & types
import { seedEmergencies } from "@/lib/dummy/emergencies";
import type { ScoredAmbulanceCandidate } from "@/lib/types/dispatch.types";
import { cn, formatBDT, formatDate } from "@/lib/utils";

// Buggy component to test ErrorBoundary
function BuggyComponent({ shouldCrash }: { shouldCrash: boolean }) {
  if (shouldCrash) {
    throw new Error("Simulated runtime crash in client view.");
  }
  return (
    <div className="p-4 bg-status-bg text-status-text rounded-lg border border-status/30 text-sm font-medium">
      ErrorBoundary Child Status: Operating Normally (no errors caught)
    </div>
  );
}

export function DevComponentsView() {
  // Table pagination state
  const [tablePage, setTablePage] = useState(1);
  const pageSize = 4;
  const totalAmbulancePages = Math.ceil(seedAmbulances.length / pageSize);
  const paginatedAmbulances = seedAmbulances.slice(
    (tablePage - 1) * pageSize,
    tablePage * pageSize,
  );

  // Skeleton variant state
  const [skeletonVariant, setSkeletonVariant] = useState<
    "stat" | "table" | "dispatch" | "list" | "card"
  >("stat");

  // Error boundary simulation state
  const [shouldCrash, setShouldCrash] = useState(false);

  // Scored candidate dummy list
  const scoredCandidates: ScoredAmbulanceCandidate[] = [
    {
      ambulance: seedAmbulances[1], // AVAILABLE ALS
      driver: seedDrivers[1],
      distanceKm: 2.4,
      score: 0.942,
      scoreBreakdown: {
        distanceScore: 0.9,
        priorityScore: 1.0,
        typeScore: 1.0,
      },
      serviceOverdue: false,
    },
    {
      ambulance: seedAmbulances[2], // AVAILABLE BLS (service overdue)
      driver: seedDrivers[2],
      distanceKm: 3.8,
      score: 0.815,
      scoreBreakdown: {
        distanceScore: 0.84,
        priorityScore: 0.8,
        typeScore: 0.8,
      },
      serviceOverdue: true,
    },
    {
      ambulance: seedAmbulances[3], // NEONATAL
      driver: seedDrivers[3],
      distanceKm: 5.1,
      score: 0.764,
      scoreBreakdown: {
        distanceScore: 0.79,
        priorityScore: 0.8,
        typeScore: 0.7,
      },
      serviceOverdue: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary p-4 sm:p-8 space-y-12 max-w-7xl mx-auto">
      {/* Dev Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold mb-2 border border-primary/20">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Phase 1 Component Preview Gallery
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Design System & Shared Components
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Validating all Phase 1 deliverables (1.1 — 1.9) against
            color-design.md tokens and responsive.md standards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="outline" className="min-h-[44px] cursor-pointer">
              Back to Home
            </Button>
          </Link>
          <Link href="/dashboard/dispatcher">
            <Button className="min-h-[44px] bg-primary hover:bg-primary-dark text-primary-foreground cursor-pointer">
              Launch Dispatcher Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Demo Role Switcher Demo */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" aria-hidden="true" />
            1. Demo Role Switcher Navigation (Plan §1.7)
          </h2>
          <span className="text-xs text-text-muted">
            6 pre-configured roles
          </span>
        </div>
        <p className="text-xs text-text-secondary">
          Click any role pill to navigate to that role&apos;s dashboard root.
        </p>
        <DemoRoleSwitcher />
      </section>

      {/* 2. Sonner Toaster Verification */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" aria-hidden="true" />
            2. Toast Notifications (&lt;Toaster /&gt; from Sonner)
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Test toast trigger and dismissal in bottom-right corner.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() =>
              toast.success("Ambulance Dispatched", {
                description: "Unit DHAKA-METRO-CHA-71-4091 en route to Banani.",
              })
            }
            className="min-h-[44px] bg-status hover:bg-green-600 text-white cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" aria-hidden="true" />
            Trigger Success Toast
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              toast.error("Dispatch Rejected", {
                description:
                  "Driver declined assignment due to oxygen maintenance.",
              })
            }
            className="min-h-[44px] border-destructive/40 text-destructive hover:bg-destructive-bg cursor-pointer"
          >
            <XCircle className="h-4 w-4 mr-2" aria-hidden="true" />
            Trigger Error Toast
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              toast.warning("ER Bed Diversion", {
                description: "United Hospital is now in DIVERTING status.",
              })
            }
            className="min-h-[44px] border-warning/40 text-warning-foreground hover:bg-warning-bg cursor-pointer"
          >
            <AlertTriangle className="h-4 w-4 mr-2" aria-hidden="true" />
            Trigger Warning Toast
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              toast.info("System Sync", {
                description:
                  "Redis active refresh session verified for 6 roles.",
              })
            }
            className="min-h-[44px] border-border text-text-primary hover:bg-primary-light hover:text-primary cursor-pointer"
          >
            <Info className="h-4 w-4 mr-2" aria-hidden="true" />
            Trigger Info Toast
          </Button>
        </div>
      </section>

      {/* 3. Color Tokens Verification from color-design.md */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-primary" />
            3. Color Design System Tokens (color-design.md)
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Verified exact hex, CSS variable mappings, and 60-30-10 light-mode
            palette.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            {
              name: "primary",
              hex: "#14B8A6",
              bg: "bg-[#14B8A6]",
              text: "text-white",
            },
            {
              name: "primary-light",
              hex: "#F0FDFA",
              bg: "bg-[#F0FDFA]",
              text: "text-[#14B8A6]",
              border: true,
            },
            {
              name: "primary-dark",
              hex: "#0D9488",
              bg: "bg-[#0D9488]",
              text: "text-white",
            },
            {
              name: "background",
              hex: "#F8FAFC",
              bg: "bg-[#F8FAFC]",
              text: "text-[#1E2D3D]",
              border: true,
            },
            {
              name: "surface",
              hex: "#FFFFFF",
              bg: "bg-[#FFFFFF]",
              text: "text-[#1E2D3D]",
              border: true,
            },
            {
              name: "text-primary",
              hex: "#1E2D3D",
              bg: "bg-[#1E2D3D]",
              text: "text-white",
            },
            {
              name: "text-secondary",
              hex: "#64748B",
              bg: "bg-[#64748B]",
              text: "text-white",
            },
            {
              name: "text-muted",
              hex: "#94A3B8",
              bg: "bg-[#94A3B8]",
              text: "text-white",
            },
            {
              name: "border",
              hex: "#E2E8F0",
              bg: "bg-[#E2E8F0]",
              text: "text-[#1E2D3D]",
            },
            {
              name: "secondary",
              hex: "#8B5CF6",
              bg: "bg-[#8B5CF6]",
              text: "text-white",
            },
            {
              name: "status (dot)",
              hex: "#22C55E",
              bg: "bg-[#22C55E]",
              text: "text-white",
            },
            {
              name: "destructive",
              hex: "#EF4444",
              bg: "bg-[#EF4444]",
              text: "text-white",
            },
          ].map((token) => (
            <div
              key={token.name}
              className="rounded-xl border border-border p-3 bg-surface flex flex-col justify-between h-24 shadow-2xs"
            >
              <div
                className={`h-8 w-full rounded-md ${token.bg} ${token.border ? "border border-border" : ""} flex items-center justify-center font-mono text-[10px] font-bold ${token.text}`}
              >
                {token.hex}
              </div>
              <div className="mt-2 text-[11px] font-semibold text-text-primary truncate">
                {token.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. StatusBadge Gallery (All PRD §3.3 Enums) */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-status animate-pulse" />
            4. StatusBadge Component (PRD §3.3 & Rule [B4])
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Single green dot (#22C55E) for positive states; specific amber for
            REASSIGNMENT_REQUIRED; muted for TIMED_OUT.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
              Positive Statuses (Green Dot #22C55E + Text)
            </span>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="ACTIVE" />
              <StatusBadge status="AVAILABLE" />
              <StatusBadge status="ACCEPTING" />
              <StatusBadge status="PAID" />
              <StatusBadge status="COMPLETED" />
              <StatusBadge status="ACCEPTED" />
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
              Workflow & Operational Statuses
            </span>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="PENDING" />
              <StatusBadge status="PRIORITIZED" />
              <StatusBadge status="DISPATCHING" />
              <StatusBadge status="ACTIVE_TRIP" />
              <StatusBadge status="DIVERTING" />
              <StatusBadge status="PENDING_ACCEPTANCE" />
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
              Special Handling (Amber Reassignment & Muted Timeout)
            </span>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="REASSIGNMENT_REQUIRED" />
              <StatusBadge status="TIMED_OUT" />
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
              Negative / Terminal States (Text Only)
            </span>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="CANCELLED" />
              <StatusBadge status="REJECTED" />
              <StatusBadge status="FAILED" />
              <StatusBadge status="SUSPENDED" />
              <StatusBadge status="DELETED" />
              <StatusBadge status="CLOSED" />
              <StatusBadge status="OUT_OF_SERVICE" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. PriorityBadge Gallery (P1-P5) */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <AlertCircle
              className="h-4 w-4 text-destructive"
              aria-hidden="true"
            />
            5. PriorityBadge Component (P1 Red → P5 Gray, Text-Only)
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Minimalist text-only color scale with zero background noise.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 p-4 rounded-lg bg-background border border-border">
          <div className="flex items-center gap-2">
            <PriorityBadge priority="P1_CRITICAL" />
            <span className="text-xs text-text-muted">(&lt; 8 min target)</span>
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority="P2_EMERGENCY" />
            <span className="text-xs text-text-muted">
              (&lt; 12 min target)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority="P3_URGENT" />
            <span className="text-xs text-text-muted">
              (&lt; 20 min target)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority="P4_NON_URGENT" />
            <span className="text-xs text-text-muted">
              (&lt; 45 min target)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority="P5_ROUTINE" />
            <span className="text-xs text-text-muted">
              (&lt; 60 min target)
            </span>
          </div>
        </div>
      </section>

      {/* 6. StatCard KPI Metric Cards */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" aria-hidden="true" />
          6. StatCard Component (Framer Motion Fade-Up)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active Emergencies"
            value="14"
            icon={AlertCircle}
            trend={{ value: "+12%", isPositive: true }}
            subtitle="4 critical P1 cases in progress"
          />
          <StatCard
            label="Ambulances Ready"
            value="28 / 35"
            icon={AmbulanceIcon}
            trend={{ value: "-2 units", isPositive: false }}
            subtitle="80% fleet availability rate"
          />
          <StatCard
            label="Avg Response Time"
            value="6.4 min"
            icon={Clock}
            trend={{ value: "-45s", isPositive: true }}
            subtitle="Within national 8-min SLA"
          />
          <StatCard
            label="Today's Revenue"
            value={formatBDT(48650)}
            icon={DollarSign}
            trend={{ value: "+৳5,200", isPositive: true }}
            subtitle="52 completed trips billed"
          />
        </div>
      </section>

      {/* 7. PageHeader Component */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-xs">
        <h2 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" aria-hidden="true" />
          7. PageHeader Component
        </h2>
        <PageHeader
          title="Fleet Dispatch Overview"
          description="Real-time telematics and geographic allocation across Metropolitan Dhaka emergency grid."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/dispatcher" },
            {
              label: "Fleet Monitor",
              href: "/dashboard/dispatcher/ambulances",
            },
            { label: "Live Queue" },
          ]}
          action={
            <Button className="min-h-[44px] bg-primary hover:bg-primary-dark text-primary-foreground font-medium cursor-pointer">
              <Plus className="h-4 w-4 mr-1.5" aria-hidden="true" />
              New Incident
            </Button>
          }
        />
      </section>

      {/* 8. DataTable & Pagination */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <AmbulanceIcon
              className="h-4 w-4 text-primary"
              aria-hidden="true"
            />
            8. DataTable & Pagination (Responsive Horizontal Scroll)
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Wraps table with overflow-x-auto at &lt; md. Prevents page
            horizontal scroll.
          </p>
        </div>

        <DataTable
          headerSlot={
            <>
              <div className="font-semibold text-sm text-text-primary">
                Ambulance Fleet Status ({seedAmbulances.length} Units)
              </div>
              <div className="text-xs text-text-muted">
                Showing page {tablePage} of {totalAmbulancePages}
              </div>
            </>
          }
          footerSlot={
            <Pagination
              page={tablePage}
              totalPages={totalAmbulancePages}
              onPageChange={setTablePage}
              totalRecords={seedAmbulances.length}
            />
          }
        >
          <Table>
            <TableHeader className="bg-background">
              <TableRow>
                <TableHead className="font-semibold text-xs text-text-primary">
                  Reg Number
                </TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">
                  Type
                </TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">
                  Capabilities
                </TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">
                  Next Service
                </TableHead>
                <TableHead className="font-semibold text-xs text-text-primary text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAmbulances.map((amb) => (
                <TableRow
                  key={amb.id}
                  className="hover:bg-primary-light/40 transition-colors"
                >
                  <TableCell className="font-mono text-xs font-semibold text-text-primary">
                    {amb.registrationNumber}
                  </TableCell>
                  <TableCell className="text-xs capitalize text-text-secondary">
                    {amb.type.replace(/_/g, " ").toLowerCase()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={amb.status} />
                  </TableCell>
                  <TableCell className="text-xs text-text-secondary">
                    {amb.capabilities.join(", ")}
                  </TableCell>
                  <TableCell className="text-xs text-text-muted">
                    {formatDate(amb.nextServiceDue, "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast.info(`Unit ${amb.registrationNumber} selected`)
                      }
                      className="min-h-[44px] sm:min-h-[32px] px-2.5 text-xs border-border hover:bg-primary-light hover:text-primary cursor-pointer"
                    >
                      Inspect
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTable>
      </section>

      {/* 9. DispatchCard Component */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" aria-hidden="true" />
            9. DispatchCard (Driver Assignment with 2-Min Countdown)
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Renders emergency details, caller contact, embedded countdown timer,
            and accept/reject triggers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DispatchCard
            dispatch={seedDispatches[1]}
            emergency={seedEmergencies[1]}
            ambulance={seedAmbulances[1]}
          />
          <DispatchCard
            dispatch={seedDispatches[0]}
            emergency={seedEmergencies[0]}
            ambulance={seedAmbulances[0]}
          />
        </div>
      </section>

      {/* 10. RecommendationList Component */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            10. RecommendationList (PRD §Feature Set 4 Haversine Scoring)
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Weights: Distance (50%), Capability match (30%), Type match (20%).
            Flags service overdue.
          </p>
        </div>

        <RecommendationList candidates={scoredCandidates} />
      </section>

      {/* 11. CountdownTimer Component */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
          11. Standalone CountdownTimer Component
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary">Normal (120s):</span>
            <CountdownTimer initialSeconds={120} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary">
              Warning (&le; 30s):
            </span>
            <CountdownTimer initialSeconds={25} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary">Expired (0s):</span>
            <CountdownTimer initialSeconds={0} />
          </div>
        </div>
      </section>

      {/* 12. LoadingSkeleton Shimmer Placeholders */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary" aria-hidden="true" />
              12. LoadingSkeleton Component
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Shimmer animation placeholders for all card and table types.
            </p>
          </div>

          {/* Variant selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(["stat", "table", "dispatch", "list", "card"] as const).map(
              (v) => (
                <Button
                  key={v}
                  variant={skeletonVariant === v ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSkeletonVariant(v)}
                  className={cn(
                    "min-h-[44px] sm:min-h-[32px] text-xs capitalize cursor-pointer",
                    skeletonVariant === v
                      ? "bg-primary text-primary-foreground"
                      : "border-border text-text-secondary hover:text-text-primary",
                  )}
                >
                  {v}
                </Button>
              ),
            )}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 shadow-xs">
          <LoadingSkeleton variant={skeletonVariant} count={3} />
        </div>
      </section>

      {/* 13. EmptyState Component */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" aria-hidden="true" />
          13. EmptyState Component
        </h2>
        <EmptyState
          icon={AlertCircle}
          title="No Pending Incident Escalations"
          description="All incoming emergency calls have been assigned to active triage and fleet dispatchers."
          action={
            <Button
              onClick={() => toast.success("Refreshed queue")}
              className="min-h-[44px] bg-primary hover:bg-primary-dark text-primary-foreground font-medium cursor-pointer"
            >
              Check Again
            </Button>
          }
        />
      </section>

      {/* 14. ErrorBoundary Demonstration */}
      <section className="bg-surface border border-border rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <AlertTriangle
                className="h-4 w-4 text-destructive"
                aria-hidden="true"
              />
              14. ErrorBoundary (React Class Component with Retry)
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Simulate component failure and verify graceful catch and recovery.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShouldCrash((prev) => !prev)}
            className="min-h-[44px] border-destructive/40 text-destructive hover:bg-destructive-bg cursor-pointer"
          >
            {shouldCrash ? "Reset Trigger" : "Simulate Crash"}
          </Button>
        </div>

        <ErrorBoundary onReset={() => setShouldCrash(false)}>
          <BuggyComponent shouldCrash={shouldCrash} />
        </ErrorBoundary>
      </section>

      {/* Phase 1 Verification Checklist Banner */}
      <div className="p-6 bg-primary-light border border-primary/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-primary text-base">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            Phase 1 Checklist Complete
          </div>
          <p className="text-xs text-text-secondary">
            Next.js App Router scaffolded, Inter font imported, shadcn UI
            components configured, color tokens mapped, types matching PRD
            §3.3/§3.5, dummy data populated, and all shared components
            operational.
          </p>
        </div>
        <Link
          href="/dashboard/dispatcher"
          className="shrink-0 w-full sm:w-auto"
        >
          <Button className="w-full sm:w-auto min-h-[44px] bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-6 shadow-sm cursor-pointer">
            Open Dispatcher Console
          </Button>
        </Link>
      </div>
    </div>
  );
}
