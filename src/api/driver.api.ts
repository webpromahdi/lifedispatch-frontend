import apiClient from "@/lib/apiClient";
import type {
  CreateDriverPayload,
  Driver,
  DriverWithUser,
  GetDriversParams,
  UpdateDriverPayload,
} from "@/lib/types/driver.types";
import type { ApiResponse } from "@/lib/types/emergency.types";

export function getDrivers(params?: GetDriversParams) {
  const query: Record<string, string | number> = {};

  if (params?.page) {
    query.page = params.page;
  }
  if (params?.limit) {
    query.limit = params.limit;
  }
  if (params?.isOnShift !== undefined && params.isOnShift !== "ALL") {
    query.isOnShift = String(params.isOnShift);
  }
  if (params?.certificationLevel && params.certificationLevel !== "ALL") {
    query.certificationLevel = params.certificationLevel;
  }

  return apiClient<ApiResponse<DriverWithUser[]>>("/drivers", {
    method: "GET",
    query,
  });
}

export function createDriver(payload: CreateDriverPayload) {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("email", payload.email);
  if (payload.phone) {
    formData.append("phone", payload.phone);
  }
  formData.append("licenseNumber", payload.licenseNumber);
  formData.append("licenseExpiry", payload.licenseExpiry);
  formData.append("certificationLevel", payload.certificationLevel);
  if (payload.assignedAmbulanceId) {
    formData.append("assignedAmbulanceId", payload.assignedAmbulanceId);
  }
  if (payload.licenseDocument) {
    formData.append("licenseDocument", payload.licenseDocument);
  }

  return apiClient<ApiResponse<DriverWithUser>>("/drivers/create", {
    method: "POST",
    body: formData,
  });
}

export function updateDriver(id: string, payload: UpdateDriverPayload) {
  return apiClient<ApiResponse<DriverWithUser>>(`/drivers/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function toggleDriverShift(action: "start" | "end") {
  return apiClient<ApiResponse<Driver>>("/drivers/me/shift", {
    method: "PATCH",
    body: { action },
  });
}

