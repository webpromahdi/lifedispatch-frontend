"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  Ambulance,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  Filter,
  MapPin,
  PhoneCall,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { RecommendationList } from "@/components/dispatch/RecommendationList";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { seedAmbulances } from "@/lib/dummy/ambulances";
import { seedDrivers } from "@/lib/dummy/drivers";
import { seedEmergencies } from "@/lib/dummy/emergencies";
import type { ScoredAmbulanceCandidate } from "@/lib/types/dispatch.types";
import type { EmergencyRequest } from "@/lib/types/emergency.types";
import { EmergencyPriority } from "@/lib/types/enums";
import { calculateHaversineDistance, cn, formatDate } from "@/lib/utils";

// Priority sorting order: P1 > P2 > P3 > P4 > P5 > null
const priorityWeight: Record<string, number> = {
  P1_CRITICAL: 1,
  P2_EMERGENCY: 2,
  P3_URGENT: 3,
  P4_NON_URGENT: 4,
  P5_ROUTINE: 5,
};

function formatTimeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function DispatcherView() {
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>(() => {
    return [...seedEmergencies].sort((a, b) => {
      const wA = a.priority ? priorityWeight[a.priority] ?? 99 : 99;
      const wB = b.priority ? priorityWeight[b.priority] ?? 99 : 99;
      return wA - wB;
    });
  });

  const [expandedEmergencyId, setExpandedEmergencyId] = useState<string | null>(
    "em_001",
  );
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [recommendationIncidentId, setRecommendationIncidentId] = useState<
    string | null
  >(null);

  // Set Priority Dialog State
  const [priorityDialogOpen, setPriorityDialogOpen] = useState(false);
  const [selectedEmergency, setSelectedEmergency] =
    useState<EmergencyRequest | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<EmergencyPriority>(
    EmergencyPriority.P1_CRITICAL,
  );

  // Compute live stats
  const pendingTriageCount = emergencies.filter(
    (e) => e.status === "PENDING" || !e.priority,
  ).length;
  const activeDispatchesCount = emergencies.filter(
    (e) => e.status === "DISPATCHING" || e.status === "ACTIVE_TRIP",
  ).length;
  const availableFleetCount = seedAmbulances.filter(
    (a) => a.status === "AVAILABLE",
  ).length;

  const filteredEmergencies = useMemo(() => {
    return emergencies.filter((em) => {
      const matchesSearch =
        em.incidentNumber.toLowerCase().includes(search.toLowerCase()) ||
        em.callerName.toLowerCase().includes(search.toLowerCase()) ||
        em.locationAddress.toLowerCase().includes(search.toLowerCase()) ||
        em.emergencyType.toLowerCase().includes(search.toLowerCase());

      const matchesPriority =
        priorityFilter === "ALL" || em.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [emergencies, search, priorityFilter]);

  const handleToggleRow = (id: string) => {
    setExpandedEmergencyId((prev) => (prev === id ? null : id));
  };

  const handleOpenPriorityDialog = (
    e: React.MouseEvent,
    em: EmergencyRequest,
  ) => {
    e.stopPropagation();
    setSelectedEmergency(em);
    setSelectedPriority(em.priority || EmergencyPriority.P2_EMERGENCY);
    setPriorityDialogOpen(true);
  };

  const handleSavePriority = () => {
    if (!selectedEmergency) return;

    setEmergencies((prev) =>
      prev.map((item) => {
        if (item.id !== selectedEmergency.id) return item;
        return {
          ...item,
          priority: selectedPriority,
          status: item.status === "PENDING" ? "PRIORITIZED" : item.status,
        };
      }),
    );

    toast.success("Incident Priority Updated", {
      description: `${selectedEmergency.incidentNumber} set to ${selectedPriority.replace(/_/g, " ")}.`,
    });

    setPriorityDialogOpen(false);
    setSelectedEmergency(null);
  };

  const handleToggleRecommendations = (
    e: React.MouseEvent,
    emergencyId: string,
  ) => {
    e.stopPropagation();
    setRecommendationIncidentId((prev) =>
      prev === emergencyId ? null : emergencyId,
    );
  };

  // Generate candidate recommendations for the active emergency
  const activeRecommendationEmergency = emergencies.find(
    (e) => e.id === (recommendationIncidentId || expandedEmergencyId),
  );

  const scoredCandidates: ScoredAmbulanceCandidate[] = useMemo(() => {
    if (!activeRecommendationEmergency) return [];

    return seedAmbulances
      .filter((a) => a.status === "AVAILABLE")
      .slice(0, 3)
      .map((amb, idx) => {
        const dist = calculateHaversineDistance(
          activeRecommendationEmergency.locationLat,
          activeRecommendationEmergency.locationLng,
          amb.baseLocationLat,
          amb.baseLocationLng,
        );
        const score = Math.max(0.72, +(1 - (dist / 25) * 0.4).toFixed(3));
        return {
          ambulance: amb,
          driver: seedDrivers[idx % seedDrivers.length] || null,
          distanceKm: dist,
          score,
          scoreBreakdown: {
            distanceScore: Math.max(0.7, +(1 - dist / 25).toFixed(2)),
            priorityScore: 1.0,
            typeScore:
              amb.type === activeRecommendationEmergency.requiredCapability
                ? 1.0
                : 0.8,
          },
          serviceOverdue: idx === 2,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [activeRecommendationEmergency]);

  const handleDispatchSuccess = (candidate: ScoredAmbulanceCandidate) => {
    if (!activeRecommendationEmergency) return;

    setEmergencies((prev) =>
      prev.map((em) => {
        if (em.id !== activeRecommendationEmergency.id) return em;
        return {
          ...em,
          status: "DISPATCHING",
        };
      }),
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Emergency Dispatch Desk"
        description="Prioritized live triage queue, intelligent unit recommendation engine, and operational telematics."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/dispatcher" },
          { label: "Live Queue" },
        ]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending Triage"
          value={pendingTriageCount}
          icon={PhoneCall}
          trend={{ value: "+2 new", isPositive: false }}
          subtitle="Awaiting priority confirmation"
        />
        <StatCard
          label="Active Dispatches"
          value={activeDispatchesCount}
          icon={AlertCircle}
          trend={{ value: "5 en route", isPositive: true }}
          subtitle="Currently responding units"
        />
        <StatCard
          label="Available Fleet"
          value={availableFleetCount}
          icon={Ambulance}
          trend={{ value: "Ready", isPositive: true }}
          subtitle="Across operational zones"
        />
        <StatCard
          label="Avg Response Time"
          value="6.2 min"
          icon={Clock}
          trend={{ value: "-45s", isPositive: true }}
          subtitle="SLA Target: under 8.0 min"
        />
      </div>

      {/* Queue Search & Priority Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 border border-border rounded-xl shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <Input
            placeholder="Search incident #, caller, address, type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-base md:text-xs h-10 md:h-9"
            aria-label="Search emergency queue"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-text-muted" aria-hidden="true" />
          <Select
            value={priorityFilter}
            onValueChange={(val) => val && setPriorityFilter(val)}
          >
            <SelectTrigger
              className="w-44 text-xs h-9"
              aria-label="Filter queue by priority"
            >
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Priorities</SelectItem>
              <SelectItem value="P1_CRITICAL">P1 Critical</SelectItem>
              <SelectItem value="P2_EMERGENCY">P2 Emergency</SelectItem>
              <SelectItem value="P3_URGENT">P3 Urgent</SelectItem>
              <SelectItem value="P4_NON_URGENT">P4 Non-Urgent</SelectItem>
              <SelectItem value="P5_ROUTINE">P5 Routine</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Grid: Live Queue & Recommendation Drawer / Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <DataTable
            headerSlot={
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-sm text-text-primary">
                  Live Emergency Queue ({filteredEmergencies.length})
                </span>
                <span className="text-xs text-text-muted hidden sm:inline">
                  Click any row to expand details & dispatch recommendations
                </span>
              </div>
            }
          >
            <Table>
              <TableHeader className="bg-background">
                <TableRow>
                  <TableHead scope="col" className="w-10">
                    <span className="sr-only">Expand</span>
                  </TableHead>
                  <TableHead scope="col" className="text-xs font-semibold">
                    Incident #
                  </TableHead>
                  <TableHead scope="col" className="text-xs font-semibold">
                    Type
                  </TableHead>
                  <TableHead scope="col" className="text-xs font-semibold">
                    Priority
                  </TableHead>
                  <TableHead scope="col" className="text-xs font-semibold">
                    Status
                  </TableHead>
                  <TableHead scope="col" className="text-xs font-semibold">
                    Caller
                  </TableHead>
                  <TableHead scope="col" className="text-xs font-semibold">
                    Reported
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmergencies.map((em) => {
                  const isExpanded = expandedEmergencyId === em.id;

                  return (
                    <tbody key={em.id} className="border-b border-border">
                      <TableRow
                        onClick={() => handleToggleRow(em.id)}
                        className={cn(
                          "cursor-pointer transition-colors",
                          isExpanded
                            ? "bg-primary-light/40"
                            : "hover:bg-primary-light/20",
                        )}
                      >
                        <TableCell className="py-3 px-2 text-center text-text-muted">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 inline" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="h-4 w-4 inline" aria-hidden="true" />
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs font-semibold text-text-primary">
                          {em.incidentNumber}
                        </TableCell>
                        <TableCell className="text-xs capitalize text-text-secondary font-medium">
                          {em.emergencyType.toLowerCase()}
                        </TableCell>
                        <TableCell>
                          <PriorityBadge priority={em.priority} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={em.status} />
                        </TableCell>
                        <TableCell className="text-xs text-text-secondary">
                          {em.callerName}
                        </TableCell>
                        <TableCell className="text-xs text-text-muted">
                          {formatTimeAgo(em.createdAt)}
                        </TableCell>
                      </TableRow>

                      {/* Expandable Inline Detail Panel */}
                      {isExpanded && (
                        <TableRow className="bg-background/70 hover:bg-background/70">
                          <TableCell colSpan={7} className="p-4 sm:p-5">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-4"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div className="space-y-2 p-3 bg-surface rounded-lg border border-border">
                                  <div className="flex items-center gap-2 text-text-primary font-semibold">
                                    <ShieldAlert className="h-4 w-4 text-primary" aria-hidden="true" />
                                    <span>Incident Overview</span>
                                  </div>
                                  <p className="text-text-secondary leading-relaxed">
                                    {em.description}
                                  </p>
                                  <div className="flex items-center gap-3 pt-2 text-[11px] text-text-muted">
                                    <span>
                                      Capability:{" "}
                                      <strong className="text-text-primary">
                                        {em.requiredCapability}
                                      </strong>
                                    </span>
                                    <span>•</span>
                                    <span>
                                      SLA Target:{" "}
                                      <strong className="text-text-primary">
                                        {em.slaTargetMinutes || 8} min
                                      </strong>
                                    </span>
                                    {em.isEscalated && (
                                      <>
                                        <span>•</span>
                                        <Badge
                                          variant="destructive"
                                          className="text-[10px] h-5"
                                        >
                                          Escalated
                                        </Badge>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-2 p-3 bg-surface rounded-lg border border-border">
                                  <div className="flex items-center gap-2 text-text-primary font-semibold">
                                    <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                                    <span>Scene Location & Contact</span>
                                  </div>
                                  <p className="text-text-secondary">
                                    {em.locationAddress}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-text-muted">
                                    <span className="flex items-center gap-1 font-mono">
                                      <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                                      {em.locationLat.toFixed(4)},{" "}
                                      {em.locationLng.toFixed(4)}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <User className="h-3.5 w-3.5" aria-hidden="true" />
                                      {em.callerName} ({em.callerPhone})
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Action Row */}
                              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
                                <div className="text-xs text-text-muted">
                                  Reported:{" "}
                                  <span className="text-text-primary font-medium">
                                    {formatDate(em.createdAt)}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) =>
                                      handleOpenPriorityDialog(e, em)
                                    }
                                    className="min-h-[38px] text-xs font-medium cursor-pointer"
                                  >
                                    Set Priority
                                  </Button>

                                  <Button
                                    size="sm"
                                    onClick={(e) =>
                                      handleToggleRecommendations(e, em.id)
                                    }
                                    className="min-h-[38px] bg-primary hover:bg-primary-dark text-white text-xs font-medium cursor-pointer"
                                  >
                                    <Sparkles className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                                    Run Recommendation
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </tbody>
                  );
                })}
              </TableBody>
            </Table>
          </DataTable>
        </div>

        {/* Sidebar: Intelligent Recommendation Candidates for Active Incident */}
        <div className="space-y-4">
          <div className="bg-surface border border-border rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                <h2 className="text-sm font-semibold text-text-primary">
                  Unit Dispatch Recommendations
                </h2>
              </div>
              {activeRecommendationEmergency && (
                <span className="font-mono text-xs font-semibold text-primary bg-primary-light px-2 py-0.5 rounded">
                  {activeRecommendationEmergency.incidentNumber}
                </span>
              )}
            </div>

            {activeRecommendationEmergency ? (
              <>
                <p className="text-xs text-text-secondary">
                  Telemetry candidates scored for{" "}
                  <strong className="text-text-primary capitalize">
                    {activeRecommendationEmergency.emergencyType.toLowerCase()}
                  </strong>{" "}
                  at {activeRecommendationEmergency.locationAddress.split(",")[0]}.
                </p>

                <RecommendationList
                  incidentNumber={activeRecommendationEmergency.incidentNumber}
                  candidates={scoredCandidates}
                  onSelect={handleDispatchSuccess}
                />
              </>
            ) : (
              <div className="p-8 text-center text-xs text-text-muted border border-dashed border-border rounded-lg">
                Select an incident from the queue and click "Run Recommendation"
                to calculate best-fit ambulance units.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Set Priority Dialog */}
      <Dialog open={priorityDialogOpen} onOpenChange={setPriorityDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary-light text-primary">
                <ShieldAlert className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <DialogTitle>Set Triage Priority</DialogTitle>
                <DialogDescription>
                  Update clinical priority for Incident{" "}
                  <span className="font-mono font-semibold text-text-primary">
                    {selectedEmergency?.incidentNumber}
                  </span>
                  .
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <Label htmlFor="priority-select" className="text-xs font-medium">
              Priority Classification
            </Label>
            <Select
              value={selectedPriority}
              onValueChange={(val) =>
                val && setSelectedPriority(val as EmergencyPriority)
              }
            >
              <SelectTrigger id="priority-select" className="w-full text-xs">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="P1_CRITICAL">
                  P1 Critical — Immediate Life Threat (Target: &lt; 8 min)
                </SelectItem>
                <SelectItem value="P2_EMERGENCY">
                  P2 Emergency — Severe Condition (Target: &lt; 12 min)
                </SelectItem>
                <SelectItem value="P3_URGENT">
                  P3 Urgent — Moderate Illness/Injury (Target: &lt; 20 min)
                </SelectItem>
                <SelectItem value="P4_NON_URGENT">
                  P4 Non-Urgent — Routine Transport (Target: &lt; 45 min)
                </SelectItem>
                <SelectItem value="P5_ROUTINE">
                  P5 Routine — Scheduled Clinical Transfer
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="p-2.5 rounded-lg bg-background border border-border text-[11px] text-text-secondary space-y-1">
              <span className="font-medium text-text-primary block">
                Triage Note:
              </span>
              <span>
                Higher priority incidents are dynamically bumped to the top of
                the dispatch queue and assigned closer telemetry weights.
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setPriorityDialogOpen(false)}
              className="text-xs min-h-[40px] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePriority}
              className="bg-primary hover:bg-primary-dark text-white text-xs min-h-[40px] cursor-pointer font-medium"
            >
              Save Priority
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
