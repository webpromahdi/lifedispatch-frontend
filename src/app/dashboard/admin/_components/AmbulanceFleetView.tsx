"use client";

import { AlertCircle, Ambulance, Loader2, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
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
import { useGetAmbulances, useUpdateAmbulanceStatus } from "@/hooks";
import { AmbulanceStatus } from "@/lib/types/enums";
import { CreateAmbulanceDialog } from "./dialogs/CreateAmbulanceDialog";

const SKELETON_ROWS = [
  "skel-row-1",
  "skel-row-2",
  "skel-row-3",
  "skel-row-4",
];

export function AmbulanceFleetView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const {
    data: ambulancesResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAmbulances({
    status: statusFilter === "ALL" ? undefined : (statusFilter as AmbulanceStatus),
  });

  const updateStatusMutation = useUpdateAmbulanceStatus();

  const ambulances = ambulancesResponse?.data || [];

  const handleUpdateStatus = (
    id: string,
    newStatus: AmbulanceStatus,
    regNum: string,
  ) => {
    updateStatusMutation.mutate(
      { id, status: newStatus },
      {
        onSuccess: () => {
          toast.success("Ambulance Telematics Updated", {
            description: `${regNum} transitioned to ${newStatus.replace(/_/g, " ")}.`,
          });
        },
        onError: (err) => {
          toast.error("Status Update Failed", {
            description:
              (err as { data?: { message?: string } })?.data?.message ||
              err.message ||
              "Could not update ambulance telemetry status.",
          });
        },
      },
    );
  };

  const filteredAmbulances = useMemo(() => {
    return ambulances.filter((amb) => {
      const term = search.toLowerCase();
      const matchesSearch =
        amb.registrationNumber.toLowerCase().includes(term) ||
        amb.type.toLowerCase().includes(term) ||
        amb.capabilities?.some((c) => c.toLowerCase().includes(term));
      return matchesSearch;
    });
  }, [ambulances, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ambulance Fleet Telematics"
        description="Manage vehicle readiness, GPS coordinate tracking, onboard clinical equipment, and maintenance schedules."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "Ambulance Fleet" },
        ]}
        action={<CreateAmbulanceDialog />}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 border border-border rounded-none shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <Input
            placeholder="Search by license plate, type, or capability..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-base md:text-xs h-10 md:h-9"
            aria-label="Search ambulance fleet"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(val) => val && setStatusFilter(val)}
          >
            <SelectTrigger
              className="w-48 text-xs h-9"
              aria-label="Filter ambulances by status"
            >
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">
                All Statuses ({ambulances.length})
              </SelectItem>
              <SelectItem value={AmbulanceStatus.AVAILABLE}>AVAILABLE</SelectItem>
              <SelectItem value={AmbulanceStatus.BUSY}>BUSY</SelectItem>
              <SelectItem value={AmbulanceStatus.OUT_OF_SERVICE}>OUT_OF_SERVICE</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-9 px-2.5 text-xs text-text-muted hover:text-text-primary"
            title="Refresh fleet telemetry"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {isError && (
        <div className="p-4 bg-destructive-bg border border-destructive/20 rounded-none flex items-center justify-between">
          <div className="flex items-center gap-2 text-destructive text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              Failed to load ambulance fleet:{" "}
              {error?.message || "Unknown error occurred."}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Fleet Table */}
      <DataTable
        headerSlot={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-sm text-text-primary">
              Active Fleet Units ({filteredAmbulances.length})
            </span>
            <span className="text-xs text-text-muted">
              Click status controls to dynamically update live unit telemetry via API
            </span>
          </div>
        }
      >
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead scope="col" className="text-xs font-semibold">
                Vehicle ID & Plate
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Type & Capability
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Assigned Paramedic
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                GPS Station
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Current Status
              </TableHead>
              <TableHead
                scope="col"
                className="text-xs font-semibold text-right"
              >
                Telemetry Override
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              SKELETON_ROWS.map((rowId) => (
                <TableRow key={rowId}>
                  <TableCell className="py-4">
                    <div className="h-3.5 bg-muted animate-pulse rounded w-32 mb-1.5" />
                    <div className="h-2.5 bg-muted animate-pulse rounded w-20" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="h-3 bg-muted animate-pulse rounded w-28" />
                  </TableCell>
                  <TableCell>
                    <div className="h-3 bg-muted animate-pulse rounded w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 bg-muted animate-pulse rounded w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-7 bg-muted animate-pulse rounded w-36 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredAmbulances.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-xs text-text-muted"
                >
                  <Ambulance className="h-8 w-8 mx-auto mb-2 text-text-muted/40" />
                  No ambulance units found matching the selected criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredAmbulances.map((amb) => (
                <TableRow
                  key={amb.id}
                  className="hover:bg-primary-light/20 transition-colors"
                >
                  <TableCell className="py-3">
                    <div className="font-semibold text-xs text-text-primary flex items-center gap-1.5">
                      <Ambulance
                        className="h-3.5 w-3.5 text-primary shrink-0"
                        aria-hidden="true"
                      />
                      {amb.registrationNumber}
                    </div>
                    <div className="text-[11px] text-text-muted font-mono mt-0.5 truncate max-w-40">
                      ID: {amb.id}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] font-semibold bg-muted text-text-secondary"
                    >
                      {amb.type.replace(/_/g, " ")}
                    </Badge>
                    <div className="text-[11px] text-text-muted max-w-40 truncate mt-1">
                      {amb.capabilities?.join(", ") || "Standard Clinical Kit"}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {amb.driver?.user?.name ? (
                      <div>
                        <div className="font-semibold text-text-primary">
                          {amb.driver.user.name}
                        </div>
                        <div className="text-[10px] text-text-muted">
                          {amb.driver.certificationLevel}
                        </div>
                      </div>
                    ) : (
                      <span className="text-text-muted italic">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-text-secondary">
                    {amb.baseLocationLat.toFixed(4)},{" "}
                    {amb.baseLocationLng.toFixed(4)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={amb.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        size="sm"
                        variant={
                          amb.status === AmbulanceStatus.AVAILABLE
                            ? "default"
                            : "outline"
                        }
                        disabled={updateStatusMutation.isPending}
                        onClick={() =>
                          handleUpdateStatus(
                            amb.id,
                            AmbulanceStatus.AVAILABLE,
                            amb.registrationNumber,
                          )
                        }
                        className={`h-7 px-2 text-[11px] font-medium cursor-pointer ${
                          amb.status === AmbulanceStatus.AVAILABLE
                            ? "bg-status text-white hover:bg-status/90"
                            : "text-status hover:bg-emerald-50"
                        }`}
                      >
                        Available
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          amb.status === AmbulanceStatus.BUSY
                            ? "default"
                            : "outline"
                        }
                        disabled={updateStatusMutation.isPending}
                        onClick={() =>
                          handleUpdateStatus(
                            amb.id,
                            AmbulanceStatus.BUSY,
                            amb.registrationNumber,
                          )
                        }
                        className={`h-7 px-2 text-[11px] font-medium cursor-pointer ${
                          amb.status === AmbulanceStatus.BUSY
                            ? "bg-amber-500 text-white hover:bg-amber-600"
                            : "text-amber-600 hover:bg-amber-50"
                        }`}
                      >
                        Busy
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          amb.status === AmbulanceStatus.OUT_OF_SERVICE
                            ? "default"
                            : "outline"
                        }
                        disabled={updateStatusMutation.isPending}
                        onClick={() =>
                          handleUpdateStatus(
                            amb.id,
                            AmbulanceStatus.OUT_OF_SERVICE,
                            amb.registrationNumber,
                          )
                        }
                        className={`h-7 px-2 text-[11px] font-medium cursor-pointer ${
                          amb.status === AmbulanceStatus.OUT_OF_SERVICE
                            ? "bg-destructive text-white hover:bg-destructive/90"
                            : "text-destructive hover:bg-destructive-bg"
                        }`}
                      >
                        Out
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </DataTable>
    </div>
  );
}
