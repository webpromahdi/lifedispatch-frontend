"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Input } from "@/components/ui/input";
import { CornerNotch, LabelTab } from "@/components/shared/DashboardUIPrimitives";
import { seedHospitals } from "@/lib/dummy/hospitals";
import { dummyUserPresets } from "@/lib/dummy/users";
import { HospitalDiversionStatus, UserRole } from "@/lib/types/enums";
import type { Hospital } from "@/lib/types/hospital.types";
import { cn } from "@/lib/utils";

interface StaffRosterMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  isOnShift: boolean;
  canManageStaff: boolean;
}

const INITIAL_ROSTER: StaffRosterMember[] = [
  {
    id: "staff_001",
    name: "Dr. Rafiqul Islam",
    designation: "Chief of Emergency Medicine",
    department: "Trauma Resuscitation",
    isOnShift: true,
    canManageStaff: true,
  },
  {
    id: "staff_002",
    name: "Dr. Naila Zaman",
    designation: "Emergency Trauma Surgeon",
    department: "Acute Surgical Unit",
    isOnShift: true,
    canManageStaff: false,
  },
  {
    id: "staff_003",
    name: "Sister Anowara Begum",
    designation: "Head Triage Nurse",
    department: "ER Reception & Triage",
    isOnShift: true,
    canManageStaff: false,
  },
  {
    id: "staff_004",
    name: "Dr. Shafiul Alam",
    designation: "Critical Care Specialist",
    department: "ICU / Ventilator",
    isOnShift: false,
    canManageStaff: false,
  },
];

