"use client";

import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PriorityPieChart } from "@/components/charts/PriorityPieChart";
import { StatusBreakdownBar } from "@/components/charts/StatusBreakdownBar";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { seedEmergencies } from "@/lib/dummy/emergencies";

interface AnalyticsViewProps {
  userRole?: "SUPER_ADMIN" | "ADMIN";
}

export function AnalyticsView({
  userRole = "SUPER_ADMIN",
}: AnalyticsViewProps) {
  const [dateRange, setDateRange] = useState("30D");

  // Computed KPIs from seedEmergencies array
  const totalEmergencies = seedEmergencies.length;
  const escalatedCount = seedEmergencies.filter(
    (e) => e.priority === "P1_CRITICAL" || e.priority === "P2_EMERGENCY",
  ).length;
  const avgResponseTime = "8.4 mins";
  const handoverSuccessRate = "98.2%";

  // Aggregation of emergency types
  const typeCounts = seedEmergencies.reduce(
    (acc, curr) => {
      acc[curr.emergencyType] = (acc[curr.emergencyType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const emergencyTypesList = Object.entries(typeCounts).map(
    ([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / totalEmergencies) * 100),
    }),
  );

  const handleExport = () => {
    toast.success("Analytics Export Generated", {
      description: "Emergency dispatch telemetry report downloaded as PDF.",
    });
  };

  const basePath =
    userRole === "SUPER_ADMIN" ? "/dashboard/super-admin" : "/dashboard/admin";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet & Dispatch Analytics"
        description="Comprehensive operational telemetry, priority triage analysis, and hospital handover velocity."
        breadcrumbs={[
          { label: "Dashboard", href: basePath },
          { label: "Analytics" },
        ]}
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="font-medium gap-1.5"
          >
            Export Telemetry Report
          </Button>
        }
      />

      {/* Date Range Filter (UI only per specification) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 border border-border rounded-xl shadow-2xs">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="text-xs font-semibold text-text-primary">
            Reporting Window:
          </span>
          <span className="text-xs text-text-muted">
            Computed from system operational seeds
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={dateRange}
            onValueChange={(val) => val && setDateRange(val)}
          >
            <SelectTrigger
              className="w-48 text-xs h-9"
              aria-label="Filter analytics by date range"
            >
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24H">Last 24 Hours</SelectItem>
              <SelectItem value="7D">Last 7 Days</SelectItem>
              <SelectItem value="30D">Last 30 Days (Default)</SelectItem>
              <SelectItem value="90D">Last Quarter</SelectItem>
              <SelectItem value="YTD">Year to Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Incidents"
          value={totalEmergencies}
          icon={Activity}
          trend={{ value: "+8.4%", isPositive: true }}
          subtitle="Processed via CAD dispatch"
        />
        <StatCard
          label="High-Acuity Escalated"
          value={escalatedCount}
          icon={AlertTriangle}
          trend={{ value: "P1 & P2 Acuity", isPositive: false }}
          subtitle="Resuscitation & emergent calls"
        />
        <StatCard
          label="Avg Response Time"
          value={avgResponseTime}
          icon={Clock}
          trend={{ value: "-1.8 mins", isPositive: true }}
          subtitle="Call answered to on-scene"
        />
        <StatCard
          label="Handover Success"
          value={handoverSuccessRate}
          icon={CheckCircle2}
          trend={{ value: "0.2% diverted", isPositive: true }}
          subtitle="Successful ER bed admissions"
        />
      </div>

      {/* Dual Charts: Priority Pie Chart + Status Breakdown Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-xl p-5 shadow-xs">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-text-primary">
              Triage Priority Distribution (P1–P5)
            </h2>
            <p className="text-xs text-text-muted">
              Severity breakdown per protocol rules (PRD §3.4)
            </p>
          </div>
          <PriorityPieChart />
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 shadow-xs">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-text-primary">
              Active Lifecycle Stages
            </h2>
            <p className="text-xs text-text-muted">
              Volume by status across Dhaka regional centers
            </p>
          </div>
          <StatusBreakdownBar />
        </div>
      </div>

      {/* Emergency Type Breakdown Table */}
      <DataTable
        headerSlot={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-sm text-text-primary">
              Emergency Type Distribution
            </span>
            <span className="text-xs text-text-muted font-mono">
              Categorized by clinical acuity
            </span>
          </div>
        }
      >
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead scope="col" className="text-xs font-semibold">
                Clinical Emergency Type
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Incident Count
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Relative Share
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Recommended Unit
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emergencyTypesList.map((item) => (
              <TableRow
                key={item.type}
                className="hover:bg-primary-light/20 transition-colors"
              >
                <TableCell className="font-semibold text-xs text-text-primary">
                  {item.type}
                </TableCell>
                <TableCell className="font-mono text-xs text-text-secondary">
                  {item.count} incidents
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-text-muted">
                      {item.percentage}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-text-muted">
                  {item.type === "CARDIAC" || item.type === "TRAUMA"
                    ? "ALS (Advanced Life Support)"
                    : "BLS / Basic Transport"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
    </div>
  );
}
