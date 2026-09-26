"use client";

import { CheckCircle2, FileText, Lock, Shield } from "lucide-react";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { seedAuditLogs } from "@/lib/dummy/audit-logs";
import { formatDate } from "@/lib/utils";

export function SuperAdminView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Super Admin Governance & Audit"
        description="High-privilege platform controls, immutable audit logging, and security posture monitoring."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/super-admin" },
          { label: "Super Admin" },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Audit Log Entries"
          value={seedAuditLogs.length}
          icon={FileText}
          subtitle="Real-time security events"
        />
        <StatCard
          label="RBAC Roles"
          value="6 Roles"
          icon={Shield}
          subtitle="Strict Prisma/JWT guards"
        />
        <StatCard
          label="Redis Token Sets"
          value="100% Synced"
          icon={Lock}
          trend={{ value: "Active", isPositive: true }}
          subtitle="Dual refresh token revocation"
        />
        <StatCard
          label="System Health"
          value="Operational"
          icon={CheckCircle2}
          trend={{ value: "99.98%", isPositive: true }}
          subtitle="Zero unhandled 500s"
        />
      </div>

      <DataTable
        headerSlot={
          <div className="font-semibold text-sm text-text-primary">
            Recent System Audit Trail (PRD §3.5 & User Story 8.3)
          </div>
        }
      >
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead className="text-xs font-semibold">Timestamp</TableHead>
              <TableHead className="text-xs font-semibold">Action</TableHead>
              <TableHead className="text-xs font-semibold">
                Target Entity
              </TableHead>
              <TableHead className="text-xs font-semibold">Actor</TableHead>
              <TableHead className="text-xs font-semibold">
                IP Address
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seedAuditLogs.map((log) => (
              <TableRow
                key={log.id}
                className="hover:bg-primary-light/30 transition-colors"
              >
                <TableCell className="font-mono text-xs text-text-muted">
                  {formatDate(log.createdAt, "dd MMM yyyy, hh:mm:ss a")}
                </TableCell>
                <TableCell className="font-mono text-xs font-semibold text-primary">
                  {log.action}
                </TableCell>
                <TableCell className="text-xs text-text-secondary">
                  {log.entity} ({log.entityId})
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
