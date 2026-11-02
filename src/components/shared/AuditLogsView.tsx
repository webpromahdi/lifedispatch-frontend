"use client";

import { Loader2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { useGetAuditLogs } from "@/hooks";
import type { AuditLog } from "@/lib/types/audit.types";
import { formatDate } from "@/lib/utils";

interface AuditLogsViewProps {
  userRole?: "SUPER_ADMIN" | "ADMIN";
}

export function AuditLogsView({
  userRole = "SUPER_ADMIN",
}: AuditLogsViewProps) {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: auditResponse, isLoading } = useGetAuditLogs({
    page: currentPage,
    limit: itemsPerPage,
    action: actionFilter !== "ALL" ? actionFilter : undefined,
  });

  const rawLogs: AuditLog[] = useMemo(() => {
    return auditResponse?.data ?? [];
  }, [auditResponse]);

  const totalPages = auditResponse?.meta?.totalPages || 1;
  const totalEvents = auditResponse?.meta?.total ?? rawLogs.length;

  // Filter logs locally by search term if search is provided
  const filteredLogs = useMemo(() => {
    if (!search.trim()) return rawLogs;
    const q = search.toLowerCase();
    return rawLogs.filter((log) => {
      const matchesAction = log.action?.toLowerCase().includes(q);
      const matchesEntity = log.entity?.toLowerCase().includes(q);
      const matchesActor = log.performedByName?.toLowerCase().includes(q);
      const matchesIP = log.ipAddress?.includes(q);
      return matchesAction || matchesEntity || matchesActor || matchesIP;
    });
  }, [rawLogs, search]);

  const basePath =
    userRole === "SUPER_ADMIN" ? "/dashboard/super-admin" : "/dashboard/admin";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security & System Audit Trail"
        description="Immutable write-once log of all privilege escalations, emergency status transitions, and user actions."
        breadcrumbs={[
          { label: "Dashboard", href: basePath },
          { label: "Audit Logs" },
        ]}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 border border-border rounded-none shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <Input
            placeholder="Search by action, actor, entity or IP..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="pl-9 text-base md:text-xs h-10 md:h-9"
            aria-label="Search audit records"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={actionFilter}
            onValueChange={(val) => {
              if (val) {
                setActionFilter(val);
                setCurrentPage(1);
              }
            }}
          >
            <SelectTrigger
              className="w-48 text-xs h-9"
              aria-label="Filter audit logs by action"
            >
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Actions</SelectItem>
              <SelectItem value="UPDATE_USER_STATUS">
                UPDATE_USER_STATUS
              </SelectItem>
              <SelectItem value="USER_CREATED">USER_CREATED</SelectItem>
              <SelectItem value="STATUS_CHANGE">STATUS_CHANGE</SelectItem>
              <SelectItem value="DIVERSION_UPDATE">DIVERSION_UPDATE</SelectItem>
              <SelectItem value="EMERGENCY_DISPATCHED">
                EMERGENCY_DISPATCHED
              </SelectItem>
              <SelectItem value="ROLE_ESCALATION">ROLE_ESCALATION</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Audit Log Table */}
      <DataTable
        headerSlot={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-sm text-text-primary">
              Immutable Records ({totalEvents} events)
            </span>
            <span className="text-xs text-text-muted">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        }
      >
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead scope="col" className="text-xs font-semibold">
                Event Timestamp
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Action Type
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Target Entity
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Entity ID
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Performed By
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Role
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                IP Address
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    Loading audit trail from secure ledger...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-xs text-text-muted"
                >
                  No audit logs recorded matching this criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow
                  key={log.id}
                  className="hover:bg-primary-light/20 transition-colors"
                >
                  <TableCell className="font-mono text-xs text-text-muted">
                    {formatDate(log.createdAt, "dd MMM yyyy, hh:mm:ss a")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] font-semibold bg-primary-light text-primary border-primary/20"
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-text-secondary font-medium">
                    {log.entity}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-text-muted">
                    {log.entityId
                      ? log.entityId.length > 12
                        ? `${log.entityId.slice(0, 12)}...`
                        : log.entityId
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-text-primary">
                    {log.performedByName}
                  </TableCell>
                  <TableCell>
                    <span className="text-[11px] text-text-muted font-mono">
                      {log.performedByRole}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-text-muted">
                    {log.ipAddress}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-border">
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </DataTable>
    </div>
  );
}
