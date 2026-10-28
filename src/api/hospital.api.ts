import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/lib/types/emergency.types";
import type { GetHospitalsParams, Hospital } from "@/lib/types/hospital.types";

export function getHospitals(params?: GetHospitalsParams) {
  const query: Record<string, string | number> = {};

  if (params?.page) {
    query.page = params.page;
  }
  if (params?.limit) {
    query.limit = params.limit;
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

