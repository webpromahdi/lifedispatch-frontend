"use client";

import { AlertTriangle, Bed, Building2, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { seedHospitals } from "@/lib/dummy/hospitals";

export function HospitalStaffView() {
  const currentHospital = seedHospitals[0]; // DMCH
  const [diversion, setDiversion] = useState(currentHospital.diversionStatus);

  const toggleDiversion = () => {
    const next = diversion === "ACCEPTING" ? "DIVERTING" : "ACCEPTING";
    setDiversion(next);
    toast.info("Hospital Diversion Updated", {
      description: `${currentHospital.name} is now ${next}.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hospital ER Capacity & Diversion Board"
        description="Emergency room bed utilization, trauma surgical availability, and ambulance diversion broadcasting."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/hospital-staff" },
          { label: "ER Capacity" },
        ]}
        action={
          <Button
            onClick={toggleDiversion}
            variant={diversion === "ACCEPTING" ? "outline" : "default"}
            className="min-h-[44px] cursor-pointer"
          >
            <AlertTriangle className="h-4 w-4 mr-2" aria-hidden="true" />
            Toggle Diversion:{" "}
            {diversion === "ACCEPTING" ? "Set Diverting" : "Set Accepting"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total ER Beds"
          value={currentHospital.totalErBeds}
          icon={Bed}
          subtitle="Trauma & Resuscitation"
        />
        <StatCard
          label="Available Beds"
          value={currentHospital.availableErBeds}
          icon={Building2}
          trend={{ value: "13% capacity free", isPositive: false }}
          subtitle="6 beds ready for intake"
        />
        <StatCard
          label="Current Diversion State"
          value={diversion}
          icon={AlertTriangle}
          trend={{
            value: diversion === "ACCEPTING" ? "Normal" : "Diverting",
            isPositive: diversion === "ACCEPTING",
          }}
          subtitle="Broadcast to all dispatchers"
        />
        <StatCard
          label="Staff Shift"
          value="Shift A (Day)"
          icon={Clock}
          subtitle="12 nurses, 4 ER physicians"
        />
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="font-bold text-base text-text-primary">
              {currentHospital.name}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              {currentHospital.address} • {currentHospital.phone}
            </p>
          </div>
          <StatusBadge status={diversion} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-background border border-border space-y-1">
            <span className="font-semibold text-text-secondary block">
              Trauma Resuscitation Bays
            </span>
            <span className="text-lg font-bold text-text-primary">
              2 / 4 Available
            </span>
          </div>
          <div className="p-4 rounded-lg bg-background border border-border space-y-1">
            <span className="font-semibold text-text-secondary block">
              ICU Ventilator Capacity
            </span>
            <span className="text-lg font-bold text-text-primary">
              1 / 8 Available
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
