"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  MapPin,
  Navigation,
  PhoneCall,
  Power,
  Radio,
  Shield,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DispatchCard } from "@/components/dispatch/DispatchCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { seedAmbulances } from "@/lib/dummy/ambulances";
import { seedDispatches } from "@/lib/dummy/dispatches";
import { seedDrivers } from "@/lib/dummy/drivers";
import { seedEmergencies } from "@/lib/dummy/emergencies";
import { seedHospitals } from "@/lib/dummy/hospitals";
import { seedTrips } from "@/lib/dummy/trips";
import { cn, formatDate } from "@/lib/utils";

interface MilestoneStep {
  id: string;
  label: string;
  description: string;
  timeEstimate: string;
}

const MILESTONES: MilestoneStep[] = [
  {
    id: "DEPARTED",
    label: "Departed Base",
    description: "Ambulance en route to emergency scene",
    timeEstimate: "14:17",
  },
  {
    id: "ARRIVED_AT_SCENE",
    label: "Arrived at Scene",
    description: "Triage & rapid trauma assessment",
    timeEstimate: "14:24",
  },
  {
    id: "PATIENT_PICKED_UP",
    label: "Patient Secured",
    description: "Patient placed on stretcher with clinical monitoring",
    timeEstimate: "14:32",
  },
  {
    id: "HOSPITAL_SELECTED",
    label: "Hospital Selected",
    description: "United Hospital Dhaka notified & bed reserved",
    timeEstimate: "14:33",
  },
  {
    id: "ARRIVED_AT_HOSPITAL",
    label: "Arrived at Hospital",
    description: "Arrived at ER trauma bay",
    timeEstimate: "14:48",
  },
  {
    id: "COMPLETED",
    label: "Handover Complete",
    description: "Transfer to emergency medicine physicians complete",
    timeEstimate: "15:00",
  },
];

