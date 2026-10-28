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

export interface DriverTripItem {
  id: string;
  dispatchId: string;
  emergencyId: string;
  ambulanceId: string;
  driverId: string;
  patientId: string;
  hospitalId: string | null;
  status: TripStatus;
  distanceKm: number | null;
  departedAt: string | null;
  arrivedAtSceneAt: string | null;
  patientPickedUpAt: string | null;
  hospitalSelectedAt: string | null;
  departedToHospitalAt: string | null;
  arrivedAtHospitalAt: string | null;
  completedAt: string | null;
  createdAt: string;
  emergency: {
    id: string;
    incidentNumber: string;
    emergencyType: string;
    priority: string;
    status: string;
    locationAddress: string;
    description: string | null;
  };
  ambulance: {
    id: string;
    registrationNumber: string;
    type: string;
    capabilities: string[];
  };
  hospital: {
    id: string;
    name: string;
    address: string;
    phone: string | null;
  } | null;
  payment: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    paymentStatus: string;
    currency: string;
  } | null;
}

export interface GetDriverTripsParams {
  page?: number;
  limit?: number;
  status?: TripStatus | "ALL";
}

export interface TripDetail extends Trip {
  dispatch: {
    id: string;
    status: string;
    dispatchedBy: string;
    timeoutAt: string;
    acceptedAt: string | null;
  };
  emergency: {
    id: string;
    incidentNumber: string;
    emergencyType: string;
    priority: string;
    status: string;
    locationAddress: string;
    locationLat: number | null;
    locationLng: number | null;
    description: string | null;
  };
  ambulance: {
    id: string;
    registrationNumber: string;
    type: string;
    capabilities: string[];
  };
  driver: {
    id: string;
    userId: string;
    certificationLevel: string;
    user: { id: string; name: string; phone: string | null };
  };
  patient: { id: string; name: string; phone: string | null; email: string };
  hospital: {
    id: string;
    name: string;
    address: string;
    phone: string | null;
  } | null;
  payment: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    paymentStatus: string;
    currency: string;
  } | null;
}

export interface UpdateTripStatusPayload {
  status: "ACTIVE" | "CANCELLED";
  distanceKm?: number;
}

export interface SelectHospitalPayload {
  hospitalId: string;
}

export interface CompleteTripPayload {
  distanceKm: number;
  arrivedAtHospitalAt?: string;
  additionalCharges?: number;
}

export interface CompleteTripResult {
  trip: Trip;
  payment: {
    id: string;
    invoiceNumber: string;
    baseFare: number;
    distanceCharge: number;
    waitingCharge: number;
    additionalCharges: number;
    totalAmount: number;
    currency: string;
  };
  invoicePdfBase64: string;
}
