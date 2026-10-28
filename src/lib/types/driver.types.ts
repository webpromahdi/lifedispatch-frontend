import type { Ambulance } from "./ambulance.types";
import type { CertificationLevel } from "./enums";

export interface Driver {
  id: string;
  userId: string;
  assignedAmbulanceId: string | null;
  certificationLevel: CertificationLevel;
  licenseNumber: string;
  licenseExpiry: string;
  licenseDocumentUrl: string | null;
  isOnShift: boolean;
  shiftStart: string | null;
  shiftEnd: string | null;
  totalTripsCompleted: number;
  createdAt: string;
  updatedAt: string;
}

export interface DriverUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status?: string;
}

export interface DriverWithUser extends Driver {
  user: DriverUser;
  ambulance: Ambulance | null;
}

export interface GetDriversParams {
  page?: number;
  limit?: number;
  isOnShift?: boolean | string;
  certificationLevel?: CertificationLevel | "ALL";
}

export interface CreateDriverPayload {
  name: string;
  email: string;
  phone?: string;
  licenseNumber: string;
  licenseExpiry: string;
  certificationLevel: CertificationLevel;
  assignedAmbulanceId?: string;
  licenseDocument: File;
}

export interface UpdateDriverPayload {
  licenseNumber?: string;
  licenseExpiry?: string;
  certificationLevel?: CertificationLevel;
  assignedAmbulanceId?: string | null;
}
