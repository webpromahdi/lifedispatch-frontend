"use client";

import {
  Calendar,
  Clock,
  Hospital,
  Power,
  Stethoscope,
  UserCheck,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetHospitalStaff,
  useGetMyHospitalStaffProfile,
  useToggleHospitalStaffShift,
} from "@/hooks";
import { cn } from "@/lib/utils";

interface ShiftScheduleItem {
  day: string;
  shift: string;
  department: string;
  status: "COMPLETED" | "CURRENT" | "SCHEDULED";
}

const WEEKLY_TEMPLATE: { day: string; shift: string; department: string }[] = [
  {
    day: "Monday",
    shift: "08:00 AM — 08:00 PM (Day)",
    department: "Trauma Resuscitation Bay 1",
  },
  {
    day: "Tuesday",
    shift: "08:00 AM — 08:00 PM (Day)",
    department: "Acute Surgical Resuscitation",
  },
  {
    day: "Wednesday",
    shift: "Off Duty (Rest)",
    department: "Clinical Standby",
  },
  {
    day: "Thursday",
    shift: "08:00 AM — 08:00 PM (Day)",
    department: "Trauma Resuscitation Bay 2",
  },
  {
    day: "Friday",
    shift: "08:00 AM — 08:00 PM (Day)",
    department: "Emergency Triage Desk",
  },
  {
    day: "Saturday",
    shift: "20:00 PM — 08:00 AM (Night)",
    department: "ICU Ventilator Coverage",
  },
  {
    day: "Sunday",
    shift: "Off Duty (Rest)",
    department: "Clinical Standby",
  },
];

const SKELETON_STATS = ["sk-stat-1", "sk-stat-2", "sk-stat-3", "sk-stat-4"];

