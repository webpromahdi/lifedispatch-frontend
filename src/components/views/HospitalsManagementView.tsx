"use client";

import { AlertTriangle, Building2, CheckCircle2, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CreateHospitalDialog } from "@/components/forms/admin/CreateHospitalDialog";
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
import { seedHospitals } from "@/lib/dummy/hospitals";
import type { HospitalDiversionStatus } from "@/lib/types/enums";
import type { Hospital } from "@/lib/types/hospital.types";

export function HospitalsManagementView() {
  const [hospitals, setHospitals] = useState<Hospital[]>(seedHospitals);
  const [search, setSearch] = useState("");

  // Toggle diversion status locally with toast
  const handleToggleDiversion = (hospitalId: string) => {
    setHospitals((prev) =>
      prev.map((hosp) => {
        if (hosp.id !== hospitalId) return hosp;
        const nextStatus: HospitalDiversionStatus =
          hosp.diversionStatus === "ACCEPTING" ? "DIVERTING" : "ACCEPTING";
        const reason =
          nextStatus === "DIVERTING"
            ? "ER at critical surge capacity. Trauma diverted."
            : null;

        toast.success("Hospital Diversion Status Updated", {
          description: `${hosp.name} is now ${nextStatus}. CAD routing notified.`,
        });

        return {
          ...hosp,
          diversionStatus: nextStatus,
          diversionReason: reason,
        };
      }),
    );
  };

  const filteredHospitals = hospitals.filter((h) => {
    const nameMatch = h.name.toLowerCase().includes(search.toLowerCase());
    const addressMatch = h.address.toLowerCase().includes(search.toLowerCase());
    return nameMatch || addressMatch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Hospital ER Diversion"
        description="Monitor trauma center emergency capacities, intake diversion states, and available ER bed counts."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "Partner Hospitals" },
        ]}
        action={<CreateHospitalDialog />}
      />

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 border border-border rounded-xl shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <Input
            placeholder="Search hospital name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-base md:text-xs h-10 md:h-9"
            aria-label="Search hospitals"
          />
        </div>

        <div className="text-xs text-text-muted">
          Accepting Trauma:{" "}
          <span className="font-bold text-status">
            {hospitals.filter((h) => h.diversionStatus === "ACCEPTING").length}
          </span>{" "}
          / {hospitals.length} centers
        </div>
      </div>

      {/* Hospitals Table */}
      <DataTable
        headerSlot={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-sm text-text-primary">
              Hospital Network ({filteredHospitals.length})
            </span>
            <span className="text-xs text-text-muted">
              Toggle diversion status to redirect ambulance CAD
              auto-recommendations
            </span>
          </div>
        }
      >
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead scope="col" className="text-xs font-semibold">
                Hospital Medical Center
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Diversion Status
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                ER Bed Availability
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Emergency Contact
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Diversion Notes
              </TableHead>
              <TableHead
                scope="col"
                className="text-xs font-semibold text-right"
              >
                Diversion Toggle
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHospitals.map((hosp) => (
              <TableRow
                key={hosp.id}
                className="hover:bg-primary-light/20 transition-colors"
              >
                <TableCell className="py-3">
                  <div className="font-semibold text-xs text-text-primary flex items-center gap-1.5">
                    <Building2
                      className="h-3.5 w-3.5 text-primary shrink-0"
                      aria-hidden="true"
                    />
                    {hosp.name}
                  </div>
                  <div className="text-[11px] text-text-muted truncate max-w-[280px]">
                    {hosp.address}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={hosp.diversionStatus} />
                </TableCell>
                <TableCell className="text-xs text-text-secondary">
                  <span className="font-bold text-text-primary">
                    {hosp.availableErBeds}
                  </span>{" "}
                  / {hosp.totalErBeds} beds
                </TableCell>
                <TableCell className="text-xs font-mono text-text-secondary">
                  <div>{hosp.phone}</div>
                  <div className="text-[11px] text-text-muted">
                    {hosp.email}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-text-muted max-w-[240px] truncate">
                  {hosp.diversionReason || "Accepting patient dispatches"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleDiversion(hosp.id)}
                    className={`h-8 px-3 text-xs font-medium gap-1.5 cursor-pointer ${
                      hosp.diversionStatus === "ACCEPTING"
                        ? "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300"
                        : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                    }`}
                  >
                    {hosp.diversionStatus === "ACCEPTING" ? (
                      <>
                        <AlertTriangle
                          className="h-3.5 w-3.5 text-amber-500"
                          aria-hidden="true"
                        />
                        Divert
                      </>
                    ) : (
                      <>
                        <CheckCircle2
                          className="h-3.5 w-3.5 text-status"
                          aria-hidden="true"
                        />
                        Accept
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
    </div>
  );
}
