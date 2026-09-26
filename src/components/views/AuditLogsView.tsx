"use client";

import { Search } from "lucide-react";
import { useState } from "react";
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
import { seedAuditLogs } from "@/lib/dummy/audit-logs";
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
  const itemsPerPage = 6;

  // Filter logs
  const filteredLogs = seedAuditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase()) ||
      log.performedByName.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress.includes(search);
    const matchesAction = actionFilter === "ALL" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 border border-border rounded-xl shadow-2xs">
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
              setCurrentPage(1);
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
              <SelectItem value="ALL">
                All Actions ({seedAuditLogs.length})
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
              Immutable Records ({filteredLogs.length} events)
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
            {paginatedLogs.map((log) => (
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
            ))}
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
