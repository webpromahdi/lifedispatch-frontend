"use client";

import { Award, CheckCircle2, MapPin, Truck } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { DispatchCard } from "@/components/dispatch/DispatchCard";
import { seedAmbulances } from "@/lib/dummy/ambulances";
import { seedDispatches } from "@/lib/dummy/dispatches";
import { seedDrivers } from "@/lib/dummy/drivers";
import { seedEmergencies } from "@/lib/dummy/emergencies";

export function DriverView() {
  const currentDriver = seedDrivers[0];
  const assignedAmbulance = seedAmbulances[0];
  const pendingDispatch = seedDispatches[1];
  const pendingEmergency = seedEmergencies[1];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Driver Dispatch Console"
        description="Active mobile dispatch notifications, mission milestones, and route directions."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/driver" },
          { label: "Driver Console" },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Assigned Ambulance"
          value="CHA-71-4091"
          icon={Truck}
          subtitle="Advanced Life Support (ALS)"
        />
        <StatCard
          label="Total Trips Completed"
          value={currentDriver.totalTripsCompleted}
          icon={Award}
          trend={{ value: "+4 this week", isPositive: true }}
          subtitle="100% completion rate"
        />
        <StatCard
          label="Shift Status"
          value={currentDriver.isOnShift ? "On Duty" : "Off Duty"}
          icon={CheckCircle2}
          trend={{ value: "Active", isPositive: true }}
          subtitle="08:00 AM — 08:00 PM"
        />
        <StatCard
          label="Base Station"
          value="Banani Station"
          icon={MapPin}
          subtitle="Zone 4 North Dhaka"
        />
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-base font-bold text-text-primary">
          Incoming Dispatch Alert (Live 2-Min Countdown)
        </h2>
        <DispatchCard
          dispatch={pendingDispatch}
          emergency={pendingEmergency}
          ambulance={assignedAmbulance}
        />
      </div>
    </div>
  );
}
