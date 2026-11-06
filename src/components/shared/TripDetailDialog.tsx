"use client";

import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  DollarSign,
  FileText,
  Hospital as HospitalIcon,
  MapPin,
  Phone,
  RefreshCw,
  Route,
  Truck,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { PriorityBadge } from "@/components/common/PriorityBadge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTripById } from "@/hooks";
import type { EmergencyPriority } from "@/lib/types/enums";
import type { TripDetail } from "@/lib/types/trip.types";
import { formatDate } from "@/lib/utils";
import { RerouteHospitalDialog } from "./RerouteHospitalDialog";

interface TripDetailDialogProps {
  tripId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allowReroute?: boolean;
}

export function TripDetailDialog({
  tripId,
  open,
  onOpenChange,
  allowReroute = true,
}: TripDetailDialogProps) {
  const [rerouteOpen, setRerouteOpen] = useState(false);

  const {
    data: tripResponse,
    isLoading,
    refetch,
    isRefetching,
  } = useGetTripById(tripId ?? undefined, {
    enabled: Boolean(tripId && open),
  });

  const trip: TripDetail | null = tripResponse?.data ?? null;

  // Telemetry lifecycle milestones
  const milestones = useMemo(() => {
    if (!trip) return [];

    return [
      {
        label: "Mission Dispatched",
        timestamp: trip.dispatch?.acceptedAt || trip.createdAt,
        completed: Boolean(trip.dispatch?.acceptedAt || trip.createdAt),
        description: "Driver accepted emergency assignment and staged unit.",
      },
      {
        label: "Ambulance Departed",
        timestamp: trip.departedAt,
        completed: Boolean(trip.departedAt),
        description: "Ambulance en route to emergency incident scene.",
      },
      {
        label: "Arrived at Scene",
        timestamp: trip.arrivedAtSceneAt,
        completed: Boolean(trip.arrivedAtSceneAt),
        description: "Paramedics on scene evaluating and stabilizing patient.",
      },
      {
        label: "Patient Secured Aboard",
        timestamp: trip.patientPickedUpAt,
        completed: Boolean(trip.patientPickedUpAt),
        description: "Patient loaded into vehicle; en-route triage initiated.",
      },
      {
        label: "Destination Designated",
        timestamp: trip.hospitalSelectedAt,
        completed: Boolean(trip.hospitalSelectedAt || trip.hospitalId),
        description: trip.hospital
          ? `Routing set to ${trip.hospital.name}.`
          : "Receiving trauma facility selected.",
      },
      {
        label: "Arrived at Hospital ER",
        timestamp: trip.arrivedAtHospitalAt,
        completed: Boolean(trip.arrivedAtHospitalAt),
        description: "Vehicle docked at ER trauma bay for clinical handover.",
      },
      {
        label: "Mission Concluded",
        timestamp: trip.completedAt,
        completed: Boolean(trip.completedAt),
        description: "Handover verified, billing finalized, unit released.",
      },
    ];
  }, [trip]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-6 rounded-none border-2 border-primary bg-white shadow-2xl">
          <DialogHeader className="border-b border-border pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-light text-primary rounded-none">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-text-primary flex items-center gap-2">
                    <span>Trip Telemetry Inspector</span>
                    {trip && <StatusBadge status={trip.status} />}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-text-secondary font-mono">
                    Trip ID: {tripId}
                  </DialogDescription>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => refetch()}
                  disabled={isLoading || isRefetching}
                  className="h-7 text-xs px-2.5 rounded-none border-border hover:bg-slate-50 cursor-pointer"
                >
                  <RefreshCw
                    className={`h-3 w-3 mr-1 ${isRefetching ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto space-y-5 pr-1 py-3 text-xs">
            {isLoading ? (
              <div className="space-y-4 py-6">
                <Skeleton className="h-16 w-full rounded-none" />
                <Skeleton className="h-28 w-full rounded-none" />
                <Skeleton className="h-44 w-full rounded-none" />
              </div>
            ) : !trip ? (
              <div className="py-12 text-center text-xs text-text-muted border border-dashed border-border p-6">
                <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <p className="font-semibold text-text-primary">
                  Trip records not found
                </p>
                <p>
                  The requested trip ID could not be loaded from telematics.
                </p>
              </div>
            ) : (
              <>
                {/* ── ROW 1: EMERGENCY INCIDENT SUMMARY BANNER ── */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-none space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-sm text-text-primary">
                        {trip.emergency?.incidentNumber || "INC-2026"}
                      </span>
                      {trip.emergency?.priority && (
                        <PriorityBadge
                          priority={
                            trip.emergency.priority as EmergencyPriority
                          }
                          variant="square"
                        />
                      )}
                      <Badge
                        variant="outline"
                        className="rounded-none text-xs bg-white text-text-secondary border-slate-300 font-semibold"
                      >
                        {trip.emergency?.emergencyType}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5 text-text-muted text-[11px] font-mono">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {formatDate(trip.createdAt, "MMM dd, yyyy hh:mm a")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 text-text-secondary pt-1">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="font-medium text-text-primary">
                      {trip.emergency?.locationAddress}
                    </span>
                  </div>

                  {trip.emergency?.description && (
                    <p className="text-[11px] text-text-muted italic border-l-2 border-primary/40 pl-2">
                      &quot;{trip.emergency.description}&quot;
                    </p>
                  )}
                </div>

                {/* ── ROW 2: PARTICIPANTS (PATIENT, AMBULANCE, DRIVER) ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Patient Card */}
                  <div className="p-3 bg-white border border-border rounded-none space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                      Patient Details
                    </span>
                    <div className="font-bold text-text-primary flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-text-muted" />
                      {trip.patient?.name || "Unknown Patient"}
                    </div>
                    {trip.patient?.phone && (
                      <div className="text-[11px] text-text-secondary flex items-center gap-1.5 font-mono">
                        <Phone className="h-3 w-3 text-text-muted" />
                        {trip.patient.phone}
                      </div>
                    )}
                  </div>

                  {/* Ambulance Unit Card */}
                  <div className="p-3 bg-white border border-border rounded-none space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                      Assigned Vehicle
                    </span>
                    <div className="font-bold text-text-primary flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5 text-primary" />
                      <span>{trip.ambulance?.registrationNumber}</span>
                      <span className="text-[10px] font-normal text-text-muted">
                        ({trip.ambulance?.type})
                      </span>
                    </div>
                    {trip.ambulance?.capabilities && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {trip.ambulance.capabilities.map((c) => (
                          <span
                            key={c}
                            className="text-[9px] px-1 py-0.2 bg-slate-100 text-slate-700 font-mono"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Paramedic Driver Card */}
                  <div className="p-3 bg-white border border-border rounded-none space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                      Paramedic Driver
                    </span>
                    <div className="font-bold text-text-primary">
                      {trip.driver?.user?.name || "Assigned Crew"}
                    </div>
                    <div className="text-[11px] text-text-secondary flex items-center gap-1 font-mono">
                      <span>
                        {trip.driver?.certificationLevel?.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── ROW 3: DESTINATION HOSPITAL ROUTING CARD ── */}
                <div className="p-3.5 bg-white border-2 border-primary/30 rounded-none space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
                      <HospitalIcon className="h-4 w-4 text-primary" />
                      <span>Receiving Medical Center (Hospital)</span>
                    </div>

                    {allowReroute && trip.status === "ACTIVE" && (
                      <Button
                        size="sm"
                        onClick={() => setRerouteOpen(true)}
                        className="h-7 text-xs font-bold px-2.5 rounded-none bg-primary hover:bg-primary-hover text-white cursor-pointer"
                      >
                        Re-Route Facility
                      </Button>
                    )}
                  </div>

                  {trip.hospital ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100">
                      <div>
                        <div className="font-bold text-xs text-text-primary flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                          {trip.hospital.name}
                        </div>
                        <div className="text-[11px] text-text-muted">
                          {trip.hospital.address}
                        </div>
                      </div>
                      {trip.hospital.phone && (
                        <div className="text-[11px] font-mono text-text-secondary flex items-center gap-1">
                          <Phone className="h-3 w-3 text-text-muted" />
                          {trip.hospital.phone}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center justify-between">
                      <span>
                        No receiving facility has been designated yet.
                      </span>
                      {allowReroute && (
                        <button
                          type="button"
                          onClick={() => setRerouteOpen(true)}
                          className="font-bold underline cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
                        >
                          Select Hospital Now
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* ── ROW 4: LIFECYCLE TELEMETRY TIMELINE ── */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      Trip Lifecycle Telemetry Timeline
                    </span>
                    {trip.distanceKm !== null && (
                      <span className="font-mono text-xs font-semibold text-primary flex items-center gap-1">
                        <Route className="h-3.5 w-3.5" />
                        {trip.distanceKm} km logged
                      </span>
                    )}
                  </div>

                  <div className="border border-border divide-y divide-slate-100 bg-white">
                    {milestones.map((m, idx) => (
                      <div
                        key={m.label}
                        className={`p-2.5 flex items-start gap-3 transition-colors ${
                          m.completed ? "bg-slate-50/60" : "bg-white opacity-60"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {m.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Circle className="h-4 w-4 text-slate-300" />
                          )}
                        </div>

                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-xs font-bold ${
                                m.completed
                                  ? "text-text-primary"
                                  : "text-text-muted"
                              }`}
                            >
                              0{idx + 1}. {m.label}
                            </span>
                            <span className="font-mono text-[11px] text-text-secondary">
                              {m.timestamp
                                ? formatDate(m.timestamp, "hh:mm:ss a")
                                : "Pending"}
                            </span>
                          </div>
                          <p className="text-[11px] text-text-muted">
                            {m.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── ROW 5: BILLING & PAYMENT SUMMARY (IF COMPLETED) ── */}
                {trip.payment && (
                  <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-none space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-900 flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-700" />
                        Billing & Payment Telemetry
                      </span>
                      <Badge
                        variant="outline"
                        className="rounded-none text-[10px] font-bold border-emerald-300 bg-emerald-100 text-emerald-800"
                      >
                        {trip.payment.paymentStatus}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-mono text-text-secondary">
                        Invoice: {trip.payment.invoiceNumber}
                      </span>
                      <span className="font-mono font-bold text-emerald-900 text-sm">
                        {trip.payment.totalAmount} {trip.payment.currency}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter className="pt-3 border-t border-border flex items-center justify-between">
            <span className="text-[11px] text-text-muted font-mono">
              LifeDispatch Telematics Engine • Auto-synced
            </span>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs rounded-none border-border"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Embedded Destination Hospital Reroute Modal */}
      {trip && (
        <RerouteHospitalDialog
          tripId={trip.id}
          currentHospitalId={trip.hospital?.id || trip.hospitalId}
          currentHospitalName={trip.hospital?.name}
          open={rerouteOpen}
          onOpenChange={setRerouteOpen}
          onSuccess={() => refetch()}
        />
      )}
    </>
  );
}
