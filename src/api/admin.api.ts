import apiClient from "@/lib/apiClient";
import type {
  AdminAnalyticsOverview,
  AnalyticsDateFilterParams,
  EmergencyAnalytics,
  GetAdminUsersParams,
  GetAuditLogsParams,
  PaymentAnalytics,
  UpdateUserStatusPayload,
} from "@/lib/types/admin.types";
import type { AuditLog } from "@/lib/types/audit.types";
import type { ApiResponse } from "@/lib/types/emergency.types";
import type { User } from "@/lib/types/user.types";

export function getAdminUsers(params?: GetAdminUsersParams) {
  const query: Record<string, string | number> = {};

  if (params?.page) {
    query.page = params.page;
  }
  if (params?.limit) {
    query.limit = params.limit;
  }
  if (params?.role) {
    query.role = params.role;
  }
  if (params?.status) {
    query.status = params.status;
  }
  if (params?.search) {
    query.search = params.search;
  }

  return apiClient<ApiResponse<User[]>>("/admin/users", {
    method: "GET",
    query,
  });
}

export function updateUserStatus(id: string, payload: UpdateUserStatusPayload) {
  return apiClient<ApiResponse<User>>(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function getAnalyticsOverview() {
  return apiClient<ApiResponse<AdminAnalyticsOverview>>(
    "/admin/analytics/overview",
    {
      method: "GET",
    },
  );
}

export function getEmergencyAnalytics(params?: AnalyticsDateFilterParams) {
  const query: Record<string, string> = {};

  if (params?.from) {
    query.from = params.from;
  }
  if (params?.to) {
    query.to = params.to;
  }

  return apiClient<ApiResponse<EmergencyAnalytics>>(
    "/admin/analytics/emergencies",
    {
      method: "GET",
      query,
    },
  );
}

export function getPaymentAnalytics(params?: AnalyticsDateFilterParams) {
  const query: Record<string, string> = {};

  if (params?.from) {
    query.from = params.from;
  }
  if (params?.to) {
    query.to = params.to;
  }

  return apiClient<ApiResponse<PaymentAnalytics>>("/admin/analytics/payments", {
    method: "GET",
    query,
  });
}

export function getAuditLogs(params?: GetAuditLogsParams) {
  const query: Record<string, string | number> = {};

  if (params?.page) {
    query.page = params.page;
  }
  if (params?.limit) {
    query.limit = params.limit;
  }
  if (params?.action) {
    query.action = params.action;
  }
  if (params?.entity) {
    query.entity = params.entity;
  }
  if (params?.performedBy) {
    query.performedBy = params.performedBy;
  }

  return apiClient<ApiResponse<AuditLog[]>>("/admin/audit-logs", {
    method: "GET",
    query,
  });
}
