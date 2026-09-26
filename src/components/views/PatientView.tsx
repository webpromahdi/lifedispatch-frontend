"use client";

import {
  AlertCircle,
  Clock,
  HeartHandshake,
  PhoneCall,
  Plus,
} from "lucide-react";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
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

export function PatientView() {
  const patientEmergencies = seedEmergencies.slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Emergency Portal"
        description="Request urgent medical dispatch, track ambulance ETA, and view trip medical invoices."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/patient" },
          { label: "My Requests" },
        ]}
        action={
          <Button className="min-h-[44px] bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-5 cursor-pointer">
            <Plus className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Request Emergency Ambulance
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Request"
          value="INC-2026-000001"
          icon={AlertCircle}
          subtitle="En Route (ETA: 4 min)"
        />
        <StatCard
          label="Emergency Contact"
          value="Tanvir Hasan"
          icon={PhoneCall}
          subtitle="+8801711555555"
        />
        <StatCard
          label="Registered Blood Type"
          value="O Negative"
          icon={HeartHandshake}
          subtitle="Universal Donor"
        />
        <StatCard
          label="Historical Trips"
          value="3 Completed"
          icon={Clock}
          subtitle="All invoices settled"
        />
      </div>

      <DataTable
        headerSlot={
          <div className="font-semibold text-sm text-text-primary">
            My Emergency Requests History
          </div>
        }
      >
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead className="text-xs font-semibold">
                Incident #
              </TableHead>
              <TableHead className="text-xs font-semibold">Type</TableHead>
              <TableHead className="text-xs font-semibold">Priority</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">
                Pickup Address
              </TableHead>
              <TableHead className="text-xs font-semibold">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patientEmergencies.map((em) => (
              <TableRow
                key={em.id}
                className="hover:bg-primary-light/30 transition-colors"
              >
                <TableCell className="font-mono text-xs font-semibold text-text-primary">
                  {em.incidentNumber}
                </TableCell>
                <TableCell className="text-xs capitalize text-text-secondary">
                  {em.emergencyType.toLowerCase()}
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={em.priority} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={em.status} />
                </TableCell>
                <TableCell className="text-xs text-text-secondary max-w-[200px] truncate">
                  {em.locationAddress}
                </TableCell>
                <TableCell className="text-xs text-text-muted">
                  {formatDate(em.createdAt, "dd MMM yyyy, hh:mm a")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
    </div>
  );
}
