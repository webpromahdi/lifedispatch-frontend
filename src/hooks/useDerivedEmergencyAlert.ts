"use client";

import { useMemo } from "react";
import { useGetMe } from "@/hooks/auth.hook";
import { useGetEmergencies } from "@/hooks/emergency.hook";
import type { EmergencyRequest } from "@/lib/types/emergency.types";
import { EmergencyPriority, EmergencyStatus, UserRole } from "@/lib/types/enums";
import {
  useAppStore,
  useDismissedAlertIds,
} from "@/store/useAppStore";

export interface DerivedAlertState {
  activeEmergency: EmergencyRequest | null;
  pendingCount: number;
  allPendingP1: EmergencyRequest[];
  emergencies: EmergencyRequest[];
  isSuccess: boolean;
  isAuthorized: boolean;
  dismissActive: () => void;
  dismissAll: () => void;
}

/**
 * Pure read-only derivation hook.
 * Derives the current active P1 emergency, pending queue, and full list directly
 * from the TanStack Query cache. Contains zero side effects (no useEffect, no mutations).
 */
export function useDerivedEmergencyAlert(): DerivedAlertState {
  const { data: meRes } = useGetMe();
  const authUser = meRes?.data?.user;
  const isAuthorized =
    authUser?.role === UserRole.DISPATCHER ||
    authUser?.role === UserRole.ADMIN ||
    authUser?.role === UserRole.SUPER_ADMIN;

  const dismissedAlertIds = useDismissedAlertIds();
  const dismissAlert = useAppStore((s) => s.dismissAlert);
  const dismissAllAlerts = useAppStore((s) => s.dismissAllAlerts);

  // Reuses query key ["emergencies", { limit: 100 }]
  const { data: emergenciesResponse, isSuccess } = useGetEmergencies(
    { limit: 100 },
    {
      enabled: isAuthorized,
      refetchInterval: 10_000,
      refetchIntervalInBackground: true,
    },
  );

  const emergencies = useMemo(
    () => emergenciesResponse?.data ?? [],
    [emergenciesResponse],
  );

  // Derived list of unacknowledged P1 pending emergencies sorted by oldest first
  const pendingP1 = useMemo(() => {
    if (!isAuthorized) return [];
    return emergencies
      .filter(
        (e) =>
          e.priority === EmergencyPriority.P1_CRITICAL &&
          e.status === EmergencyStatus.PENDING &&
          !dismissedAlertIds.includes(e.id),
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }, [emergencies, dismissedAlertIds, isAuthorized]);

  const activeEmergency = pendingP1[0] ?? null;
  const pendingCount = pendingP1.length;

  return {
    activeEmergency,
    pendingCount,
    allPendingP1: pendingP1,
    emergencies,
    isSuccess,
    isAuthorized,
    dismissActive: () => {
      if (activeEmergency) {
        dismissAlert(activeEmergency.id);
      }
    },
    dismissAll: () => {
      dismissAllAlerts(pendingP1.map((e) => e.id));
    },
  };
}
