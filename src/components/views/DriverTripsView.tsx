"use client";

import {
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  MapPin,
  Navigation,
  Route,
  Search,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { seedTrips } from "@/lib/dummy/trips";
import type { Trip } from "@/lib/types/trip.types";
import { formatDate } from "@/lib/utils";

export function DriverTripsView() {
  const [trips] = useState<Trip[]>(seedTrips);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const ambulanceMap = useMemo(
    () => new Map(seedAmbulances.map((a) => [a.id, a])),
    [],
  );
  const hospitalMap = useMemo(
    () => new Map(seedHospitals.map((h) => [h.id, h])),
    [],
  );

  const completedTrips = trips.filter((t) => t.status === "COMPLETED");
  const totalKm = completedTrips.reduce(
    (sum, t) => sum + (t.distanceKm || 0),
    0,
  );

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const amb = ambulanceMap.get(trip.ambulanceId);
      const hosp = trip.hospitalId ? hospitalMap.get(trip.hospitalId) : null;

      const searchTerms = [
        trip.id,
        amb?.registrationNumber || "",
        hosp?.name || "",
        trip.status,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchTerms.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || trip.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [trips, search, statusFilter, ambulanceMap, hospitalMap]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Driver Trip History"
        description="Historical log of emergency paramedic missions, route telemetry, transport distances, and hospital handover records."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/driver" },
          { label: "Trip History" },
        ]}
      />

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Missions Completed"
          value={completedTrips.length}
          icon={CheckCircle2}
          subtitle="All-time verified handovers"
        />
        <StatCard
          label="Total Distance Covered"
          value={`${totalKm.toFixed(1)} km`}
          icon={Route}
          subtitle="Zone 4 response radius"
        />
        <StatCard
          label="Avg Mission Duration"
          value="34 min"
          icon={Clock}
          trend={{ value: "-4 min", isPositive: true }}
          subtitle="Scene to ER transfer"
        />
        <StatCard
          label="SLA On-Time Arrival"
          value="98.5%"
          icon={Award}
          trend={{ value: "+1.2%", isPositive: true }}
          subtitle="Benchmark: 95.0%"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 border border-border rounded-xl shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <Input
            placeholder="Search trip ID, ambulance, hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-base md:text-xs h-10 md:h-9"
            aria-label="Search trip history"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-text-muted" aria-hidden="true" />
          <Select
            value={statusFilter}
            onValueChange={(val) => val && setStatusFilter(val)}
          >
            <SelectTrigger
              className="w-48 text-xs h-9"
              aria-label="Filter trips by status"
            >
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses ({trips.length})</SelectItem>
              <SelectItem value="COMPLETED">COMPLETED</SelectItem>
              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
              <SelectItem value="CANCELLED">CANCELLED</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Trips Table */}
      <DataTable
        headerSlot={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-sm text-text-primary">
              Completed & Archived Trips ({filteredTrips.length})
            </span>
            <span className="text-xs text-text-muted">
              Official telematics log for hospital patient handover
            </span>
          </div>
        }
      >
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead scope="col" className="text-xs font-semibold">
                Trip ID
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Date & Departure
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Ambulance Unit
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Destination Hospital
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Distance
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Status
              </TableHead>
              <TableHead
                scope="col"
                className="text-xs font-semibold text-right"
              >
                Completed At
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrips.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-xs text-text-muted"
                >
                  No trip records found matching this criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredTrips.map((trip) => {
                const amb = ambulanceMap.get(trip.ambulanceId);
                const hosp = trip.hospitalId
                  ? hospitalMap.get(trip.hospitalId)
                  : null;

                return (
                  <TableRow
                    key={trip.id}
                    className="hover:bg-primary-light/20 transition-colors"
                  >
                    <TableCell className="font-mono text-xs font-semibold text-text-primary">
                      {trip.id}
                    </TableCell>
                    <TableCell className="text-xs text-text-secondary">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Calendar className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
                        <span>
                          {formatDate(trip.departedAt, "MMM dd, yyyy hh:mm a")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-text-secondary">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Truck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        <span>{amb ? amb.registrationNumber : trip.ambulanceId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
                        <span>{hosp ? hosp.name : "Local Emergency Center"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono font-medium text-text-primary">
                      {trip.distanceKm ? `${trip.distanceKm} km` : "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={trip.status} />
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono text-text-muted">
                      {trip.completedAt
                        ? formatDate(trip.completedAt, "hh:mm a")
                        : "—"}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </DataTable>
    </div>
  );
}
