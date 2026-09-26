"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Navigation,
  Send,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ScoredAmbulanceCandidate } from "@/lib/types/dispatch.types";
import { cn } from "@/lib/utils";

export interface RecommendationListProps {
  candidates: ScoredAmbulanceCandidate[];
  onSelect?: (candidate: ScoredAmbulanceCandidate) => void;
  selectedId?: string | null;
  className?: string;
  incidentNumber?: string;
}

export function RecommendationList({
  candidates,
  onSelect,
  selectedId,
  className,
  incidentNumber = "INC-2026-LIVE",
}: RecommendationListProps) {
  const [candidateList, setCandidateList] =
    useState<ScoredAmbulanceCandidate[]>(candidates);
  const [selectedCandidate, setSelectedCandidate] =
    useState<ScoredAmbulanceCandidate | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

  const handleOpenConfirm = (candidate: ScoredAmbulanceCandidate) => {
    setSelectedCandidate(candidate);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDispatch = () => {
    if (!selectedCandidate) return;

    const cand = selectedCandidate;
    setConfirmDialogOpen(false);

    // Animates card away by filtering out from local state
    setCandidateList((prev) =>
      prev.filter((c) => c.ambulance.id !== cand.ambulance.id),
    );

    toast.success(`Unit ${cand.ambulance.registrationNumber} Dispatched!`, {
      description: `Assigned to ${incidentNumber}. Estimated arrival: ${Math.round(cand.distanceKm * 2.5)} min.`,
    });

    if (onSelect) onSelect(cand);
    setSelectedCandidate(null);
  };

  if (!candidateList || candidateList.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-text-muted bg-surface border border-dashed border-border rounded-xl">
        No candidate ambulances available in the current dispatch queue.
      </div>
    );
  }

  return (
    <>
      <div className={cn("space-y-3", className)}>
        <AnimatePresence>
          {candidateList.map((cand, index) => {
            const isTopChoice = index === 0;
            const isSelected = selectedId === cand.ambulance.id;

            return (
              <motion.div
                key={cand.ambulance.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, scale: 0.95, marginBottom: 0 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "bg-surface border rounded-xl p-4 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs",
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 bg-primary-light/30"
                    : isTopChoice
                      ? "border-primary/50 shadow-sm"
                      : "border-border hover:border-border-strong",
                )}
              >
                {/* Left: Info & Badges */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sm text-text-primary">
                      {cand.ambulance.registrationNumber}
                    </span>

                    {isTopChoice && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-full border border-primary/20">
                        <Award className="h-3 w-3" aria-hidden="true" />
                        Top Match
                      </span>
                    )}

                    {cand.serviceOverdue && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-warning-foreground bg-warning-bg px-2 py-0.5 rounded-full border border-warning/30">
                        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                        Service Overdue
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                    <span className="capitalize">
                      {cand.ambulance.type.replace(/_/g, " ").toLowerCase()}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Navigation
                        className="h-3 w-3 text-text-muted"
                        aria-hidden="true"
                      />
                      {cand.distanceKm} km away (~
                      {Math.round(cand.distanceKm * 2.5)}m ETA)
                    </span>
                    {cand.driver && (
                      <>
                        <span>•</span>
                        <span>
                          Driver: {cand.driver.certificationLevel.replace(/_/g, " ")}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Score Breakdown pill indicators */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-text-muted">
                    <span>
                      Distance:{" "}
                      {(cand.scoreBreakdown.distanceScore * 100).toFixed(0)}%
                    </span>
                    <span>
                      Priority Match:{" "}
                      {(cand.scoreBreakdown.priorityScore * 100).toFixed(0)}%
                    </span>
                    <span>
                      Capability:{" "}
                      {(cand.scoreBreakdown.typeScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Right: Composite Score & Action */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary font-mono">
                      {(cand.score * 100).toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-text-muted uppercase tracking-wider">
                      Composite
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleOpenConfirm(cand)}
                    aria-label={`Dispatch unit ${cand.ambulance.registrationNumber}`}
                    className="min-h-[44px] sm:min-h-[38px] px-4 bg-primary hover:bg-primary-dark text-primary-foreground font-medium rounded-lg cursor-pointer transition-colors"
                  >
                    <Send className="h-4 w-4 mr-1.5" aria-hidden="true" />
                    Dispatch
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Confirmation Dialog for Dispatch */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary-light text-primary">
                <Truck className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <DialogTitle>Confirm Unit Dispatch</DialogTitle>
                <DialogDescription>
                  Deploy unit to emergency incident{" "}
                  <span className="font-mono font-semibold text-text-primary">
                    {incidentNumber}
                  </span>
                  .
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedCandidate && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-lg bg-background border border-border space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Ambulance Unit:</span>
                  <span className="font-mono font-semibold text-text-primary">
                    {selectedCandidate.ambulance.registrationNumber} (
                    {selectedCandidate.ambulance.type.replace(/_/g, " ")})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Distance / ETA:</span>
                  <span className="font-medium text-text-primary">
                    {selectedCandidate.distanceKm} km (~
                    {Math.round(selectedCandidate.distanceKm * 2.5)} minutes)
                  </span>
                </div>
                {selectedCandidate.driver && (
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Paramedic Driver:</span>
                    <span className="font-medium text-text-primary">
                      {selectedCandidate.driver.licenseNumber} (
                      {selectedCandidate.driver.certificationLevel})
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1 border-t border-border">
                  <span className="text-text-muted">Recommendation Score:</span>
                  <span className="font-mono font-bold text-primary text-sm">
                    {(selectedCandidate.score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-text-secondary text-[11px]">
                <ShieldCheck className="h-4 w-4 text-status shrink-0" aria-hidden="true" />
                <span>
                  Telemetry will transmit coordinates to the driver console with
                  a 2-minute response timer.
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              className="text-xs min-h-[40px] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDispatch}
              className="bg-primary hover:bg-primary-dark text-white text-xs min-h-[40px] cursor-pointer font-medium"
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" aria-hidden="true" />
              Confirm Dispatch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
