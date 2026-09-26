import type { AuthProvider, BloodType, UserRole, UserStatus } from "./enums";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  isDeleted: boolean;
  deletedAt: string | null;
  authProvider: AuthProvider;
  bloodType: BloodType | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  knownConditions: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DummyUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: UserRole;
  driverId: string | null;
  hospitalStaffId: string | null;
  hospitalId: string | null;
}
