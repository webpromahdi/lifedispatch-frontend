import type { TripStatus } from "./enums";

export interface Trip {
  id: string;
  dispatchId: string;
  driverId: string;
  ambulanceId: string;
  patientId: string;
  hospitalId: string | null;
  status: TripStatus;
  distanceKm: number | null;
  departedAt: string | null;
  arrivedAtSceneAt: string | null;
  patientPickedUpAt: string | null;
  hospitalSelectedAt: string | null;
  arrivedAtHospitalAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}
