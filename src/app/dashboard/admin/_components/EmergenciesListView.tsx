"use client";

import { AlertCircle, AlertTriangle, RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useGetEmergencies } from "@/hooks";
import { EmergencyPriority, EmergencyStatus } from "@/lib/types/enums";
import { formatDate } from "@/lib/utils";

export function EmergenciesListView() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = {
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch.trim() || undefined,
    priority:
      priorityFilter !== "ALL"
        ? (priorityFilter as EmergencyPriority)
        : undefined,
    status:
      statusFilter !== "ALL" ? (statusFilter as EmergencyStatus) : undefined,
  };

  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetEmergencies(queryParams);

  const emergencies = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const totalItems = meta?.total ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Emergency CAD Incidents"
        description="Comprehensive dispatch queue logs, real-time triage priority, and incident telematics tracking."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "Live Emergencies" },
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
            placeholder="Search incident #, caller, address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-base md:text-xs h-10 md:h-9"
            aria-label="Search emergency incidents"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Priority filter */}
          <Select
            value={priorityFilter}
            onValueChange={(val) => {
              if (val) {
                setPriorityFilter(val);
                setCurrentPage(1);
              }
            }}
          >
            <SelectTrigger
              className="w-40 text-xs h-9"
              aria-label="Filter emergencies by priority"
            >
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Priorities</SelectItem>
              <SelectItem value={EmergencyPriority.P1_CRITICAL}>
                P1 Critical
              </SelectItem>
              <SelectItem value={EmergencyPriority.P2_EMERGENCY}>
                P2 Emergency
              </SelectItem>
              <SelectItem value={EmergencyPriority.P3_URGENT}>
                P3 Urgent
              </SelectItem>
              <SelectItem value={EmergencyPriority.P4_NON_URGENT}>
                P4 Non-Urgent
              </SelectItem>
              <SelectItem value={EmergencyPriority.P5_ROUTINE}>
                P5 Routine
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              if (val) {
                setStatusFilter(val);
                setCurrentPage(1);
              }
            }}
          >
            <SelectTrigger
              className="w-48 text-xs h-9"
              aria-label="Filter emergencies by status"
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value={EmergencyStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={EmergencyStatus.PRIORITIZED}>
                Prioritized
              </SelectItem>
              <SelectItem value={EmergencyStatus.DISPATCHING}>
                Dispatching
              </SelectItem>
              <SelectItem value={EmergencyStatus.ACTIVE_TRIP}>
                Active Trip
              </SelectItem>
              <SelectItem value={EmergencyStatus.COMPLETED}>
                Completed
              </SelectItem>
              <SelectItem value={EmergencyStatus.CANCELLED}>
                Cancelled
              </SelectItem>
              <SelectItem value={EmergencyStatus.REASSIGNMENT_REQUIRED}>
                Reassignment Required
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 px-3 text-xs"
            aria-label="Refresh emergency incidents"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
            <span>
              Failed to load emergency records:{" "}
              {error instanceof Error ? error.message : "Unknown server error."}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="h-7 text-xs bg-white"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Emergency Incidents Table */}
      <DataTable
        headerSlot={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-sm text-text-primary">
              Emergency Queue ({totalItems} incidents)
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
                Incident Number
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Type
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Triage Priority
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                CAD Status
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Incident Location
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Caller & Contact
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Logged At
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow
                  // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array
                  key={`skeleton-${index}`}
                >
                  <TableCell className="py-4">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded-none" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 bg-muted animate-pulse rounded-none" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded-none" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded-none" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-36 bg-muted animate-pulse rounded-none" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-28 bg-muted animate-pulse rounded-none" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded-none" />
                  </TableCell>
                </TableRow>
              ))
            ) : emergencies.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-xs text-text-muted"
                >
                  No emergency incidents found matching this criteria.
                </TableCell>
              </TableRow>
            ) : (
              emergencies.map((em) => (
                <TableRow
                  key={em.id}
                  className="hover:bg-primary-light/20 transition-colors"
                >
                  <TableCell className="font-mono text-xs font-semibold text-primary py-3">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle
                        className="h-3.5 w-3.5 text-primary shrink-0"
                        aria-hidden="true"
                      />
                      {em.incidentNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] font-semibold bg-muted text-text-secondary"
                    >
                      {em.emergencyType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={em.priority} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={em.status} />
                  </TableCell>
                  <TableCell className="text-xs text-text-secondary max-w-55 truncate">
                    {em.locationAddress}
                  </TableCell>
                  <TableCell className="text-xs text-text-primary">
                    <div className="font-medium">{em.callerName}</div>
                    <div className="text-[11px] text-text-muted font-mono">
                      {em.callerPhone}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-text-muted">
                    {formatDate(em.createdAt, "dd MMM, hh:mm a")}
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
