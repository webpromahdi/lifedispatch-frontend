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
