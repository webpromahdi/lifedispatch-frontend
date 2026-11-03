import apiClient from "@/lib/apiClient";
import type {
  AcceptDispatchResult,
  CancelDispatchPayload,
  CreateDispatchPayload,
  Dispatch,
  GetDispatchesParams,
  PendingDispatchItem,
  ScoredAmbulanceCandidate,
} from "@/lib/types/dispatch.types";
import type { ApiResponse } from "@/lib/types/emergency.types";

export function getDispatches(params?: GetDispatchesParams) {
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
  if (params?.emergencyId) {
    query.emergencyId = params.emergencyId;
  }
  if (params?.ambulanceId) {
    query.ambulanceId = params.ambulanceId;
  }
  if (params?.driverId) {
    query.driverId = params.driverId;
  }
  if (params?.search?.trim()) {
    query.search = params.search.trim();
  }

  return apiClient<ApiResponse<Dispatch[]>>("/dispatch", {
    method: "GET",
    query,
  });
}

export function recommendAmbulances(emergencyId: string) {
  return apiClient<ApiResponse<ScoredAmbulanceCandidate[]>>(
    "/dispatch/recommend",
    {
      method: "POST",
      body: { emergencyId },
    },
  );
}

export function createDispatch(payload: CreateDispatchPayload) {
  return apiClient<ApiResponse<Dispatch & { serviceOverdueWarning?: boolean }>>(
    "/dispatch/create",
    {
      method: "POST",
      body: payload,
    },
  );
}

export function cancelDispatch(id: string, payload: CancelDispatchPayload) {
  return apiClient<ApiResponse<Dispatch>>(`/dispatch/${id}/cancel`, {
    method: "POST",
    body: payload,
  });
}

export function getDispatchById(id: string) {
  return apiClient<ApiResponse<Dispatch>>(`/dispatch/${id}`, {
    method: "GET",
  });
}

export function getMyPendingDispatches() {
  return apiClient<ApiResponse<PendingDispatchItem[]>>("/dispatch/me", {
    method: "GET",
  });
}

export function acceptDispatch(id: string) {
  return apiClient<ApiResponse<AcceptDispatchResult>>(
    `/dispatch/${id}/accept`,
    {
      method: "POST",
    },
  );
}

export function rejectDispatch(id: string, reason: string) {
  return apiClient<ApiResponse<Dispatch>>(`/dispatch/${id}/reject`, {
    method: "POST",
    body: { reason },
  });
}
