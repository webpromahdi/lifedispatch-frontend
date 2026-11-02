"use client";

import { Building2, Loader2, Plus } from "lucide-react";
import { useState } from "react";
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
import { useCreateHospital } from "@/hooks";

export function CreateHospitalDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("23.7744");
  const [lng, setLng] = useState("90.4072");
  const [totalBeds, setTotalBeds] = useState("40");
  const [availBeds, setAvailBeds] = useState("12");
  const [phone, setPhone] = useState("+880 2-8836444");
  const [emergencyContact, setEmergencyContact] = useState("+880 1711-000000");
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffDesignation, setStaffDesignation] = useState("ER Coordinator");

  const { mutate: createHospital, isPending } = useCreateHospital();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createHospital(
      {
        name,
        address,
        lat: Number.parseFloat(lat) || 23.7744,
        lng: Number.parseFloat(lng) || 90.4072,
        phone,
        emergencyContact: emergencyContact || phone,
        capabilities: ["TRAUMA", "CARDIAC", "GENERAL_EMERGENCY"],
        totalErBeds: Number.parseInt(totalBeds, 10) || 1,
        availableErBeds: Number.parseInt(availBeds, 10) || 0,
        staffName: staffName || `${name} Staff`,
        staffEmail,
        staffDesignation: staffDesignation || "ER Coordinator",
      },
      {
        onSuccess: (res) => {
          toast.success("Hospital Partner Enrolled", {
            description: `${res?.data?.name || name} connected to LifeDispatch emergency diversion network.`,
          });
          setOpen(false);
          setName("");
          setAddress("");
          setStaffName("");
          setStaffEmail("");
        },
        onError: (err) => {
          toast.error("Failed to enroll hospital", {
            description:
              err instanceof Error
                ? err.message
                : "Unable to register hospital.",
          });
        },
      },
    );
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-primary text-white hover:bg-primary-hover font-semibold gap-1.5 shadow-xs cursor-pointer"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add Hospital
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary-light text-primary">
                <Building2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <DialogTitle>Enroll Partner Hospital</DialogTitle>
            </div>
            <DialogDescription>
              Register emergency medical center for intelligent telemetry-based
              patient diversion.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Hospital Name */}
            <div className="space-y-1.5">
              <Label htmlFor="hosp-name">Hospital Name *</Label>
              <Input
                id="hosp-name"
                placeholder="e.g. Apollo Imperial Medical Center"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Physical Address */}
            <div className="space-y-1.5">
              <Label htmlFor="hosp-address">Physical Address *</Label>
              <Input
                id="hosp-address"
                placeholder="e.g. Plot 81, Block E, Bashundhara R/A, Dhaka"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="hosp-lat">Latitude *</Label>
                <Input
                  id="hosp-lat"
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hosp-lng">Longitude *</Label>
                <Input
                  id="hosp-lng"
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Bed Counts */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="total-beds">Total ER Beds *</Label>
                <Input
                  id="total-beds"
                  type="number"
                  min="1"
                  value={totalBeds}
                  onChange={(e) => setTotalBeds(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="avail-beds">Available ER Beds *</Label>
                <Input
                  id="avail-beds"
                  type="number"
                  min="0"
                  value={availBeds}
                  onChange={(e) => setAvailBeds(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="hosp-phone">Emergency Phone *</Label>
                <Input
                  id="hosp-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hosp-emergency">Emergency Contact</Label>
                <Input
                  id="hosp-emergency"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                />
              </div>
            </div>

            {/* Primary Staff Contact */}
            <div className="border-t border-border pt-3 space-y-3">
              <div className="text-xs font-semibold text-text-primary">
                Hospital ER Liaison / Staff Account *
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="staff-name">Staff Name *</Label>
                  <Input
                    id="staff-name"
                    placeholder="Dr. Rahman / Staff in Charge"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="staff-email">Staff Email *</Label>
                  <Input
                    id="staff-email"
                    type="email"
                    placeholder="staff@hospital.org.bd"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="staff-designation">Designation</Label>
                <Input
                  id="staff-designation"
                  placeholder="e.g. Chief Medical Officer / ER Coordinator"
                  value={staffDesignation}
                  onChange={(e) => setStaffDesignation(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary text-white hover:bg-primary-hover font-semibold"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Enroll Hospital
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
