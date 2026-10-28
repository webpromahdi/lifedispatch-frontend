import type { DispatchStatus } from "./enums";
import type { Trip } from "./trip.types";

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

export interface AcceptDispatchResult {
  dispatch: Dispatch;
  trip: Trip;
  emergency: {
    id: string;
    incidentNumber: string;
    emergencyType: string;
    priority: string;
    locationAddress: string;
    locationLat: number | null;
    locationLng: number | null;
    description: string | null;
  };
}

export interface PendingDispatchItem {
  id: string;
  emergencyId: string;
  ambulanceId: string;
  driverId: string;
  status: DispatchStatus;
  timeoutAt: string;
  acceptedAt: string | null;
  ambulance: {
    id: string;
    registrationNumber: string;
    type: string;
    capabilities: string[];
  };
  emergency: {
    id: string;
    incidentNumber: string;
    emergencyType: string;
    priority: string;
    locationAddress: string;
    locationLat: number | null;
    locationLng: number | null;
    description: string | null;
    callerName: string | null;
    callerPhone: string | null;
  };
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
