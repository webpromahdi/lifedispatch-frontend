"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ActiveEmergenciesCard,
  AuditLogCard,
  EmergencySummaryCard,
  LiveOperationsCard,
  RevenueCard,
  SystemScaleCards,
} from "@/components/shared/AdminDashboardSections";
import {
  type AnalyticsOverviewData,
  getAnalyticsOverview,
} from "@/lib/dummy/analytics";
import { seedAuditLogs } from "@/lib/dummy/audit-logs";
import { seedEmergencies } from "@/lib/dummy/emergencies";
import { EmergencyStatus } from "@/lib/types/enums";

export function AdminOverviewView() {
  const [analytics, setAnalytics] = useState<AnalyticsOverviewData>(
    getAnalyticsOverview(),
  );

  // Live Operations refresh ~15 seconds with existing fetching approach
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(getAnalyticsOverview());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Latest 5 emergencies in PENDING, PRIORITIZED, DISPATCHING or ACTIVE_TRIP
  const activeEmergenciesList = useMemo(() => {
    return seedEmergencies
      .filter(
        (e) =>
          e.status === EmergencyStatus.PENDING ||
          e.status === EmergencyStatus.PRIORITIZED ||
          e.status === EmergencyStatus.DISPATCHING ||
          e.status === EmergencyStatus.ACTIVE_TRIP,
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, []);

  // Latest 4 to 5 audit logs
  const recentLogs = useMemo(() => {
    return [...seedAuditLogs]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 4);
  }, []);

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
