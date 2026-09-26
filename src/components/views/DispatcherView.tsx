"use client";

import { AlertCircle, Ambulance, Clock, PhoneCall, Plus } from "lucide-react";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DispatchCard } from "@/components/dispatch/DispatchCard";
import { RecommendationList } from "@/components/dispatch/RecommendationList";
import { Button } from "@/components/ui/button";
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
import { formatDate } from "@/lib/utils";

export function DispatcherView() {
  const pendingOrActiveEmergencies = seedEmergencies.slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Emergency Dispatch Desk"
        description="Active triage queue, intelligent unit recommendation, and real-time response coordination."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/dispatcher" },
          { label: "Dispatch Desk" },
        ]}
        action={
          <Button className="min-h-[44px] bg-primary hover:bg-primary-dark text-primary-foreground font-medium cursor-pointer">
            <Plus className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Create Emergency Call
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending Triage"
          value="3"
          icon={PhoneCall}
          trend={{ value: "+1", isPositive: false }}
          subtitle="Awaiting priority assignment"
        />
        <StatCard
          label="Active Dispatches"
          value="5"
          icon={AlertCircle}
          trend={{ value: "+2", isPositive: true }}
          subtitle="En route or at scene"
        />
        <StatCard
          label="Fleet Available"
          value="24"
          icon={Ambulance}
          trend={{ value: "68%", isPositive: true }}
          subtitle="Ready across 8 bases"
        />
        <StatCard
          label="Avg Response Time"
          value="6.2 min"
          icon={Clock}
          trend={{ value: "-30s", isPositive: true }}
          subtitle="Target: under 8.0 min"
        />
      </div>

      {/* Main Grid: Active Incidents & Driver Assignment Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <DataTable
            headerSlot={
              <div className="font-semibold text-sm text-text-primary">
                Live Incident Queue
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
                  <TableHead className="text-xs font-semibold">
                    Priority
                  </TableHead>
                  <TableHead className="text-xs font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold">
                    Address
                  </TableHead>
                  <TableHead className="text-xs font-semibold">
                    Reported
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingOrActiveEmergencies.map((em) => (
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
                      {formatDate(em.createdAt, "hh:mm a")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DataTable>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-text-primary">
            Active Assignment Card
          </h2>
          <DispatchCard
            dispatch={seedDispatches[1]}
            emergency={seedEmergencies[1]}
            ambulance={seedAmbulances[1]}
          />
        </div>
      </div>

      {/* Recommended Ambulance Dispatch Candidates */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h2 className="text-sm font-semibold text-text-primary">
          Intelligent Unit Recommendations (Scored Candidates)
        </h2>
        <RecommendationList
          candidates={[
            {
              ambulance: seedAmbulances[1],
              driver: seedDrivers[1],
              distanceKm: 2.1,
              score: 0.945,
              scoreBreakdown: {
                distanceScore: 0.92,
                priorityScore: 1.0,
                typeScore: 1.0,
              },
              serviceOverdue: false,
            },
            {
              ambulance: seedAmbulances[2],
              driver: seedDrivers[2],
              distanceKm: 3.5,
              score: 0.824,
              scoreBreakdown: {
                distanceScore: 0.85,
                priorityScore: 0.8,
                typeScore: 0.8,
              },
              serviceOverdue: true,
            },
          ]}
        />
      </div>
    </div>
  );
}
