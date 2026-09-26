"use client";

import {
  Award,
  Calendar,
  CheckCircle2,
  FileCheck,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShieldCheck,
  Star,
  Truck,
  User,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { seedAmbulances } from "@/lib/dummy/ambulances";
import { seedDrivers } from "@/lib/dummy/drivers";

export function DriverProfileView() {
  const driver = seedDrivers[0];
  const ambulance = seedAmbulances[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Driver Telematics & Profile"
        description="Paramedic driver credentials, operational readiness records, driving licensing, and clinical certifications."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/driver" },
          { label: "Driver Profile" },
        ]}
      />

      {/* Driver Identity Card */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-2xl border-2 border-primary/20 shrink-0">
              RI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-text-primary">
                  Rafiqul Islam
                </h2>
                <Badge
                  variant="outline"
                  className="bg-status-bg text-status-text border-status/40 text-xs font-semibold"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1 text-status" aria-hidden="true" />
                  {driver.isOnShift ? "Active Duty" : "Off Duty"}
                </Badge>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Senior Paramedic Fleet Driver • Dhaka Metropolitan Region
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-text-muted">
                <span className="flex items-center text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" aria-hidden="true" />
                  <strong className="text-text-primary">4.95</strong> / 5.0
                </span>
                <span>•</span>
                <span>
                  License ID:{" "}
                  <strong className="font-mono text-text-primary">
                    {driver.licenseNumber}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-background p-3 rounded-lg border border-border text-xs">
            <div className="text-right">
              <span className="text-[11px] text-text-muted block">
                Total Missions
              </span>
              <span className="text-base font-bold text-primary font-mono">
                {driver.totalTripsCompleted}
              </span>
            </div>
            <div className="h-8 w-px bg-border mx-2" />
            <div className="text-right">
              <span className="text-[11px] text-text-muted block">
                SLA Compliance
              </span>
              <span className="text-base font-bold text-status font-mono">
                100%
              </span>
            </div>
          </div>
        </div>

        {/* Profile Attributes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {/* Card 1: Contact Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Contact & Identity
            </h3>
            <div className="p-3.5 rounded-lg bg-background border border-border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-muted flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Email:
                </span>
                <span className="text-text-primary font-medium">
                  rafiqul.islam@lifedispatch.org
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" /> Phone:
                </span>
                <span className="text-text-primary font-medium">
                  +880 1711-234567
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-status" aria-hidden="true" /> Emergency Contact:
                </span>
                <span className="text-text-primary font-medium">
                  +880 1819-998877 (Spouse)
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Assigned Vehicle & Base */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Operational Assignment
            </h3>
            <div className="p-3.5 rounded-lg bg-background border border-border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Unit Plate:</span>
                <span className="font-mono font-semibold text-text-primary">
                  {ambulance.registrationNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Vehicle Type:</span>
                <span className="capitalize font-medium text-text-primary">
                  {ambulance.type.replace(/_/g, " ").toLowerCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Base Station:
                </span>
                <span className="font-medium text-text-primary">
                  Banani Dispatch Hub (Zone 4)
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Clinical & EVOC Certifications */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Clinical Credentials
            </h3>
            <div className="p-3.5 rounded-lg bg-background border border-border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Clinical Level:</span>
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] font-bold text-primary border-primary/30 bg-primary-light"
                >
                  {driver.certificationLevel}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">ACLS / BLS Certified:</span>
                <span className="text-status font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Valid through 2028
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">EVOC Emergency Driving:</span>
                <span className="text-status font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Class 1 Certified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications & Badges Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-border flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary-light text-primary shrink-0">
            <HeartPulse className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-text-primary">
              Advanced Cardiac Life Support
            </h4>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Authorized for defibrillator deployment, cardiac telemetry, and
              IV drug administration.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border flex items-start gap-3">
          <div className="p-2 rounded-lg bg-secondary-light text-secondary shrink-0">
            <Shield className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-text-primary">
              Pre-Hospital Trauma Specialist
            </h4>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Extrication, airway intubation, hemorrhage control, and rapid
              triage certified.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border flex items-start gap-3">
          <div className="p-2 rounded-lg bg-status-bg text-status shrink-0">
            <Award className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-text-primary">
              Excellence in Emergency Care
            </h4>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Over 300 successful patient handovers with zero safety incidents
              over 5 years.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
