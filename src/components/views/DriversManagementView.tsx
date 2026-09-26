"use client";

import { Power, Search, UserCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { CreateDriverDialog } from "@/components/forms/admin/CreateDriverDialog";
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
import { seedAmbulances } from "@/lib/dummy/ambulances";
import { seedDrivers } from "@/lib/dummy/drivers";
import { seedUsers } from "@/lib/dummy/users";
import type { Driver } from "@/lib/types/driver.types";
import { formatDate } from "@/lib/utils";

export function DriversManagementView() {
  const [drivers, setDrivers] = useState<Driver[]>(seedDrivers);
  const [search, setSearch] = useState("");

  // Toggle isOnShift state locally + show toast
  const handleToggleShift = (driverId: string) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id !== driverId) return d;
        const nextShift = !d.isOnShift;
        const driverUser = seedUsers.find((u) => u.id === d.userId);
        toast.success("Driver Shift Updated", {
          description: `${driverUser?.name || "Paramedic"} is now ${
            nextShift ? "ON DUTY (Active)" : "OFF DUTY (Standby)"
          }.`,
        });
        return {
          ...d,
          isOnShift: nextShift,
        };
      }),
    );
  };

  const filteredDrivers = drivers.filter((d) => {
    const user = seedUsers.find((u) => u.id === d.userId);
    const nameMatch = user?.name.toLowerCase().includes(search.toLowerCase());
    const certMatch = d.certificationLevel
      .toLowerCase()
      .includes(search.toLowerCase());
    return nameMatch || certMatch;
  });

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

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 border border-border rounded-xl shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <Input
            placeholder="Search by driver name or certification..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-base md:text-xs h-10 md:h-9"
            aria-label="Search paramedic drivers"
          />
        </div>

        <div className="text-xs text-text-muted">
          Active On-Duty:{" "}
          <span className="font-bold text-status">
            {drivers.filter((d) => d.isOnShift).length}
          </span>{" "}
          / {drivers.length} drivers
        </div>
      </div>

      {/* Driver Table */}
      <DataTable
        headerSlot={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-sm text-text-primary">
              Paramedic Personnel ({filteredDrivers.length})
            </span>
            <span className="text-xs text-text-muted">
              Toggle shift switch to clock drivers in/out of live CAD routing
            </span>
          </div>
        }
      >
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead scope="col" className="text-xs font-semibold">
                Paramedic Name
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Certification Level
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Commercial License Expiry
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Assigned Unit
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Shift Status
              </TableHead>
              <TableHead
                scope="col"
                className="text-xs font-semibold text-right"
              >
                Duty Toggle
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrivers.map((driver) => {
              const user = seedUsers.find((u) => u.id === driver.userId);
              const ambulance = seedAmbulances.find(
                (a) => a.id === driver.assignedAmbulanceId,
              );

              return (
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
                      {user?.name || "Paramedic Officer"}
                    </div>
                    <div className="text-[11px] text-text-muted font-mono">
                      {user?.email || "driver@lifedispatch.bd"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] font-semibold bg-primary-light text-primary border-primary/20"
                    >
                      {driver.certificationLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-text-secondary">
                    {formatDate(driver.licenseExpiry, "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-text-secondary">
                    {ambulance ? (
                      <span className="font-mono text-text-primary">
                        {ambulance.registrationNumber}
                      </span>
                    ) : (
                      <span className="text-text-muted italic">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {driver.isOnShift ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="h-2 w-2 rounded-full bg-status animate-pulse" />
                        ON DUTY
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <span className="h-2 w-2 rounded-full bg-slate-400" />
                        OFF DUTY
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleShift(driver.id)}
                      className={`h-8 px-3 text-xs font-medium gap-1.5 cursor-pointer ${
                        driver.isOnShift
                          ? "hover:bg-destructive-bg hover:text-destructive hover:border-destructive/30"
                          : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                      }`}
                    >
                      <Power className="h-3.5 w-3.5" aria-hidden="true" />
                      {driver.isOnShift ? "Clock Out" : "Clock In"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DataTable>
    </div>
  );
}
