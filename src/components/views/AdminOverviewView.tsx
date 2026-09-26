"use client";

import { motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  Ambulance,
  Building2,
  Clock,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { EmergencyLineChart } from "@/components/charts/EmergencyLineChart";
import { StatusBreakdownBar } from "@/components/charts/StatusBreakdownBar";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
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
import { seedAmbulances } from "@/lib/dummy/ambulances";
import { seedDrivers } from "@/lib/dummy/drivers";
import { seedEmergencies } from "@/lib/dummy/emergencies";
import { seedHospitals } from "@/lib/dummy/hospitals";

export function AdminOverviewView() {
  const activeEmergencies = seedEmergencies.filter(
    (e) => e.status !== "COMPLETED" && e.status !== "CANCELLED",
  ).length;
  const availableAmbulances = seedAmbulances.filter(
    (a) => a.status === "AVAILABLE",
  ).length;
  const onDutyDrivers = seedDrivers.filter((d) => d.isOnShift).length;
  const acceptingHospitals = seedHospitals.filter(
    (h) => h.diversionStatus === "ACCEPTING",
  ).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations Control Desk"
        description="Monitor regional emergency dispatching, telemetry sensor feeds, active ambulance units, and hospital intake."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "System Admin" },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Link href="/dashboard/admin/emergencies">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 font-medium"
              >
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                Live Emergencies
              </Button>
            </Link>
            <Link href="/dashboard/admin/ambulances">
              <Button
                size="sm"
                className="bg-primary text-white hover:bg-primary-hover font-semibold gap-1.5 shadow-xs"
              >
                <Ambulance className="h-4 w-4" aria-hidden="true" />
                Fleet Console
              </Button>
            </Link>
          </div>
        }
      />

      {/* 6 StatCards stagger-revealed on mount */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            label="Active Incidents"
            value={activeEmergencies}
            icon={Activity}
            subtitle="CAD triage queue"
            trend={{ value: "+3 live", isPositive: true }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="Ambulances Ready"
            value={`${availableAmbulances}/${seedAmbulances.length}`}
            icon={Ambulance}
            subtitle="GPS units online"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="Drivers on Shift"
            value={`${onDutyDrivers}/${seedDrivers.length}`}
            icon={UserCheck}
            subtitle="Certified paramedics"
            trend={{ value: "All active", isPositive: true }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="Hospitals Accepting"
            value={`${acceptingHospitals}/${seedHospitals.length}`}
            icon={Building2}
            subtitle="Regional trauma centers"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="Target Response"
            value="< 10m"
            icon={Clock}
            subtitle="SLA threshold"
            trend={{ value: "98.4% met", isPositive: true }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="Telematics Health"
            value="Healthy"
            icon={ShieldCheck}
            subtitle="MQTT broker live"
          />
        </motion.div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                Today&apos;s Emergency Volume by Hour
              </h2>
              <p className="text-xs text-text-muted">
                Real-time incident dispatches and handovers
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-primary px-2 py-0.5 rounded-md bg-primary-light">
              Live
            </span>
          </div>
          <EmergencyLineChart />
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                Dispatch Lifecycle Stage Breakdown
              </h2>
              <p className="text-xs text-text-muted">
                Current emergency queue state distribution
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-text-secondary px-2 py-0.5 rounded-md bg-muted">
              Dhaka Grid
            </span>
          </div>
          <StatusBreakdownBar />
        </div>
      </div>

      {/* Hospital Network Diversion Status Table */}
      <DataTable
        headerSlot={
          <div className="flex items-center justify-between w-full">
            <div>
              <h3 className="font-semibold text-sm text-text-primary">
                Hospital Network Diversion & ER Capacity
              </h3>
              <p className="text-xs text-text-muted">
                Real-time trauma intake and bed availability monitoring
              </p>
            </div>
            <Link
              href="/dashboard/admin/hospitals"
              className="text-xs text-primary hover:underline font-semibold"
            >
              Manage Hospitals &rarr;
            </Link>
          </div>
        }
      >
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead scope="col" className="text-xs font-semibold">
                Hospital Name
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Diversion Status
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Available / Total ER Beds
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Emergency Phone
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Diversion Reason
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seedHospitals.map((hosp) => (
              <TableRow
                key={hosp.id}
                className="hover:bg-primary-light/20 transition-colors"
              >
                <TableCell className="font-semibold text-xs text-text-primary">
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
                <TableCell className="text-xs text-text-secondary font-mono">
                  {hosp.phone}
                </TableCell>
                <TableCell className="text-xs text-text-muted max-w-[260px] truncate">
                  {hosp.diversionReason ||
                    "Accepting all incoming patient transports"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
    </div>
  );
}
