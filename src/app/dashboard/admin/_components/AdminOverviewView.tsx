"use client";

import { useMemo } from "react";
import {
  ActiveEmergenciesCard,
  AuditLogCard,
  EmergencySummaryCard,
  LiveOperationsCard,
  RevenueCard,
  SystemScaleCards,
} from "@/components/shared/AdminDashboardSections";
import {
  useGetAnalyticsOverview,
  useGetAuditLogs,
  useGetEmergencies,
  useGetEmergencyAnalytics,
} from "@/hooks";
import type {
  AdminAnalyticsOverview,
  AnalyticsOverviewData,
} from "@/lib/types/admin.types";
import { EmergencyStatus } from "@/lib/types/enums";

function mapToAnalyticsOverviewData(
  data?: AdminAnalyticsOverview,
  avgResponseTimeMinutes?: number | null,
): AnalyticsOverviewData {
  return {
    liveOperations: {
      activeEmergencies: data?.liveOperations?.activeEmergencies ?? 0,
      availableAmbulances: data?.liveOperations?.availableAmbulances ?? 0,
      busyAmbulances: data?.liveOperations?.busyAmbulances ?? 0,
      outOfService: data?.liveOperations?.outOfServiceAmbulances ?? 0,
      driversOnShift: data?.liveOperations?.driversOnShift ?? 0,
    },
    revenue: {
      totalCollected: data?.revenue?.totalCollected ?? 0,
      totalPending: data?.revenue?.totalPending ?? 0,
      currency: "BDT",
    },
    historicStats: {
      completed: data?.historicStats?.totalCompletedEmergencies ?? 0,
      cancelled: data?.historicStats?.totalCancelledEmergencies ?? 0,
      totalTrips: data?.historicStats?.totalTrips ?? 0,
    },
    emergencyAnalytics: {
      avgResponseTimeMinutes: avgResponseTimeMinutes ?? 8.4,
    },
    usersAndResources: {
      totalPatients: data?.usersAndResources?.totalPatients ?? 0,
      totalDrivers: data?.usersAndResources?.totalDrivers ?? 0,
      totalHospitals: data?.usersAndResources?.totalHospitals ?? 0,
    },
  };
}

export function AdminOverviewView() {
  // Live Operations from backend API refreshed every 15s
  const { data: analyticsResponse } = useGetAnalyticsOverview({
    refetchInterval: 15_000,
  });

  const { data: emergencyAnalyticsResponse } = useGetEmergencyAnalytics(
    undefined,
    { refetchInterval: 30_000 },
  );

  const analytics = useMemo(() => {
    return mapToAnalyticsOverviewData(
      analyticsResponse?.data,
      emergencyAnalyticsResponse?.data?.avgResponseTimeMinutes,
    );
  }, [analyticsResponse, emergencyAnalyticsResponse]);

  // Live active emergencies
  const { data: emergenciesResponse } = useGetEmergencies(
    { limit: 20 },
    { refetchInterval: 15_000 },
  );

  const activeEmergenciesList = useMemo(() => {
    return (emergenciesResponse?.data ?? [])
      .filter(
        (e) =>
          e.status === EmergencyStatus.PENDING ||
          e.status === EmergencyStatus.PRIORITIZED ||
          e.status === EmergencyStatus.DISPATCHING ||
          e.status === EmergencyStatus.ACTIVE_TRIP,
      )
      .slice(0, 5);
  }, [emergenciesResponse]);

  // Live audit logs
  const { data: auditResponse } = useGetAuditLogs(
    { limit: 4 },
    { refetchInterval: 15_000 },
  );

  const recentLogs = useMemo(() => {
    return auditResponse?.data ?? [];
  }, [auditResponse]);

  return (
    <div className="space-y-6 flex flex-col">
      {/* ── 1. LIVE OPERATIONS CARD (Full Width) ── */}
      <LiveOperationsCard analytics={analytics} />

      {/* ── 2 & 3 & 4. MIDDLE TWO-COLUMN AREA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: ACTIVE EMERGENCIES TABLE */}
        <div className="lg:col-span-8 w-full">
          <ActiveEmergenciesCard emergencies={activeEmergenciesList} />
        </div>

        {/* Right Column: REVENUE & EMERGENCY SUMMARY */}
        <div className="lg:col-span-4 w-full flex flex-col gap-6">
          <RevenueCard revenue={analytics.revenue} />
          <EmergencySummaryCard
            historicStats={analytics.historicStats}
            emergencyAnalytics={analytics.emergencyAnalytics}
          />
        </div>
      </div>

      {/* ── 5. THREE STAT CARDS ── */}
      <SystemScaleCards usersAndResources={analytics.usersAndResources} />

      {/* ── 6. RECENT AUDIT LOG TABLE (Full Width) ── */}
      <AuditLogCard logs={recentLogs} maxRows={4} title="RECENT AUDIT LOG" />
    </div>
  );
}
