"use client";

import {
  AlertCircle,
  AlertTriangle,
  Ambulance,
  Bed,
  CheckCircle2,
  Clock,
  HeartPulse,
  Hospital as HospitalIcon,
  Minus,
  Phone,
  Plus,
  Power,
  RefreshCw,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  CornerNotch,
  LabelTab,
} from "@/components/shared/DashboardUIPrimitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetHospitalInboundTrips,
  useGetHospitalStaff,
  useGetMyHospitalStaffProfile,
  useToggleHospitalStaffShift,
  useUpdateHospital,
  useUpdateHospitalDiversion,
} from "@/hooks";
import { HospitalDiversionStatus } from "@/lib/types/enums";
import { cn } from "@/lib/utils";

export function HospitalStaffView() {
  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());

  // 1-second interval for live shift timer and transit calculation
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Fetch current staff member profile and linked hospital
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useGetMyHospitalStaffProfile();

  const staffProfile = profileData?.data;
  const hospital = staffProfile?.hospital;
  const hospitalId = hospital?.id;
  const isOnShift = staffProfile?.isOnShift ?? false;

  // 2. Fetch inbound ambulances to this hospital (polled every 5 seconds)
  const {
    data: inboundData,
    isLoading: isInboundLoading,
    refetch: refetchInbound,
  } = useGetHospitalInboundTrips(hospitalId, {
    enabled: Boolean(hospitalId),
    refetchInterval: 5000,
  });

  const inboundTrips = inboundData?.data ?? [];

  // 3. Fetch active clinicians on duty
  const { data: onShiftStaffData, isLoading: isOnShiftLoading } =
    useGetHospitalStaff(
      hospitalId,
      { isOnShift: true },
      { enabled: Boolean(hospitalId) },
    );

  const onShiftStaff = onShiftStaffData?.data ?? [];

  // Mutations
  const updateDiversionMutation = useUpdateHospitalDiversion();
  const updateCapacityMutation = useUpdateHospital();
  const toggleShiftMutation = useToggleHospitalStaffShift();

  // Local form state
  const [diversionStatus, setDiversionStatus] =
    useState<HospitalDiversionStatus>(HospitalDiversionStatus.ACCEPTING);
  const [diversionReason, setDiversionReason] = useState<string>("");
  const [availableBeds, setAvailableBeds] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    if (hospital && !isInitialized) {
      setDiversionStatus(
        hospital.diversionStatus || HospitalDiversionStatus.ACCEPTING,
      );
      setDiversionReason(hospital.diversionReason || "");
      setAvailableBeds(hospital.availableErBeds ?? 0);
      setIsInitialized(true);
    }
  }, [hospital, isInitialized]);

  // Handle Diversion Status Change
  const handleUpdateDiversion = async () => {
    if (!hospitalId) return;

    if (
      (diversionStatus === HospitalDiversionStatus.DIVERTING ||
        diversionStatus === HospitalDiversionStatus.CLOSED) &&
      !diversionReason.trim()
    ) {
      setUpdateError(
        "A clear clinical or operational reason is required when placing ER on diversion or closed status.",
      );
      return;
    }

    setUpdateError(null);

    try {
      await updateDiversionMutation.mutateAsync({
        id: hospitalId,
        payload: {
          diversionStatus,
          diversionReason:
            diversionStatus === HospitalDiversionStatus.ACCEPTING
              ? undefined
              : diversionReason.trim(),
          availableErBeds: Number(availableBeds) || 0,
        },
      });
      toast.success("Hospital Diversion Status Updated", {
        description: `ER admissions status changed to ${diversionStatus}.`,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update hospital status";
      setUpdateError(msg);
      toast.error("Status Update Failed", { description: msg });
    }
  };

  // Handle Quick Bed Adjustment
  const handleAdjustBeds = async (delta: number) => {
    if (!hospital || !hospitalId) return;
    const newCount = Math.max(
      0,
      Math.min(hospital.totalErBeds, availableBeds + delta),
    );
    setAvailableBeds(newCount);

    try {
      await updateCapacityMutation.mutateAsync({
        id: hospitalId,
        payload: {
          availableErBeds: newCount,
        },
      });
      toast.success("ER Bed Count Updated", {
        description: `${newCount} of ${hospital.totalErBeds} beds currently available.`,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update bed capacity";
      toast.error("Failed to Update Beds", { description: msg });
    }
  };

  // Handle Direct Bed Input Save
  const handleSaveBedInput = async () => {
    if (!hospital || !hospitalId) return;
    try {
      await updateCapacityMutation.mutateAsync({
        id: hospitalId,
        payload: {
          availableErBeds: Number(availableBeds) || 0,
        },
      });
      toast.success("ER Bed Count Updated", {
        description: `${availableBeds} of ${hospital.totalErBeds} beds available.`,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update bed capacity";
      toast.error("Failed to Update Beds", { description: msg });
    }
  };

  // Handle Duty Shift Toggle
  const handleToggleShift = async () => {
    const nextAction = isOnShift ? "end" : "start";
    try {
      await toggleShiftMutation.mutateAsync({ action: nextAction });
      if (nextAction === "start") {
        toast.success("Duty Shift Activated", {
          description: "Logged onto ER clinical trauma bay. Status: ON DUTY",
        });
      } else {
        toast.info("Duty Shift Concluded", {
          description: "Clinical handover registered. Status set to OFF DUTY.",
        });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update shift duty";
      toast.error("Shift Toggle Error", { description: msg });
    }
  };

  // Calculate live shift timer
  const shiftDurationFormatted = useMemo(() => {
    if (!isOnShift || !staffProfile?.shiftStart) return "00:00:00";
    const startMs = new Date(staffProfile.shiftStart).getTime();
    const elapsedSecs = Math.max(0, Math.floor((currentTime - startMs) / 1000));
    const hours = Math.floor(elapsedSecs / 3600);
    const mins = Math.floor((elapsedSecs % 3600) / 60);
    const secs = elapsedSecs % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, [isOnShift, staffProfile?.shiftStart, currentTime]);

  // Compute Occupancy
  const totalBeds = hospital?.totalErBeds ?? 0;
  const currentAvailableBeds = hospital?.availableErBeds ?? availableBeds;
  const occupiedBeds = Math.max(0, totalBeds - currentAvailableBeds);
  const occupancyPercent =
    totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  // Occupancy color scheme
  const occupancyColor =
    occupancyPercent >= 90
      ? "bg-red-600"
      : occupancyPercent >= 75
        ? "bg-amber-500"
        : "bg-emerald-600";

  // Loading skeleton
  if (isProfileLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="h-64 w-full rounded-none" />
            <Skeleton className="h-44 w-full rounded-none" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-64 w-full rounded-none" />
          </div>
        </div>
        <Skeleton className="h-72 w-full rounded-none" />
      </div>
    );
  }

  // Error boundary
  if (profileError || !staffProfile || !hospital) {
    return (
      <div className="p-8 bg-red-50 border-2 border-red-300 rounded-none shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-red-800 font-bold text-base">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>Hospital Staff Record Not Found</span>
        </div>
        <p className="text-sm text-red-700">
          No active hospital department is assigned to your authenticated staff
          account. Please contact the system administrator to assign your
          clinical department.
        </p>
        <Button
          onClick={() => refetchProfile()}
          variant="outline"
          className="text-xs bg-white border-red-300 hover:bg-red-50 text-red-900 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col">
      {/* ── ROW 1: DESKTOP TWO COLUMNS (Left Wide: Hospital Status, Right Narrow: My Shift) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: HOSPITAL STATUS (Diversion Controls & ER Beds) */}
        <div className="lg:col-span-8 w-full space-y-6">
          <section
            aria-label="Hospital Status"
            className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5 sm:p-6"
          >
            <CornerNotch />
            <LabelTab label="HOSPITAL CAPACITY & DIVERSION" />

            <div className="mt-4 space-y-5">
              {/* Header: Hospital Name, Badges & Capabilities */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary-light text-primary border border-primary/20 shrink-0">
                    <HospitalIcon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-text-primary tracking-tight">
                      {hospital.name}
                    </h2>
                    <span className="text-xs text-text-secondary block">
                      {hospital.address}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className="font-mono text-[11px] gap-1 bg-surface border-border text-text-secondary"
                  >
                    <Phone className="h-3 w-3" />
                    {hospital.emergencyContact || hospital.phone}
                  </Badge>
                  {hospital.capabilities?.slice(0, 3).map((cap) => (
                    <Badge
                      key={cap}
                      className="bg-primary/10 text-primary border-primary/20 text-[10px] font-semibold"
                    >
                      {cap}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* ER Bed Utilization Progress & Quick Steppers */}
              <div className="p-4 bg-surface border border-border space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-text-primary">
                  <span className="flex items-center gap-1.5">
                    <Bed className="h-4 w-4 text-primary" />
                    ER Bed Utilization: {occupiedBeds} / {totalBeds} Occupied
                  </span>
                  <span
                    className={cn(
                      "font-mono px-2 py-0.5 text-xs font-black",
                      occupancyPercent >= 90
                        ? "text-red-700 bg-red-100"
                        : occupancyPercent >= 75
                          ? "text-amber-800 bg-amber-100"
                          : "text-emerald-800 bg-emerald-100",
                    )}
                  >
                    {occupancyPercent}% Occupancy
                  </span>
                </div>

                {/* Visual Bar */}
                <div className="w-full bg-slate-200 h-3 overflow-hidden rounded-none border border-slate-300">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      occupancyColor,
                    )}
                    style={{
                      width: `${Math.min(100, Math.max(0, occupancyPercent))}%`,
                    }}
                  />
                </div>

                {/* Bed Adjustment Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-text-secondary">
                    Available ER Beds:{" "}
                    <strong className="text-text-primary font-mono text-sm">
                      {currentAvailableBeds}
                    </strong>{" "}
                    (of {totalBeds} total beds)
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAdjustBeds(-1)}
                      disabled={
                        availableBeds <= 0 || updateCapacityMutation.isPending
                      }
                      aria-label="Decrease available bed count by 1"
                      className="h-8 w-8 p-0 rounded-none border-border hover:bg-slate-100 cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>

                    <Input
                      type="number"
                      min={0}
                      max={totalBeds}
                      value={availableBeds}
                      onChange={(e) =>
                        setAvailableBeds(
                          Math.max(
                            0,
                            Math.min(totalBeds, Number(e.target.value)),
                          ),
                        )
                      }
                      aria-label="Direct available bed count input"
                      className="h-8 w-16 text-center text-xs font-mono font-bold rounded-none border-border"
                    />

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAdjustBeds(1)}
                      disabled={
                        availableBeds >= totalBeds ||
                        updateCapacityMutation.isPending
                      }
                      aria-label="Increase available bed count by 1"
                      className="h-8 w-8 p-0 rounded-none border-border hover:bg-slate-100 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      size="sm"
                      onClick={handleSaveBedInput}
                      disabled={
                        availableBeds === hospital.availableErBeds ||
                        updateCapacityMutation.isPending
                      }
                      className="h-8 text-xs font-bold rounded-none bg-primary hover:bg-primary-dark text-white cursor-pointer px-3"
                    >
                      {updateCapacityMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Diversion Status 3 Square Selector Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-primary block">
                  ER Diversion Protocol Status
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Accepting (Green) */}
                  <button
                    type="button"
                    onClick={() =>
                      setDiversionStatus(HospitalDiversionStatus.ACCEPTING)
                    }
                    className={cn(
                      "min-h-12 px-4 text-xs sm:text-sm font-bold rounded-none cursor-pointer flex items-center justify-center gap-2 transition-all",
                      diversionStatus === HospitalDiversionStatus.ACCEPTING
                        ? "bg-emerald-100 text-emerald-900 border-2 border-emerald-600 shadow-xs ring-1 ring-emerald-500/20"
                        : "bg-emerald-50/60 text-emerald-800 border border-emerald-300 hover:bg-emerald-100/80",
                    )}
                  >
                    <span className="w-2.5 h-2.5 bg-emerald-600 shrink-0" />
                    <span>Accepting Inbound</span>
                  </button>

                  {/* Diverting (Amber) */}
                  <button
                    type="button"
                    onClick={() =>
                      setDiversionStatus(HospitalDiversionStatus.DIVERTING)
                    }
                    className={cn(
                      "min-h-12 px-4 text-xs sm:text-sm font-bold rounded-none cursor-pointer flex items-center justify-center gap-2 transition-all",
                      diversionStatus === HospitalDiversionStatus.DIVERTING
                        ? "bg-amber-100 text-amber-900 border-2 border-amber-600 shadow-xs ring-1 ring-amber-500/20"
                        : "bg-amber-50/60 text-amber-800 border border-amber-300 hover:bg-amber-100/80",
                    )}
                  >
                    <span className="w-2.5 h-2.5 bg-amber-600 shrink-0" />
                    <span>Diverting (Limited)</span>
                  </button>

                  {/* Closed (Destructive Red) */}
                  <button
                    type="button"
                    onClick={() =>
                      setDiversionStatus(HospitalDiversionStatus.CLOSED)
                    }
                    className={cn(
                      "min-h-12 px-4 text-xs sm:text-sm font-bold rounded-none cursor-pointer flex items-center justify-center gap-2 transition-all",
                      diversionStatus === HospitalDiversionStatus.CLOSED
                        ? "bg-red-100 text-red-900 border-2 border-red-600 shadow-xs ring-1 ring-red-500/20"
                        : "bg-red-50/60 text-red-800 border border-red-300 hover:bg-red-100/80",
                    )}
                  >
                    <span className="w-2.5 h-2.5 bg-red-600 shrink-0" />
                    <span>ER Closed (Emergency)</span>
                  </button>
                </div>
              </div>

              {/* Conditional Reason Input for Diverting or Closed */}
              {(diversionStatus === HospitalDiversionStatus.DIVERTING ||
                diversionStatus === HospitalDiversionStatus.CLOSED) && (
                <div className="space-y-1.5 p-3.5 bg-amber-50/70 border border-amber-300 rounded-none animate-in fade-in-50 duration-200">
                  <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    Diversion Justification Reason{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <Input
                    value={diversionReason}
                    onChange={(e) => setDiversionReason(e.target.value)}
                    placeholder="e.g. Critical ICU bed saturation; acute emergency generator maintenance"
                    className="rounded-none border-2 border-amber-300 bg-white text-xs min-h-10 placeholder:text-text-muted"
                  />
                  <p className="text-[11px] text-amber-800">
                    This notice is immediately transmitted to active dispatchers
                    and en route ambulances.
                  </p>
                </div>
              )}

              {/* Error Notice */}
              {updateError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{updateError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border">
                <span className="text-xs text-text-muted">
                  Current Status:{" "}
                  <strong className="text-text-primary">
                    {hospital.diversionStatus}
                  </strong>{" "}
                  {hospital.diversionSetAt && (
                    <span className="font-mono">
                      (since{" "}
                      {new Date(hospital.diversionSetAt).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                      )
                    </span>
                  )}
                </span>

                <Button
                  type="button"
                  disabled={updateDiversionMutation.isPending}
                  onClick={handleUpdateDiversion}
                  className="w-full sm:w-auto min-h-10 px-5 text-xs font-bold bg-primary hover:bg-primary-dark text-white rounded-none cursor-pointer"
                >
                  {updateDiversionMutation.isPending
                    ? "Updating Protocol..."
                    : "Update Diversion Status"}
                </Button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: MY SHIFT STATUS & TELEMATICS */}
        <div className="lg:col-span-4 w-full">
          <section
            aria-label="My Shift"
            className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5 sm:p-6 space-y-4"
          >
            <CornerNotch />
            <LabelTab label="MY CLINICAL SHIFT" />

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-xs font-semibold text-text-secondary">
                  Shift Duty Status:
                </span>
                <StatusBadge
                  status={isOnShift ? "ON_SHIFT" : "OFF_SHIFT"}
                  variant="square"
                />
              </div>

              {/* Clinician Card */}
              <div className="p-3 bg-surface border border-border space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-none bg-primary-light text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="font-bold text-xs text-text-primary truncate block">
                      {staffProfile.user?.name || "Clinician"}
                    </span>
                    <span className="text-[11px] text-text-muted truncate block font-mono">
                      {staffProfile.designation || "Emergency Staff"} •{" "}
                      {staffProfile.employeeId || "STAFF-ID"}
                    </span>
                  </div>
                </div>

                {staffProfile.canManageStaff && (
                  <Badge className="bg-purple-100 text-purple-900 border-purple-300 text-[10px] font-semibold w-full justify-center">
                    Department Manager Privileges
                  </Badge>
                )}
              </div>

              {/* Live Active Shift Elapsed Timer */}
              {isOnShift && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-none flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-700 shrink-0" />
                    <div>
                      <span className="text-[10px] text-emerald-800 uppercase tracking-wider font-bold block">
                        Active Shift Time
                      </span>
                      <span className="font-mono text-sm font-black text-emerald-950">
                        {shiftDurationFormatted}
                      </span>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                </div>
              )}

              {/* Shift Clock-In / Clock-Out Button */}
              <Button
                type="button"
                onClick={handleToggleShift}
                disabled={toggleShiftMutation.isPending}
                aria-label={
                  isOnShift ? "End current shift duty" : "Start shift duty"
                }
                className={cn(
                  "w-full min-h-12 text-xs font-bold rounded-none cursor-pointer transition-colors gap-2",
                  isOnShift
                    ? "border-2 border-red-300 bg-red-50 text-red-900 hover:bg-red-100"
                    : "bg-primary hover:bg-primary-dark text-white",
                )}
              >
                <Power className="h-4 w-4" />
                {toggleShiftMutation.isPending
                  ? "Transmitting..."
                  : isOnShift
                    ? "End Shift Duty (Clock Out)"
                    : "Start Shift Duty (Clock In)"}
              </Button>
            </div>
          </section>
        </div>
      </div>

      {/* ── ROW 2: INBOUND AMBULANCE INTAKE FEED (REAL-TIME TELEMATICS) ── */}
      <section
        aria-label="Inbound Ambulance Intake"
        className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5 sm:p-6"
      >
        <CornerNotch />
        <LabelTab label="INBOUND AMBULANCE INTAKE (LIVE)" />

        <div className="mt-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Ambulance className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-text-primary">
                Incoming Emergency Transits ({inboundTrips.length})
              </span>
              <span className="text-[11px] text-text-muted">
                • Auto-updates every 5s
              </span>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => refetchInbound()}
              disabled={isInboundLoading}
              aria-label="Refresh inbound ambulance intake feed"
              className="h-7 text-xs px-2.5 rounded-none border-border hover:bg-slate-50 cursor-pointer"
            >
              <RefreshCw
                className={cn(
                  "h-3 w-3 mr-1",
                  isInboundLoading && "animate-spin",
                )}
              />
              Refresh
            </Button>
          </div>

          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <div className="min-w-160 px-5 sm:px-0">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-text-primary bg-slate-50">
                    <th scope="col" className="py-2.5 px-3">
                      Incident / Priority
                    </th>
                    <th scope="col" className="py-2.5 px-3">
                      Emergency Type
                    </th>
                    <th scope="col" className="py-2.5 px-3">
                      Patient Details
                    </th>
                    <th scope="col" className="py-2.5 px-3">
                      Ambulance / Crew
                    </th>
                    <th scope="col" className="py-2.5 px-3">
                      Transit Stage
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inboundTrips.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-10 text-center text-text-muted space-y-1.5"
                      >
                        <HeartPulse className="h-6 w-6 text-slate-300 mx-auto" />
                        <p className="font-medium text-xs">
                          No inbound ambulances currently en route to{" "}
                          {hospital.name}.
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Incoming transports will automatically appear here as
                          paramedic drivers designate this facility.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    inboundTrips.map((trip) => {
                      const isAtHospital = Boolean(trip.arrivedAtHospitalAt);
                      const isDeparted = Boolean(trip.departedToHospitalAt);

                      return (
                        <tr
                          key={trip.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="py-3 px-3">
                            <div className="space-y-1">
                              <span className="font-mono font-bold text-text-primary block">
                                {trip.emergency?.incidentNumber || "INC-99"}
                              </span>
                              <PriorityBadge
                                priority={trip.emergency?.priority}
                                variant="square"
                              />
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="space-y-0.5">
                              <span className="font-semibold text-text-primary block">
                                {trip.emergency?.emergencyType}
                              </span>
                              <span className="text-[11px] text-text-muted truncate max-w-xs block">
                                {trip.emergency?.locationAddress}
                              </span>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="space-y-0.5">
                              <span className="font-medium text-text-primary block">
                                {trip.patient?.name || "Unknown Patient"}
                              </span>
                              <div className="flex items-center gap-1.5 text-[11px] text-text-secondary font-mono">
                                {trip.patient?.bloodType && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] py-0 px-1 border-red-200 text-red-700 bg-red-50"
                                  >
                                    {trip.patient.bloodType}
                                  </Badge>
                                )}
                                <span>{trip.patient?.phone || "No phone"}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="space-y-0.5">
                              <span className="font-mono font-bold text-text-primary block">
                                {trip.ambulance?.plateNumber} (
                                {trip.ambulance?.type})
                              </span>
                              <span className="text-[11px] text-text-muted block">
                                Driver:{" "}
                                {trip.driver?.user?.name || "Paramedic Crew"}
                              </span>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs font-semibold">
                              {isAtHospital ? (
                                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-none font-bold flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                  Arrived at ER Doors
                                </span>
                              ) : isDeparted ? (
                                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-none font-bold flex items-center gap-1 animate-pulse">
                                  <Ambulance className="h-3 w-3 text-amber-600" />
                                  En Route to Facility
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded-none font-medium">
                                  Assigned Destination
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROW 3: ACTIVE ON-SHIFT CLINICAL ROSTER ── */}
      <section
        aria-label="Staff On Duty"
        className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5 sm:p-6"
      >
        <CornerNotch />
        <LabelTab label="CLINICIANS ACTIVE ON SHIFT" />

        <div className="mt-4 overflow-x-auto -mx-5 sm:mx-0">
          <div className="min-w-155 px-5 sm:px-0">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-text-primary bg-slate-50">
                  <th scope="col" className="py-2.5 px-3">
                    Clinician Name
                  </th>
                  <th scope="col" className="py-2.5 px-3">
                    Designation
                  </th>
                  <th scope="col" className="py-2.5 px-3">
                    Employee ID
                  </th>
                  <th scope="col" className="py-2.5 px-3">
                    Duty Status
                  </th>
                  <th scope="col" className="py-2.5 px-3">
                    Privileges
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isOnShiftLoading ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      Loading active on-duty staff...
                    </td>
                  </tr>
                ) : onShiftStaff.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-text-muted"
                    >
                      No colleagues are currently clocked into this ER station.
                    </td>
                  </tr>
                ) : (
                  onShiftStaff.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-3 font-bold text-text-primary">
                        {member.user?.name || "Staff Clinician"}
                      </td>
                      <td className="py-3 px-3 font-medium text-text-primary">
                        {member.designation || "General Emergency"}
                      </td>
                      <td className="py-3 px-3 font-mono text-text-secondary">
                        {member.employeeId || "—"}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge
                          status={member.isOnShift ? "ON_SHIFT" : "OFF_SHIFT"}
                          variant="square"
                        />
                      </td>
                      <td className="py-3 px-3 font-medium text-text-secondary">
                        {member.canManageStaff ? (
                          <span className="text-purple-700 font-bold">
                            Manager
                          </span>
                        ) : (
                          "Clinical Staff"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export const HospitalStaffOverviewView = HospitalStaffView;
