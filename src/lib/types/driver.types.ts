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
