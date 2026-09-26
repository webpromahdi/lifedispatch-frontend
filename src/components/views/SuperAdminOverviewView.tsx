"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Ambulance,
  Building2,
  Clock,
  FileText,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { EmergencyLineChart } from "@/components/charts/EmergencyLineChart";
import { StatusBreakdownBar } from "@/components/charts/StatusBreakdownBar";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { seedAmbulances } from "@/lib/dummy/ambulances";
import { seedAuditLogs } from "@/lib/dummy/audit-logs";
import { seedEmergencies } from "@/lib/dummy/emergencies";
import { seedHospitals } from "@/lib/dummy/hospitals";
import { seedUsers } from "@/lib/dummy/users";
import { formatDate } from "@/lib/utils";

export function SuperAdminOverviewView() {
  // Computed KPIs from static seeds
  const _totalUsers = seedUsers.length;
  const totalPatients = seedUsers.filter((u) => u.role === "PATIENT").length;
  const activeEmergencies = seedEmergencies.filter(
    (e) => e.status !== "COMPLETED" && e.status !== "CANCELLED",
  ).length;
  const availableAmbulances = seedAmbulances.filter(
    (a) => a.status === "AVAILABLE",
  ).length;
  const totalHospitals = seedHospitals.length;
  const totalAuditLogs = seedAuditLogs.length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Command & Security"
        description="High-privilege system oversight, real-time dispatch volume telemetry, and governance audit trail."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/super-admin" },
          { label: "Super Admin Overview" },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Link href="/dashboard/super-admin/users">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 font-medium"
              >
                <Users className="h-4 w-4" aria-hidden="true" />
                Manage Users
              </Button>
            </Link>
            <Link href="/dashboard/super-admin/audit-logs">
              <Button
                size="sm"
                className="bg-primary text-white hover:bg-primary-hover font-semibold gap-1.5"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                Audit Logs
              </Button>
            </Link>
          </div>
        }
      />

      {/* 6 StatCards stagger-revealed on mount */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            label="Active Emergencies"
            value={activeEmergencies}
            icon={Activity}
            subtitle="CAD triage queue"
            trend={{ value: "+2 live", isPositive: true }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="Registered Patients"
            value={totalPatients}
            icon={Users}
            subtitle="Patient portal profiles"
            trend={{ value: "+12% MoM", isPositive: true }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="Ambulances Ready"
            value={`${availableAmbulances}/${seedAmbulances.length}`}
            icon={Ambulance}
            subtitle="Live GPS available"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="Network Hospitals"
            value={totalHospitals}
            icon={Building2}
            subtitle="ER diversion enabled"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="Avg Response Time"
            value="8.4m"
            icon={Clock}
            subtitle="Dhaka metropolitan area"
            trend={{ value: "-1.2m faster", isPositive: true }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="Security Audit Trail"
            value={totalAuditLogs}
            icon={Shield}
            subtitle="Immutable events logged"
          />
        </motion.div>
      </motion.div>

      {/* Dual Analytics Charts: Emergency Line Chart + Status Breakdown Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                24-Hour Emergency Dispatch Volume
              </h2>
              <p className="text-xs text-text-muted">
                Incoming CAD calls vs. resolved patient hospital handovers
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-primary px-2 py-0.5 rounded-md bg-primary-light">
              Live Stream
            </span>
          </div>
          <EmergencyLineChart />
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                Active Incident Status Breakdown
              </h2>
              <p className="text-xs text-text-muted">
                Distribution across current emergency lifecycle stages
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-text-secondary px-2 py-0.5 rounded-md bg-muted">
              Dhaka Metro
            </span>
          </div>
          <StatusBreakdownBar />
        </div>
      </div>

      {/* Recent Audit Trail Preview */}
      <DataTable
        headerSlot={
          <div className="flex items-center justify-between w-full">
            <div>
              <h3 className="font-semibold text-sm text-text-primary">
                Recent Security Audit Events
              </h3>
              <p className="text-xs text-text-muted">
                Immutable system event logs for regulatory compliance (PRD §3.5)
              </p>
            </div>
            <Link
              href="/dashboard/super-admin/audit-logs"
              className="text-xs text-primary hover:underline font-semibold"
            >
              View Full Audit Log &rarr;
            </Link>
          </div>
        }
      >
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead scope="col" className="text-xs font-semibold">
                Timestamp
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Action
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Target Entity
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Actor
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                IP Address
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seedAuditLogs.slice(0, 5).map((log) => (
              <TableRow
                key={log.id}
                className="hover:bg-primary-light/20 transition-colors"
              >
                <TableCell className="font-mono text-xs text-text-muted">
                  {formatDate(log.createdAt, "dd MMM yyyy, hh:mm:ss a")}
                </TableCell>
                <TableCell className="font-mono text-xs font-semibold text-primary">
                  {log.action}
                </TableCell>
                <TableCell className="text-xs text-text-secondary">
                  {log.entity} (
                  <span className="font-mono text-text-muted">
                    {log.entityId ? `${log.entityId.slice(0, 10)}...` : "N/A"}
                  </span>
                  )
                </TableCell>
                <TableCell className="text-xs text-text-primary">
                  {log.performedByName}{" "}
                  <span className="text-text-muted">
                    ({log.performedByRole})
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs text-text-muted">
                  {log.ipAddress}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
    </div>
  );
}
