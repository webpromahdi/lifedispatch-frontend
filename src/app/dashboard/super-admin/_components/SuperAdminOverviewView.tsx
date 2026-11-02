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
import { CornerNotch } from "@/components/shared/DashboardUIPrimitives";
import {
  useGetAdminUsers,
  useGetAnalyticsOverview,
  useGetAuditLogs,
  useGetEmergencies,
} from "@/hooks";
import type { AnalyticsOverviewData } from "@/lib/dummy/analytics";
import type { AdminAnalyticsOverview } from "@/lib/types/admin.types";
import { EmergencyStatus, UserRole, UserStatus } from "@/lib/types/enums";

function mapToAnalyticsOverviewData(
  data?: AdminAnalyticsOverview,
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
      avgResponseTimeMinutes: 8.4,
    },
    usersAndResources: {
      totalPatients: data?.usersAndResources?.totalPatients ?? 0,
      totalDrivers: data?.usersAndResources?.totalDrivers ?? 0,
      totalHospitals: data?.usersAndResources?.totalHospitals ?? 0,
    },
  };
}

export function SuperAdminOverviewView() {
  // Live Operations from backend API refreshed every 15s
  const { data: analyticsResponse } = useGetAnalyticsOverview({
    refetchInterval: 15_000,
  });

  const analytics = useMemo(() => {
    return mapToAnalyticsOverviewData(analyticsResponse?.data);
  }, [analyticsResponse]);

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

  // Live user directory for account governance counts
  const { data: usersResponse } = useGetAdminUsers(
    { limit: 100 },
    { refetchInterval: 30_000 },
  );

  const usersList = useMemo(() => {
    return usersResponse?.data ?? [];
  }, [usersResponse]);

  const adminAccountsCount = useMemo(() => {
    return usersList.filter((u) => u.role === UserRole.ADMIN).length;
  }, [usersList]);

  const suspendedAccountsCount = useMemo(() => {
    return usersList.filter((u) => u.status === UserStatus.SUSPENDED).length;
  }, [usersList]);

  const deletedAccountsCount = useMemo(() => {
    return usersList.filter(
      (u) => u.status === UserStatus.DELETED || u.isDeleted,
    ).length;
  }, [usersList]);

  // Security audit trail: Up to 8 rows, security-oriented view with IP address
  const { data: auditResponse } = useGetAuditLogs(
    { limit: 8 },
    { refetchInterval: 15_000 },
  );

  const securityLogs = useMemo(() => {
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

      {/* ── 5b. EXTRA ROW: ACCOUNT GOVERNANCE STAT CARDS ── */}
      <section
        aria-label="Account Governance Metrics"
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        {/* Admin Accounts */}
        <div className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5">
          <CornerNotch />
          <span className="text-xs font-semibold text-text-secondary block mb-1">
            Admin Accounts
          </span>
          <div className="text-3xl sm:text-4xl font-black text-primary-dark font-mono leading-none">
            {adminAccountsCount}
          </div>
        </div>

        {/* Suspended Accounts (Amber) */}
        <div className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5">
          <CornerNotch />
          <span className="text-xs font-semibold text-text-secondary block mb-1">
            Suspended Accounts
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#D97706] font-mono leading-none">
            {suspendedAccountsCount}
          </div>
        </div>

        {/* Deleted Accounts */}
        <div className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5">
          <CornerNotch />
          <span className="text-xs font-semibold text-text-secondary block mb-1">
            Deleted Accounts
          </span>
          <div className="text-3xl sm:text-4xl font-black text-primary-dark font-mono leading-none">
            {deletedAccountsCount}
          </div>
        </div>
      </section>

      {/* ── 6. SECURITY AUDIT LOG TABLE (Up to 8 rows, with IP Address) ── */}
      <AuditLogCard
        logs={securityLogs}
        maxRows={8}
        showIpAddress={true}
        title="SECURITY AUDIT TRAIL"
      />
    </div>
  );
}
