"use client";

import {
  AlertTriangle,
  Filter,
  MapPin,
  Receipt,
  RefreshCw,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import { useGetEmergencies } from "@/hooks";
import { EmergencyType } from "@/lib/types/enums";
import { formatDate } from "@/lib/utils";

export function PatientHistoryView() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
    emergencyType:
      typeFilter !== "ALL" ? (typeFilter as EmergencyType) : undefined,
  };

  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetEmergencies(queryParams);

  const emergencies = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Emergency Medical History"
        description="Chronological record of your past emergency ambulance dispatches, triage assessments, and clinical hospital transfers."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/patient" },
          { label: "Medical History" },
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
            placeholder="Search incident #, condition, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-base md:text-xs h-10 md:h-9"
            aria-label="Search emergency records"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-text-muted" aria-hidden="true" />
          <Select
            value={typeFilter}
            onValueChange={(val) => {
              if (val) {
                setTypeFilter(val);
                setCurrentPage(1);
              }
            }}
          >
            <SelectTrigger
              className="w-48 text-xs h-9"
              aria-label="Filter by emergency type"
            >
              <SelectValue placeholder="All Emergency Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value={EmergencyType.CARDIAC}>Cardiac</SelectItem>
              <SelectItem value={EmergencyType.TRAUMA}>Trauma</SelectItem>
              <SelectItem value={EmergencyType.RESPIRATORY}>
                Respiratory
              </SelectItem>
              <SelectItem value={EmergencyType.NEUROLOGICAL}>
                Neurological
              </SelectItem>
              <SelectItem value={EmergencyType.OBSTETRIC}>Obstetric</SelectItem>
              <SelectItem value={EmergencyType.PEDIATRIC}>Pediatric</SelectItem>
              <SelectItem value={EmergencyType.PSYCHIATRIC}>
                Psychiatric
              </SelectItem>
              <SelectItem value={EmergencyType.OTHER}>Other</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 px-3 text-xs"
            aria-label="Refresh medical history"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
            <span>
              Failed to load emergency history:{" "}
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

      {/* Timeline List of Emergencies */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton placeholder
              key={`history-skeleton-${idx}`}
              className="p-5 rounded-none bg-surface border border-border shadow-xs space-y-4 animate-pulse"
            >
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <div className="h-4 w-32 bg-muted rounded-none" />
                <div className="h-4 w-24 bg-muted rounded-none" />
              </div>
              <div className="h-12 w-full bg-muted rounded-none" />
            </div>
          ))
        ) : emergencies.length === 0 ? (
          <div className="p-12 text-center bg-surface border border-border text-xs text-text-muted space-y-1">
            <p className="font-semibold text-text-primary">
              No emergency records found.
            </p>
            <p>
              Your past emergency requests and trip logs will appear here once
              logged.
            </p>
          </div>
        ) : (
          emergencies.map((em) => (
            <div
              key={em.id}
              className="p-5 rounded-none bg-surface border border-border shadow-xs space-y-4"
            >
              {/* Top row: Incident #, Type, Priority, Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-text-primary">
                    {em.incidentNumber}
                  </span>
                  <Badge
                    variant="outline"
                    className="font-semibold text-xs capitalize bg-muted"
                  >
                    {em.emergencyType.toLowerCase()}
                  </Badge>
                  <PriorityBadge priority={em.priority} />
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={em.status} />
                  <span className="text-xs font-mono text-text-muted">
                    {formatDate(em.createdAt, "MMM dd, yyyy • hh:mm a")}
                  </span>
                </div>
              </div>

              {/* Middle: Clinical Description and Location details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2 space-y-2">
                  <p className="text-text-secondary leading-relaxed">
                    {em.description}
                  </p>

                  <div className="flex items-center gap-2 text-text-muted text-[11px] pt-1">
                    <MapPin
                      className="h-3.5 w-3.5 text-primary shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-text-secondary truncate">
                      {em.locationAddress}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-none bg-background border border-border space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-text-muted">Capability:</span>
                    <span className="font-semibold text-text-primary">
                      {em.requiredCapability}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-text-muted">SLA Target:</span>
                    <span className="font-medium text-text-primary">
                      {em.slaTargetMinutes || 8} min
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-text-muted">Response Time:</span>
                    <span className="font-semibold text-status">
                      {em.responseTimeMinutes
                        ? `${em.responseTimeMinutes} min`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom: Invoice Action */}
              <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                <span className="text-text-muted">
                  Caller: <strong>{em.callerName}</strong> ({em.callerPhone})
                </span>

                <Link
                  href={`/dashboard/patient/payment/${em.id}`}
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-dark font-semibold px-3 py-1.5 rounded-none hover:bg-primary-light cursor-pointer"
                >
                  <Receipt className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>View Trip Invoice</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-4 bg-surface border border-border">
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