export function DriverView() {
  const currentDriver = seedDrivers[0];
  const assignedAmbulance = seedAmbulances[0];
  const sampleTrip = seedTrips[0];
  const sampleHospital = seedHospitals[1]; // United Hospital

  // Driver Shift Toggle State
  const [isOnShift, setIsOnShift] = useState<boolean>(currentDriver.isOnShift);

  // Active Trip Milestones State
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(3); // starts at Hospital Selected
  const [isTripActive, setIsTripActive] = useState<boolean>(true);

  // Pending Dispatches State (hardcoded 1-2 dispatches from seedDispatches)
  const [pendingDispatches, setPendingDispatches] = useState(() => [
    {
      dispatch: seedDispatches[1], // PENDING_ACCEPTANCE with countdown
      emergency: seedEmergencies[1],
      ambulance: seedAmbulances[1],
    },
  ]);

  const handleToggleShift = () => {
    const nextState = !isOnShift;
    setIsOnShift(nextState);

    if (nextState) {
      toast.success("Shift Started — ON DUTY", {
        description: "You are now active and receiving emergency dispatch alerts.",
      });
    } else {
      toast.info("Shift Ended — OFF DUTY", {
        description: "You have logged off duty. Fleet telematics set to standby.",
      });
    }
  };

  const handleAdvanceStep = () => {
    if (currentStepIndex < MILESTONES.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      toast.success(`Milestone Logged: ${MILESTONES[nextIndex].label}`, {
        description: MILESTONES[nextIndex].description,
      });
    } else {
      // Completing the trip
      handleCompleteTrip();
    }
  };

  const handleCompleteTrip = () => {
    setIsTripActive(false);
    toast.success("Trip Successfully Completed!", {
      description: "Mission recorded. Unit returned to Available status.",
    });
  };

  const handleDismissDispatch = (dispatchId: string) => {
    setPendingDispatches((prev) =>
      prev.filter((p) => p.dispatch.id !== dispatchId),
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paramedic Driver Console"
        description="Active mobile dispatch notifications, mission milestones, and GPS route telemetry."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/driver" },
          { label: "Driver Console" },
        ]}
        action={
          <div className="flex items-center gap-3 bg-surface p-1.5 px-3 rounded-xl border border-border shadow-2xs">
            <div className="text-right">
              <div className="text-xs font-semibold text-text-primary">
                Duty Status
              </div>
              <div className="text-[11px] text-text-muted">
                {isOnShift ? "Active Dispatch" : "Off Duty Standby"}
              </div>
            </div>

            <Button
              size="sm"
              onClick={handleToggleShift}
              aria-label={`Toggle shift duty. Currently ${isOnShift ? "On Duty" : "Off Duty"}`}
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

      {/* KPI Telematics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Assigned Ambulance"
          value={assignedAmbulance.registrationNumber}
          icon={Truck}
          subtitle="Advanced Life Support (ALS)"
        />
        <StatCard
          label="Total Trips Completed"
          value={currentDriver.totalTripsCompleted}
          icon={Award}
          trend={{ value: "+4 this week", isPositive: true }}
          subtitle="100% SLA adherence rate"
        />
        <StatCard
          label="Shift Status"
          value={isOnShift ? "On Duty" : "Off Duty"}
          icon={CheckCircle2}
          trend={{
            value: isOnShift ? "Active Dispatch" : "Standby",
            isPositive: isOnShift,
          }}
          subtitle={isOnShift ? "08:00 AM — 08:00 PM" : "Shift Inactive"}
        />
        <StatCard
          label="Home Base Station"
          value="Banani Station"
          icon={MapPin}
          subtitle="Zone 4 North Dhaka"
        />
      </div>

      {/* Main Content Layout: Pending Dispatches & Active Trip Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Pending Incoming Dispatches */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-primary animate-pulse" aria-hidden="true" />
              <h2 className="text-sm font-bold text-text-primary">
                Incoming Dispatch Alerts
              </h2>
            </div>
            <span className="text-xs text-text-muted">
              {pendingDispatches.length} pending response
            </span>
          </div>

          {pendingDispatches.length === 0 ? (
            <div className="p-8 text-center text-xs text-text-muted bg-surface border border-dashed border-border rounded-xl">
              <CheckCircle2 className="h-8 w-8 text-status mx-auto mb-2" aria-hidden="true" />
              <p className="font-medium text-text-primary">
                No Pending Dispatch Alerts
              </p>
              <p className="text-text-secondary mt-1">
                You are currently queued for upcoming emergency dispatches in
                Zone 4.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingDispatches.map(({ dispatch, emergency, ambulance }) => (
                <DispatchCard
                  key={dispatch.id}
                  dispatch={dispatch}
                  emergency={emergency}
                  ambulance={ambulance}
                  onAccept={() => handleDismissDispatch(dispatch.id)}
                  onReject={() => handleDismissDispatch(dispatch.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Active Trip View with Milestone Stepper */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" aria-hidden="true" />
              <h2 className="text-sm font-bold text-text-primary">
                Active Mission Telematics
              </h2>
            </div>
            {isTripActive && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary border border-primary/20">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                Trip in Progress
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isTripActive ? (
              <motion.div
                key="active-trip-panel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                transition={{ duration: 0.3 }}
                className="p-5 rounded-xl bg-surface border border-border shadow-xs space-y-5"
              >
                {/* Trip Header Context */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
                  <div>
                    <span className="font-mono text-xs text-text-muted">
                      Mission Ref: {sampleTrip.id}
                    </span>
                    <h3 className="font-bold text-sm text-text-primary">
                      Cardiac Emergency Response
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="font-mono text-xs font-semibold bg-muted"
                    >
                      {sampleTrip.distanceKm} km
                    </Badge>
                    <PriorityBadge priority="P1_CRITICAL" />
                  </div>
                </div>

                {/* Destination & Location Context */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-background border border-border text-xs">
                  <div className="space-y-1">
                    <span className="text-text-muted flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      Pickup Scene:
                    </span>
                    <span className="font-medium text-text-primary block truncate">
                      House 14, Road 7, Sector 3, Uttara
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-text-muted flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
                      Destination Hospital:
                    </span>
                    <span className="font-medium text-text-primary block truncate">
                      {sampleHospital.name} (ER Trauma Bay)
                    </span>
                  </div>
                </div>

                {/* Milestone Stepper (Accessibility: role="list") */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-text-primary block">
                    Mission Milestones Progress
                  </span>

                  <ol role="list" className="space-y-2.5">
                    {MILESTONES.map((milestone, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;

                      return (
                        <li
                          key={milestone.id}
                          role="listitem"
                          className={cn(
                            "flex items-start gap-3 p-2.5 rounded-lg border transition-colors",
                            isCurrent
                              ? "bg-primary-light/50 border-primary/40 ring-1 ring-primary/20"
                              : isCompleted
                                ? "bg-background border-border text-text-secondary"
                                : "bg-muted/30 border-transparent text-text-muted opacity-60",
                          )}
                        >
                          <div
                            className={cn(
                              "h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5 transition-colors",
                              isCompleted
                                ? "bg-status text-white"
                                : "bg-muted text-text-muted border border-border",
                            )}
                          >
                            {isCompleted ? (
                              <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={cn(
                                  "font-medium text-xs",
                                  isCurrent
                                    ? "text-primary font-bold"
                                    : isCompleted
                                      ? "text-text-primary"
                                      : "text-text-muted",
                                )}
                              >
                                {milestone.label}
                              </span>
                              <span className="font-mono text-[11px] text-text-muted">
                                {isCompleted ? milestone.timeEstimate : "—"}
                              </span>
                            </div>
                            <p className="text-[11px] text-text-secondary mt-0.5 line-clamp-1">
                              {milestone.description}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>

                {/* Advance Milestone or Complete Trip Action Button */}
                <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
                  <div className="text-xs text-text-muted">
                    Step {currentStepIndex + 1} of {MILESTONES.length}
                  </div>

                  <Button
                    onClick={handleAdvanceStep}
                    aria-label={
                      currentStepIndex === MILESTONES.length - 1
                        ? "Complete trip and finalize patient handover"
                        : `Mark milestone complete: ${MILESTONES[currentStepIndex + 1]?.label}`
                    }
                    className={cn(
                      "min-h-[44px] px-5 font-semibold text-xs cursor-pointer gap-1.5 transition-colors",
                      currentStepIndex === MILESTONES.length - 1
                        ? "bg-status hover:bg-status/90 text-white"
                        : "bg-primary hover:bg-primary-dark text-white",
                    )}
                  >
                    {currentStepIndex === MILESTONES.length - 1 ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-1" aria-hidden="true" />
                        Complete Trip
                      </>
                    ) : (
                      <>
                        <span>Mark Step Done:</span>
                        <strong>
                          {MILESTONES[currentStepIndex + 1]?.label}
                        </strong>
                        <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="trip-completed-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-xl bg-status-bg border border-status/30 text-center space-y-3"
              >
                <div className="h-12 w-12 rounded-full bg-status/10 flex items-center justify-center text-status mx-auto">
                  <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-sm text-text-primary">
                  Trip Completed & Patient Handed Over
                </h3>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  Trip {sampleTrip.id} has successfully concluded. Clinical handover
                  telematics have been saved to United Hospital and central operations.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCurrentStepIndex(0);
                    setIsTripActive(true);
                  }}
                  className="text-xs min-h-[38px] border-status/30 text-status hover:bg-status-bg cursor-pointer"
                >
                  Simulate New Active Trip
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
