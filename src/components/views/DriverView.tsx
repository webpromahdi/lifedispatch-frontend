"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { formatEnumTitle } from "@/components/admin/AdminDashboardSections";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CornerNotch, LabelTab } from "@/components/views/PatientView";
import { seedAmbulances } from "@/lib/dummy/ambulances";
import { seedDispatches } from "@/lib/dummy/dispatches";
import { seedDrivers } from "@/lib/dummy/drivers";
import { seedEmergencies } from "@/lib/dummy/emergencies";
import { seedHospitals } from "@/lib/dummy/hospitals";
import type { Ambulance } from "@/lib/types/ambulance.types";
import type { Dispatch } from "@/lib/types/dispatch.types";
import type { EmergencyRequest } from "@/lib/types/emergency.types";
import {
  DispatchStatus,
  EmergencyPriority,
  HospitalDiversionStatus,
} from "@/lib/types/enums";
import type { Hospital } from "@/lib/types/hospital.types";
import { cn } from "@/lib/utils";

interface PendingDispatchItem {
  dispatch: Dispatch;
  emergency: EmergencyRequest;
  ambulance: Ambulance;
}

const TRIP_STEPS = [
  { id: 1, label: "01 Departed" },
  { id: 2, label: "02 At Scene" },
  { id: 3, label: "03 Patient Picked Up" },
  { id: 4, label: "04 At Hospital" },
];

