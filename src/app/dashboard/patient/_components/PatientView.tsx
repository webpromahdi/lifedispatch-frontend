"use client";
import { CornerNotch, LabelTab } from "@/components/shared/DashboardUIPrimitives";

import {
  AlertTriangle,
  Ambulance,
  ArrowRight,
  Building2,
  Check,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CreateEmergencyForm } from "@/components/forms/CreateEmergencyForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { seedAmbulances } from "@/lib/dummy/ambulances";
import {
  seedEmergencies,
  seedTimelineEvents,
} from "@/lib/dummy/emergencies";
import { seedHospitals } from "@/lib/dummy/hospitals";
import { seedPayments } from "@/lib/dummy/payments";
import { seedTrips } from "@/lib/dummy/trips";
import { seedUsers } from "@/lib/dummy/users";
import type { EmergencyRequest } from "@/lib/types/emergency.types";
import type { User } from "@/lib/types/user.types";
import {
  EmergencyPriority,
  EmergencyStatus,
  PaymentStatus,
} from "@/lib/types/enums";
import { cn, formatDate } from "@/lib/utils";

// CornerNotch and LabelTab imported from @/components/shared/DashboardUIPrimitives

// ── Priority Badge Helper Matching Reference (■ P1, ■ P2, etc.) ──
function TablePriorityBadge({ priority }: { priority: EmergencyPriority | null }) {
  if (priority === EmergencyPriority.P1_CRITICAL) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DC2626]">
        <span className="w-2 h-2 bg-[#DC2626] shrink-0" />
        <span>P1</span>
      </span>
    );
  }
  if (priority === EmergencyPriority.P2_EMERGENCY) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706]">
        <span className="w-2 h-2 bg-[#D97706] shrink-0" />
        <span>P2</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary">
      <span className="w-2 h-2 bg-text-muted shrink-0" />
      <span>{priority === EmergencyPriority.P3_URGENT ? "P3" : priority === EmergencyPriority.P4_NON_URGENT ? "P4" : "P5"}</span>
    </span>
  );
}

// ── Status Badge Helper Matching Reference (Active, Completed, Cancelled) ──
function TableStatusBadge({ status }: { status: EmergencyStatus }) {
  const isActive =
    status === EmergencyStatus.PENDING ||
    status === EmergencyStatus.PRIORITIZED ||
    status === EmergencyStatus.DISPATCHING ||
    status === EmergencyStatus.ACTIVE_TRIP;

  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-status-bg border border-[#BBF7D0] text-status-text text-xs font-bold rounded-none">
        Active
      </span>
    );
  }

  if (status === EmergencyStatus.COMPLETED) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-status-bg border border-[#BBF7D0] text-status-text text-xs font-bold rounded-none">
        Completed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 text-xs font-bold rounded-none">
      Cancelled
    </span>
  );
}

