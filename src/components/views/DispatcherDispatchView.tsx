"use client";

import {
  AlertTriangle,
  Ban,
  Clock,
  Filter,
  Radio,
  Search,
  Truck,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { seedAmbulances } from "@/lib/dummy/ambulances";
import { seedDispatches } from "@/lib/dummy/dispatches";
import { seedDrivers } from "@/lib/dummy/drivers";
import { seedEmergencies } from "@/lib/dummy/emergencies";
import type { Dispatch } from "@/lib/types/dispatch.types";
import { DispatchStatus } from "@/lib/types/enums";
import { formatDate } from "@/lib/utils";

export function DispatcherDispatchView() {
  const [dispatches, setDispatches] = useState<Dispatch[]>(seedDispatches);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Cancel Confirmation Dialog State
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedDispatch, setSelectedDispatch] = useState<Dispatch | null>(
    null,
  );

  const handleOpenCancelDialog = (dispatch: Dispatch) => {
    setSelectedDispatch(dispatch);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedDispatch) return;

    const targetId = selectedDispatch.id;
    setDispatches((prev) =>
      prev.map((d) => {
        if (d.id !== targetId) return d;
        return {
          ...d,
          status: DispatchStatus.CANCELLED,
          cancelledAt: new Date().toISOString(),
          cancellationReason: "Cancelled manually by dispatcher console operator.",
        };
      }),
    );

    const relatedEmergency = seedEmergencies.find(
      (e) => e.id === selectedDispatch.emergencyId,
    );
    const incNumber = relatedEmergency?.incidentNumber || selectedDispatch.id;

    toast.success("Dispatch Assignment Cancelled", {
      description: `Assignment ${selectedDispatch.id} (Incident ${incNumber}) cancelled and unit released.`,
    });

    setCancelDialogOpen(false);
    setSelectedDispatch(null);
  };

  // Helper maps for lookup
  const emergencyMap = useMemo(() => {
    return new Map(seedEmergencies.map((e) => [e.id, e]));
  }, []);

  const ambulanceMap = useMemo(() => {
    return new Map(seedAmbulances.map((a) => [a.id, a]));
  }, []);

  const driverMap = useMemo(() => {
    return new Map(seedDrivers.map((d) => [d.id, d]));
  }, []);

  const filteredDispatches = useMemo(() => {
    return dispatches.filter((disp) => {
      const em = emergencyMap.get(disp.emergencyId);
      const amb = ambulanceMap.get(disp.ambulanceId);
      const drv = driverMap.get(disp.driverId);

      const searchTerms = [
        disp.id,
        em?.incidentNumber || "",
        amb?.registrationNumber || "",
        drv?.licenseNumber || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchTerms.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || disp.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [dispatches, search, statusFilter, emergencyMap, ambulanceMap, driverMap]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dispatch Operations Desk"
        description="Comprehensive dispatch log, emergency mission assignments, response score telematics, and cancellation controls."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/dispatcher" },
          { label: "Dispatch Desk" },
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
            placeholder="Search dispatch ID, incident #, or vehicle plate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-base md:text-xs h-10 md:h-9"
            aria-label="Search dispatch history"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-text-muted" aria-hidden="true" />
          <Select
            value={statusFilter}
            onValueChange={(val) => val && setStatusFilter(val)}
          >
            <SelectTrigger
              className="w-48 text-xs h-9"
              aria-label="Filter dispatches by status"
            >
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses ({dispatches.length})</SelectItem>
              <SelectItem value="ACCEPTED">ACCEPTED</SelectItem>
              <SelectItem value="PENDING_ACCEPTANCE">
                PENDING ACCEPTANCE
              </SelectItem>
              <SelectItem value="COMPLETED">COMPLETED</SelectItem>
              <SelectItem value="REJECTED">REJECTED</SelectItem>
              <SelectItem value="CANCELLED">CANCELLED</SelectItem>
              <SelectItem value="TIMED_OUT">TIMED OUT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dispatches Table */}
      <DataTable
        headerSlot={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-sm text-text-primary">
              Dispatch Assignments Log ({filteredDispatches.length})
            </span>
            <span className="text-xs text-text-muted hidden sm:inline">
              Active dispatches may be cancelled to re-route emergency triage
            </span>
          </div>
        }
      >
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead scope="col" className="text-xs font-semibold">
                Dispatch ID
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Incident #
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Assigned Unit
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Paramedic Driver
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Score
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Status
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Timestamp
              </TableHead>
              <TableHead
                scope="col"
                className="text-xs font-semibold text-right"
              >
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDispatches.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-xs text-text-muted"
                >
                  No dispatch assignments found matching this criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredDispatches.map((disp) => {
                const em = emergencyMap.get(disp.emergencyId);
                const amb = ambulanceMap.get(disp.ambulanceId);
                const drv = driverMap.get(disp.driverId);

                const isTerminal =
                  disp.status === "CANCELLED" ||
                  disp.status === "COMPLETED" ||
                  disp.status === "REJECTED" ||
                  disp.status === "TIMED_OUT";

                return (
                  <TableRow
                    key={disp.id}
                    className="hover:bg-primary-light/20 transition-colors"
                  >
                    <TableCell className="font-mono text-xs font-semibold text-text-primary">
                      {disp.id}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-text-primary font-medium">
                      {em ? em.incidentNumber : disp.emergencyId}
                    </TableCell>
                    <TableCell className="text-xs text-text-secondary">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Truck className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                        <span>{amb ? amb.registrationNumber : disp.ambulanceId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-text-muted shrink-0" aria-hidden="true" />
                        <span>{drv ? drv.licenseNumber : disp.driverId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-semibold text-primary">
                      {disp.dispatchScore
                        ? `${(disp.dispatchScore * 100).toFixed(0)}%`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={disp.status} />
                    </TableCell>
                    <TableCell className="text-xs text-text-muted font-mono">
                      {formatDate(disp.createdAt, "MMM dd, hh:mm a")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isTerminal}
                        onClick={() => handleOpenCancelDialog(disp)}
                        aria-label={`Cancel dispatch assignment ${disp.id}`}
                        className={`h-7 px-2.5 text-xs font-medium cursor-pointer ${
                          isTerminal
                            ? "text-text-muted opacity-40 border-border cursor-not-allowed"
                            : "text-destructive border-destructive/30 hover:bg-destructive-bg"
                        }`}
                      >
                        <Ban className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </DataTable>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-destructive-bg text-destructive">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <DialogTitle>Cancel Dispatch Assignment</DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel dispatch{" "}
                  <span className="font-mono font-semibold text-text-primary">
                    {selectedDispatch?.id}
                  </span>
                  ?
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-2 text-xs text-text-secondary space-y-2">
            <p>
              Cancelling will unassign the ambulance and driver from this
              incident. The incident will be returned to the triage queue with
              status <strong>REASSIGNMENT_REQUIRED</strong>.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              className="text-xs min-h-[40px] cursor-pointer"
            >
              Abort
            </Button>
            <Button
              onClick={handleConfirmCancel}
              className="bg-destructive hover:bg-destructive/90 text-white text-xs min-h-[40px] cursor-pointer font-medium"
            >
              Confirm Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
