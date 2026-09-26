"use client";

import {
  Calendar,
  Clock,
  Compass,
  FileText,
  Filter,
  HeartPulse,
  MapPin,
  Receipt,
  Search,
  Shield,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { seedEmergencies } from "@/lib/dummy/emergencies";
import { formatDate } from "@/lib/utils";

export function PatientHistoryView() {
  const [emergencies] = useState(seedEmergencies);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const filteredEmergencies = useMemo(() => {
    return emergencies.filter((em) => {
      const searchTerms = [
        em.incidentNumber,
        em.emergencyType,
        em.locationAddress,
        em.description,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchTerms.includes(search.toLowerCase());
      const matchesType = typeFilter === "ALL" || em.emergencyType === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [emergencies, search, typeFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Emergency Medical History"
        description="Chronological record of your past emergency ambulance dispatches, triage assessments, and clinical hospital transfers."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/patient" },
          { label: "Medical History" },
        ]}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 border border-border rounded-xl shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <Input
            placeholder="Search incident #, condition, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-base md:text-xs h-10 md:h-9"
            aria-label="Search emergency records"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-text-muted" aria-hidden="true" />
          <Select
            value={typeFilter}
            onValueChange={(val) => val && setTypeFilter(val)}
          >
            <SelectTrigger
              className="w-44 text-xs h-9"
              aria-label="Filter by emergency type"
            >
              <SelectValue placeholder="All Emergency Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="CARDIAC">Cardiac</SelectItem>
              <SelectItem value="TRAUMA">Trauma</SelectItem>
              <SelectItem value="RESPIRATORY">Respiratory</SelectItem>
              <SelectItem value="NEUROLOGICAL">Neurological</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Timeline List of Emergencies */}
      <div className="space-y-4">
        {filteredEmergencies.map((em, idx) => (
          <div
            key={em.id}
            className="p-5 rounded-xl bg-surface border border-border hover:border-border-strong transition-all shadow-xs space-y-4"
          >
            {/* Top row: Incident #, Type, Priority, Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-text-primary">
                  {em.incidentNumber}
                </span>
                <Badge
                  variant="outline"
                  className="font-semibold text-xs capitalize bg-muted"
                >
                  {em.emergencyType.toLowerCase()}
                </Badge>
                <PriorityBadge priority={em.priority} />
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={em.status} />
                <span className="text-xs font-mono text-text-muted">
                  {formatDate(em.createdAt, "MMM dd, yyyy • hh:mm a")}
                </span>
              </div>
            </div>

            {/* Middle: Clinical Description and Location details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2 space-y-2">
                <p className="text-text-secondary leading-relaxed">
                  {em.description}
                </p>

                <div className="flex items-center gap-2 text-text-muted text-[11px] pt-1">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                  <span className="text-text-secondary truncate">
                    {em.locationAddress}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-background border border-border space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-text-muted">Capability:</span>
                  <span className="font-semibold text-text-primary">
                    {em.requiredCapability}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-text-muted">SLA Target:</span>
                  <span className="font-medium text-text-primary">
                    {em.slaTargetMinutes || 8} min
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-text-muted">Response Time:</span>
                  <span className="font-semibold text-status">
                    {em.responseTimeMinutes
                      ? `${em.responseTimeMinutes} min`
                      : "6.2 min"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom: Invoice Action */}
            <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
              <span className="text-text-muted">
                Caller: <strong>{em.callerName}</strong> ({em.callerPhone})
              </span>

              <Link
                href={`/dashboard/patient/payment/pay_001`}
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-dark font-semibold px-3 py-1.5 rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
              >
                <Receipt className="h-3.5 w-3.5" aria-hidden="true" />
                <span>View Trip Invoice</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
