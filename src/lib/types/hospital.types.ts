import type {
  AmbulanceStatus,
  AmbulanceType,
  BloodType,
  EmergencyPriority,
  EmergencyStatus,
  EmergencyType,
  HospitalDiversionStatus,
  TripStatus,
} from "./enums";

export interface Hospital {
  id: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  locationLat?: number;
  locationLng?: number;
  phone: string;
  emergencyContact?: string;
  email?: string | null;
  capabilities?: string[];
  totalErBeds: number;
  availableErBeds: number;
  diversionStatus: HospitalDiversionStatus;
  diversionReason?: string | null;
  diversionSetAt?: string | null;
  isActive?: boolean;
  occupancyPercent?: number | null;
  _count?: {
    staff: number;
    trips: number;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface HospitalStaff {
  id: string;
  userId: string;
  hospitalId: string;
  employeeId?: string | null;
  designation?: string | null;
  department?: string | null;
  canManageStaff: boolean;
  isOnShift: boolean;
  shiftStart?: string | null;
  shiftEnd?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    role: string;
    status: string;
  };
}

export interface HospitalStaffMe extends HospitalStaff {
  hospital: Hospital;
}

export interface InboundTrip {
  id: string;
  dispatchId: string;
  emergencyId: string;
  ambulanceId: string;
  driverId: string;
  patientId: string;
  hospitalId: string;
  departedAt?: string | null;
  arrivedAtSceneAt?: string | null;
  patientPickedUpAt?: string | null;
  hospitalSelectedAt?: string | null;
  departedToHospitalAt?: string | null;
  arrivedAtHospitalAt?: string | null;
  completedAt?: string | null;
  distanceKm?: number | null;
  status: TripStatus;
  createdAt: string;
  emergency: {
    id: string;
    incidentNumber: string;
    emergencyType: EmergencyType;
    priority: EmergencyPriority | null;
    status: EmergencyStatus;
    locationAddress: string;
    description: string;
    dispatcherNotes?: string | null;
    callerName?: string;
    callerPhone?: string;
  };
  ambulance: {
    id: string;
    plateNumber: string;
    type: AmbulanceType;
    status: AmbulanceStatus;
  };
  driver: {
    id: string;
    licenseNumber: string;
    user: {
      id: string;
      name: string;
      phone?: string | null;
    };
  };
  patient: {
    id: string;
    name: string;
    phone?: string | null;
    bloodType?: BloodType | null;
    knownConditions?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
  };
}

export interface UpdateHospitalPayload {
  name?: string;
  address?: string;
  phone?: string;
  emergencyContact?: string;
  capabilities?: string[];
  totalErBeds?: number;
  availableErBeds?: number;
  lat?: number;
  lng?: number;
}

export interface UpdateDiversionPayload {
  diversionStatus: HospitalDiversionStatus;
  diversionReason?: string;
  availableErBeds?: number;
}

export interface ToggleStaffShiftPayload {
  action: "start" | "end";
}

export interface CreateHospitalStaffPayload {
  name: string;
  email: string;
  phone?: string;
  designation?: string;
  employeeId?: string;
  canManageStaff?: boolean;
}

export interface UpdateHospitalStaffPayload {
  name?: string;
  phone?: string;
  designation?: string;
  employeeId?: string | null;
  canManageStaff?: boolean;
}

export interface GetHospitalStaffParams {
  page?: number;
  limit?: number;
  search?: string;
  canManageStaff?: boolean;
  isOnShift?: boolean;
}

export interface GetHospitalsParams {
  page?: number;
  limit?: number;
  diversionStatus?: HospitalDiversionStatus;
  isActive?: boolean;
  hasCapacity?: boolean;
  search?: string;
}
