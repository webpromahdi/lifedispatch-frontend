"use client";

import { Ambulance, Building2, ShieldAlert, Users } from "lucide-react";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { seedAmbulances } from "@/lib/dummy/ambulances";
import { seedHospitals } from "@/lib/dummy/hospitals";
import { seedUsers } from "@/lib/dummy/users";

export function AdminView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="System Administration"
        description="Manage fleet vehicles, regional hospitals, certified drivers, and user role access."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "System Admin" },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Registered Users"
          value={seedUsers.length}
          icon={Users}
          trend={{ value: "+3 this week", isPositive: true }}
          subtitle="System wide user accounts"
        />
        <StatCard
          label="Fleet Ambulances"
          value={seedAmbulances.length}
          icon={Ambulance}
          trend={{ value: "100% active", isPositive: true }}
          subtitle="ALS, BLS & Specialized"
        />
        <StatCard
          label="Partner Hospitals"
          value={seedHospitals.length}
          icon={Building2}
          trend={{ value: "4 accepting", isPositive: true }}
          subtitle="Dhaka metropolitan network"
        />
        <StatCard
          label="Security Status"
          value="Healthy"
          icon={ShieldAlert}
          subtitle="Zero unhandled audit alerts"
        />
      </div>

      <DataTable
        headerSlot={
          <div className="font-semibold text-sm text-text-primary">
            Hospital Network Diversion Status
          </div>
        }
      >
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead className="text-xs font-semibold">
                Hospital Name
              </TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">
                Available / Total ER Beds
              </TableHead>
              <TableHead className="text-xs font-semibold">Phone</TableHead>
              <TableHead className="text-xs font-semibold">
                Diversion Note
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seedHospitals.map((hosp) => (
              <TableRow
                key={hosp.id}
                className="hover:bg-primary-light/30 transition-colors"
              >
                <TableCell className="font-medium text-xs text-text-primary">
                  {hosp.name}
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
                <TableCell className="text-xs text-text-secondary">
                  {hosp.phone}
                </TableCell>
                <TableCell className="text-xs text-text-muted max-w-[250px] truncate">
                  {hosp.diversionReason ||
                    "None (accepting all trauma & medical emergencies)"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
    </div>
  );
}