export function DriverView() {
  const currentDriver = seedDrivers[0];
  const [isOnShift, setIsOnShift] = useState<boolean>(currentDriver.isOnShift);
  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());

  // Pending dispatches list
  const [pendingDispatches, setPendingDispatches] = useState<
    PendingDispatchItem[]
  >(() => {
    // Find dispatches with PENDING_ACCEPTANCE
    const pending = seedDispatches.find(
      (d) => d.status === DispatchStatus.PENDING_ACCEPTANCE,
    );
    if (!pending) return [];

    const em =
      seedEmergencies.find((e) => e.id === pending.emergencyId) ||
      seedEmergencies[0];
    const amb =
      seedAmbulances.find((a) => a.id === pending.ambulanceId) ||
      seedAmbulances[0];

    return [{ dispatch: pending, emergency: em, ambulance: amb }];
  });

  // Active Trip State
  const [activeTrip, setActiveTrip] = useState<{
    id: string;
    incidentNumber: string;
    emergencyType: string;
    locationAddress: string;
    stepIndex: number; // 1: Departed, 2: At Scene, 3: Patient Picked Up, 4: At Hospital
    destinationHospital: Hospital | null;
  } | null>(null);

  // Reject Dialog State
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [dispatchToReject, setDispatchToReject] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Select Hospital Dialog State
  const [hospitalDialogOpen, setHospitalDialogOpen] = useState(false);

  // Complete Trip Dialog State
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [tripDistanceKm, setTripDistanceKm] = useState<string>("8.5");

  // Timer: 1-second interval for countdown clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Polling driver's pending dispatches every ~5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // In production, fetch pending dispatches for driver
      // Dispatches will not arrive when off shift
      if (!isOnShift) {
        setPendingDispatches([]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isOnShift]);

  // Handle Shift Toggle
  const handleToggleShift = () => {
    const nextState = !isOnShift;
    setIsOnShift(nextState);
    if (nextState) {
      toast.success("Shift status updated: ON SHIFT");
    } else {
      toast.info("Shift status updated: OFF SHIFT");
    }
  };

  // Handle Accept Dispatch
  const handleAcceptDispatch = (item: PendingDispatchItem) => {
    setPendingDispatches((prev) =>
      prev.filter((d) => d.dispatch.id !== item.dispatch.id),
    );

    setActiveTrip({
      id: item.dispatch.id,
      incidentNumber: item.emergency.incidentNumber,
      emergencyType: item.emergency.emergencyType,
      locationAddress: item.emergency.locationAddress,
      stepIndex: 1, // Start at 01 Departed
      destinationHospital: seedHospitals[0],
    });

    toast.success(`Dispatch accepted for ${item.emergency.incidentNumber}`);
  };

  // Handle Open Reject Dialog
  const handleOpenRejectDialog = (dispatchId: string) => {
    setDispatchToReject(dispatchId);
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  // Handle Confirm Reject
  const handleConfirmReject = () => {
    if (!dispatchToReject) return;

    setPendingDispatches((prev) =>
      prev.filter((d) => d.dispatch.id !== dispatchToReject),
    );

    toast.info("Dispatch rejected");
    setRejectDialogOpen(false);
    setDispatchToReject(null);
  };

  // Advance Trip Milestone
  const handleAdvanceMilestone = () => {
    if (!activeTrip) return;

    if (activeTrip.stepIndex < 4) {
      const nextStep = activeTrip.stepIndex + 1;
      setActiveTrip({
        ...activeTrip,
        stepIndex: nextStep,
      });
      const stepName = TRIP_STEPS.find((s) => s.id === nextStep)?.label || "";
      toast.success(`Milestone updated: ${stepName}`);
    } else {
      // Already at step 4: prompt completion
      setCompleteDialogOpen(true);
    }
  };

  // Complete Trip
  const handleConfirmCompleteTrip = () => {
    if (!activeTrip) return;

    toast.success(`Trip ${activeTrip.incidentNumber} completed successfully`);
    setActiveTrip(null);
    setCompleteDialogOpen(false);
  };

  // Compact hospitals list for right column
  const compactHospitals = useMemo(() => {
    return seedHospitals.slice(0, 5);
  }, []);

  return (
    <div className="space-y-6 flex flex-col">
      {/* ── DESKTOP TWO-COLUMN / MOBILE-FIRST ORDERED LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Desktop 8 cols / Mobile 1st): INCOMING DISPATCH & ACTIVE TRIP */}
        <div className="lg:col-span-8 w-full flex flex-col gap-6 order-1">
          {/* Card: INCOMING DISPATCH */}
          {pendingDispatches.length > 0 && (
            <section
              aria-label="Incoming Dispatch"
              className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5 sm:p-6"
            >
              <CornerNotch />
              <LabelTab label="INCOMING DISPATCH" />

              <div className="mt-4 space-y-6">
                {pendingDispatches.map((item) => {
                  const targetTime = new Date(
                    item.dispatch.timeoutAt,
                  ).getTime();
                  const diffMs = Math.max(0, targetTime - currentTime);
                  const isExpired = diffMs <= 0;
                  const minutes = Math.floor(diffMs / 60000);
                  const seconds = Math.floor((diffMs % 60000) / 1000);
                  const formattedCountdown = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

                  return (
                    <div
                      key={item.dispatch.id}
                      className="border-2 border-slate-200 p-4 sm:p-5 bg-slate-50 space-y-4"
                    >
                      {/* Top row: Incident No + Badges + Countdown */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xl sm:text-2xl font-black text-text-primary font-mono">
                            {item.emergency.incidentNumber}
                          </span>
                          <PriorityBadge
                            priority={
                              item.emergency.priority ||
                              EmergencyPriority.P1_CRITICAL
                            }
                            variant="square"
                          />
                          <span className="text-xs font-bold text-text-secondary px-2 py-0.5 border border-slate-300 bg-white">
                            {formatEnumTitle(item.emergency.emergencyType)}
                          </span>
                        </div>

                        {/* Live Countdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-text-secondary">
                            Expires in:
                          </span>
                          <div
                            className={cn(
                              "font-mono font-black text-sm px-2.5 py-1 border rounded-none",
                              isExpired
                                ? "bg-red-100 text-red-700 border-red-300"
                                : "bg-amber-100 text-amber-900 border-amber-300",
                            )}
                          >
                            {isExpired ? "Expired" : formattedCountdown}
                          </div>
                        </div>
                      </div>

                      {/* Location & Description */}
                      <div className="space-y-1.5 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-text-secondary shrink-0">
                            Location:
                          </span>
                          <span className="font-medium text-text-primary">
                            {item.emergency.locationAddress}
                          </span>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-text-secondary shrink-0">
                            Description:
                          </span>
                          <span className="text-text-primary">
                            {item.emergency.description ||
                              "Urgent emergency medical dispatch."}
                          </span>
                        </div>
                      </div>

                      {/* Caller Info & Assigned Ambulance */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-xs">
                        <div>
                          <span className="text-text-secondary block">
                            Caller Contact:
                          </span>
                          <span className="font-medium text-text-primary">
                            {item.emergency.callerName} (
                            <a
                              href={`tel:${item.emergency.callerPhone}`}
                              className="text-primary-dark font-bold hover:underline"
                            >
                              {item.emergency.callerPhone}
                            </a>
                            )
                          </span>
                        </div>

                        <div>
                          <span className="text-text-secondary block">
                            Assigned Ambulance:
                          </span>
                          <span className="font-mono font-bold text-text-primary">
                            {item.ambulance.registrationNumber} (
                            {item.ambulance.type})
                          </span>
                        </div>
                      </div>

                      {/* Large Action Buttons (min-h-12) */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                        <button
                          type="button"
                          disabled={isExpired}
                          onClick={() => handleAcceptDispatch(item)}
                          className={cn(
                            "w-full sm:flex-1 min-h-12 px-6 text-sm font-bold text-white rounded-none cursor-pointer transition-colors",
                            isExpired
                              ? "bg-slate-300 cursor-not-allowed text-slate-500"
                              : "bg-primary hover:bg-primary-dark",
                          )}
                        >
                          Accept Dispatch
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenRejectDialog(item.dispatch.id)
                          }
                          className="w-full sm:w-auto min-h-12 px-6 text-sm font-bold border-2 border-red-500 text-red-600 hover:bg-red-50 rounded-none cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Empty State for Incoming Dispatch when no pending */}
          {pendingDispatches.length === 0 && !activeTrip && (
            <section
              aria-label="Incoming Dispatch Standby"
              className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5 sm:p-6"
            >
              <CornerNotch />
              <LabelTab label="INCOMING DISPATCH" />

              <div className="py-12 text-center space-y-2">
                <div className="text-base font-semibold text-text-primary">
                  No pending dispatches.
                </div>
                <div className="text-xs text-text-secondary">
                  New dispatches appear here automatically.
                </div>
              </div>
            </section>
          )}

          {/* Card: ACTIVE TRIP */}
          {activeTrip && (
            <section
              aria-label="Active Trip"
              className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5 sm:p-6"
            >
              <CornerNotch />
              <LabelTab label="ACTIVE TRIP" />

              <div className="mt-4 space-y-6">
                {/* Header: Incident & Details */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-text-primary font-mono">
                      {activeTrip.incidentNumber}
                    </h2>
                    <div className="text-xs text-text-secondary mt-1">
                      {formatEnumTitle(activeTrip.emergencyType)} ·{" "}
                      {activeTrip.locationAddress}
                    </div>
                  </div>

                  {activeTrip.destinationHospital && (
                    <div className="text-right">
                      <span className="text-[11px] text-text-secondary block">
                        Destination Hospital:
                      </span>
                      <span className="text-xs font-bold text-text-primary">
                        {activeTrip.destinationHospital.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* ── Shared Notched Stepper (4 steps) ── */}
                <div className="pt-2 pb-1 overflow-x-auto">
                  <div className="min-w-120 sm:min-w-0 flex items-center justify-between">
                    {TRIP_STEPS.map((step, idx) => {
                      const isPast = activeTrip.stepIndex > step.id;
                      const isCurrent = activeTrip.stepIndex === step.id;

                      return (
                        <div
                          key={step.id}
                          className="flex items-center flex-1 last:flex-none"
                        >
                          <div className="flex flex-col items-center">
                            <div
                              className={cn(
                                "w-10 h-10 flex items-center justify-center font-bold text-xs sm:text-sm rounded-none select-none",
                                isPast
                                  ? "bg-primary text-white"
                                  : isCurrent
                                    ? "bg-white border-2 border-primary text-primary"
                                    : "bg-white border border-border-strong text-text-muted",
                              )}
                            >
                              0{step.id}
                            </div>
                            <span
                              className={cn(
                                "text-xs mt-2 text-center select-none font-semibold",
                                isPast || isCurrent
                                  ? "text-text-primary"
                                  : "text-text-muted",
                              )}
                            >
                              {step.label.replace(/^0\d\s*/, "")}
                            </span>
                          </div>

                          {/* Arrow connector */}
                          {idx < TRIP_STEPS.length - 1 && (
                            <div className="flex-1 flex items-center px-2 -mt-5">
                              <div
                                className={cn(
                                  "w-full border-t flex items-center justify-center relative",
                                  activeTrip.stepIndex > step.id
                                    ? "border-t-2 border-primary"
                                    : "border-t border-border-strong",
                                )}
                              >
                                <span
                                  className={cn(
                                    "absolute -top-2.5 text-xs font-bold",
                                    activeTrip.stepIndex > step.id
                                      ? "text-primary"
                                      : "text-text-muted",
                                  )}
                                >
                                  →
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Large Milestone Button & Controls (min-h-12) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAdvanceMilestone}
                    className="flex-1 min-h-12 px-6 text-sm font-bold bg-primary hover:bg-primary-dark text-white rounded-none cursor-pointer"
                  >
                    {activeTrip.stepIndex < 4
                      ? `Advance to ${TRIP_STEPS[activeTrip.stepIndex]?.label || "Next Milestone"}`
                      : "Handover Complete — Ready to Complete"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setHospitalDialogOpen(true)}
                    className="min-h-12 px-5 text-sm font-semibold border-2 border-border text-text-primary hover:bg-slate-100 rounded-none cursor-pointer"
                  >
                    Select Hospital
                  </button>

                  <button
                    type="button"
                    onClick={() => setCompleteDialogOpen(true)}
                    className="min-h-12 px-5 text-sm font-bold border-2 border-primary text-primary-dark hover:bg-primary-light rounded-none cursor-pointer"
                  >
                    Complete Trip
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right Column (Desktop 4 cols / Mobile 2nd & 3rd): MY SHIFT & HOSPITALS */}
        <div className="lg:col-span-4 w-full flex flex-col gap-6 order-2">
          {/* Card: MY SHIFT */}
          <section
            aria-label="My Shift"
            className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5"
          >
            <CornerNotch />
            <LabelTab label="MY SHIFT" />

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-secondary">
                  Shift Duty Status:
                </span>
                <StatusBadge
                  status={isOnShift ? "ON_SHIFT" : "OFF_SHIFT"}
                  variant="square"
                />
              </div>

              {!isOnShift && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
                  Dispatches will not arrive while off shift.
                </div>
              )}

              <button
                type="button"
                onClick={handleToggleShift}
                className={cn(
                  "w-full min-h-12 text-sm font-bold rounded-none cursor-pointer transition-colors",
                  isOnShift
                    ? "border-2 border-border text-text-primary hover:bg-slate-100"
                    : "bg-primary hover:bg-primary-dark text-white",
                )}
              >
                {isOnShift
                  ? "End Shift (Go Off Duty)"
                  : "Start Shift (Go On Duty)"}
              </button>
            </div>
          </section>

          {/* Card: HOSPITALS (Same compact list as Dispatcher) */}
          <section
            aria-label="Hospitals"
            className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5"
          >
            <CornerNotch />
            <LabelTab label="HOSPITALS" />

            <div className="mt-4 divide-y divide-slate-100 text-xs">
              {compactHospitals.map((hosp) => (
                <div
                  key={hosp.id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <svg
                      className="w-4 h-4 text-secondary shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 6v4" />
                      <path d="M10 8h4" />
                      <path d="M18 20V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16" />
                      <path d="M2 20h20" />
                      <path d="M10 14h4v6h-4z" />
                    </svg>
                    <div className="min-w-0">
                      <span className="font-semibold text-text-primary truncate block text-xs">
                        {hosp.name}
                      </span>
                      <span className="text-[11px] text-text-secondary">
                        {hosp.availableErBeds} beds available
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <StatusBadge
                      status={hosp.diversionStatus}
                      variant="square"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* ── REJECT DISPATCH DIALOG ── */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="rounded-none border-2 border-primary bg-white sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-text-primary">
              Reject Dispatch
            </DialogTitle>
            <DialogDescription className="text-xs text-text-secondary">
              Provide a reason for declining this emergency dispatch.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <label className="text-xs font-bold text-text-primary block">
              Reason for Rejection
            </label>
            <Input
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Mechanical fault, road blockage, paramedic handover"
              className="rounded-none border-2 border-border text-sm min-h-11"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              className="rounded-none border-border text-xs min-h-11"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmReject}
              className="rounded-none bg-red-600 hover:bg-red-700 text-white text-xs font-bold min-h-11"
            >
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── SELECT HOSPITAL DIALOG ── */}
      <Dialog open={hospitalDialogOpen} onOpenChange={setHospitalDialogOpen}>
        <DialogContent className="rounded-none border-2 border-primary bg-white sm:max-w-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-text-primary">
              Select Destination Hospital
            </DialogTitle>
            <DialogDescription className="text-xs text-text-secondary">
              Review current trauma bed availability and diversion status.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto">
            {seedHospitals.map((hosp) => {
              const isClosed =
                hosp.diversionStatus === HospitalDiversionStatus.CLOSED;
              const isDiverting =
                hosp.diversionStatus === HospitalDiversionStatus.DIVERTING;

              return (
                <div
                  key={hosp.id}
                  className="p-3 border border-border bg-slate-50 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-secondary shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 6v4" />
                        <path d="M10 8h4" />
                        <path d="M18 20V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16" />
                        <path d="M2 20h20" />
                        <path d="M10 14h4v6h-4z" />
                      </svg>
                      <span className="font-bold text-xs text-text-primary">
                        {hosp.name}
                      </span>
                    </div>

                    <div className="text-xs text-text-secondary">
                      {hosp.availableErBeds} beds available
                    </div>

                    {isDiverting && (
                      <div className="text-[11px] text-amber-700 font-medium">
                        Hospital is diverting non-critical admissions.
                      </div>
                    )}

                    {isClosed && (
                      <div className="text-[11px] text-red-700 font-medium">
                        Hospital intake is closed.
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isClosed}
                    onClick={() => {
                      if (activeTrip) {
                        setActiveTrip({
                          ...activeTrip,
                          destinationHospital: hosp,
                        });
                        toast.success(`Destination set to ${hosp.name}`);
                        setHospitalDialogOpen(false);
                      }
                    }}
                    className={cn(
                      "px-3.5 py-1.5 text-xs font-bold rounded-none min-h-9.5 cursor-pointer",
                      isClosed
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-primary hover:bg-primary-dark text-white",
                    )}
                  >
                    Select
                  </button>
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setHospitalDialogOpen(false)}
              className="rounded-none border-border text-xs min-h-9.5"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── COMPLETE TRIP DIALOG ── */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="rounded-none border-2 border-primary bg-white sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-text-primary">
              Complete Emergency Trip
            </DialogTitle>
            <DialogDescription className="text-xs text-text-secondary">
              Record final trip distance to conclude the assignment and release
              the vehicle.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <label className="text-xs font-bold text-text-primary block">
              Trip Distance (km)
            </label>
            <Input
              type="number"
              step="0.1"
              value={tripDistanceKm}
              onChange={(e) => setTripDistanceKm(e.target.value)}
              className="rounded-none border-2 border-border text-base min-h-12"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCompleteDialogOpen(false)}
              className="rounded-none border-border text-xs min-h-11"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmCompleteTrip}
              className="rounded-none bg-primary hover:bg-primary-dark text-white text-xs font-bold min-h-11"
            >
              Confirm Complete Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
