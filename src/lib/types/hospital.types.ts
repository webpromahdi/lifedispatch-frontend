import type { HospitalDiversionStatus } from "./enums";

export interface Hospital {
  id: string;
  name: string;
  address: string;
  locationLat: number;
  locationLng: number;
  totalErBeds: number;
  availableErBeds: number;
  diversionStatus: HospitalDiversionStatus;
  diversionReason: string | null;
  phone: string | null;
  email: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HospitalStaff {
  id: string;
  userId: string;
  hospitalId: string;
  department: string | null;
  isOnShift: boolean;
  shiftStart: string | null;
  shiftEnd: string | null;
  createdAt: string;
  updatedAt: string;
}
