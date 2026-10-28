"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  formatEnumTitle,
  formatTime,
} from "@/components/shared/AdminDashboardSections";
import {
  CornerNotch,
  LabelTab,
} from "@/components/shared/DashboardUIPrimitives";
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
import {
  useCreateDispatch,
  useGetAmbulances,
  useGetEmergencies,
  useRecommendAmbulances,
  useUpdateEmergencyPriority,
} from "@/hooks";
import { seedHospitals } from "@/lib/dummy/hospitals";
import type { ScoredAmbulanceCandidate } from "@/lib/types/dispatch.types";
import type { EmergencyRequest } from "@/lib/types/emergency.types";
import {
  AmbulanceStatus,
  EmergencyPriority,
  EmergencyStatus,
} from "@/lib/types/enums";
import type { Hospital } from "@/lib/types/hospital.types";

export function DispatcherView() {
  // Live polling for emergency queue every 10 seconds
  const { data: emergenciesResponse } = useGetEmergencies(
    { limit: 100 },
    { refetchInterval: 10_000 },
  );

  const emergencies = useMemo(() => {
    return emergenciesResponse?.data ?? [];
  }, [emergenciesResponse]);

  // Live polling for ambulance fleet every 10 seconds
  const { data: ambulancesResponse } = useGetAmbulances(undefined, {
    refetchInterval: 10_000,
  });

  const ambulances = useMemo(() => {
    return ambulancesResponse?.data ?? [];
  }, [ambulancesResponse]);
  const [hospitals] = useState<Hospital[]>(seedHospitals);

  // Set Priority Dialog State
  const [priorityDialogOpen, setPriorityDialogOpen] = useState(false);
  const [selectedEmergencyForPriority, setSelectedEmergencyForPriority] =
    useState<EmergencyRequest | null>(null);
  const [pendingPriority, setPendingPriority] = useState<EmergencyPriority>(
    EmergencyPriority.P1_CRITICAL,
  );
  const [priorityError, setPriorityError] = useState<string | null>(null);

  // Dispatch Dialog State
  const [dispatchDialogOpen, setDispatchDialogOpen] = useState(false);
  const [selectedEmergencyForDispatch, setSelectedEmergencyForDispatch] =
    useState<EmergencyRequest | null>(null);
  const [candidates, setCandidates] = useState<ScoredAmbulanceCandidate[]>([]);
  const [dispatchError, setDispatchError] = useState<string | null>(null);

  // Mutations
  const { mutate: updatePriorityMutation, isPending: isUpdatingPriority } =
    useUpdateEmergencyPriority();
  const { mutate: getRecommendations, isPending: isLoadingRecommendations } =
    useRecommendAmbulances();
  const { mutate: createDispatchMutation, isPending: isAssigning } =
    useCreateDispatch();

  // Compute live queue counts
  const needsPriorityCount = useMemo(() => {
    return emergencies.filter((e) => e.status === EmergencyStatus.PENDING)
      .length;
  }, [emergencies]);

  const awaitingDispatchCount = useMemo(() => {
    return emergencies.filter(
      (e) =>
        e.status === EmergencyStatus.PRIORITIZED ||
        e.status === EmergencyStatus.DISPATCHING,
    ).length;
  }, [emergencies]);

  const activeTripsCount = useMemo(() => {
    return emergencies.filter((e) => e.status === EmergencyStatus.ACTIVE_TRIP)
      .length;
  }, [emergencies]);

  const availableAmbulancesCount = useMemo(() => {
    return ambulances.filter((a) => a.status === AmbulanceStatus.AVAILABLE)
      .length;
  }, [ambulances]);

  // Emergency Queue list: PENDING, PRIORITIZED, DISPATCHING, REASSIGNMENT_REQUIRED
  // Sort: priority P1 first, unset priority next to top of its group, then oldest first
  const queueEmergencies = useMemo(() => {
    const validStatuses: EmergencyStatus[] = [
      EmergencyStatus.PENDING,
      EmergencyStatus.PRIORITIZED,
      EmergencyStatus.DISPATCHING,
      EmergencyStatus.REASSIGNMENT_REQUIRED,
    ];

    const getRank = (priority: EmergencyPriority | null | undefined) => {
      if (priority === EmergencyPriority.P1_CRITICAL) return 1;
      if (!priority) return 2;
      if (priority === EmergencyPriority.P2_EMERGENCY) return 3;
      if (priority === EmergencyPriority.P3_URGENT) return 4;
      if (priority === EmergencyPriority.P4_NON_URGENT) return 5;
      if (priority === EmergencyPriority.P5_ROUTINE) return 6;
      return 7;
    };

    return emergencies
      .filter((e) => validStatuses.includes(e.status))
      .sort((a, b) => {
        const rankDiff = getRank(a.priority) - getRank(b.priority);
        if (rankDiff !== 0) return rankDiff;
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
  }, [emergencies]);

  // Available Ambulances list: Up to 5 units
  const availableAmbulancesList = useMemo(() => {
    return ambulances
      .filter((a) => a.status === AmbulanceStatus.AVAILABLE)
      .slice(0, 5);
  }, [ambulances]);

  // Hospitals list: Up to 5 hospitals
  const hospitalList = useMemo(() => {
    return hospitals.slice(0, 5);
  }, [hospitals]);

  // Handler: Open Set Priority Dialog
  const handleOpenSetPriority = (emergency: EmergencyRequest) => {
    setSelectedEmergencyForPriority(emergency);
    setPendingPriority(emergency.priority || EmergencyPriority.P1_CRITICAL);
    setPriorityError(null);
    setPriorityDialogOpen(true);
  };

  // Handler: Save Priority
  const handleSavePriority = () => {
    if (!selectedEmergencyForPriority) return;

    updatePriorityMutation(
      { id: selectedEmergencyForPriority.id, priority: pendingPriority },
      {
        onSuccess: () => {
          toast.success(
            `Priority set to ${pendingPriority.split("_")[0]} for ${selectedEmergencyForPriority.incidentNumber}`,
          );
          setPriorityDialogOpen(false);
          setSelectedEmergencyForPriority(null);
        },
        onError: (err) => {
          setPriorityError(
            err instanceof Error
              ? err.message
              : "Failed to update priority. Please try again.",
          );
        },
      },
    );
  };

  // Handler: Open Dispatch Dialog & Load Candidates from Backend
  const handleOpenDispatch = (emergency: EmergencyRequest) => {
    setSelectedEmergencyForDispatch(emergency);
    setDispatchError(null);
    setCandidates([]);
    setDispatchDialogOpen(true);

    getRecommendations(emergency.id, {
      onSuccess: (res) => {
        setCandidates(res.data ?? []);
      },
      onError: (err) => {
        setDispatchError(
          err instanceof Error
            ? err.message
            : "Failed to load ambulance recommendations.",
        );
      },
    });
  };

  // Handler: Assign Dispatch via Backend
  const handleAssignDispatch = (candidate: ScoredAmbulanceCandidate) => {
    if (!selectedEmergencyForDispatch) return;

    setDispatchError(null);

    createDispatchMutation(
      {
        emergencyId: selectedEmergencyForDispatch.id,
        ambulanceId: candidate.ambulanceId,
        dispatchScore: candidate.score,
      },
      {
        onSuccess: (res) => {
          if (res.data?.serviceOverdueWarning || candidate.serviceOverdue) {
            toast.warning("Service Overdue Notice", {
              description: `Vehicle ${candidate.registrationNumber} is overdue for scheduled maintenance.`,
            });
          }

          toast.success(
            `Unit ${candidate.registrationNumber} dispatched to ${selectedEmergencyForDispatch.incidentNumber}`,
          );

          setDispatchDialogOpen(false);
          setSelectedEmergencyForDispatch(null);
        },
        onError: (err) => {
          setDispatchError(
            err instanceof Error
              ? err.message
              : "Failed to assign ambulance to this emergency.",
          );
        },
      },
    );
  };

  return (
    <div className="space-y-6 flex flex-col">
      {/* ── ROW 1: DISPATCH QUEUE STATS CARD (Full Width) ── */}
      <section
        aria-label="Dispatch Queue Overview"
        className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5"
      >
        <CornerNotch />
        <LabelTab label="DISPATCH QUEUE" />

        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          {/* Needs Priority (PENDING) - Amber */}
          <div className="p-3 sm:px-4 sm:py-2">
            <span className="text-xs font-semibold text-text-secondary block mb-1">
              Needs Priority
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#D97706] font-mono leading-none">
              {needsPriorityCount}
            </div>
          </div>

          {/* Awaiting Dispatch (PRIORITIZED + DISPATCHING) */}
          <div className="p-3 sm:px-4 sm:py-2">
            <span className="text-xs font-semibold text-text-secondary block mb-1">
              Awaiting Dispatch
            </span>
            <div className="text-3xl sm:text-4xl font-black text-text-primary font-mono leading-none">
              {awaitingDispatchCount}
            </div>
          </div>

          {/* Active Trips (ACTIVE_TRIP) - Teal */}
          <div className="p-3 sm:px-4 sm:py-2">
            <span className="text-xs font-semibold text-text-secondary block mb-1">
              Active Trips
            </span>
            <div className="text-3xl sm:text-4xl font-black text-primary-dark font-mono leading-none">
              {activeTripsCount}
            </div>
          </div>

          {/* Available Ambulances - Teal */}
          <div className="p-3 sm:px-4 sm:py-2">
            <span className="text-xs font-semibold text-text-secondary block mb-1">
              Available Ambulances
            </span>
            <div className="text-3xl sm:text-4xl font-black text-primary-dark font-mono leading-none">
              {availableAmbulancesCount}
            </div>
          </div>
        </div>
      </section>

      {/* ── ROW 2: TWO COLUMNS (Left Wide: Emergency Queue, Right Narrow: Available Ambulances & Hospital Status) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: EMERGENCY QUEUE TABLE */}
        <div className="lg:col-span-8 w-full">
          <section
            aria-label="Emergency Queue"
            className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5 sm:p-6"
          >
            <CornerNotch />
            <LabelTab label="EMERGENCY QUEUE" />

            <div className="mt-4 overflow-x-auto -mx-5 sm:mx-0">
              <div className="min-w-170 px-5 sm:px-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-text-primary">
                      <th scope="col" className="py-2.5 pr-4">
                        Incident No.
                      </th>
                      <th scope="col" className="py-2.5 px-3">
                        Type
                      </th>
                      <th scope="col" className="py-2.5 px-3">
                        Priority
                      </th>
                      <th scope="col" className="py-2.5 px-3">
                        Status
                      </th>
                      <th scope="col" className="py-2.5 px-3">
                        Location
                      </th>
                      <th scope="col" className="py-2.5 px-3">
                        Created
                      </th>
                      <th scope="col" className="py-2.5 pl-3 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {queueEmergencies.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-8 text-center text-text-muted"
                        >
                          No active incidents waiting in dispatch queue.
                        </td>
                      </tr>
                    ) : (
                      queueEmergencies.map((em) => {
                        const canDispatch =
                          em.status === EmergencyStatus.PRIORITIZED ||
                          em.status === EmergencyStatus.DISPATCHING ||
                          em.status === EmergencyStatus.REASSIGNMENT_REQUIRED;

                        return (
                          <tr
                            key={em.id}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="py-3 pr-4 font-mono font-bold text-text-primary">
                              {em.incidentNumber}
                            </td>
                            <td className="py-3 px-3 font-medium text-text-primary">
                              {formatEnumTitle(em.emergencyType)}
                            </td>
                            <td className="py-3 px-3">
                              <PriorityBadge
                                priority={em.priority}
                                variant="square"
                              />
                            </td>
                            <td className="py-3 px-3">
                              <StatusBadge
                                status={em.status}
                                variant="square"
                              />
                            </td>
                            <td className="py-3 px-3 text-text-secondary truncate max-w-37.5">
                              {em.locationAddress}
                            </td>
                            <td className="py-3 px-3 text-text-secondary whitespace-nowrap">
                              {formatTime(em.createdAt)}
                            </td>
                            <td className="py-3 pl-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleOpenSetPriority(em)}
                                  className="border border-border text-text-primary hover:bg-slate-100 px-2.5 py-1 text-xs font-semibold rounded-none min-h-8 cursor-pointer"
                                >
                                  Set Priority
                                </button>
                                {canDispatch && (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDispatch(em)}
                                    className="bg-primary hover:bg-primary-dark text-white px-2.5 py-1 text-xs font-bold rounded-none min-h-8 cursor-pointer"
                                  >
                                    Dispatch
                                  </button>
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
          </section>
        </div>

        {/* Right Column: AVAILABLE AMBULANCES & HOSPITAL STATUS */}
        <div className="lg:col-span-4 w-full flex flex-col gap-6">
          {/* Card: AVAILABLE AMBULANCES */}
          <section
            aria-label="Available Ambulances"
            className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5"
          >
            <CornerNotch />
            <LabelTab label="AVAILABLE AMBULANCES" />

            <div className="mt-4 divide-y divide-slate-100 text-xs">
              {availableAmbulancesList.length === 0 ? (
                <div className="py-6 text-center text-text-muted">
                  No ambulances currently available.
                </div>
              ) : (
                availableAmbulancesList.map((amb) => {
                  const isOverdue = Boolean(
                    amb.nextServiceDue &&
                      new Date(amb.nextServiceDue).getTime() < Date.now(),
                  );

                  return (
                    <div
                      key={amb.id}
                      className="py-2.5 flex items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-mono font-bold text-text-primary block">
                          {amb.registrationNumber}
                        </span>
                        <span className="text-[11px] text-text-secondary">
                          {amb.type}
                        </span>
                      </div>
                      <div>
                        {isOverdue && (
                          <span className="bg-amber-100 text-amber-800 border border-amber-300 rounded-none text-[10px] px-1.5 py-0.5 font-bold">
                            Service overdue
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Card: HOSPITAL STATUS */}
          <section
            aria-label="Hospital Status"
            className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5"
          >
            <CornerNotch />
            <LabelTab label="HOSPITAL STATUS" />

            <div className="mt-4 divide-y divide-slate-100 text-xs">
              {hospitalList.length === 0 ? (
                <div className="py-6 text-center text-text-muted">
                  No hospitals recorded.
                </div>
              ) : (
                hospitalList.map((hosp) => (
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
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      {/* ── SET PRIORITY DIALOG ── */}
      <Dialog open={priorityDialogOpen} onOpenChange={setPriorityDialogOpen}>
        <DialogContent className="rounded-none border-2 border-primary bg-white sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-text-primary">
              Set Priority
            </DialogTitle>
            <DialogDescription className="text-xs text-text-secondary">
              Update incident priority for{" "}
              <span className="font-mono font-bold text-text-primary">
                {selectedEmergencyForPriority?.incidentNumber}
              </span>
            </DialogDescription>
          </DialogHeader>

          {priorityError && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {priorityError}
            </div>
          )}

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label
                htmlFor="priority-level-select"
                className="text-xs font-bold text-text-primary block"
              >
                Triage Priority Level
              </label>
              <Select
                value={pendingPriority}
                onValueChange={(val) =>
                  setPendingPriority(val as EmergencyPriority)
                }
              >
                <SelectTrigger
                  id="priority-level-select"
                  className="rounded-none border-2 border-border text-xs min-h-10 focus:ring-0"
                >
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-2 border-primary bg-white">
                  <SelectItem value={EmergencyPriority.P1_CRITICAL}>
                    P1 - Critical (Immediate Life Threat)
                  </SelectItem>
                  <SelectItem value={EmergencyPriority.P2_EMERGENCY}>
                    P2 - Emergency (10 min SLA)
                  </SelectItem>
                  <SelectItem value={EmergencyPriority.P3_URGENT}>
                    P3 - Urgent (30 min SLA)
                  </SelectItem>
                  <SelectItem value={EmergencyPriority.P4_NON_URGENT}>
                    P4 - Non-Urgent (60 min SLA)
                  </SelectItem>
                  <SelectItem value={EmergencyPriority.P5_ROUTINE}>
                    P5 - Routine (120 min SLA)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={isUpdatingPriority}
              onClick={() => setPriorityDialogOpen(false)}
              className="rounded-none border-border text-xs min-h-9.5"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isUpdatingPriority}
              onClick={handleSavePriority}
              className="rounded-none bg-primary hover:bg-primary-dark text-white text-xs font-bold min-h-9.5"
            >
              {isUpdatingPriority ? "Saving..." : "Save Priority"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── DISPATCH UNIT RECOMMENDATIONS DIALOG ── */}
      <Dialog open={dispatchDialogOpen} onOpenChange={setDispatchDialogOpen}>
        <DialogContent className="rounded-none border-2 border-primary bg-white sm:max-w-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-text-primary">
              Dispatch Recommended Unit
            </DialogTitle>
            <DialogDescription className="text-xs text-text-secondary">
              Unit candidates for{" "}
              <span className="font-mono font-bold text-text-primary">
                {selectedEmergencyForDispatch?.incidentNumber}
              </span>{" "}
              (
              {formatEnumTitle(
                selectedEmergencyForDispatch?.emergencyType || "",
              )}
              )
            </DialogDescription>
          </DialogHeader>

          {dispatchError && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {dispatchError}
            </div>
          )}

          <div className="space-y-3 py-2 max-h-96 overflow-y-auto">
            {isLoadingRecommendations ? (
              <div className="py-8 text-center text-text-muted text-xs flex flex-col items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                <span>Computing optimal ambulance candidates & routes...</span>
              </div>
            ) : candidates.length === 0 ? (
              <div className="py-6 text-center text-text-muted text-xs">
                No eligible ambulances available for this emergency capability.
              </div>
            ) : (
              candidates.map((cand) => (
                <div
                  key={cand.ambulanceId}
                  className="p-3 border border-border bg-slate-50 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-text-primary text-sm">
                        {cand.registrationNumber}
                      </span>
                      <span className="text-xs font-semibold text-text-secondary">
                        {cand.type}
                      </span>
                      <span className="text-xs text-primary-dark font-bold">
                        Score:{" "}
                        {cand.score <= 1
                          ? `${Math.round(cand.score * 100)}%`
                          : `${cand.score}%`}
                      </span>
                    </div>

                    <div className="text-xs text-text-secondary">
                      Distance: {cand.distanceKm} km
                      {cand.driverName && (
                        <span className="ml-2 font-medium text-text-primary">
                          · Driver: {cand.driverName}
                        </span>
                      )}
                    </div>

                    {cand.serviceOverdue && (
                      <div className="text-[11px] text-amber-700 font-semibold">
                        Service overdue
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isAssigning}
                    onClick={() => handleAssignDispatch(cand)}
                    className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-3.5 py-1.5 text-xs font-bold rounded-none min-h-9 cursor-pointer"
                  >
                    {isAssigning ? "Assigning..." : "Assign"}
                  </button>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isAssigning}
              onClick={() => setDispatchDialogOpen(false)}
              className="rounded-none border-border text-xs min-h-9.5"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
