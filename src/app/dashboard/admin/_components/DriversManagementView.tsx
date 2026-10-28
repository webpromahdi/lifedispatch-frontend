"use client";

import {
  AlertCircle,
  Power,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetDrivers } from "@/hooks";
import { formatDate } from "@/lib/utils";
import { CreateDriverDialog } from "./dialogs/CreateDriverDialog";

const SKELETON_ROWS = [
  "skel-driver-1",
  "skel-driver-2",
  "skel-driver-3",
  "skel-driver-4",
];

export function DriversManagementView() {
  const [search, setSearch] = useState("");

  const {
    data: driversResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetDrivers();

  const drivers = driversResponse?.data || [];

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      const term = search.toLowerCase();
      const nameMatch = d.user?.name?.toLowerCase().includes(term);
      const emailMatch = d.user?.email?.toLowerCase().includes(term);
      const certMatch = d.certificationLevel?.toLowerCase().includes(term);
      const licenseMatch = d.licenseNumber?.toLowerCase().includes(term);
      return nameMatch || emailMatch || certMatch || licenseMatch;
    });
  }, [drivers, search]);

  const onDutyCount = drivers.filter((d) => d.isOnShift).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paramedic Driver Roster"
        description="Verify EMS driver licenses, certifications, assigned vehicles, and real-time duty shifts."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "Paramedic Drivers" },
        ]}
        action={<CreateDriverDialog />}
      />

      {/* Search and Summary Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 border border-border rounded-none shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <Input
            placeholder="Search by driver name, license, or certification..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-base md:text-xs h-10 md:h-9"
            aria-label="Search paramedic drivers"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-text-muted">
            Active On-Duty:{" "}
            <span className="font-bold text-status">{onDutyCount}</span> /{" "}
            {drivers.length} drivers
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-9 px-2.5 text-xs text-text-muted hover:text-text-primary"
            title="Refresh driver roster"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="p-4 bg-destructive-bg border border-destructive/20 rounded-none flex items-center justify-between">
          <div className="flex items-center gap-2 text-destructive text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              Failed to load driver roster:{" "}
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

      {/* Driver Table */}
      <DataTable
        headerSlot={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-sm text-text-primary">
              Paramedic Personnel ({filteredDrivers.length})
            </span>
            <span className="text-xs text-text-muted">
              Live driver profiles synced with authentication & CAD dispatch
            </span>
          </div>
        }
      >
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead scope="col" className="text-xs font-semibold">
                Paramedic Officer
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Certification Level
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Commercial License & Expiry
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Assigned Unit
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Duty Shift
              </TableHead>
              <TableHead
                scope="col"
                className="text-xs font-semibold text-right"
              >
                Trips Completed
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              SKELETON_ROWS.map((rowId) => (
                <TableRow key={rowId}>
                  <TableCell className="py-4">
                    <div className="h-3.5 bg-muted animate-pulse rounded w-32 mb-1.5" />
                    <div className="h-2.5 bg-muted animate-pulse rounded w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="h-3.5 bg-muted animate-pulse rounded w-28 mb-1" />
                    <div className="h-2.5 bg-muted animate-pulse rounded w-20" />
                  </TableCell>
                  <TableCell>
                    <div className="h-3 bg-muted animate-pulse rounded w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 bg-muted animate-pulse rounded w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-3.5 bg-muted animate-pulse rounded w-12 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredDrivers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-xs text-text-muted"
                >
                  <UserCheck className="h-8 w-8 mx-auto mb-2 text-text-muted/40" />
                  No paramedic drivers found matching the selected criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredDrivers.map((driver) => (
                <TableRow
                  key={driver.id}
                  className="hover:bg-primary-light/20 transition-colors"
                >
                  <TableCell className="py-3">
                    <div className="font-semibold text-xs text-text-primary flex items-center gap-1.5">
                      <UserCheck
                        className="h-3.5 w-3.5 text-primary shrink-0"
                        aria-hidden="true"
                      />
                      {driver.user?.name || "Paramedic Officer"}
                    </div>
                    <div className="text-[11px] text-text-muted font-mono mt-0.5">
                      {driver.user?.email || "driver@lifedispatch.bd"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] font-semibold bg-primary-light text-primary border-primary/20"
                    >
                      {driver.certificationLevel?.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-xs font-semibold text-text-primary">
                      {driver.licenseNumber}
                    </div>
                    <div className="text-[10px] text-text-muted font-mono">
                      Exp: {formatDate(driver.licenseExpiry, "dd MMM yyyy")}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-text-secondary">
                    {driver.ambulance ? (
                      <div>
                        <span className="font-mono font-semibold text-text-primary">
                          {driver.ambulance.registrationNumber}
                        </span>
                        <div className="text-[10px] text-text-muted">
                          {driver.ambulance.type.replace(/_/g, " ")}
                        </div>
                      </div>
                    ) : (
                      <span className="text-text-muted italic">
                        Unassigned (Standby)
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {driver.isOnShift ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="h-2 w-2 rounded-none bg-status" />
                        ON DUTY
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <span className="h-2 w-2 rounded-none bg-slate-400" />
                        OFF DUTY
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs font-semibold text-text-primary">
                    {driver.totalTripsCompleted ?? 0}
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
