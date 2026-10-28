"use client";

import {
  AlertCircle,
  Ambulance,
  MapPin,
  RefreshCw,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAmbulances, useUpdateAmbulanceStatus } from "@/hooks";
import type { AmbulanceWithDriver } from "@/lib/types/ambulance.types";
import { AmbulanceStatus } from "@/lib/types/enums";

export function DispatcherAmbulancesView() {
  const [search, setSearch] = useState("");

  const {
    data: ambulancesResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAmbulances(undefined, { refetchInterval: 15_000 });

  const updateStatusMutation = useUpdateAmbulanceStatus();

  const ambulances = ambulancesResponse?.data || [];

  const handleStatusChange = (
    ambulanceId: string,
    newStatus: AmbulanceStatus,
    regNum: string,
  ) => {
    updateStatusMutation.mutate(
      { id: ambulanceId, status: newStatus },
      {
        onSuccess: () => {
          toast.success("Ambulance Readiness Updated", {
            description: `Unit ${regNum} transitioned to ${newStatus.replace(/_/g, " ")}.`,
          });
        },
        onError: (err) => {
          toast.error("Status Update Failed", {
            description:
              (err as { data?: { message?: string } })?.data?.message ||
              err.message ||
              "Could not update ambulance status.",
          });
        },
      },
    );
  };

  const filteredAmbulances = useMemo(() => {
    return ambulances.filter(
      (a) =>
        a.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
        a.type.toLowerCase().includes(search.toLowerCase()) ||
        a.capabilities?.some((c) =>
          c.toLowerCase().includes(search.toLowerCase()),
        ),
    );
  }, [ambulances, search]);

  const availableUnits = filteredAmbulances.filter(
    (a) => a.status === AmbulanceStatus.AVAILABLE,
  );
  const busyUnits = filteredAmbulances.filter(
    (a) => a.status === AmbulanceStatus.BUSY,
  );
  const outOfServiceUnits = filteredAmbulances.filter(
    (a) => a.status === AmbulanceStatus.OUT_OF_SERVICE,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ambulance Fleet Monitor"
        description="Real-time multi-column unit telemetry, availability status board, and rapid status controls."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/dispatcher" },
          { label: "Fleet Monitor" },
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
            placeholder="Search by license plate, type, or gear..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-base md:text-xs h-10 md:h-9"
            aria-label="Search ambulance fleet"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-none bg-status" />
            Available: <strong>{availableUnits.length}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-none bg-amber-500" />
            Busy: <strong>{busyUnits.length}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-none bg-destructive" />
            Out of Service: <strong>{outOfServiceUnits.length}</strong>
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-8 px-2 text-xs text-text-muted hover:text-text-primary ml-1"
            title="Refresh fleet monitor"
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
              Failed to load fleet telematics:{" "}
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

      {/* 3-Column Status Board: AVAILABLE / BUSY / OUT_OF_SERVICE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: AVAILABLE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-none bg-status-bg border border-status/30">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-none bg-status" />
              <h2 className="text-xs font-bold text-status-text uppercase tracking-wider">
                Available Units
              </h2>
            </div>
            <Badge
              variant="outline"
              className="bg-surface text-status-text border-status/40 font-mono text-xs"
            >
              {availableUnits.length}
            </Badge>
          </div>

          <div className="space-y-3 min-h-75">
            {isLoading ? (
              <ColumnLoadingSkeleton />
            ) : availableUnits.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-muted border border-dashed border-border rounded-none bg-surface/50">
                No units currently available in this filter.
              </div>
            ) : (
              availableUnits.map((amb) => (
                <AmbulanceStatusCard
                  key={amb.id}
                  ambulance={amb}
                  isUpdating={updateStatusMutation.isPending}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </div>

        {/* Column 2: BUSY */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-none bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-none bg-amber-500" />
              <h2 className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Busy / On Mission
              </h2>
            </div>
            <Badge
              variant="outline"
              className="bg-surface text-amber-700 border-amber-500/40 font-mono text-xs"
            >
              {busyUnits.length}
            </Badge>
          </div>

          <div className="space-y-3 min-h-75">
            {isLoading ? (
              <ColumnLoadingSkeleton />
            ) : busyUnits.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-muted border border-dashed border-border rounded-none bg-surface/50">
                No units currently busy.
              </div>
            ) : (
              busyUnits.map((amb) => (
                <AmbulanceStatusCard
                  key={amb.id}
                  ambulance={amb}
                  isUpdating={updateStatusMutation.isPending}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </div>

        {/* Column 3: OUT_OF_SERVICE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-none bg-destructive-bg border border-destructive/30">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-none bg-destructive" />
              <h2 className="text-xs font-bold text-destructive uppercase tracking-wider">
                Out of Service / Maintenance
              </h2>
            </div>
            <Badge
              variant="outline"
              className="bg-surface text-destructive border-destructive/40 font-mono text-xs"
            >
              {outOfServiceUnits.length}
            </Badge>
          </div>

          <div className="space-y-3 min-h-75">
            {isLoading ? (
              <ColumnLoadingSkeleton />
            ) : outOfServiceUnits.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-muted border border-dashed border-border rounded-none bg-surface/50">
                No units out of service.
              </div>
            ) : (
              outOfServiceUnits.map((amb) => (
                <AmbulanceStatusCard
                  key={amb.id}
                  ambulance={amb}
                  isUpdating={updateStatusMutation.isPending}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const SKELETON_KEYS = ["skeleton-card-1", "skeleton-card-2"];

function ColumnLoadingSkeleton() {
  return (
    <div className="space-y-3">
      {SKELETON_KEYS.map((keyId) => (
        <div
          key={keyId}
          className="p-4 rounded-none bg-surface border border-border shadow-xs space-y-3 animate-pulse"
        >
          <div className="flex justify-between items-center">
            <div className="h-4 bg-muted rounded w-28" />
            <div className="h-4 bg-muted rounded w-16" />
          </div>
          <div className="h-3 bg-muted rounded w-36" />
          <div className="h-5 bg-muted rounded w-full" />
        </div>
      ))}
    </div>
  );
}

function AmbulanceStatusCard({
  ambulance,
  isUpdating,
  onStatusChange,
}: {
  ambulance: AmbulanceWithDriver;
  isUpdating: boolean;
  onStatusChange: (id: string, status: AmbulanceStatus, regNum: string) => void;
}) {
  return (
    <div className="p-4 rounded-none bg-surface border border-border shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ambulance
            className="h-4 w-4 text-primary shrink-0"
            aria-hidden="true"
          />
          <span className="font-mono font-semibold text-xs text-text-primary">
            {ambulance.registrationNumber}
          </span>
        </div>
        <Badge
          variant="outline"
          className="font-mono text-[10px] font-semibold bg-muted text-text-secondary"
        >
          {ambulance.type.replace(/_/g, " ")}
        </Badge>
      </div>

      <div className="text-xs text-text-secondary space-y-1">
        <div className="flex items-center gap-1.5 text-text-muted text-[11px]">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>
            GPS: {ambulance.baseLocationLat.toFixed(4)},{" "}
            {ambulance.baseLocationLng.toFixed(4)}
          </span>
        </div>

        {ambulance.driver?.user?.name && (
          <div className="text-[11px] text-text-primary font-medium">
            Crew: {ambulance.driver.user.name} (
            {ambulance.driver.certificationLevel})
          </div>
        )}

        {(ambulance.capabilities?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {ambulance.capabilities.map((cap) => (
              <span
                key={cap}
                className="text-[10px] bg-background border border-border px-1.5 py-0.5 rounded text-text-muted"
              >
                {cap}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Quick Status Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-[11px] text-text-muted">Set Status:</span>
        <div className="flex items-center gap-1">
          {ambulance.status !== AmbulanceStatus.AVAILABLE && (
            <Button
              size="sm"
              variant="outline"
              disabled={isUpdating}
              onClick={() =>
                onStatusChange(
                  ambulance.id,
                  AmbulanceStatus.AVAILABLE,
                  ambulance.registrationNumber,
                )
              }
              className="h-6 px-2 text-[10px] font-medium text-status border-status/40 hover:bg-status-bg cursor-pointer"
            >
              Available
            </Button>
          )}

          {ambulance.status !== AmbulanceStatus.BUSY && (
            <Button
              size="sm"
              variant="outline"
              disabled={isUpdating}
              onClick={() =>
                onStatusChange(
                  ambulance.id,
                  AmbulanceStatus.BUSY,
                  ambulance.registrationNumber,
                )
              }
              className="h-6 px-2 text-[10px] font-medium text-amber-600 border-amber-500/40 hover:bg-amber-50 cursor-pointer"
            >
              Busy
            </Button>
          )}

          {ambulance.status !== AmbulanceStatus.OUT_OF_SERVICE && (
            <Button
              size="sm"
              variant="outline"
              disabled={isUpdating}
              onClick={() =>
                onStatusChange(
                  ambulance.id,
                  AmbulanceStatus.OUT_OF_SERVICE,
                  ambulance.registrationNumber,
                )
              }
              className="h-6 px-2 text-[10px] font-medium text-destructive border-destructive/40 hover:bg-destructive-bg cursor-pointer"
            >
              Out of Svc
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
