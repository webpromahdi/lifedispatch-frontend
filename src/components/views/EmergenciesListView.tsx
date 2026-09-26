"use client";

import { AlertCircle, Search } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
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
import { seedEmergencies } from "@/lib/dummy/emergencies";
import { formatDate } from "@/lib/utils";

export function EmergenciesListView() {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredEmergencies = seedEmergencies.filter((em) => {
    const matchesSearch =
      em.incidentNumber.toLowerCase().includes(search.toLowerCase()) ||
      em.emergencyType.toLowerCase().includes(search.toLowerCase()) ||
      em.locationAddress.toLowerCase().includes(search.toLowerCase()) ||
      em.callerName.toLowerCase().includes(search.toLowerCase());
    const matchesPriority =
      priorityFilter === "ALL" || em.priority === priorityFilter;
    const matchesStatus = statusFilter === "ALL" || em.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEmergencies.length / itemsPerPage) || 1;
  const paginatedEmergencies = filteredEmergencies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 border border-border rounded-xl shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <Input
            placeholder="Search incident #, caller, address..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
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
              className="w-36 text-xs h-9"
              aria-label="Filter emergencies by priority"
            >
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Priorities</SelectItem>
              <SelectItem value="P1">P1 Resuscitation</SelectItem>
              <SelectItem value="P2">P2 Emergent</SelectItem>
              <SelectItem value="P3">P3 Urgent</SelectItem>
              <SelectItem value="P4">P4 Less Urgent</SelectItem>
              <SelectItem value="P5">P5 Non-Urgent</SelectItem>
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
              className="w-40 text-xs h-9"
              aria-label="Filter emergencies by status"
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="SEARCHING">SEARCHING</SelectItem>
              <SelectItem value="ASSIGNED">ASSIGNED</SelectItem>
              <SelectItem value="ACCEPTED">ACCEPTED</SelectItem>
              <SelectItem value="EN_ROUTE">EN_ROUTE</SelectItem>
              <SelectItem value="ON_SCENE">ON_SCENE</SelectItem>
              <SelectItem value="TRANSPORTING">TRANSPORTING</SelectItem>
              <SelectItem value="HANDED_OVER">HANDED_OVER</SelectItem>
              <SelectItem value="RESOLVED">RESOLVED</SelectItem>
              <SelectItem value="CANCELLED">CANCELLED</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Emergency Incidents Table */}
      <DataTable
        headerSlot={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-sm text-text-primary">
              Emergency Queue ({filteredEmergencies.length} incidents)
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
            {paginatedEmergencies.map((em) => (
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
                <TableCell className="text-xs text-text-secondary max-w-[220px] truncate">
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
