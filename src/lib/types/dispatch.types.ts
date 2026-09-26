import type { Ambulance } from "./ambulance.types";
import type { Driver } from "./driver.types";
import type { DispatchStatus } from "./enums";

export interface Dispatch {
  id: string;
  emergencyId: string;
  ambulanceId: string;
  driverId: string;
  status: DispatchStatus;
  dispatchScore: number | null;
  timeoutAt: string;
  acceptedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScoredAmbulanceCandidate {
  ambulance: Ambulance;
  driver: Driver | null;
  distanceKm: number;
  score: number;
  scoreBreakdown: {
    distanceScore: number;
    priorityScore: number;
    typeScore: number;
  };
  serviceOverdue: boolean;
}