export function HospitalStaffShiftView() {
  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());

  // 1-second interval for real-time shift elapsed counter
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Fetch authenticated staff profile
  const { data: profileResponse, isLoading: isProfileLoading } =
    useGetMyHospitalStaffProfile();

  const currentStaff = profileResponse?.data;
  const hospital = currentStaff?.hospital;
  const hospitalId = hospital?.id;
  const isOnShift = currentStaff?.isOnShift ?? false;

  // 2. Fetch fellow colleagues on shift
  const { data: onShiftStaffResponse, isLoading: isOnShiftStaffLoading } =
    useGetHospitalStaff(
      hospitalId,
      { isOnShift: true },
      { enabled: Boolean(hospitalId) },
    );

  const onShiftStaff = onShiftStaffResponse?.data ?? [];

  // Toggle shift mutation
  const toggleShiftMutation = useToggleHospitalStaffShift();

  // Shift duration counter
  const shiftDurationFormatted = useMemo(() => {
    if (!isOnShift || !currentStaff?.shiftStart) return "00h 00m 00s";
    const startMs = new Date(currentStaff.shiftStart).getTime();
    const elapsedSecs = Math.max(0, Math.floor((currentTime - startMs) / 1000));
    const hours = Math.floor(elapsedSecs / 3600);
    const mins = Math.floor((elapsedSecs % 3600) / 60);
    const secs = elapsedSecs % 60;
    return `${hours.toString().padStart(2, "0")}h ${mins.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
  }, [isOnShift, currentStaff?.shiftStart, currentTime]);

  // Handle Shift Toggle
  const handleToggleShift = async () => {
    const nextAction = isOnShift ? "end" : "start";
    try {
      await toggleShiftMutation.mutateAsync({ action: nextAction });
      if (nextAction === "start") {
        toast.success("Shift Duty Started", {
          description: `Logged into ${hospital?.name || "Emergency Department"}. Status: ON DUTY.`,
        });
      } else {
        toast.info("Shift Duty Ended", {
          description:
            "Clinical handover registered. Duty status updated to OFF DUTY.",
        });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to toggle duty shift";
      toast.error("Shift Toggle Failed", { description: msg });
    }
  };

  // Build dynamic weekly schedule relative to current day
  const weeklySchedule: ShiftScheduleItem[] = useMemo(() => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const todayIndex = new Date(currentTime).getDay();
    const todayName = days[todayIndex];

    return WEEKLY_TEMPLATE.map((item) => {
      let status: "COMPLETED" | "CURRENT" | "SCHEDULED" = "SCHEDULED";
      const itemIndex = days.indexOf(item.day);

      if (item.day === todayName) {
        status = "CURRENT";
      } else if (itemIndex < todayIndex) {
        status = "COMPLETED";
      } else {
        status = "SCHEDULED";
      }

      return {
        ...item,
        status,
      };
    });
  }, [currentTime]);

  // Loading skeleton
  if (isProfileLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full rounded-none" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SKELETON_STATS.map((key) => (
            <Skeleton key={key} className="h-28 rounded-none" />
          ))}
        </div>
        <Skeleton className="h-32 w-full rounded-none" />
        <Skeleton className="h-64 w-full rounded-none" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clinical Duty Shift Console"
        description="Emergency medicine physician duty controls, trauma bay assignments, and weekly clinical shift schedules."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/hospital-staff" },
          { label: "Shift Schedule" },
        ]}
        action={
          <div className="flex items-center gap-3 bg-surface p-1.5 px-3 rounded-none border border-border shadow-2xs">
            <div className="text-right">
              <div className="text-xs font-semibold text-text-primary">
                ER Duty Status
              </div>
              <div className="text-[11px] text-text-muted font-mono">
                {isOnShift ? "Shift Active" : "Logged Off Duty"}
              </div>
            </div>

            <Button
              size="sm"
              onClick={handleToggleShift}
              disabled={toggleShiftMutation.isPending}
              aria-label={`Toggle ER clinical shift duty. Currently ${isOnShift ? "On Duty" : "Off Duty"}`}
              className={cn(
                "min-h-9 font-semibold text-xs gap-1.5 cursor-pointer transition-colors rounded-none px-3",
                isOnShift
                  ? "bg-status hover:bg-status/90 text-white"
                  : "bg-muted text-text-secondary hover:bg-muted/80 border border-border",
              )}
            >
              <Power className="h-3.5 w-3.5" aria-hidden="true" />
              {toggleShiftMutation.isPending
                ? "Updating..."
                : isOnShift
                  ? "On Duty"
                  : "Go On Duty"}
            </Button>
          </div>
        }
      />

      {/* Telematics StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Current Duty Shift"
          value={isOnShift ? "Active Session" : "Off Duty"}
          icon={Clock}
          subtitle={
            isOnShift && currentStaff?.shiftStart
              ? `Started ${new Date(currentStaff.shiftStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : "Standby for ER roster call"
          }
        />
        <StatCard
          label="Duty Station Facility"
          value={hospital?.name || "LifeDispatch General"}
          icon={Hospital}
          subtitle={hospital?.address || "Emergency Department"}
        />
        <StatCard
          label="Elapsed Session Time"
          value={isOnShift ? shiftDurationFormatted : "—"}
          icon={Calendar}
          subtitle={
            isOnShift ? "Live duty telematics" : "Clock in to start timer"
          }
        />
        <StatCard
          label="Colleagues on Shift"
          value={`${onShiftStaff.length} On Duty`}
          icon={Users}
          subtitle={`${hospital?.name?.slice(0, 20) || "ER"} clinical team`}
        />
      </div>

      {/* Duty Status Highlight Banner */}
      <div
        className={cn(
          "p-5 rounded-none border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
          isOnShift
            ? "bg-status-bg border-status/30 shadow-xs"
            : "bg-muted/40 border-border",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-none flex items-center justify-center shrink-0 font-bold",
              isOnShift
                ? "bg-status text-white shadow-xs"
                : "bg-muted text-text-muted",
            )}
          >
            <Stethoscope className="h-5 w-5" aria-hidden="true" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              {isOnShift
                ? "You Are Currently Active on ER Clinical Duty"
                : "You Are Currently Off Duty (Clinical Standby)"}
              {isOnShift && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              {isOnShift
                ? `Logged in as ${currentStaff?.user?.name || "Clinician"} (${currentStaff?.designation || "Staff"}). Inbound trauma and diversion notices active.`
                : "Emergency ambulance notifications routed to active on-duty relief attending team."}
            </p>
          </div>
        </div>

        <Button
          onClick={handleToggleShift}
          disabled={toggleShiftMutation.isPending}
          variant="outline"
          aria-label={isOnShift ? "End current shift" : "Start current shift"}
          className="min-h-10 text-xs font-semibold bg-surface border-border hover:bg-background cursor-pointer rounded-none"
        >
          {toggleShiftMutation.isPending
            ? "Transmitting..."
            : isOnShift
              ? "Clock Out of Shift"
              : "Clock In to Shift"}
        </Button>
      </div>

      {/* On-Duty Clinical Colleagues Widget */}
      <div className="bg-surface border border-border rounded-none p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-sm text-text-primary">
              Active Colleagues at {hospital?.name || "This Facility"} (
              {onShiftStaff.length})
            </h3>
          </div>

          <Badge variant="outline" className="text-xs font-mono">
            Live Station Roster
          </Badge>
        </div>

        {isOnShiftStaffLoading ? (
          <div className="py-6 text-center text-xs text-text-muted">
            Loading active clinicians...
          </div>
        ) : onShiftStaff.length === 0 ? (
          <div className="py-6 text-center text-xs text-text-muted space-y-1">
            <p className="font-medium">
              No colleagues currently active on duty.
            </p>
            <p className="text-[11px] text-slate-400">
              Staff members will show up here once they clock in.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {onShiftStaff.map((colleague) => (
              <div
                key={colleague.id}
                className="p-3 bg-white border border-slate-200 rounded-none flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-text-primary block">
                    {colleague.user?.name || "Staff Clinician"}
                  </span>
                  <span className="text-[11px] text-text-secondary block">
                    {colleague.designation || "General Emergency"}
                  </span>
                  <span className="text-[10px] text-text-muted font-mono block">
                    ID: {colleague.employeeId || "—"}
                  </span>
                </div>
                <StatusBadge status="ON_SHIFT" variant="square" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Schedule Overview */}
      <div className="bg-surface border border-border rounded-none p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="font-bold text-base text-text-primary">
              Approved Weekly ER Shift Rotation
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Standard clinical rotation schedule for {hospital?.name || "ER"}.
            </p>
          </div>

          <Badge variant="outline" className="text-xs font-mono">
            Zone Emergency Care
          </Badge>
        </div>

        <div className="space-y-3">
          {weeklySchedule.map((item) => (
            <div
              key={item.day}
              className={cn(
                "p-3.5 rounded-none border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs",
                item.status === "CURRENT"
                  ? "bg-primary-light/40 border-primary shadow-xs ring-1 ring-primary/20"
                  : "bg-background border-border",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-none bg-surface border border-border flex items-center justify-center font-bold text-xs text-text-primary shrink-0">
                  {item.day.slice(0, 3)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">
                      {item.day}
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
                <span className="font-mono text-text-primary">
                  {item.shift}
                </span>
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
