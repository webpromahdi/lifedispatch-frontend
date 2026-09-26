"use client";

import { Ambulance, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CreateAmbulanceDialog } from "@/components/forms/admin/CreateAmbulanceDialog";
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
import { seedAmbulances } from "@/lib/dummy/ambulances";
import type { Ambulance as AmbulanceTypeModel } from "@/lib/types/ambulance.types";
import type { AmbulanceStatus } from "@/lib/types/enums";

export function AmbulanceFleetView() {
  const [ambulances, setAmbulances] =
    useState<AmbulanceTypeModel[]>(seedAmbulances);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Local state update for ambulance status
  const handleUpdateStatus = (id: string, newStatus: AmbulanceStatus) => {
    setAmbulances((prev) =>
      prev.map((amb) => {
        if (amb.id !== id) return amb;
        toast.success("Ambulance Telematics Updated", {
          description: `${amb.registrationNumber} is now ${newStatus}.`,
        });
        return {
          ...amb,
          status: newStatus,
        };
      }),
    );
  };

  const filteredAmbulances = ambulances.filter((amb) => {
    const matchesSearch =
      amb.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      amb.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || amb.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 border border-border rounded-xl shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <Input
            placeholder="Search by license plate or type..."
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
              <SelectItem value="AVAILABLE">AVAILABLE</SelectItem>
              <SelectItem value="BUSY">BUSY</SelectItem>
              <SelectItem value="MAINTENANCE">MAINTENANCE</SelectItem>
              <SelectItem value="OUT_OF_SERVICE">OUT_OF_SERVICE</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Fleet Table */}
      <DataTable
        headerSlot={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-sm text-text-primary">
              Active Fleet Units ({filteredAmbulances.length})
            </span>
            <span className="text-xs text-text-muted">
              Click status pill to dynamically simulate unit telemetry update
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
                GPS Base Location
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Current Status
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Equipment Specs
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
            {filteredAmbulances.map((amb) => (
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
                  <div className="text-[11px] text-text-muted font-mono mt-0.5">
                    ID: {amb.id}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="font-mono text-[10px] font-semibold bg-muted text-text-secondary"
                  >
                    {amb.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs font-mono text-text-secondary">
                  {amb.baseLocationLat.toFixed(4)},{" "}
                  {amb.baseLocationLng.toFixed(4)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={amb.status} />
                </TableCell>
                <TableCell className="text-xs text-text-muted max-w-[200px] truncate">
                  {amb.capabilities.join(", ") || "Standard First Aid Kit"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button
                      size="sm"
                      variant={
                        amb.status === "AVAILABLE" ? "default" : "outline"
                      }
                      onClick={() => handleUpdateStatus(amb.id, "AVAILABLE")}
                      className={`h-7 px-2 text-[11px] font-medium cursor-pointer ${
                        amb.status === "AVAILABLE"
                          ? "bg-status text-white hover:bg-status/90"
                          : "text-status hover:bg-emerald-50"
                      }`}
                    >
                      Available
                    </Button>
                    <Button
                      size="sm"
                      variant={amb.status === "BUSY" ? "default" : "outline"}
                      onClick={() => handleUpdateStatus(amb.id, "BUSY")}
                      className={`h-7 px-2 text-[11px] font-medium cursor-pointer ${
                        amb.status === "BUSY"
                          ? "bg-amber-500 text-white hover:bg-amber-600"
                          : "text-amber-600 hover:bg-amber-50"
                      }`}
                    >
                      Busy
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        amb.status === "OUT_OF_SERVICE" ? "default" : "outline"
                      }
                      onClick={() =>
                        handleUpdateStatus(amb.id, "OUT_OF_SERVICE")
                      }
                      className={`h-7 px-2 text-[11px] font-medium cursor-pointer ${
                        amb.status === "OUT_OF_SERVICE"
                          ? "bg-destructive text-white hover:bg-destructive/90"
                          : "text-destructive hover:bg-destructive-bg"
                      }`}
                    >
                      Off
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
    </div>
  );
}
