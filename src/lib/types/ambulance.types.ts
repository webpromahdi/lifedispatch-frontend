import type { AmbulanceStatus, AmbulanceType } from "./enums";

export interface Ambulance {
  id: string;
  registrationNumber: string;
  type: AmbulanceType;
  status: AmbulanceStatus;
  version: number;
  capabilities: string[];
  registrationDocumentUrl: string | null;
  baseLocationLat: number;
  baseLocationLng: number;
  currentLat: number | null;
  currentLng: number | null;
  hospitalId: string | null;
  lastServiceDate: string | null;
  nextServiceDue: string | null;
  manufacturedYear: number | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
