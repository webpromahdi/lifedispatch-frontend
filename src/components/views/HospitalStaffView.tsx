"use client";

import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  Bed,
  Building2,
  CheckCircle2,
  Clock,
  HeartPulse,
  Hospital,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { seedHospitals } from "@/lib/dummy/hospitals";
import { HospitalDiversionStatus } from "@/lib/types/enums";
import { cn } from "@/lib/utils";

interface BedUnit {
  name: string;
  total: number;
  available: number;
  specialty: string;
}

const BED_UNITS: BedUnit[] = [
  {
    name: "Trauma Resuscitation Bays",
    total: 4,
    available: 2,
    specialty: "Critical Resuscitation & Crash Carts",
  },
  {
    name: "ICU Ventilator Beds",
    total: 8,
    available: 1,
    specialty: "Invasive Mechanical Ventilation",
  },
  {
    name: "General Emergency Ward Beds",
    total: 45,
    available: 6,
    specialty: "Rapid Observation & Triage Monitoring",
  },
  {
    name: "Pediatric Emergency Beds",
    total: 10,
    available: 3,
    specialty: "Pediatric Trauma Care",
  },
];

export function HospitalStaffView() {
  const currentHospital = seedHospitals[0]; // Dhaka Medical College Hospital
  const [diversionStatus, setDiversionStatus] =
    useState<HospitalDiversionStatus>(currentHospital.diversionStatus);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [pendingStatus, setPendingStatus] =
    useState<HospitalDiversionStatus>(diversionStatus);

  const handleOpenDialog = () => {
    setPendingStatus(diversionStatus);
    setDialogOpen(true);
  };

  const handleSaveStatus = () => {
    setDiversionStatus(pendingStatus);
    setDialogOpen(false);

    if (pendingStatus === "ACCEPTING") {
      toast.success("Hospital Status: ACCEPTING", {
        description: `${currentHospital.name} ER is open and receiving ambulance intake.`,
      });
    } else if (pendingStatus === "DIVERTING") {
      toast.warning("Hospital Status: DIVERTING", {
        description: `ER diversion broadcast to dispatch command. Non-critical units re-routed.`,
      });
    } else {
      toast.error("Hospital Status: CLOSED", {
        description: `Emergency Department marked CLOSED. All ambulances diverted.`,
      });
    }
  };

  const isAccepting = diversionStatus === "ACCEPTING";
  const isDiverting = diversionStatus === "DIVERTING";
  const isClosed = diversionStatus === "CLOSED";

  const totalAvailableBeds = BED_UNITS.reduce(
    (sum, unit) => sum + unit.available,
    0,
  );
  const totalBeds = BED_UNITS.reduce((sum, unit) => sum + unit.total, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hospital ER Capacity & Diversion Board"
        description="Live emergency intake broadcast, trauma bay telemetry, clinical bed utilization, and regional diversion controls."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/hospital-staff" },
          { label: "ER Capacity" },
        ]}
        action={
          <Button
            onClick={handleOpenDialog}
            aria-label="Update hospital diversion status"
            className="min-h-[44px] bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-5 cursor-pointer shadow-xs"
          >
            <Activity className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Update Diversion Status
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total ER Beds"
          value={totalBeds}
          icon={Bed}
          subtitle="Trauma & Resuscitation"
        />
        <StatCard
          label="Available Intake Beds"
          value={totalAvailableBeds}
          icon={Building2}
          trend={{
            value: `${Math.round((totalAvailableBeds / totalBeds) * 100)}% available`,
            isPositive: totalAvailableBeds > 8,
          }}
          subtitle="Immediate capacity"
        />
        <StatCard
          label="Diversion Status"
          value={diversionStatus}
          icon={AlertTriangle}
          trend={{
            value: isAccepting ? "Receiving Units" : "Diverting Inbound",
            isPositive: isAccepting,
          }}
          subtitle="Central telemetry broadcast"
        />
        <StatCard
          label="Clinical Staff Active"
          value="18 On Duty"
          icon={Users}
          trend={{ value: "Shift A (Day)", isPositive: true }}
          subtitle="12 nurses, 6 trauma doctors"
        />
      </div>

      {/* Large Hospital Status Card */}
      <div
        className={cn(
          "p-6 sm:p-8 rounded-2xl border transition-all shadow-xs space-y-4",
          isAccepting
            ? "bg-status-bg/40 border-status/40"
            : isDiverting
              ? "bg-warning-bg/40 border-warning/40"
              : "bg-destructive-bg/40 border-destructive/40",
        )}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-3 w-3 rounded-full animate-pulse",
                  isAccepting
                    ? "bg-status"
                    : isDiverting
                      ? "bg-amber-500"
                      : "bg-destructive",
                )}
              />
              <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
                Hospital Telemetry Broadcast
              </span>
              <StatusBadge status={diversionStatus} />
            </div>

            <h2 className="text-xl font-bold text-text-primary">
              {currentHospital.name} — ER Status: {diversionStatus}
            </h2>

            <p className="text-xs text-text-secondary max-w-2xl">
              {isAccepting &&
                "Trauma resuscitation bays are operational and accepting priority ambulance transfers. Coordinates active in central dispatch recommendation engine."}
              {isDiverting &&
                "ER capacity is currently saturated. Dispatch engine is automatically recommending secondary partner hospitals for non-critical incidents."}
              {isClosed &&
                "Emergency Department is closed to inbound medical ambulance traffic. All pending emergencies are redirected."}
            </p>
          </div>

          <Button
            onClick={handleOpenDialog}
            variant="outline"
            className="min-h-[44px] bg-surface text-text-primary border-border hover:bg-background font-semibold cursor-pointer shrink-0"
          >
            Change Diversion Status
          </Button>
        </div>
      </div>

      {/* Bed Capacity Widget */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="font-bold text-base text-text-primary">
              Bed Capacity & Clinical Unit Telemetry
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Live bed census breakdown by emergency specialty department.
            </p>
          </div>

          <Badge variant="outline" className="text-xs font-mono">
            {totalAvailableBeds} of {totalBeds} Beds Free
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BED_UNITS.map((unit) => {
            const occupied = unit.total - unit.available;
            const occupancyPct = Math.round((occupied / unit.total) * 100);

            return (
              <div
                key={unit.name}
                className="p-4 rounded-xl bg-background border border-border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                    <span className="font-semibold text-xs text-text-primary">
                      {unit.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-text-primary">
                    {unit.available} / {unit.total} Free
                  </span>
                </div>

                <p className="text-[11px] text-text-muted">{unit.specialty}</p>

                {/* Visual Progress Bar */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        occupancyPct >= 85
                          ? "bg-destructive"
                          : occupancyPct >= 65
                            ? "bg-amber-500"
                            : "bg-status",
                      )}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-text-muted">
                    <span>{occupancyPct}% Occupied</span>
                    <span>{unit.available} Ready for Intake</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diversion Status Update Dialog (Accessibility: role="radiogroup" with aria-labelledby) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary-light text-primary">
                <Hospital className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <DialogTitle id="diversion-dialog-title">
                  Update Diversion Telemetry
                </DialogTitle>
                <DialogDescription>
                  Broadcast new emergency intake availability to all central dispatchers.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Accessible Radiogroup per specification */}
          <div className="py-3 space-y-3">
            <Label
              id="diversion-group-label"
              className="text-xs font-semibold text-text-primary block"
            >
              Select Hospital Operating Status:
            </Label>

            <div
              role="radiogroup"
              aria-labelledby="diversion-group-label"
              className="space-y-2.5"
            >
              {[
                {
                  value: HospitalDiversionStatus.ACCEPTING,
                  title: "ACCEPTING (Normal Intake)",
                  description:
                    "Emergency Department open. Trauma resuscitation bays ready for inbound ambulances.",
                  color: "border-status/40 bg-status-bg/30 text-status-text",
                },
                {
                  value: HospitalDiversionStatus.DIVERTING,
                  title: "DIVERTING (Congested)",
                  description:
                    "ER capacity saturated. Ambulances will be re-routed to adjacent regional facilities.",
                  color: "border-warning/40 bg-warning-bg/30 text-warning-foreground",
                },
                {
                  value: HospitalDiversionStatus.CLOSED,
                  title: "CLOSED (Emergency Closure)",
                  description:
                    "Department closed to all new incoming ambulance arrivals due to facility decontamination or crisis.",
                  color: "border-destructive/40 bg-destructive-bg/30 text-destructive",
                },
              ].map((option) => (
                <div
                  key={option.value}
                  role="radio"
                  aria-checked={pendingStatus === option.value}
                  tabIndex={0}
                  onClick={() => setPendingStatus(option.value)}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      setPendingStatus(option.value);
                    }
                  }}
                  className={cn(
                    "p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    pendingStatus === option.value
                      ? cn("ring-2 ring-primary/30", option.color)
                      : "border-border hover:border-border-strong bg-background",
                  )}
                >
                  <div className="mt-0.5">
                    <div
                      className={cn(
                        "h-4 w-4 rounded-full border flex items-center justify-center",
                        pendingStatus === option.value
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-surface",
                      )}
                    >
                      {pendingStatus === option.value && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-xs text-text-primary block">
                      {option.title}
                    </span>
                    <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="text-xs min-h-[40px] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveStatus}
              className="bg-primary hover:bg-primary-dark text-white text-xs min-h-[40px] cursor-pointer font-medium"
            >
              Broadcast Status Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
