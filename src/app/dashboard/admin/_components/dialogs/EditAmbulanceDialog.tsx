"use client";

import { Ambulance, Edit3, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetHospitals, useUpdateAmbulance } from "@/hooks";
import type { AmbulanceWithDriver } from "@/lib/types/ambulance.types";
import { AmbulanceType } from "@/lib/types/enums";

interface EditAmbulanceDialogProps {
  ambulance: AmbulanceWithDriver;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function EditAmbulanceDialog({
  ambulance,
  open: externalOpen,
  onOpenChange: setExternalOpen,
  trigger,
}: EditAmbulanceDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen =
    isControlled && setExternalOpen ? setExternalOpen : setInternalOpen;

  const [regNum, setRegNum] = useState(ambulance.registrationNumber);
  const [ambulanceType, setAmbulanceType] = useState<AmbulanceType>(
    ambulance.type || AmbulanceType.ADVANCED_LIFE_SUPPORT,
  );
  const [capabilities, setCapabilities] = useState(
    ambulance.capabilities?.join(", ") || "",
  );
  const [lat, setLat] = useState(
    ambulance.baseLocationLat?.toString() || "23.8103",
  );
  const [lng, setLng] = useState(
    ambulance.baseLocationLng?.toString() || "90.4125",
  );
  const [hospitalId, setHospitalId] = useState(ambulance.hospitalId || "NONE");
  const [mfgYear, setMfgYear] = useState(
    ambulance.manufacturedYear ? ambulance.manufacturedYear.toString() : "",
  );
  const [lastServiceDate, setLastServiceDate] = useState(
    ambulance.lastServiceDate ? ambulance.lastServiceDate.split("T")[0] : "",
  );
  const [nextServiceDue, setNextServiceDue] = useState(
    ambulance.nextServiceDue ? ambulance.nextServiceDue.split("T")[0] : "",
  );

  const { data: hospitalsResponse, isLoading: isLoadingHospitals } =
    useGetHospitals({ limit: 100 });
  const hospitals = hospitalsResponse?.data || [];

  const updateAmbulanceMutation = useUpdateAmbulance();

  useEffect(() => {
    if (open) {
      setRegNum(ambulance.registrationNumber);
      setAmbulanceType(ambulance.type || AmbulanceType.ADVANCED_LIFE_SUPPORT);
      setCapabilities(ambulance.capabilities?.join(", ") || "");
      setLat(ambulance.baseLocationLat?.toString() || "23.8103");
      setLng(ambulance.baseLocationLng?.toString() || "90.4125");
      setHospitalId(ambulance.hospitalId || "NONE");
      setMfgYear(
        ambulance.manufacturedYear ? ambulance.manufacturedYear.toString() : "",
      );
      setLastServiceDate(
        ambulance.lastServiceDate
          ? ambulance.lastServiceDate.split("T")[0]
          : "",
      );
      setNextServiceDue(
        ambulance.nextServiceDue ? ambulance.nextServiceDue.split("T")[0] : "",
      );
    }
  }, [ambulance, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const capabilitiesArray = capabilities
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    if (capabilitiesArray.length === 0) {
      toast.error("Please provide at least one medical capability.");
      return;
    }

    const parsedLat = Number.parseFloat(lat);
    const parsedLng = Number.parseFloat(lng);

    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
      toast.error("Please enter valid GPS coordinates.");
      return;
    }

    updateAmbulanceMutation.mutate(
      {
        id: ambulance.id,
        payload: {
          registrationNumber: regNum.trim(),
          type: ambulanceType,
          capabilities: capabilitiesArray,
          baseLocationLat: parsedLat,
          baseLocationLng: parsedLng,
          hospitalId: hospitalId === "NONE" ? null : hospitalId,
          manufacturedYear: mfgYear ? Number.parseInt(mfgYear, 10) : undefined,
          lastServiceDate: lastServiceDate || undefined,
          nextServiceDue: nextServiceDue || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Ambulance Updated", {
            description: `Ambulance ${regNum} specifications updated.`,
          });
          setOpen(false);
        },
        onError: (err) => {
          toast.error("Update Failed", {
            description:
              (err as { data?: { message?: string } })?.data?.message ||
              err.message ||
              "Failed to update ambulance specifications.",
          });
        },
      },
    );
  };

  return (
    <>
      {trigger ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-transparent border-0 p-0 text-left cursor-pointer inline-flex"
        >
          {trigger}
        </button>
      ) : !isControlled ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="h-7 px-2 text-xs gap-1 cursor-pointer"
        >
          <Edit3 className="h-3.5 w-3.5" />
          Edit
        </Button>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Ambulance className="h-4 w-4 text-primary" />
              Edit Ambulance Unit — {ambulance.registrationNumber}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Modify telemetry specifications, onboard medical capabilities,
              base station coordinates, and maintenance schedules.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Registration Number & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-reg-num">
                  License Plate / Unit Code *
                </Label>
                <Input
                  id="edit-reg-num"
                  value={regNum}
                  onChange={(e) => setRegNum(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-ambulance-type">Ambulance Type *</Label>
                <Select
                  value={ambulanceType}
                  onValueChange={(val) =>
                    val && setAmbulanceType(val as AmbulanceType)
                  }
                >
                  <SelectTrigger
                    id="edit-ambulance-type"
                    aria-label="Select vehicle type"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AmbulanceType.ADVANCED_LIFE_SUPPORT}>
                      ALS — Advanced Life Support
                    </SelectItem>
                    <SelectItem value={AmbulanceType.BASIC_LIFE_SUPPORT}>
                      BLS — Basic Life Support
                    </SelectItem>
                    <SelectItem value={AmbulanceType.PATIENT_TRANSPORT}>
                      Patient Transport Vehicle
                    </SelectItem>
                    <SelectItem value={AmbulanceType.NEONATAL}>
                      Neonatal Intensive Care Unit (NICU)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Capabilities */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-capabilities">
                Medical Equipment Capabilities *
              </Label>
              <Input
                id="edit-capabilities"
                placeholder="e.g. VENTILATOR, ECG_MONITOR, DEFIBRILLATOR"
                value={capabilities}
                onChange={(e) => setCapabilities(e.target.value)}
                required
              />
              <p className="text-[11px] text-text-muted">
                Comma-separated list of onboard medical equipment.
              </p>
            </div>

            {/* Coordinates Lat / Lng */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-base-lat">Base Latitude *</Label>
                <Input
                  id="edit-base-lat"
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-base-lng">Base Longitude *</Label>
                <Input
                  id="edit-base-lng"
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Hospital & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-station-hosp">Assigned Hospital</Label>
                <Select
                  value={hospitalId}
                  onValueChange={(val) => val && setHospitalId(val)}
                >
                  <SelectTrigger
                    id="edit-station-hosp"
                    aria-label="Select base hospital"
                  >
                    <SelectValue placeholder="Select hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">
                      None (Stationed independently)
                    </SelectItem>
                    {isLoadingHospitals ? (
                      <SelectItem value="loading" disabled>
                        Loading hospitals...
                      </SelectItem>
                    ) : (
                      hospitals.map((hosp) => (
                        <SelectItem key={hosp.id} value={hosp.id}>
                          {hosp.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-mfg-year">Manufacture Year</Label>
                <Input
                  id="edit-mfg-year"
                  type="number"
                  value={mfgYear}
                  onChange={(e) => setMfgYear(e.target.value)}
                />
              </div>
            </div>

            {/* Maintenance Service Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-last-service">Last Service Date</Label>
                <Input
                  id="edit-last-service"
                  type="date"
                  value={lastServiceDate}
                  onChange={(e) => setLastServiceDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-next-service">Next Service Due</Label>
                <Input
                  id="edit-next-service"
                  type="date"
                  value={nextServiceDue}
                  onChange={(e) => setNextServiceDue(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={updateAmbulanceMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateAmbulanceMutation.isPending}
                className="gap-2 cursor-pointer"
              >
                {updateAmbulanceMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Save Specifications
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
