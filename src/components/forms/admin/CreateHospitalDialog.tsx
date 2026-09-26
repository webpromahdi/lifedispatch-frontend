"use client";

import { Building2, Plus } from "lucide-react";
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

export function CreateHospitalDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("23.7744");
  const [lng, setLng] = useState("90.4072");
  const [totalBeds, setTotalBeds] = useState("40");
  const [availBeds, setAvailBeds] = useState("12");
  const [phone, setPhone] = useState("+880 2-8836444");
  const [email, setEmail] = useState("er@hospital.org.bd");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Hospital Partner Enrolled", {
      description: `${name || "Hospital Partner"} connected to LifeDispatch emergency diversion network.`,
    });
    setOpen(false);
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
                <Label htmlFor="hosp-phone">Emergency Phone</Label>
                <Input
                  id="hosp-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hosp-email">ER Liaison Email</Label>
                <Input
                  id="hosp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary-hover font-semibold"
              >
                Enroll Hospital
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
