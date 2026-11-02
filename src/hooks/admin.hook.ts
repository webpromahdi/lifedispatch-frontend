import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminUsers,
  getAnalyticsOverview,
  getAuditLogs,
  getEmergencyAnalytics,
  getPaymentAnalytics,
  updateUserStatus,
} from "@/api";
import type {
  AnalyticsDateFilterParams,
  GetAdminUsersParams,
  GetAuditLogsParams,
  UpdateUserStatusPayload,
} from "@/lib/types/admin.types";

export function useGetAdminUsers(
  params?: GetAdminUsersParams,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => getAdminUsers(params),
    ...options,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateUserStatusPayload;
    }) => updateUserStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
}

export function useGetAnalyticsOverview(options?: {
  enabled?: boolean;
  refetchInterval?: number | false;
}) {
  return useQuery({
    queryKey: ["admin", "analytics", "overview"],
    queryFn: () => getAnalyticsOverview(),
    ...options,
  });
}

export function useGetEmergencyAnalytics(
  params?: AnalyticsDateFilterParams,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: ["admin", "analytics", "emergencies", params],
    queryFn: () => getEmergencyAnalytics(params),
    ...options,
  });
}

export function useGetPaymentAnalytics(
  params?: AnalyticsDateFilterParams,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: ["admin", "analytics", "payments", params],
    queryFn: () => getPaymentAnalytics(params),
    ...options,
  });
}

export function useGetAuditLogs(
  params?: GetAuditLogsParams,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: ["admin", "audit-logs", params],
    queryFn: () => getAuditLogs(params),
    ...options,
  });
}
