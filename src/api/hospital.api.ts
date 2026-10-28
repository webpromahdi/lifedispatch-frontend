import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/lib/types/emergency.types";
import type {
  CreateHospitalStaffPayload,
  GetHospitalStaffParams,
  GetHospitalsParams,
  Hospital,
  HospitalStaff,
  HospitalStaffMe,
  InboundTrip,
  ToggleStaffShiftPayload,
  UpdateDiversionPayload,
  UpdateHospitalPayload,
  UpdateHospitalStaffPayload,
} from "@/lib/types/hospital.types";

export function getHospitals(params?: GetHospitalsParams) {
  const query: Record<string, string | number | boolean> = {};

  if (params?.page) {
    query.page = params.page;
  }
  if (params?.limit) {
    query.limit = params.limit;
  }
  if (params?.diversionStatus) {
    query.diversionStatus = params.diversionStatus;
  }
  if (params?.isActive !== undefined) {
    query.isActive = params.isActive;
  }
  if (params?.hasCapacity !== undefined) {
    query.hasCapacity = params.hasCapacity;
  }
  if (params?.search) {
    query.search = params.search;
  }

  return apiClient<ApiResponse<Hospital[]>>("/hospitals", {
    method: "GET",
    query,
  });
}

export function getHospitalById(id: string) {
  return apiClient<ApiResponse<Hospital>>(`/hospitals/${id}`, {
    method: "GET",
  });
}

export function getMyHospitalStaffProfile() {
  return apiClient<ApiResponse<HospitalStaffMe>>("/hospitals/staff/me", {
    method: "GET",
  });
}

export function updateHospital(id: string, payload: UpdateHospitalPayload) {
  return apiClient<ApiResponse<Hospital>>(`/hospitals/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function updateHospitalDiversion(
  id: string,
  payload: UpdateDiversionPayload,
) {
  return apiClient<ApiResponse<Hospital>>(`/hospitals/${id}/diversion`, {
    method: "PATCH",
    body: payload,
  });
}

export function toggleHospitalStaffShift(payload: ToggleStaffShiftPayload) {
  return apiClient<ApiResponse<HospitalStaff>>("/hospitals/staff/me/shift", {
    method: "PATCH",
    body: payload,
  });
}

export function getHospitalStaff(
  hospitalId: string,
  params?: GetHospitalStaffParams,
) {
  const query: Record<string, string | number | boolean> = {};

  if (params?.page) {
    query.page = params.page;
  }
  if (params?.limit) {
    query.limit = params.limit;
  }
  if (params?.search) {
    query.search = params.search;
  }
  if (params?.canManageStaff !== undefined) {
    query.canManageStaff = params.canManageStaff;
  }
  if (params?.isOnShift !== undefined) {
    query.isOnShift = params.isOnShift;
  }

  return apiClient<ApiResponse<HospitalStaff[]>>(
    `/hospitals/${hospitalId}/staff`,
    {
      method: "GET",
      query,
    },
  );
}

export function createHospitalStaff(
  hospitalId: string,
  payload: CreateHospitalStaffPayload,
) {
  return apiClient<ApiResponse<HospitalStaff>>(
    `/hospitals/${hospitalId}/staff/create`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export function updateHospitalStaff(
  hospitalId: string,
  staffId: string,
  payload: UpdateHospitalStaffPayload,
) {
  return apiClient<ApiResponse<HospitalStaff>>(
    `/hospitals/${hospitalId}/staff/${staffId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}

export function deleteHospitalStaff(hospitalId: string, staffId: string) {
  return apiClient<ApiResponse<null>>(
    `/hospitals/${hospitalId}/staff/${staffId}`,
    {
      method: "DELETE",
    },
  );
}

export function getHospitalInboundTrips(hospitalId: string) {
  return apiClient<ApiResponse<InboundTrip[]>>(
    `/hospitals/${hospitalId}/inbound`,
    {
      method: "GET",
    },
  );
}
