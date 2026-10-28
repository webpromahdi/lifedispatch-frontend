import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/lib/types/emergency.types";
import type {
  CompleteTripPayload,
  CompleteTripResult,
  DriverTripItem,
  GetDriverTripsParams,
  SelectHospitalPayload,
  Trip,
  TripDetail,
  UpdateTripStatusPayload,
} from "@/lib/types/trip.types";

export function getTripById(id: string) {
  return apiClient<ApiResponse<TripDetail>>(`/trips/${id}`, {
    method: "GET",
  });
}

export function getMyTrips(params?: GetDriverTripsParams) {
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

  return apiClient<ApiResponse<DriverTripItem[]>>("/trips/me", {
    method: "GET",
    query,
  });
}

export function updateTripStatus(id: string, payload: UpdateTripStatusPayload) {
  return apiClient<ApiResponse<Trip>>(`/trips/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function selectTripHospital(id: string, payload: SelectHospitalPayload) {
  return apiClient<ApiResponse<TripDetail>>(`/trips/${id}/hospital`, {
    method: "PATCH",
    body: payload,
  });
}

export function completeTrip(id: string, payload: CompleteTripPayload) {
  return apiClient<ApiResponse<CompleteTripResult>>(`/trips/${id}/complete`, {
    method: "POST",
    body: payload,
  });
}