export function PatientView() {
  // Current user data (Nafisa Anjum)
  const patientUser = useMemo(() => {
    const user = seedUsers.find((u) => u.id === "usr_patient_01");
    return user as User;
  }, []);

  // Active emergency state tracking
  const [activeEmergency, setActiveEmergency] = useState<EmergencyRequest | null>(
    () => {
      const active = seedEmergencies.find(
        (e) =>
          e.patientId === "usr_patient_01" &&
          (e.status === EmergencyStatus.PENDING ||
            e.status === EmergencyStatus.PRIORITIZED ||
            e.status === EmergencyStatus.DISPATCHING ||
            e.status === EmergencyStatus.ACTIVE_TRIP),
      );
      return active || null;
    },
  );

  const hasActiveEmergency = Boolean(activeEmergency);

  // Dialog and form states
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("Alternative transport arranged");
  const [cancelNotes, setCancelNotes] = useState("");

  // Synchronize state with Sidebar through custom event
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("lifedispatch:emergency-status", {
        detail: { hasActiveEmergency },
      }),
    );
  }, [hasActiveEmergency]);

  // Listen to open-modal event from sidebar buttons
  useEffect(() => {
    const handleOpenModal = () => {
      if (!hasActiveEmergency) {
        setRequestModalOpen(true);
      }
    };

    window.addEventListener("lifedispatch:open-request-modal", handleOpenModal);
    return () => {
      window.removeEventListener(
        "lifedispatch:open-request-modal",
        handleOpenModal,
      );
    };
  }, [hasActiveEmergency]);

  // Refresh active emergency data every ~10s while active (existing fetching pattern, no websockets)
  useEffect(() => {
    if (!hasActiveEmergency) return;

    const interval = setInterval(() => {
      // Re-fetch latest emergency from store
      const current = seedEmergencies.find(
        (e) =>
          e.patientId === "usr_patient_01" &&
          (e.status === EmergencyStatus.PENDING ||
            e.status === EmergencyStatus.PRIORITIZED ||
            e.status === EmergencyStatus.DISPATCHING ||
            e.status === EmergencyStatus.ACTIVE_TRIP),
      );
      if (current) {
        setActiveEmergency({ ...current });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [hasActiveEmergency]);

  // Trip, Ambulance, and Hospital blocks (render ONLY when data exists)
  const activeTrip = useMemo(() => {
    if (!activeEmergency) return null;
    return (
      seedTrips.find(
        (t) =>
          t.patientId === activeEmergency.patientId &&
          t.status === "ACTIVE",
      ) || null
    );
  }, [activeEmergency]);

  const assignedAmbulance = useMemo(() => {
    if (!activeTrip?.ambulanceId) return null;
    return (
      seedAmbulances.find((a) => a.id === activeTrip.ambulanceId) || null
    );
  }, [activeTrip]);

  const assignedHospital = useMemo(() => {
    if (!activeTrip?.hospitalId) return null;
    return seedHospitals.find((h) => h.id === activeTrip.hospitalId) || null;
  }, [activeTrip]);

  // Timeline events for active emergency (render ONLY when data exists)
  const timelineUpdates = useMemo(() => {
    if (!activeEmergency) return [];
    return seedTimelineEvents.filter(
      (ev) => ev.emergencyId === activeEmergency.id,
    );
  }, [activeEmergency]);

  // Pending payment for this patient (render ONLY when a pending payment exists)
  const pendingPayment = useMemo(() => {
    return (
      seedPayments.find(
        (p) =>
          p.patientId === "usr_patient_01" &&
          p.status === PaymentStatus.PENDING,
      ) || null
    );
  }, []);

  // Compute stat card metrics dynamically from patient emergencies
  const patientEmergencies = useMemo(() => {
    return seedEmergencies.filter((e) => e.patientId === "usr_patient_01");
  }, []);

  const totalRequestsCount = patientEmergencies.length;

  const completedEmergencies = useMemo(() => {
    return patientEmergencies.filter(
      (e) => e.status === EmergencyStatus.COMPLETED,
    );
  }, [patientEmergencies]);

  const completedCount = completedEmergencies.length;

  const avgResponseTimeText = useMemo(() => {
    const validTimes = completedEmergencies
      .map((e) => e.responseTimeMinutes)
      .filter((t): t is number => typeof t === "number" && t > 0);

    if (validTimes.length === 0) return "8 min";
    const sum = validTimes.reduce((acc, curr) => acc + curr, 0);
    const avg = Math.round(sum / validTimes.length);
    return `${avg} min`;
  }, [completedEmergencies]);

  // Recent Emergencies for table (latest 4 to 5 rows)
  const recentEmergencies = useMemo(() => {
    return [...patientEmergencies]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 4);
  }, [patientEmergencies]);

  // Stepper calculations
  // PENDING/PRIORITIZED = 01 Request Sent, DISPATCHING = 02 Finding Ambulance, ACTIVE_TRIP = 03 En Route, COMPLETED = 04 Completed
  const currentStep = useMemo(() => {
    if (!activeEmergency) return 0;
    switch (activeEmergency.status) {
      case EmergencyStatus.PENDING:
      case EmergencyStatus.PRIORITIZED:
        return 1;
      case EmergencyStatus.DISPATCHING:
        return 2;
      case EmergencyStatus.ACTIVE_TRIP:
        return 3;
      case EmergencyStatus.COMPLETED:
        return 4;
      default:
        return 0;
    }
  }, [activeEmergency]);

  // Handle Cancel Emergency
  const handleConfirmCancel = () => {
    if (!activeEmergency) return;

    activeEmergency.status = EmergencyStatus.CANCELLED;
    activeEmergency.cancellationReason = cancelNotes
      ? `${cancelReason}: ${cancelNotes}`
      : cancelReason;
    activeEmergency.cancelledAt = new Date().toISOString();

    setActiveEmergency(null);
    setCancelDialogOpen(false);
    toast.error("Emergency Cancelled", {
      description: `Incident ${activeEmergency.incidentNumber} was cancelled. Assigned unit has been recalled.`,
    });
  };

  // Handle Create Emergency Success
  const handleCreateSuccess = (incidentNumber: string) => {
    setRequestModalOpen(false);
    const newEmergency: EmergencyRequest = {
      id: `em_${Date.now()}`,
      incidentNumber,
      patientId: "usr_patient_01",
      emergencyType: EmergencyStatus.PENDING as unknown as EmergencyRequest["emergencyType"],
      requiredCapability: EmergencyPriority.P1_CRITICAL as unknown as EmergencyRequest["requiredCapability"],
      priority: EmergencyPriority.P1_CRITICAL,
      status: EmergencyStatus.PENDING,
      description: "Emergency distress call logged via patient dashboard.",
      locationAddress: "House 24, Road 11, Dhanmondi, Dhaka",
      locationLat: 23.7509,
      locationLng: 90.3755,
      callerName: patientUser.name,
      callerPhone: patientUser.phone || "+880 1711-555555",
      isEscalated: false,
      escalationReason: null,
      slaTargetMinutes: 8,
      responseTimeMinutes: null,
      cancelledAt: null,
      cancellationReason: null,
      cancelledBy: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    seedEmergencies.unshift(newEmergency);
    setActiveEmergency(newEmergency);
  };

  // Handle Pay Now redirect
  const handlePayNow = () => {
    if (pendingPayment?.gatewayUrl) {
      toast.info("Connecting to Payment Gateway", {
        description: `Redirecting to SSLCommerz sandbox for invoice ${pendingPayment.invoiceNumber}...`,
      });
      window.location.href = pendingPayment.gatewayUrl;
    } else {
      toast.info("Invoice Processed", {
        description: "Payment gateway initialized.",
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 
        Responsive layout order:
        Desktop: 2 columns (Current Emergency left, Medical Info + Payment Due right).
        Mobile: Single column order: Current Emergency, Payment Due, Medical Info, stats, table.
      */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-start">
        {/* ── 1. CURRENT EMERGENCY CARD ── */}
        <section
          aria-label="Current Emergency"
          className="order-1 lg:col-span-8 w-full relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5 sm:p-6"
        >
          <CornerNotch />
          <LabelTab label="CURRENT EMERGENCY" />

          {hasActiveEmergency && activeEmergency ? (
            <div className="mt-4 space-y-6">
              {/* Header: Incident No + Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-mono">
                    {activeEmergency.incidentNumber}
                  </h2>

                  {/* Priority Badge */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-destructive-bg border border-[#FECACA] text-[#DC2626] text-xs font-bold rounded-none select-none">
                    <span className="w-2 h-2 bg-[#DC2626] shrink-0" />
                    <span>
                      {activeEmergency.priority === EmergencyPriority.P1_CRITICAL
                        ? "P1 Critical"
                        : "P2 Emergency"}
                    </span>
                  </span>

                  {/* Status Badge */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-status-bg border border-[#BBF7D0] text-status-text text-xs font-bold rounded-none select-none">
                    <Check className="w-3.5 h-3.5 text-status-text shrink-0" strokeWidth={2.5} />
                    <span>Active</span>
                  </span>
                </div>
              </div>

              {/* Subtitle: Type · Location · Time */}
              <div className="text-xs sm:text-sm text-text-secondary font-medium -mt-2">
                <span className="capitalize">{activeEmergency.emergencyType.toLowerCase()}</span>
                <span className="mx-2 text-slate-300">·</span>
                <span>{activeEmergency.locationAddress}</span>
                <span className="mx-2 text-slate-300">·</span>
                <span className="font-mono">
                  {formatDate(activeEmergency.createdAt, "hh:mm a")}
                </span>
              </div>

              {/* ── Stepper ── */}
              {activeEmergency.status === EmergencyStatus.CANCELLED ||
              activeEmergency.status === EmergencyStatus.REASSIGNMENT_REQUIRED ? (
                <div className="p-3 bg-red-50 border border-red-200 text-xs font-medium text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>
                    {activeEmergency.status === EmergencyStatus.CANCELLED
                      ? `Emergency Cancelled: ${activeEmergency.cancellationReason || "Patient request"}`
                      : "Unit Reassignment in progress: A new ambulance is being dispatched."}
                  </span>
                </div>
              ) : (
                <div className="pt-2 pb-1 overflow-x-auto">
                  <div className="min-w-120 sm:min-w-0 flex items-center justify-between">
                    {/* Step 1: Request Sent */}
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={cn(
                          "w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-xs sm:text-sm rounded-none select-none",
                          currentStep >= 1 && currentStep !== 1
                            ? "bg-primary text-white"
                            : currentStep === 1
                              ? "bg-white border-2 border-primary text-primary"
                              : "bg-white border border-border-strong text-text-muted",
                        )}
                      >
                        01
                      </div>
                      <span
                        className={cn(
                          "text-xs mt-2 text-center select-none font-semibold",
                          currentStep >= 1 ? "text-text-primary" : "text-text-muted",
                        )}
                      >
                        Request Sent
                      </span>
                    </div>

                    {/* Arrow connector 1-2 */}
                    <div className="flex-1 flex items-center px-1 -mt-5">
                      <div
                        className={cn(
                          "w-full border-t flex items-center justify-center relative",
                          currentStep >= 2
                            ? "border-t-2 border-primary"
                            : "border-t border-border-strong",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute -top-2.5 text-xs font-bold",
                            currentStep >= 2 ? "text-primary" : "text-text-muted",
                          )}
                        >
                          →
                        </span>
                      </div>
                    </div>

                    {/* Step 2: Finding Ambulance */}
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={cn(
                          "w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-xs sm:text-sm rounded-none select-none",
                          currentStep > 2
                            ? "bg-primary text-white"
                            : currentStep === 2
                              ? "bg-white border-2 border-primary text-primary"
                              : "bg-white border border-border-strong text-text-muted",
                        )}
                      >
                        02
                      </div>
                      <span
                        className={cn(
                          "text-xs mt-2 text-center select-none font-semibold",
                          currentStep >= 2 ? "text-text-primary" : "text-text-muted",
                        )}
                      >
                        Finding Ambulance
                      </span>
                    </div>

                    {/* Arrow connector 2-3 */}
                    <div className="flex-1 flex items-center px-1 -mt-5">
                      <div
                        className={cn(
                          "w-full border-t flex items-center justify-center relative",
                          currentStep >= 3
                            ? "border-t-2 border-primary"
                            : "border-t border-border-strong",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute -top-2.5 text-xs font-bold",
                            currentStep >= 3 ? "text-primary" : "text-text-muted",
                          )}
                        >
                          →
                        </span>
                      </div>
                    </div>

                    {/* Step 3: En Route */}
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={cn(
                          "w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-xs sm:text-sm rounded-none select-none",
                          currentStep > 3
                            ? "bg-primary text-white"
                            : currentStep === 3
                              ? "bg-white border-2 border-primary text-primary"
                              : "bg-white border border-border-strong text-text-muted",
                        )}
                      >
                        03
                      </div>
                      <span
                        className={cn(
                          "text-xs mt-2 text-center select-none font-bold",
                          currentStep === 3
                            ? "text-primary"
                            : currentStep > 3
                              ? "text-text-primary"
                              : "text-text-muted",
                        )}
                      >
                        En Route
                      </span>
                    </div>

                    {/* Arrow connector 3-4 */}
                    <div className="flex-1 flex items-center px-1 -mt-5">
                      <div
                        className={cn(
                          "w-full border-t flex items-center justify-center relative",
                          currentStep >= 4
                            ? "border-t-2 border-primary"
                            : "border-t border-border-strong",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute -top-2.5 text-xs font-bold",
                            currentStep >= 4 ? "text-primary" : "text-text-muted",
                          )}
                        >
                          →
                        </span>
                      </div>
                    </div>

                    {/* Step 4: Completed */}
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={cn(
                          "w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-xs sm:text-sm rounded-none select-none",
                          currentStep === 4
                            ? "bg-primary text-white"
                            : "bg-white border border-border-strong text-text-muted",
                        )}
                      >
                        04
                      </div>
                      <span
                        className={cn(
                          "text-xs mt-2 text-center select-none font-medium",
                          currentStep === 4 ? "text-text-primary font-bold" : "text-text-muted",
                        )}
                      >
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Ambulance Block & Hospital Block (render only when data exists) ── */}
              {(assignedAmbulance || assignedHospital) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Ambulance Block */}
                  {assignedAmbulance && (
                    <div className="bg-primary-light/50 border border-[#CCFBF1] p-3.5 flex items-center gap-3.5 rounded-none">
                      <div className="w-11 h-11 bg-[#CCFBF1] text-primary-dark flex items-center justify-center shrink-0 rounded-none">
                        <Ambulance className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-semibold text-text-secondary uppercase block leading-none mb-1">
                          Ambulance
                        </span>
                        <div className="text-sm font-bold text-text-primary leading-tight font-mono truncate">
                          {assignedAmbulance.registrationNumber}
                        </div>
                        <span className="text-xs text-text-secondary block leading-tight mt-0.5">
                          {assignedAmbulance.type === "ADVANCED_LIFE_SUPPORT"
                            ? "Advanced Life Support"
                            : "Basic Life Support"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Hospital Block */}
                  {assignedHospital && (
                    <div className="bg-[#FAF5FF]/50 border border-[#E9D5FF] p-3.5 flex items-center gap-3.5 rounded-none">
                      <div className="w-11 h-11 bg-secondary-light text-secondary flex items-center justify-center shrink-0 rounded-none">
                        <Building2 className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-semibold text-text-secondary uppercase block leading-none mb-1">
                          Hospital
                        </span>
                        <div className="text-sm font-bold text-text-primary leading-tight truncate">
                          {assignedHospital.name}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Latest Updates (Incident Timeline, render only when data exists) ── */}
              {timelineUpdates.length > 0 && (
                <div className="pt-1">
                  <h3 className="text-sm font-bold text-text-primary mb-3">
                    Latest Updates
                  </h3>
                  <div className="space-y-3 relative before:absolute before:left-1.25 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-200">
                    {timelineUpdates.map((item, index) => {
                      const isRecent = index < 2;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-xs gap-3 pl-4 relative"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "absolute left-0 w-2.5 h-2.5 rounded-none ring-2 ring-white",
                                isRecent ? "bg-primary" : "bg-text-muted",
                              )}
                              aria-hidden="true"
                            />
                            <span className="font-medium text-text-primary">
                              {item.notes}
                            </span>
                          </div>
                          <span className="text-text-muted font-mono shrink-0">
                            {formatDate(item.createdAt, "hh:mm a")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Cancel Emergency Button (Bottom Right) ── */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setCancelDialogOpen(true)}
                  aria-label="Cancel Emergency"
                  className="relative px-4 py-1.5 border-2 border-destructive text-destructive hover:bg-red-50 text-xs font-semibold rounded-none cursor-pointer transition-colors"
                >
                  {/* Solid red corner notch */}
                  <div
                    className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-destructive pointer-events-none"
                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
                    aria-hidden="true"
                  />
                  <span>Cancel Emergency</span>
                </button>
              </div>
            </div>
          ) : (
            /* ── Empty State when no active emergency ── */
            <div className="mt-4 py-8 text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary-light text-primary flex items-center justify-center rounded-none">
                <Ambulance className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-text-primary">
                  No Active Emergency
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  You currently have no active emergency dispatches. If you or someone
                  nearby requires urgent medical attention, request immediate ambulance dispatch below.
                </p>
              </div>
              <Button
                onClick={() => setRequestModalOpen(true)}
                className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-5 h-10 rounded-none cursor-pointer"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
                }}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Request Emergency
              </Button>
            </div>
          )}
        </section>

        {/* 
          Right Column Wrapper:
          On Desktop: col-span-4 stacked column (Medical Info top, Payment Due bottom).
          On Mobile: uses contents so items reorder: Payment Due (order-2), Medical Info (order-3).
        */}
        <div className="contents lg:flex lg:flex-col lg:gap-6 lg:col-span-4 w-full">
          {/* ── 2. PAYMENT DUE CARD (Rendered ONLY when pending payment exists) ── */}
          {pendingPayment && (
            <section
              aria-label="Payment Due"
              className="order-2 lg:order-2 w-full relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5 sm:p-6"
            >
              <CornerNotch />
              <LabelTab label="PAYMENT DUE" />

              <div className="mt-4 space-y-3">
                <h3 className="text-base font-bold text-text-primary tracking-tight">
                  Trip Invoice
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-text-secondary">
                    <span>Base fare</span>
                    <span className="font-semibold text-text-primary font-mono">
                      {pendingPayment.baseFare} BDT
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-text-secondary">
                    <span>Distance (4 km × 35 BDT)</span>
                    <span className="font-semibold text-text-primary font-mono">
                      {pendingPayment.distanceCharge} BDT
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-text-primary">
                    Total
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-text-primary font-mono">
                    {pendingPayment.totalAmount} BDT
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handlePayNow}
                  aria-label="Pay trip invoice now"
                  className="w-full h-10 mt-2 bg-primary hover:bg-primary-dark active:translate-y-px text-white text-xs font-bold flex items-center justify-center gap-2 rounded-none cursor-pointer shadow-xs"
                >
                  <span>Pay Now</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </section>
          )}

          {/* ── 3. MEDICAL INFO CARD ── */}
          <section
            aria-label="Medical Info"
            className="order-3 lg:order-1 w-full relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5 sm:p-6"
          >
            <CornerNotch />
            <LabelTab label="MEDICAL INFO" />

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="flex justify-between items-center gap-2">
                <span className="text-text-secondary">Blood Group</span>
                <span className="font-bold text-text-primary font-mono">
                  {patientUser.bloodType === "O_NEGATIVE"
                    ? "O-"
                    : patientUser.bloodType === "O_POSITIVE"
                      ? "O+"
                      : patientUser.bloodType || "Not provided"}
                </span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className="text-text-secondary">Emergency Contact</span>
                <span className="font-semibold text-text-primary text-right truncate">
                  {patientUser.emergencyContactName && patientUser.emergencyContactPhone
                    ? `${patientUser.emergencyContactName}, ${patientUser.emergencyContactPhone}`
                    : "Not provided"}
                </span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className="text-text-secondary">Known Conditions</span>
                <span className="font-semibold text-text-primary">
                  {patientUser.knownConditions || "None listed"}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ── 4. THREE STAT CARDS ── */}
      <section
        aria-label="Patient Emergency Statistics"
        className="order-4 grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        {/* Total Requests Card */}
        <div className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5">
          <CornerNotch />
          <span className="text-xs font-semibold text-text-secondary block mb-1">
            Total Requests
          </span>
          <div className="text-3xl sm:text-4xl font-black text-primary-dark font-mono leading-none">
            {totalRequestsCount}
          </div>
        </div>

        {/* Completed Card */}
        <div className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5">
          <CornerNotch />
          <span className="text-xs font-semibold text-text-secondary block mb-1">
            Completed
          </span>
          <div className="text-3xl sm:text-4xl font-black text-primary-dark font-mono leading-none">
            {completedCount}
          </div>
        </div>

        {/* Avg Response Card */}
        <div className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5">
          <CornerNotch />
          <span className="text-xs font-semibold text-text-secondary block mb-1">
            Avg Response
          </span>
          <div className="text-3xl sm:text-4xl font-black text-text-primary font-mono leading-none">
            {avgResponseTimeText}
          </div>
        </div>
      </section>

      {/* ── 5. RECENT EMERGENCIES TABLE CARD ── */}
      <section
        aria-label="Recent Emergencies"
        className="order-5 relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5 sm:p-6"
      >
        <CornerNotch />
        <LabelTab label="RECENT EMERGENCIES" />

        <div className="mt-4 overflow-x-auto -mx-5 sm:mx-0">
          <div className="min-w-155 px-5 sm:px-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-text-primary">
                  <th scope="col" className="py-2.5 pr-4">
                    Incident No.
                  </th>
                  <th scope="col" className="py-2.5 px-4">
                    Type
                  </th>
                  <th scope="col" className="py-2.5 px-4">
                    Priority
                  </th>
                  <th scope="col" className="py-2.5 px-4">
                    Status
                  </th>
                  <th scope="col" className="py-2.5 px-4">
                    Date
                  </th>
                  <th scope="col" className="py-2.5 pl-4 text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentEmergencies.map((em) => (
                  <tr
                    key={em.id}
                    className="hover:bg-primary-light/30 transition-colors"
                  >
                    <td className="py-3 pr-4 font-mono font-bold text-text-primary">
                      {em.incidentNumber}
                    </td>
                    <td className="py-3 px-4 capitalize text-text-secondary font-medium">
                      {em.emergencyType.toLowerCase()}
                    </td>
                    <td className="py-3 px-4">
                      <TablePriorityBadge priority={em.priority} />
                    </td>
                    <td className="py-3 px-4">
                      <TableStatusBadge status={em.status} />
                    </td>
                    <td className="py-3 px-4 text-text-secondary font-mono">
                      {formatDate(em.createdAt, "dd MMM yyyy")}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <Link
                        href={`/dashboard/patient/history?search=${em.incidentNumber}`}
                        className="inline-flex items-center gap-1 border border-slate-300 px-3 py-1 text-xs font-semibold text-text-primary hover:bg-slate-50 transition-colors rounded-none min-h-8 cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Dialog Modal for CreateEmergencyForm ── */}
      <Dialog open={requestModalOpen} onOpenChange={setRequestModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-none border-2 border-primary p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-text-primary">
              Request Emergency Ambulance
            </DialogTitle>
            <DialogDescription className="text-xs text-text-secondary">
              Dispatch urgent critical care life-support units to your exact location coordinates.
            </DialogDescription>
          </DialogHeader>

          <CreateEmergencyForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setRequestModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* ── Dialog Modal for Cancel Emergency Request ── */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-md rounded-none border-2 border-red-500 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Cancel Emergency Request?</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-text-secondary">
              Are you sure you want to cancel incident{" "}
              <strong className="font-mono text-text-primary">
                {activeEmergency?.incidentNumber}
              </strong>
              ? Assigned responder units will be stood down.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="cancel-reason-select" className="font-semibold text-text-primary block">
                Reason for cancellation
              </label>
              <Select
                value={cancelReason}
                onValueChange={(val) => {
                  if (val) setCancelReason(val);
                }}
              >
                <SelectTrigger id="cancel-reason-select" className="w-full text-xs rounded-none border-slate-300">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="Alternative transport arranged">
                    Alternative transport arranged
                  </SelectItem>
                  <SelectItem value="Patient condition stabilized">
                    Patient condition stabilized
                  </SelectItem>
                  <SelectItem value="Accidental dispatch call">
                    Accidental dispatch call
                  </SelectItem>
                  <SelectItem value="Other reason">
                    Other reason
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="cancel-notes" className="font-semibold text-text-primary block">
                Additional Notes (Optional)
              </label>
              <input
                id="cancel-notes"
                type="text"
                placeholder="Brief reason details..."
                value={cancelNotes}
                onChange={(e) => setCancelNotes(e.target.value)}
                className="w-full h-9 px-3 border border-slate-300 text-xs rounded-none focus:outline-hidden focus:border-primary"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              className="text-xs rounded-none min-h-10 cursor-pointer"
            >
              Keep Active Request
            </Button>
            <Button
              onClick={handleConfirmCancel}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-none min-h-10 cursor-pointer"
            >
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
