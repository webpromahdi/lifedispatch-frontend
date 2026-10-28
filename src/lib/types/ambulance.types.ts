import type { Driver } from "./driver.types";
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

export interface AmbulanceDriverUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

export interface AmbulanceWithDriver extends Ambulance {
  driver:
    | (Driver & {
        user: AmbulanceDriverUser;
      })
    | null;
  hospital: {
    id: string;
    name: string;
    address?: string;
  } | null;
}

export interface GetAmbulancesParams {
  page?: number;
  limit?: number;
  status?: AmbulanceStatus | "ALL";
  type?: AmbulanceType | "ALL";
}

export interface CreateAmbulancePayload {
  registrationNumber: string;
  type: AmbulanceType;
  capabilities: string[];
  baseLocationLat: number;
  baseLocationLng: number;
  hospitalId?: string;
  lastServiceDate?: string;
  nextServiceDue?: string;
  manufacturedYear?: number;
  registrationDocument?: File | null;
}

export interface UpdateAmbulancePayload {
  registrationNumber?: string;
  type?: AmbulanceType;
  capabilities?: string[];
  baseLocationLat?: number;
  baseLocationLng?: number;
  currentLat?: number;
  currentLng?: number;
  hospitalId?: string | null;
  lastServiceDate?: string;
  nextServiceDue?: string;
  manufacturedYear?: number;
}
