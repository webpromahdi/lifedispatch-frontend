"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  Ambulance,
  ArrowRight,
  Ban,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  HeartHandshake,
  MapPin,
  PhoneCall,
  Plus,
  Radio,
  Receipt,
  Shield,
  ShieldAlert,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CreateEmergencyForm } from "@/components/forms/CreateEmergencyForm";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { seedEmergencies } from "@/lib/dummy/emergencies";
import { EmergencyStatus } from "@/lib/types/enums";
import { cn, formatDate } from "@/lib/utils";

// Stepper workflow per PRD §3.3
const STEPPER_STAGES = [
  { key: "PENDING", label: "Call Received", desc: "Triage registered" },
  { key: "PRIORITIZED", label: "Prioritized", desc: "Severity assigned" },
  { key: "DISPATCHING", label: "Dispatching", desc: "Unit assigned" },
  { key: "ACTIVE_TRIP", label: "Ambulance En Route", desc: "Responding unit" },
  { key: "COMPLETED", label: "Hospital Handover", desc: "Care transferred" },
];

export function PatientView() {
  // Visual Decision [B5]: Nafisa Anjum default has an active emergency (INC-2026-0001)
  const [hasActiveEmergency, setHasActiveEmergency] = useState<boolean>(true);
  const [activeIncidentNumber, setActiveIncidentNumber] =
    useState<string>("INC-2026-0001");
  const [activeEmergencyStatus, setActiveEmergencyStatus] = useState<string>(
    EmergencyStatus.ACTIVE_TRIP,
  );

  // Modal dialog states
  const [requestModalOpen, setRequestModalOpen] = useState<boolean>(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);

  const activeIndex = STEPPER_STAGES.findIndex(
    (s) => s.key === activeEmergencyStatus,
  );

  const handleCancelEmergency = () => {
    setActiveEmergencyStatus(EmergencyStatus.CANCELLED);
    setHasActiveEmergency(false);
    setCancelDialogOpen(false);
    toast.error("Emergency Call Cancelled", {
      description: `Incident ${activeIncidentNumber} has been officially cancelled.`,
    });
  };

  const handleCreateSuccess = (incidentNum: string) => {
    setRequestModalOpen(false);
    setActiveIncidentNumber(incidentNum);
    setActiveEmergencyStatus(EmergencyStatus.PENDING);
    setHasActiveEmergency(true);
  };

  const pastEmergencies = seedEmergencies.slice(1, 4);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Emergency Portal"
        description="Request urgent clinical ambulance dispatch, track live responder telematics, and review trip medical invoices."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/patient" },
          { label: "Emergency Portal" },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setRequestModalOpen(true)}
              disabled={hasActiveEmergency}
              aria-label="Request Emergency Ambulance"
              className={cn(
                "min-h-[44px] font-semibold px-5 transition-colors cursor-pointer",
                hasActiveEmergency
                  ? "bg-muted text-text-muted cursor-not-allowed border border-border"
                  : "bg-primary hover:bg-primary-dark text-primary-foreground",
              )}
              title={
                hasActiveEmergency
                  ? `Active emergency ${activeIncidentNumber} in progress.`
                  : "Request urgent medical ambulance"
              }
            >
              <Plus className="h-4 w-4 mr-1.5" aria-hidden="true" />
              Request Emergency Ambulance
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Request"
          value={hasActiveEmergency ? activeIncidentNumber : "None Active"}
          icon={AlertCircle}
          subtitle={
            hasActiveEmergency ? "Unit En Route (ETA: ~4 min)" : "Ready on standby"
          }
          trend={
            hasActiveEmergency
              ? { value: "Priority P1", isPositive: false }
              : undefined
          }
        />
        <StatCard
          label="Emergency Contact"
          value="Tanvir Hasan"
          icon={PhoneCall}
          subtitle="+880 1711-555555 (Spouse)"
        />
        <StatCard
          label="Registered Blood Type"
          value="O Negative (O-)"
          icon={HeartHandshake}
          subtitle="Universal Donor Profile"
        />
        <StatCard
          label="Historical Trips"
          value="3 Completed"
          icon={Clock}
          subtitle="All invoices settled"
        />
      </div>

      {/* Active Emergency Status Tracker (Rendered when patient has active emergency) */}
      <AnimatePresence>
        {hasActiveEmergency && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="p-6 rounded-2xl bg-surface border border-primary/30 shadow-md space-y-6"
          >
            {/* Header with Incident number and cancel action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
                  <span className="font-mono text-xs font-semibold text-text-primary">
                    Active Incident: {activeIncidentNumber}
                  </span>
                  <PriorityBadge priority="P1_CRITICAL" />
                </div>
                <h2 className="text-base font-bold text-text-primary">
                  Cardiac Emergency Response Dispatched
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCancelDialogOpen(true)}
                  aria-label={`Cancel emergency request ${activeIncidentNumber}`}
                  className="min-h-[40px] text-xs font-medium text-destructive border-destructive/30 hover:bg-destructive-bg cursor-pointer"
                >
                  <Ban className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                  Cancel Request
                </Button>
              </div>
            </div>

            {/* Visual Stepper with Framer Animated Teal Pulse Ring */}
            <div className="py-2">
              <span className="text-xs font-semibold text-text-primary block mb-3">
                Live Mission Progress Tracker
              </span>

              <ol
                role="list"
                aria-label="Emergency response progress"
                className="grid grid-cols-1 sm:grid-cols-5 gap-3"
              >
                {STEPPER_STAGES.map((stage, idx) => {
                  const isCurrent = stage.key === activeEmergencyStatus;
                  const isPast = idx < activeIndex;

                  return (
                    <li
                      key={stage.key}
                      role="listitem"
                      aria-current={isCurrent ? "step" : undefined}
                      className={cn(
                        "p-3 rounded-xl border flex flex-col justify-between transition-all duration-200 relative",
                        isCurrent
                          ? "bg-primary-light/60 border-primary shadow-xs ring-1 ring-primary/30"
                          : isPast
                            ? "bg-surface border-border text-text-secondary"
                            : "bg-background/40 border-dashed border-border text-text-muted opacity-60",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-mono text-text-muted">
                          Step 0{idx + 1}
                        </span>

                        <div className="relative flex items-center justify-center">
                          {/* Animated Teal Pulse Ring on Active Step */}
                          {isCurrent && (
                            <span
                              className="absolute -inset-1 rounded-full bg-primary/30 animate-ping"
                              aria-hidden="true"
                            />
                          )}

                          <div
                            className={cn(
                              "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors z-10",
                              isCurrent
                                ? "bg-primary text-white"
                                : isPast
                                  ? "bg-status text-white"
                                  : "bg-muted text-text-muted border border-border",
                            )}
                          >
                            {isPast ? (
                              <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div
                          className={cn(
                            "text-xs font-semibold leading-tight",
                            isCurrent
                              ? "text-primary font-bold"
                              : isPast
                                ? "text-text-primary"
                                : "text-text-muted",
                          )}
                        >
                          {stage.label}
                        </div>
                        <p className="text-[11px] text-text-secondary mt-0.5 line-clamp-1">
                          {stage.desc}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Active Telematics Unit Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-background border border-border text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary-light text-primary">
                  <Ambulance className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">
                    Assigned Unit
                  </span>
                  <span className="font-mono font-semibold text-text-primary">
                    CHA-71-4091 (ALS)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-secondary-light text-secondary">
                  <Building2 className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">
                    Destination ER
                  </span>
                  <span className="font-medium text-text-primary">
                    United Hospital (Trauma Bay)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-status-bg text-status">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">
                    Estimated Arrival
                  </span>
                  <span className="font-bold text-status text-sm">
                    ~3-4 Minutes
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Requests History Table */}
      <DataTable
        headerSlot={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-sm text-text-primary">
              My Emergency Requests &amp; Records
            </span>
            <Link
              href="/dashboard/patient/history"
              className="text-xs text-primary hover:text-primary-dark font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View Full History</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        }
      >
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead scope="col" className="text-xs font-semibold">
                Incident #
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Type
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Priority
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Status
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Pickup Address
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Date &amp; Time
              </TableHead>
              <TableHead
                scope="col"
                className="text-xs font-semibold text-right"
              >
                Invoice
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pastEmergencies.map((em) => (
              <TableRow
                key={em.id}
                className="hover:bg-primary-light/20 transition-colors"
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
                <TableCell className="text-xs text-text-secondary max-w-[220px] truncate">
                  {em.locationAddress}
                </TableCell>
                <TableCell className="text-xs text-text-muted font-mono">
                  {formatDate(em.createdAt, "dd MMM yyyy, hh:mm a")}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/dashboard/patient/payment/pay_001`}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-dark font-medium cursor-pointer"
                  >
                    <Receipt className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>View Bill</span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>

      {/* Full-Page Dialog Modal for CreateEmergencyForm */}
      <Dialog open={requestModalOpen} onOpenChange={setRequestModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-destructive-bg text-destructive">
                <ShieldAlert className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <DialogTitle>Request Emergency Ambulance</DialogTitle>
                <DialogDescription>
                  Dispatch high-priority medical transport to your current
                  coordinates.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <CreateEmergencyForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setRequestModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Cancel Request Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-destructive-bg text-destructive">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <DialogTitle>Cancel Emergency Request?</DialogTitle>
                <DialogDescription>
                  Are you certain you want to cancel response for incident{" "}
                  <span className="font-mono font-semibold text-text-primary">
                    {activeIncidentNumber}
                  </span>
                  ?
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-2 text-xs text-text-secondary space-y-2">
            <p>
              Cancelling will recall assigned ambulance unit{" "}
              <strong>CHA-71-4091</strong> and clear the telemetry route. If
              medical distress continues, please call 999 immediately.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              className="text-xs min-h-[40px] cursor-pointer"
            >
              Do Not Cancel
            </Button>
            <Button
              onClick={handleCancelEmergency}
              className="bg-destructive hover:bg-destructive/90 text-white text-xs min-h-[40px] cursor-pointer font-medium"
            >
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
