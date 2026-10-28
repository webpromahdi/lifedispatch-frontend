import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateEmergencyPayload,
  EmergencyDetail,
  EmergencyRequest,
  EmergencyWithPatient,
  GetEmergenciesParams,
} from "@/lib/types/emergency.types";
import type { EmergencyPriority } from "@/lib/types/enums";

export function getEmergencies(params?: GetEmergenciesParams) {
  const query: Record<string, string | number> = {};

  if (params?.page) {
    query.page = params.page;
  }
  if (params?.limit) {
    query.limit = params.limit;
  }
  if (params?.search?.trim()) {
    query.search = params.search.trim();
  }
  if (params?.status && (params.status as string) !== "ALL") {
    query.status = params.status;
  }
  if (params?.emergencyType && (params.emergencyType as string) !== "ALL") {
    query.emergencyType = params.emergencyType;
  }
  if (params?.priority && (params.priority as string) !== "ALL") {
    query.priority = params.priority;
  }

  return apiClient<ApiResponse<EmergencyWithPatient[]>>("/emergencies", {
    method: "GET",
    query,
  });
}

export function getEmergencyById(id: string) {
  return apiClient<ApiResponse<EmergencyDetail>>(`/emergencies/${id}`, {
    method: "GET",
  });
}

export function createEmergency(payload: CreateEmergencyPayload) {
  return apiClient<ApiResponse<EmergencyWithPatient>>("/emergencies/create", {
    method: "POST",
    body: payload,
  });
}

export function updateEmergencyPriority(
  id: string,
  priority: EmergencyPriority,
) {
  return apiClient<ApiResponse<EmergencyRequest>>(
    `/emergencies/${id}/priority`,
    {
      method: "PATCH",
      body: { priority },
    },
  );
}

export function cancelEmergency(id: string, reason: string) {
  return apiClient<ApiResponse<EmergencyRequest>>(`/emergencies/${id}/cancel`, {
    method: "POST",
    body: { reason },
  });
}
