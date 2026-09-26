"use client";

import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  HeartPulse,
  Hospital,
  Power,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShiftScheduleItem {
  day: string;
  date: string;
  shift: string;
  department: string;
  status: "COMPLETED" | "CURRENT" | "SCHEDULED";
}

const SCHEDULE: ShiftScheduleItem[] = [
  {
    day: "Monday",
    date: "Mar 23, 2026",
    shift: "08:00 AM — 08:00 PM (Day)",
    department: "Trauma Resuscitation Bay 1",
    status: "COMPLETED",
  },
  {
    day: "Tuesday",
    date: "Mar 24, 2026",
    shift: "08:00 AM — 08:00 PM (Day)",
    department: "Acute Surgical Resuscitation",
    status: "COMPLETED",
  },
  {
    day: "Wednesday",
    date: "Mar 25, 2026",
    shift: "Off Duty (Rest)",
    department: "—",
    status: "COMPLETED",
  },
  {
    day: "Thursday",
    date: "Mar 26, 2026",
    shift: "08:00 AM — 08:00 PM (Day)",
    department: "Trauma Resuscitation Bay 2",
    status: "CURRENT",
  },
  {
    day: "Friday",
    date: "Mar 27, 2026",
    shift: "08:00 AM — 08:00 PM (Day)",
    department: "Emergency Triage Desk",
    status: "SCHEDULED",
  },
  {
    day: "Saturday",
    date: "Mar 28, 2026",
    shift: "20:00 PM — 08:00 AM (Night)",
    department: "ICU Ventilator Coverage",
    status: "SCHEDULED",
  },
];

export function HospitalStaffShiftView() {
  const [isOnShift, setIsOnShift] = useState<boolean>(true);

  const handleToggleShift = () => {
    const nextState = !isOnShift;
    setIsOnShift(nextState);

    if (nextState) {
      toast.success("Shift Logged: ON DUTY", {
        description:
          "Logged into Dhaka Medical College Hospital ER Trauma Station.",
      });
    } else {
      toast.info("Shift Concluded: OFF DUTY", {
        description:
          "Handover telematics submitted. Shift transferred to relief team.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clinical Duty Shift & ER Handover"
        description="Emergency medicine physician duty controls, trauma bay assignments, and weekly clinical shift schedules."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/hospital-staff" },
          { label: "Shift Schedule" },
        ]}
        action={
          <div className="flex items-center gap-3 bg-surface p-1.5 px-3 rounded-xl border border-border shadow-2xs">
            <div className="text-right">
              <div className="text-xs font-semibold text-text-primary">
                ER Duty Status
              </div>
              <div className="text-[11px] text-text-muted">
                {isOnShift ? "Shift A (Day) Active" : "Logged Off"}
              </div>
            </div>

            <Button
              size="sm"
              onClick={handleToggleShift}
              aria-label={`Toggle ER clinical shift duty. Currently ${isOnShift ? "On Duty" : "Off Duty"}`}
              className={cn(
                "min-h-[38px] font-semibold text-xs gap-1.5 cursor-pointer transition-colors",
                isOnShift
                  ? "bg-status hover:bg-status/90 text-white"
                  : "bg-muted text-text-secondary hover:bg-muted/80 border border-border",
              )}
            >
              <Power className="h-3.5 w-3.5" aria-hidden="true" />
              {isOnShift ? "On Duty" : "Go On Duty"}
            </Button>
          </div>
        }
      />

      {/* Telematics StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Current Shift Schedule"
          value="Shift A (Day)"
          icon={Clock}
          subtitle="08:00 AM — 08:00 PM"
        />
        <StatCard
          label="Clinical Duty Station"
          value="Trauma Bay 2"
          icon={Hospital}
          subtitle="Dhaka Medical College ER"
        />
        <StatCard
          label="Relief Attending Clinician"
          value="Dr. Naila Zaman"
          icon={UserCheck}
          subtitle="Handover at 20:00 PM"
        />
        <StatCard
          label="Weekly Shift Hours"
          value="36.0 Hrs"
          icon={Calendar}
          trend={{ value: "On Target", isPositive: true }}
          subtitle="Target: 40.0 Hrs"
        />
      </div>

      {/* Duty Status Highlight Banner */}
      <div
        className={cn(
          "p-5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
          isOnShift
            ? "bg-status-bg border-status/30"
            : "bg-muted/40 border-border",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
              isOnShift
                ? "bg-status text-white shadow-xs"
                : "bg-muted text-text-muted",
            )}
          >
            <Stethoscope className="h-5 w-5" aria-hidden="true" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-text-primary">
              {isOnShift
                ? "You Are Currently Active on ER Trauma Duty"
                : "You Are Currently Off Duty (Standby)"}
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              {isOnShift
                ? "Receiving direct dispatch updates for inbound ALS ambulances in Zone 1 & 2."
                : "Emergency notifications routed to relief attending physician."}
            </p>
          </div>
        </div>

        <Button
          onClick={handleToggleShift}
          variant="outline"
          aria-label={isOnShift ? "End current shift" : "Start current shift"}
          className="min-h-[40px] text-xs font-semibold bg-surface border-border hover:bg-background cursor-pointer"
        >
          {isOnShift ? "Clock Out of Shift" : "Clock In to Shift"}
        </Button>
      </div>

      {/* Weekly Schedule Overview */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="font-bold text-base text-text-primary">
              Weekly ER Shift Schedule
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Approved clinical duty rotation for Week 13, 2026.
            </p>
          </div>

          <Badge variant="outline" className="text-xs font-mono">
            DMCH Emergency Department
          </Badge>
        </div>

        <div className="space-y-3">
          {SCHEDULE.map((item) => (
            <div
              key={item.day}
              className={cn(
                "p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all",
                item.status === "CURRENT"
                  ? "bg-primary-light/40 border-primary shadow-xs ring-1 ring-primary/20"
                  : "bg-background border-border",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-surface border border-border flex items-center justify-center font-bold text-xs text-text-primary shrink-0">
                  {item.day.slice(0, 3)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">
                      {item.day}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      ({item.date})
                    </span>
                    {item.status === "CURRENT" && (
                      <Badge className="bg-primary text-white text-[10px] h-4">
                        Today
                      </Badge>
                    )}
                  </div>
                  <span className="text-[11px] text-text-secondary">
                    {item.department}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                <span className="font-mono text-text-primary">{item.shift}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-semibold",
                    item.status === "COMPLETED"
                      ? "bg-status-bg text-status-text border-status/30"
                      : item.status === "CURRENT"
                        ? "bg-primary text-white border-primary"
                        : "bg-muted text-text-muted border-border",
                  )}
                >
                  {item.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
