"use client";

import { Building2, Edit3, Loader2 } from "lucide-react";
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
import { useUpdateHospital } from "@/hooks";
import type { Hospital } from "@/lib/types/hospital.types";

interface EditHospitalDialogProps {
  hospital: Hospital;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const AVAILABLE_CAPABILITIES = [
  "TRAUMA",
  "CARDIAC",
  "ICU",
  "BURN",
  "STROKE",
  "PEDIATRIC",
  "GENERAL_EMERGENCY",
];

export function EditHospitalDialog({
  hospital,
  open: externalOpen,
  onOpenChange: setExternalOpen,
  trigger,
}: EditHospitalDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen =
    isControlled && setExternalOpen ? setExternalOpen : setInternalOpen;

  const [name, setName] = useState(hospital.name);
  const [address, setAddress] = useState(hospital.address);
  const [lat, setLat] = useState(
    hospital.lat?.toString() || hospital.locationLat?.toString() || "23.7744",
  );
  const [lng, setLng] = useState(
    hospital.lng?.toString() || hospital.locationLng?.toString() || "90.4072",
  );
  const [totalBeds, setTotalBeds] = useState(
    hospital.totalErBeds?.toString() || "40",
  );
  const [availBeds, setAvailBeds] = useState(
    hospital.availableErBeds?.toString() || "10",
  );
  const [phone, setPhone] = useState(hospital.phone || "");
  const [emergencyContact, setEmergencyContact] = useState(
    hospital.emergencyContact || hospital.phone || "",
  );
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>(
    hospital.capabilities && hospital.capabilities.length > 0
      ? hospital.capabilities
      : ["TRAUMA", "GENERAL_EMERGENCY"],
  );

  // Sync state whenever hospital prop changes or dialog opens
  useEffect(() => {
    if (open) {
      setName(hospital.name);
      setAddress(hospital.address);
      setLat(
        hospital.lat?.toString() ||
          hospital.locationLat?.toString() ||
          "23.7744",
      );
      setLng(
        hospital.lng?.toString() ||
          hospital.locationLng?.toString() ||
          "90.4072",
      );
      setTotalBeds(hospital.totalErBeds?.toString() || "40");
      setAvailBeds(hospital.availableErBeds?.toString() || "10");
      setPhone(hospital.phone || "");
      setEmergencyContact(hospital.emergencyContact || hospital.phone || "");
      setSelectedCapabilities(
        hospital.capabilities && hospital.capabilities.length > 0
          ? hospital.capabilities
          : ["TRAUMA", "GENERAL_EMERGENCY"],
      );
    }
  }, [hospital, open]);

  const { mutate: updateHospital, isPending } = useUpdateHospital();

  const toggleCapability = (cap: string) => {
    setSelectedCapabilities((prev) =>
      prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Hospital name is required");
      return;
    }

    if (!address.trim()) {
      toast.error("Hospital address is required");
      return;
    }

    if (!phone.trim()) {
      toast.error("Contact phone is required");
      return;
    }

    const parsedLat = Number.parseFloat(lat);
    const parsedLng = Number.parseFloat(lng);
    const parsedTotalBeds = Number.parseInt(totalBeds, 10);
    const parsedAvailBeds = Number.parseInt(availBeds, 10);

    updateHospital(
      {
        id: hospital.id,
        payload: {
          name: name.trim(),
          address: address.trim(),
          phone: phone.trim(),
          emergencyContact: (emergencyContact || phone).trim(),
          capabilities:
            selectedCapabilities.length > 0
              ? selectedCapabilities
              : ["GENERAL_EMERGENCY"],
          totalErBeds: Number.isNaN(parsedTotalBeds) ? 1 : parsedTotalBeds,
          availableErBeds: Number.isNaN(parsedAvailBeds) ? 0 : parsedAvailBeds,
          lat: Number.isNaN(parsedLat) ? 23.7744 : parsedLat,
          lng: Number.isNaN(parsedLng) ? 90.4072 : parsedLng,
        },
      },
      {
        onSuccess: (res) => {
          toast.success("Hospital Details Updated", {
            description: `${res?.data?.name || name} operational parameters have been updated.`,
          });
          setOpen(false);
        },
        onError: (err) => {
          toast.error("Failed to update hospital", {
            description:
              err instanceof Error
                ? err.message
                : "Unable to save hospital changes.",
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
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setOpen(true)}
          className="h-8 px-2.5 text-xs font-medium gap-1.5 cursor-pointer hover:bg-slate-100 border-border"
        >
          <Edit3 className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
          Edit
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-none border-2 border-primary">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-none bg-primary-light text-primary">
                <Building2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <DialogTitle>Edit Hospital Details</DialogTitle>
                <DialogDescription>
                  Modify facility capacity, emergency contact, and CAD routing
                  coordinates.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {/* Hospital Name */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-hosp-name" className="text-xs font-semibold">
                Hospital Facility Name *
              </Label>
              <Input
                id="edit-hosp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dhaka Medical College Hospital"
                className="h-9 text-xs rounded-none"
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-hosp-address"
                className="text-xs font-semibold"
              >
                Physical Address *
              </Label>
              <Input
                id="edit-hosp-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Secretariate Road, Ramna, Dhaka"
                className="h-9 text-xs rounded-none"
                required
              />
            </div>

            {/* Geo Coordinates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-hosp-lat"
                  className="text-xs font-semibold"
                >
                  Latitude
                </Label>
                <Input
                  id="edit-hosp-lat"
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="h-9 text-xs font-mono rounded-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-hosp-lng"
                  className="text-xs font-semibold"
                >
                  Longitude
                </Label>
                <Input
                  id="edit-hosp-lng"
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="h-9 text-xs font-mono rounded-none"
                />
              </div>
            </div>

            {/* Bed Capacities */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-total-beds"
                  className="text-xs font-semibold"
                >
                  Total ER Beds
                </Label>
                <Input
                  id="edit-total-beds"
                  type="number"
                  min="0"
                  value={totalBeds}
                  onChange={(e) => setTotalBeds(e.target.value)}
                  className="h-9 text-xs font-mono rounded-none"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-avail-beds"
                  className="text-xs font-semibold"
                >
                  Available ER Beds
                </Label>
                <Input
                  id="edit-avail-beds"
                  type="number"
                  min="0"
                  value={availBeds}
                  onChange={(e) => setAvailBeds(e.target.value)}
                  className="h-9 text-xs font-mono rounded-none"
                  required
                />
              </div>
            </div>

            {/* Phone & Emergency Contact */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-hosp-phone"
                  className="text-xs font-semibold"
                >
                  General Phone *
                </Label>
                <Input
                  id="edit-hosp-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 2-8836444"
                  className="h-9 text-xs font-mono rounded-none"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-emergency-contact"
                  className="text-xs font-semibold"
                >
                  ER Emergency Line
                </Label>
                <Input
                  id="edit-emergency-contact"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="+880 1711-000000"
                  className="h-9 text-xs font-mono rounded-none"
                />
              </div>
            </div>

            {/* Specialized Capabilities */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold block">
                Specialized Capabilities
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_CAPABILITIES.map((cap) => {
                  const isSelected = selectedCapabilities.includes(cap);
                  return (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => toggleCapability(cap)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-none border transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-primary text-white border-primary"
                          : "bg-surface text-text-secondary border-border hover:bg-slate-100"
                      }`}
                    >
                      {cap.replace("_", " ")}
                    </button>
                  );
                })}
              </div>
            </div>

            <DialogFooter className="pt-2 flex items-center justify-end gap-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => setOpen(false)}
                className="h-9 text-xs rounded-none border-border"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="h-9 text-xs bg-primary hover:bg-primary-hover text-white rounded-none cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2
                      className="h-3.5 w-3.5 animate-spin mr-1.5"
                      aria-hidden="true"
                    />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