export function HospitalStaffView() {
  // Current logged in user from presets
  const currentUser = dummyUserPresets[UserRole.HOSPITAL_STAFF];
  const userHospitalId = currentUser.hospitalId;

  // Find linked hospital
  const initialHospital = useMemo(() => {
    if (!userHospitalId) return null;
    return seedHospitals.find((h) => h.id === userHospitalId) || null;
  }, [userHospitalId]);

  // Hospital Status Form State
  const [hospital, setHospital] = useState<Hospital | null>(initialHospital);
  const [diversionStatus, setDiversionStatus] =
    useState<HospitalDiversionStatus>(
      initialHospital?.diversionStatus || HospitalDiversionStatus.ACCEPTING,
    );
  const [diversionReason, setDiversionReason] = useState<string>(
    initialHospital?.diversionReason || "",
  );
  const [availableBeds, setAvailableBeds] = useState<number>(
    initialHospital?.availableErBeds ?? 6,
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdateNotice, setLastUpdateNotice] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // My Shift State
  const [isOnShift, setIsOnShift] = useState<boolean>(true);

  // Staff Roster
  const [roster] = useState<StaffRosterMember[]>(INITIAL_ROSTER);

  // Handle Shift Toggle
  const handleToggleShift = () => {
    const nextState = !isOnShift;
    setIsOnShift(nextState);
    if (nextState) {
      toast.success("Staff shift status updated: ON SHIFT");
    } else {
      toast.info("Staff shift status updated: OFF SHIFT");
    }
  };

  // Handle Diversion Status Update
  const handleUpdateHospitalStatus = () => {
    if (!hospital) return;

    if (
      (diversionStatus === HospitalDiversionStatus.DIVERTING ||
        diversionStatus === HospitalDiversionStatus.CLOSED) &&
      !diversionReason.trim()
    ) {
      setUpdateError(
        "Please specify a reason for diverting or closing ER admissions.",
      );
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);

    // Call update API (simulated)
    setTimeout(() => {
      const updatedHospital: Hospital = {
        ...hospital,
        diversionStatus,
        diversionReason:
          diversionStatus === HospitalDiversionStatus.ACCEPTING
            ? null
            : diversionReason.trim(),
        availableErBeds: Number(availableBeds) || 0,
        updatedAt: new Date().toISOString(),
      };

      setHospital(updatedHospital);
      setLastUpdateNotice(
        `Status updated to ${diversionStatus} (${availableBeds} ER beds available).`,
      );
      toast.success("Hospital Status Updated Successfully");
      setIsUpdating(false);
    }, 300);
  };

  return (
    <div className="space-y-6 flex flex-col">
      {/* ── ROW 1: DESKTOP TWO COLUMNS (Left Wide: Hospital Status, Right Narrow: My Shift) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: HOSPITAL STATUS (Diversion Controls & ER Beds) */}
        <div className="lg:col-span-8 w-full">
          <section
            aria-label="Hospital Status"
            className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5 sm:p-6"
          >
            <CornerNotch />
            <LabelTab label="HOSPITAL STATUS" />

            {!hospital ? (
              <div className="mt-4 p-6 bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                No hospital record found for this staff account. Please contact
                system support.
              </div>
            ) : (
              <div className="mt-4 space-y-5">
                {/* Header: Hospital Name with Purple Icon */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 border border-purple-200 shrink-0">
                    <svg
                      className="w-6 h-6 text-secondary"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 6v4" />
                      <path d="M10 8h4" />
                      <path d="M18 20V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16" />
                      <path d="M2 20h20" />
                      <path d="M10 14h4v6h-4z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-text-primary tracking-tight">
                      {hospital.name}
                    </h2>
                    <span className="text-xs text-text-secondary">
                      Emergency Department Care & Capacity Center
                    </span>
                  </div>
                </div>

                {/* Diversion Status 3 Square Buttons */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-primary block">
                    ER Diversion Status
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Accepting (Green) */}
                    <button
                      type="button"
                      onClick={() =>
                        setDiversionStatus(HospitalDiversionStatus.ACCEPTING)
                      }
                      className={cn(
                        "min-h-12 px-4 text-xs sm:text-sm font-bold rounded-none cursor-pointer flex items-center justify-center gap-2",
                        diversionStatus === HospitalDiversionStatus.ACCEPTING
                          ? "bg-emerald-100 text-emerald-900 border-2 border-emerald-600 shadow-xs"
                          : "bg-emerald-50/70 text-emerald-800 border border-emerald-300 hover:bg-emerald-100",
                      )}
                    >
                      <span className="w-2.5 h-2.5 bg-emerald-600 shrink-0" />
                      <span>Accepting</span>
                    </button>

                    {/* Diverting (Amber) */}
                    <button
                      type="button"
                      onClick={() =>
                        setDiversionStatus(HospitalDiversionStatus.DIVERTING)
                      }
                      className={cn(
                        "min-h-12 px-4 text-xs sm:text-sm font-bold rounded-none cursor-pointer flex items-center justify-center gap-2",
                        diversionStatus === HospitalDiversionStatus.DIVERTING
                          ? "bg-amber-100 text-amber-900 border-2 border-amber-600 shadow-xs"
                          : "bg-amber-50/70 text-amber-800 border border-amber-300 hover:bg-amber-100",
                      )}
                    >
                      <span className="w-2.5 h-2.5 bg-amber-600 shrink-0" />
                      <span>Diverting</span>
                    </button>

                    {/* Closed (Destructive Red) */}
                    <button
                      type="button"
                      onClick={() =>
                        setDiversionStatus(HospitalDiversionStatus.CLOSED)
                      }
                      className={cn(
                        "min-h-12 px-4 text-xs sm:text-sm font-bold rounded-none cursor-pointer flex items-center justify-center gap-2",
                        diversionStatus === HospitalDiversionStatus.CLOSED
                          ? "bg-red-100 text-red-900 border-2 border-red-600 shadow-xs"
                          : "bg-red-50/70 text-red-800 border border-red-300 hover:bg-red-100",
                      )}
                    >
                      <span className="w-2.5 h-2.5 bg-red-600 shrink-0" />
                      <span>Closed</span>
                    </button>
                  </div>
                </div>

                {/* Conditional Reason Input (for Diverting & Closed) */}
                {(diversionStatus === HospitalDiversionStatus.DIVERTING ||
                  diversionStatus === HospitalDiversionStatus.CLOSED) && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-primary block">
                      Diversion Reason <span className="text-red-600">*</span>
                    </label>
                    <Input
                      value={diversionReason}
                      onChange={(e) => setDiversionReason(e.target.value)}
                      placeholder="e.g., Trauma bay near capacity; acute electrical maintenance"
                      className="rounded-none border-2 border-border text-sm min-h-11"
                    />
                  </div>
                )}

                {/* Available ER Beds Number Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary block">
                    Available ER Beds (Total Capacity: {hospital.totalErBeds})
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={hospital.totalErBeds}
                    value={availableBeds}
                    onChange={(e) =>
                      setAvailableBeds(Math.max(0, Number(e.target.value)))
                    }
                    className="rounded-none border-2 border-border text-sm min-h-11 max-w-xs font-mono font-bold"
                  />
                </div>

                {/* Error Notice */}
                {updateError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                    {updateError}
                  </div>
                )}

                {/* Saved Result Notice */}
                {lastUpdateNotice && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                    {lastUpdateNotice}
                  </div>
                )}

                {/* Update Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={handleUpdateHospitalStatus}
                    className="w-full sm:w-auto min-h-11 px-6 text-sm font-bold bg-primary hover:bg-primary-dark text-white rounded-none cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? "Saving..." : "Update Hospital Status"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: MY SHIFT */}
        <div className="lg:col-span-4 w-full">
          <section
            aria-label="My Shift"
            className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5 sm:p-6"
          >
            <CornerNotch />
            <LabelTab label="MY SHIFT" />

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-secondary">
                  Shift Duty Status:
                </span>
                <StatusBadge
                  status={isOnShift ? "ON_SHIFT" : "OFF_SHIFT"}
                  variant="square"
                />
              </div>

              <div className="text-xs text-text-secondary">
                Logged in as{" "}
                <span className="font-bold text-text-primary">
                  {currentUser.name}
                </span>
              </div>

              <button
                type="button"
                onClick={handleToggleShift}
                className={cn(
                  "w-full min-h-12 text-sm font-bold rounded-none cursor-pointer transition-colors",
                  isOnShift
                    ? "border-2 border-border text-text-primary hover:bg-slate-100"
                    : "bg-primary hover:bg-primary-dark text-white",
                )}
              >
                {isOnShift
                  ? "End Shift (Go Off Duty)"
                  : "Start Shift (Go On Duty)"}
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* ── ROW 2: FULL WIDTH STAFF ROSTER TABLE ── */}
      <section
        aria-label="Staff Roster"
        className="relative bg-white border-2 border-primary rounded-none shadow-[2px_2px_0px_0px_rgba(20,184,166,0.15)] p-5 sm:p-6"
      >
        <CornerNotch />
        <LabelTab label="STAFF ROSTER" />

        <div className="mt-4 overflow-x-auto -mx-5 sm:mx-0">
          <div className="min-w-155 px-5 sm:px-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-text-primary">
                  <th scope="col" className="py-2.5 pr-4">
                    Name
                  </th>
                  <th scope="col" className="py-2.5 px-4">
                    Designation
                  </th>
                  <th scope="col" className="py-2.5 px-4">
                    Department
                  </th>
                  <th scope="col" className="py-2.5 px-4">
                    Shift Status
                  </th>
                  <th scope="col" className="py-2.5 pl-4">
                    Can Manage Staff
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {roster.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-text-muted"
                    >
                      No staff members assigned to this facility.
                    </td>
                  </tr>
                ) : (
                  roster.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 pr-4 font-bold text-text-primary">
                        {member.name}
                      </td>
                      <td className="py-3 px-4 font-medium text-text-primary">
                        {member.designation}
                      </td>
                      <td className="py-3 px-4 text-text-secondary">
                        {member.department}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          status={member.isOnShift ? "ON_SHIFT" : "OFF_SHIFT"}
                          variant="square"
                        />
                      </td>
                      <td className="py-3 pl-4 font-medium text-text-primary">
                        {member.canManageStaff ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
