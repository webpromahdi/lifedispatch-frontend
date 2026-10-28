import type { Ambulance } from "./ambulance.types";
import type { Dispatch } from "./dispatch.types";
import type { Driver } from "./driver.types";
import type {
  EmergencyPriority,
  EmergencyStatus,
  EmergencyType,
  RequiredCapability,
} from "./enums";

export interface EmergencyRequest {
  id: string;
  incidentNumber: string;
  patientId: string;
  emergencyType: EmergencyType;
  requiredCapability: RequiredCapability;
  priority: EmergencyPriority | null;
  status: EmergencyStatus;
  description: string;
  locationAddress: string;
  locationLat: number;
  locationLng: number;
  callerName: string;
  callerPhone: string;
  isEscalated: boolean;
  escalationReason: string | null;
  slaTargetMinutes: number | null;
  responseTimeMinutes: number | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  cancelledBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentTimelineEvent {
  id: string;
  emergencyId: string;
  eventType: string;
  oldValue: string | null;
  newValue: string | null;
  triggeredBy: string;
  triggeredByRole: string;
  notes: string | null;
  createdAt: string;
}

export interface EmergencyPatient {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

export interface EmergencyWithPatient extends EmergencyRequest {
  patient: EmergencyPatient;
}

export interface DispatchWithRelations extends Dispatch {
  ambulance: Ambulance;
  driver: Driver & {
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      role: string;
    };
  };
}

export interface EmergencyDetail extends EmergencyRequest {
  patient: EmergencyPatient;
  timeline: IncidentTimelineEvent[];
  dispatches: DispatchWithRelations[];
}

export interface GetEmergenciesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: EmergencyStatus;
  emergencyType?: EmergencyType;
  priority?: EmergencyPriority;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateEmergencyPayload {
  emergencyType: EmergencyType;
  requiredCapability: RequiredCapability;
  description: string;
  locationAddress: string;
  locationLat: number;
  locationLng: number;
  callerName: string;
  callerPhone: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginatedMeta;
}
