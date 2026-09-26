"use client";

import { AlertTriangle, Award, CheckCircle2, Navigation } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ScoredAmbulanceCandidate } from "@/lib/types/dispatch.types";
import { cn } from "@/lib/utils";

export interface RecommendationListProps {
  candidates: ScoredAmbulanceCandidate[];
  onSelect?: (candidate: ScoredAmbulanceCandidate) => void;
  selectedId?: string | null;
  className?: string;
}

export function RecommendationList({
  candidates,
  onSelect,
  selectedId,
  className,
}: RecommendationListProps) {
  const handleDispatch = (candidate: ScoredAmbulanceCandidate) => {
    toast.success(`Dispatching ${candidate.ambulance.registrationNumber}...`, {
      description: `Score: ${(candidate.score * 100).toFixed(1)}% | ETA approx. ${Math.round(candidate.distanceKm * 2.5)} mins`,
    });
    if (onSelect) onSelect(candidate);
  };

  if (!candidates || candidates.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-text-muted bg-surface border border-dashed border-border rounded-xl">
        No scored ambulance candidates available for this request.
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {candidates.map((cand, index) => {
        const isTopChoice = index === 0;
        const isSelected = selectedId === cand.ambulance.id;

        return (
          <div
            key={cand.ambulance.id}
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
                  {cand.distanceKm} km away
                </span>
                {cand.driver && (
                  <>
                    <span>•</span>
                    <span>
                      Driver on shift:{" "}
                      {cand.driver.certificationLevel.replace(/_/g, " ")}
                    </span>
                  </>
                )}
              </div>

              {/* Score Breakdown pill indicators */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-text-muted">
                <span>
                  Dist: {(cand.scoreBreakdown.distanceScore * 100).toFixed(0)}%
                </span>
                <span>
                  Priority:{" "}
                  {(cand.scoreBreakdown.priorityScore * 100).toFixed(0)}%
                </span>
                <span>
                  Type: {(cand.scoreBreakdown.typeScore * 100).toFixed(0)}%
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
                onClick={() => handleDispatch(cand)}
                className="min-h-[44px] sm:min-h-[38px] px-4 bg-primary hover:bg-primary-dark text-primary-foreground font-medium rounded-lg cursor-pointer transition-colors"
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Select
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
