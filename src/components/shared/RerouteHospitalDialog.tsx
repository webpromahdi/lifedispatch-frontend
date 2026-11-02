"use client";

import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Hospital as HospitalIcon,
  Loader2,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGetHospitals, useSelectTripHospital } from "@/hooks";
import type { Hospital } from "@/lib/types/hospital.types";

interface RerouteHospitalDialogProps {
  tripId: string | null;
  currentHospitalId?: string | null;
  currentHospitalName?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (hospital: Hospital) => void;
}

export function RerouteHospitalDialog({
  tripId,
  currentHospitalId,
  currentHospitalName,
  open,
  onOpenChange,
  onSuccess,
}: RerouteHospitalDialogProps) {
  const [search, setSearch] = useState("");

  const { data: hospitalsResponse, isLoading: isHospitalsLoading } =
    useGetHospitals(undefined, { enabled: open });
  const hospitals = useMemo(
    () => hospitalsResponse?.data ?? [],
    [hospitalsResponse],
  );

  const { mutate: selectHospital, isPending: isSelecting } =
    useSelectTripHospital();

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const q = search.toLowerCase();
      return (
        h.name.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        Boolean(h.phone?.toLowerCase().includes(q))
      );
    });
  }, [hospitals, search]);

  const handleSelectHospital = (hospital: Hospital) => {
    if (!tripId) {
      toast.error("Trip ID is required to route destination");
      return;
    }

    selectHospital(
      {
        id: tripId,
        payload: { hospitalId: hospital.id },
      },
      {
        onSuccess: (res) => {
          toast.success("Destination Hospital Updated", {
            description: `${res?.data?.hospital?.name || hospital.name} designated as receiving facility. Navigation updated.`,
          });
          onSuccess?.(hospital);
          onOpenChange(false);
        },
        onError: (err) => {
          toast.error("Failed to update destination hospital", {
            description:
              err instanceof Error
                ? err.message
                : "Unable to designate hospital.",
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6 rounded-none border-2 border-primary bg-white shadow-xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-light text-primary rounded-none">
              <HospitalIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-text-primary">
                Route Destination Hospital
              </DialogTitle>
              <DialogDescription className="text-xs text-text-secondary">
                Designate or re-route emergency receiving medical facility for
                active ambulance trip.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {currentHospitalName && (
          <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
            <span className="text-text-muted">Current Assigned Facility:</span>
            <span className="font-semibold text-text-primary flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              {currentHospitalName}
            </span>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hospital by facility name, address, or phone..."
            className="pl-9 h-9 text-xs rounded-none border-border"
          />
        </div>

        {/* Hospitals List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-60 max-h-96">
          {isHospitalsLoading ? (
            <div className="py-12 text-center space-y-2 text-xs text-text-muted">
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary" />
              <span>Scanning regional trauma center network...</span>
            </div>
          ) : filteredHospitals.length === 0 ? (
            <div className="py-12 text-center text-xs text-text-muted border border-dashed border-border p-6">
              No medical centers match your search criteria.
            </div>
          ) : (
            filteredHospitals.map((hosp) => {
              const isCurrent =
                hosp.id === currentHospitalId ||
                hosp.name === currentHospitalName;
              const isDiverting = hosp.diversionStatus === "DIVERTING";

              return (
                <div
                  key={hosp.id}
                  className={`p-3.5 border transition-all rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCurrent
                      ? "border-primary bg-primary-light/10"
                      : isDiverting
                        ? "border-amber-200 bg-amber-50/40"
                        : "border-border hover:border-primary/50 bg-white"
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-text-primary">
                        {hosp.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-primary text-white rounded-none">
                          CURRENT DESTINATION
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-none border ${
                          isDiverting
                            ? "bg-amber-100 text-amber-800 border-amber-300"
                            : "bg-emerald-100 text-emerald-800 border-emerald-300"
                        }`}
                      >
                        {hosp.diversionStatus}
                      </span>
                    </div>

                    <p className="text-[11px] text-text-muted truncate max-w-md">
                      {hosp.address}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-text-secondary pt-0.5">
                      <span>
                        ER Beds:{" "}
                        <strong className="text-text-primary">
                          {hosp.availableErBeds}
                        </strong>{" "}
                        / {hosp.totalErBeds}
                      </span>
                      {hosp.phone && (
                        <span className="font-mono text-slate-500">
                          {hosp.phone}
                        </span>
                      )}
                    </div>

                    {isDiverting && (
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-700 font-medium pt-1">
                        <AlertTriangle className="h-3 w-3 shrink-0" />
                        <span>
                          {hosp.diversionReason ||
                            "ER currently diverting trauma cases. Select with caution."}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center justify-end">
                    <Button
                      size="sm"
                      disabled={isCurrent || isSelecting}
                      onClick={() => handleSelectHospital(hosp)}
                      className={`h-8 px-3 text-xs font-bold rounded-none cursor-pointer ${
                        isCurrent
                          ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                          : isDiverting
                            ? "bg-amber-600 hover:bg-amber-700 text-white"
                            : "bg-primary hover:bg-primary-hover text-white"
                      }`}
                    >
                      {isSelecting ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          Routing...
                        </>
                      ) : isCurrent ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-primary" />
                          Selected
                        </>
                      ) : (
                        "Route Here"
                      )}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <DialogFooter className="pt-3 border-t border-border flex items-center justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs rounded-none border-border"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
