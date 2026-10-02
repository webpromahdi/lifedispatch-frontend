"use client";

import { PriorityBadge } from "@/components/common/PriorityBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CornerNotch, LabelTab } from "@/components/shared/DashboardUIPrimitives";
import type { AnalyticsOverviewData } from "@/lib/dummy/analytics";
import type { AuditLog } from "@/lib/types/audit.types";
import type { EmergencyRequest } from "@/lib/types/emergency.types";

export function formatEnumTitle(val: string): string {
  if (!val) return "";
  return val
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function formatRole(role: string): string {
  if (!role) return "";
  const r = role.toUpperCase();
  if (r === "ADMIN") return "Admin";
  if (r === "DISPATCHER") return "Dispatcher";
  if (r === "SUPER_ADMIN") return "Super Admin";
  if (r === "DRIVER") return "Driver";
  return formatEnumTitle(role);
}

export function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return isoString;
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export function LiveOperationsCard({
  analytics,
}: {
  analytics: AnalyticsOverviewData;
}) {
  return (
    <section
      aria-label="Live Operations"
      className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5"
    >
      <CornerNotch />
      <LabelTab label="LIVE OPERATIONS" />

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
        <div className="p-3 sm:px-4 sm:py-2">
          <span className="text-xs font-semibold text-text-secondary block mb-1">
            Active Emergencies
          </span>
          <div className="text-3xl sm:text-4xl font-black text-text-primary font-mono leading-none">
            {analytics.liveOperations.activeEmergencies}
          </div>
        </div>

        <div className="p-3 sm:px-4 sm:py-2">
          <span className="text-xs font-semibold text-text-secondary block mb-1">
            Available Ambulances
          </span>
          <div className="text-3xl sm:text-4xl font-black text-primary-dark font-mono leading-none">
            {analytics.liveOperations.availableAmbulances}
          </div>
        </div>

        <div className="p-3 sm:px-4 sm:py-2">
          <span className="text-xs font-semibold text-text-secondary block mb-1">
            Busy Ambulances
          </span>
          <div className="text-3xl sm:text-4xl font-black text-text-primary font-mono leading-none">
            {analytics.liveOperations.busyAmbulances}
          </div>
        </div>

        <div className="p-3 sm:px-4 sm:py-2">
          <span className="text-xs font-semibold text-text-secondary block mb-1">
            Out of Service
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#D97706] font-mono leading-none">
            {analytics.liveOperations.outOfService}
          </div>
        </div>

        <div className="p-3 sm:px-4 sm:py-2 col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold text-text-secondary block mb-1">
            Drivers On Shift
          </span>
          <div className="text-3xl sm:text-4xl font-black text-primary-dark font-mono leading-none">
            {analytics.liveOperations.driversOnShift}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ActiveEmergenciesCard({
  emergencies,
}: {
  emergencies: EmergencyRequest[];
}) {
  return (
    <section
      aria-label="Active Emergencies"
      className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5 sm:p-6"
    >
      <CornerNotch />
      <LabelTab label="ACTIVE EMERGENCIES" />

      <div className="mt-4 overflow-x-auto -mx-5 sm:mx-0">
        <div className="min-w-155 px-5 sm:px-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-text-primary">
                <th scope="col" className="py-2.5 pr-4">
                  Incident No.
                </th>
                <th scope="col" className="py-2.5 px-4">
                  Type
                </th>
                <th scope="col" className="py-2.5 px-4">
                  Priority
                </th>
                <th scope="col" className="py-2.5 px-4">
                  Status
                </th>
                <th scope="col" className="py-2.5 px-4">
                  Location
                </th>
                <th scope="col" className="py-2.5 pl-4">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {emergencies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-muted">
                    No active emergencies at this time.
                  </td>
                </tr>
              ) : (
                emergencies.map((em) => (
                  <tr
                    key={em.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 pr-4 font-mono font-bold text-text-primary">
                      {em.incidentNumber}
                    </td>
                    <td className="py-3 px-4 font-medium text-text-primary">
                      {formatEnumTitle(em.emergencyType)}
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={em.priority} variant="square" />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={em.status} variant="square" />
                    </td>
                    <td className="py-3 px-4 text-text-secondary truncate max-w-45">
                      {em.locationAddress}
                    </td>
                    <td className="py-3 pl-4 text-text-secondary whitespace-nowrap">
                      {formatTime(em.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function RevenueCard({
  revenue,
}: {
  revenue: AnalyticsOverviewData["revenue"];
}) {
  return (
    <section
      aria-label="Revenue"
      className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5"
    >
      <CornerNotch />
      <LabelTab label="REVENUE" />

      <div className="mt-4 space-y-4">
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-medium text-text-secondary">
            Total Collected
          </span>
          <span className="text-xl sm:text-2xl font-black text-text-primary font-mono">
            {revenue.totalCollected.toLocaleString()} {revenue.currency}
          </span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-sm font-medium text-text-secondary">
            Total Pending
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#D97706] font-mono">
            {revenue.totalPending.toLocaleString()} {revenue.currency}
          </span>
        </div>
      </div>
    </section>
  );
}

export function EmergencySummaryCard({
  historicStats,
  emergencyAnalytics,
}: {
  historicStats: AnalyticsOverviewData["historicStats"];
  emergencyAnalytics: AnalyticsOverviewData["emergencyAnalytics"];
}) {
  return (
    <section
      aria-label="Emergency Summary"
      className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5"
    >
      <CornerNotch />
      <LabelTab label="EMERGENCY SUMMARY" />

      <div className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between items-center text-text-secondary">
          <span>Completed</span>
          <span className="font-bold text-text-primary font-mono">
            {historicStats.completed.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center text-text-secondary">
          <span>Cancelled</span>
          <span className="font-bold text-text-primary font-mono">
            {historicStats.cancelled.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center text-text-secondary">
          <span>Total Trips</span>
          <span className="font-bold text-text-primary font-mono">
            {historicStats.totalTrips.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center text-text-secondary">
          <span>Avg Response</span>
          <span className="font-bold text-text-primary font-mono">
            {emergencyAnalytics.avgResponseTimeMinutes != null
              ? `${emergencyAnalytics.avgResponseTimeMinutes} min`
              : "-"}
          </span>
        </div>
      </div>
    </section>
  );
}

export function SystemScaleCards({
  usersAndResources,
}: {
  usersAndResources: AnalyticsOverviewData["usersAndResources"];
}) {
  return (
    <section
      aria-label="System Scale Metrics"
      className="grid grid-cols-1 sm:grid-cols-3 gap-6"
    >
      <div className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5">
        <CornerNotch />
        <span className="text-xs font-semibold text-text-secondary block mb-1">
          Total Patients
        </span>
        <div className="text-3xl sm:text-4xl font-black text-primary-dark font-mono leading-none">
          {usersAndResources.totalPatients.toLocaleString()}
        </div>
      </div>

      <div className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5">
        <CornerNotch />
        <span className="text-xs font-semibold text-text-secondary block mb-1">
          Total Drivers
        </span>
        <div className="text-3xl sm:text-4xl font-black text-primary-dark font-mono leading-none">
          {usersAndResources.totalDrivers.toLocaleString()}
        </div>
      </div>

      <div className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5 flex items-center justify-between">
        <CornerNotch />
        <div>
          <span className="text-xs font-semibold text-text-secondary block mb-1">
            Total Hospitals
          </span>
          <div className="text-3xl sm:text-4xl font-black text-primary-dark font-mono leading-none">
            {usersAndResources.totalHospitals.toLocaleString()}
          </div>
        </div>
        <div className="text-secondary shrink-0 pr-1" aria-hidden="true">
          <svg
            className="w-10 h-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="Hospital icon"
          >
            <title>Hospital icon</title>
            <path d="M12 6v4" />
            <path d="M10 8h4" />
            <path d="M18 20V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16" />
            <path d="M2 20h20" />
            <path d="M10 14h4v6h-4z" />
          </svg>
        </div>
      </div>
    </section>
  );
}

export function AuditLogCard({
  logs,
  showIpAddress = false,
  maxRows = 5,
  title = "RECENT AUDIT LOG",
}: {
  logs: AuditLog[];
  showIpAddress?: boolean;
  maxRows?: number;
  title?: string;
}) {
  const displayLogs = logs.slice(0, maxRows);

  return (
    <section
      aria-label={title}
      className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5 sm:p-6"
    >
      <CornerNotch />
      <LabelTab label={title} />

      <div className="mt-4 overflow-x-auto -mx-5 sm:mx-0">
        <div className="min-w-155 px-5 sm:px-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-text-primary">
                <th scope="col" className="py-2.5 pr-4">
                  Action
                </th>
                <th scope="col" className="py-2.5 px-4">
                  Entity
                </th>
                <th scope="col" className="py-2.5 px-4">
                  Performed By
                </th>
                <th scope="col" className="py-2.5 px-4">
                  Role
                </th>
                {showIpAddress && (
                  <th scope="col" className="py-2.5 px-4">
                    IP Address
                  </th>
                )}
                <th scope="col" className="py-2.5 pl-4">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {displayLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={showIpAddress ? 6 : 5}
                    className="py-8 text-center text-text-muted"
                  >
                    No audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                displayLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 pr-4 font-mono font-medium text-text-primary flex items-center">
                      <span className="w-2.5 h-2.5 bg-text-muted inline-block mr-2.5 shrink-0 rounded-none" />
                      <span>{log.action}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-text-primary">
                      {log.entity}
                    </td>
                    <td className="py-3 px-4 text-text-primary font-medium">
                      {log.performedByName}
                    </td>
                    <td className="py-3 px-4 text-text-secondary">
                      {formatRole(log.performedByRole)}
                    </td>
                    {showIpAddress && (
                      <td className="py-3 px-4 font-mono text-text-secondary text-xs">
                        {log.ipAddress || "-"}
                      </td>
                    )}
                    <td className="py-3 pl-4 text-text-secondary whitespace-nowrap">
                      {formatTime(log.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
