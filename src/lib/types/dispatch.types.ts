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
  ambulanceId: string;
  registrationNumber: string;
  type: string;
  capabilities: string[];
  driverId: string;
  driverName: string;
  driverCertificationLevel: string;
  distanceKm: number;
  score: number;
  scoreBreakdown: {
    distanceScore: number;
    priorityScore: number;
    typeScore: number;
  };
  serviceOverdue?: boolean;
}

export interface RecommendAmbulancesPayload {
  emergencyId: string;
}

export interface CreateDispatchPayload {
  emergencyId: string;
  ambulanceId: string;
  dispatchScore?: number;
}

export interface CancelDispatchPayload {
  reason: string;
}
