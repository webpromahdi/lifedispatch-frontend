import apiClient from "@/lib/apiClient";
import type {
  AmbulanceWithDriver,
  CreateAmbulancePayload,
  GetAmbulancesParams,
  UpdateAmbulancePayload,
} from "@/lib/types/ambulance.types";
import type { ApiResponse } from "@/lib/types/emergency.types";
import type { AmbulanceStatus } from "@/lib/types/enums";

export function getAmbulances(params?: GetAmbulancesParams) {
  const query: Record<string, string | number> = {};

  if (params?.page) {
    query.page = params.page;
  }
  if (params?.limit) {
    query.limit = params.limit;
  }
  if (params?.status && params.status !== "ALL") {
    query.status = params.status;
  }
  if (params?.type && params.type !== "ALL") {
    query.type = params.type;
  }

  return apiClient<ApiResponse<AmbulanceWithDriver[]>>("/ambulances", {
    method: "GET",
    query,
  });
}

export function getAmbulanceById(id: string) {
  return apiClient<ApiResponse<AmbulanceWithDriver>>(`/ambulances/${id}`, {
    method: "GET",
  });
}

export function createAmbulance(payload: CreateAmbulancePayload) {
  if (payload.registrationDocument) {
    const formData = new FormData();
    formData.append("registrationNumber", payload.registrationNumber);
    formData.append("type", payload.type);
    for (const cap of payload.capabilities) {
      formData.append("capabilities", cap);
    }
    formData.append("baseLocationLat", String(payload.baseLocationLat));
    formData.append("baseLocationLng", String(payload.baseLocationLng));
    if (payload.hospitalId) {
      formData.append("hospitalId", payload.hospitalId);
    }
    if (payload.lastServiceDate) {
      formData.append("lastServiceDate", payload.lastServiceDate);
    }
    if (payload.nextServiceDue) {
      formData.append("nextServiceDue", payload.nextServiceDue);
    }
    if (payload.manufacturedYear) {
      formData.append("manufacturedYear", String(payload.manufacturedYear));
    }
    formData.append("registrationDocument", payload.registrationDocument);

    return apiClient<ApiResponse<AmbulanceWithDriver>>("/ambulances/create", {
      method: "POST",
      body: formData,
    });
  }

  const body: Record<string, unknown> = {
    registrationNumber: payload.registrationNumber,
    type: payload.type,
    capabilities: payload.capabilities,
    baseLocationLat: payload.baseLocationLat,
    baseLocationLng: payload.baseLocationLng,
  };
  if (payload.hospitalId) {
    body.hospitalId = payload.hospitalId;
  }
  if (payload.lastServiceDate) {
    body.lastServiceDate = payload.lastServiceDate;
  }
  if (payload.nextServiceDue) {
    body.nextServiceDue = payload.nextServiceDue;
  }
  if (payload.manufacturedYear) {
    body.manufacturedYear = payload.manufacturedYear;
  }

  return apiClient<ApiResponse<AmbulanceWithDriver>>("/ambulances/create", {
    method: "POST",
    body,
  });
}

export function updateAmbulance(id: string, payload: UpdateAmbulancePayload) {
  return apiClient<ApiResponse<AmbulanceWithDriver>>(`/ambulances/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function updateAmbulanceStatus(id: string, status: AmbulanceStatus) {
  return apiClient<ApiResponse<AmbulanceWithDriver>>(
    `/ambulances/${id}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );
}
