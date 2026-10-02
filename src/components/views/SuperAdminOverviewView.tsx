"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ActiveEmergenciesCard,
  AuditLogCard,
  EmergencySummaryCard,
  LiveOperationsCard,
  RevenueCard,
  SystemScaleCards,
} from "@/components/admin/AdminDashboardSections";
import { CornerNotch } from "@/components/views/PatientView";
import {
  type AnalyticsOverviewData,
  getAnalyticsOverview,
} from "@/lib/dummy/analytics";
import { seedAuditLogs } from "@/lib/dummy/audit-logs";
import { seedEmergencies } from "@/lib/dummy/emergencies";
import { seedUsers } from "@/lib/dummy/users";
import { EmergencyStatus, UserRole, UserStatus } from "@/lib/types/enums";

export function SuperAdminOverviewView() {
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

  // Account governance metrics: Admin Accounts, Suspended Accounts, Deleted Accounts
  const adminAccountsCount = useMemo(() => {
    return seedUsers.filter((u) => u.role === UserRole.ADMIN).length;
  }, []);

  const suspendedAccountsCount = useMemo(() => {
    return seedUsers.filter((u) => u.status === UserStatus.SUSPENDED).length;
  }, []);

  const deletedAccountsCount = useMemo(() => {
    return seedUsers.filter(
      (u) => u.status === UserStatus.DELETED || u.isDeleted,
    ).length;
  }, []);

  // Security audit trail: Up to 8 rows, security-oriented view with IP address
  const securityLogs = useMemo(() => {
    return [...seedAuditLogs]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 8);
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

      {/* ── 5b. EXTRA ROW: ACCOUNT GOVERNANCE STAT CARDS ── */}
      <section
        aria-label="Account Governance Metrics"
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        {/* Admin Accounts */}
        <div className="relative bg-white border-2 border-[#14B8A6] rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5">
          <CornerNotch />
          <span className="text-xs font-semibold text-text-secondary block mb-1">
            Admin Accounts
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#0D9488] font-mono leading-none">
            {adminAccountsCount}
          </div>
        </div>

        {/* Suspended Accounts (Amber) */}
        <div className="relative bg-white border-2 border-[#14B8A6] rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5">
          <CornerNotch />
          <span className="text-xs font-semibold text-text-secondary block mb-1">
            Suspended Accounts
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#D97706] font-mono leading-none">
            {suspendedAccountsCount}
          </div>
        </div>

        {/* Deleted Accounts */}
        <div className="relative bg-white border-2 border-[#14B8A6] rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5">
          <CornerNotch />
          <span className="text-xs font-semibold text-text-secondary block mb-1">
            Deleted Accounts
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#0D9488] font-mono leading-none">
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
