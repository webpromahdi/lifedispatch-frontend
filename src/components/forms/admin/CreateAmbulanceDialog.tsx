"use client";

import { Ambulance, Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AmbulanceType } from "@/lib/types/enums";

export function CreateAmbulanceDialog() {
  const [open, setOpen] = useState(false);
  const [regNum, setRegNum] = useState("");
  const [ambulanceType, setAmbulanceType] = useState<string>(
    AmbulanceType.ADVANCED_LIFE_SUPPORT,
  );
  const [capabilities, setCapabilities] = useState("VENTILATOR, DEFIBRILLATOR");
  const [lat, setLat] = useState("23.8103");
  const [lng, setLng] = useState("90.4125");
  const [hospitalId, setHospitalId] = useState("hosp_001");
  const [mfgYear, setMfgYear] = useState("2024");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Ambulance Provisioned", {
      description: `Ambulance unit ${regNum || "DHAKA-METRO-EM-99"} added to active fleet.`,
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
        Add Ambulance
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary-light text-primary">
                <Ambulance className="h-5 w-5" aria-hidden="true" />
              </div>
              <DialogTitle>Register New Ambulance</DialogTitle>
            </div>
            <DialogDescription>
              Provision a new emergency vehicle with equipment capabilities and
              GPS station coordinates.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Registration Number */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-num">Registration Number *</Label>
              <Input
                id="reg-num"
                placeholder="e.g. DHAKA-METRO-CHA-77-9901"
                value={regNum}
                onChange={(e) => setRegNum(e.target.value)}
                required
              />
            </div>

            {/* Vehicle Type */}
            <div className="space-y-1.5">
              <Label htmlFor="ambulance-type">
                Vehicle Type & Capability *
              </Label>
              <Select
                value={ambulanceType}
                onValueChange={(val) => val && setAmbulanceType(val)}
              >
                <SelectTrigger
                  id="ambulance-type"
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

            {/* Capabilities Multi-Select / comma-separated */}
            <div className="space-y-1.5">
              <Label htmlFor="capabilities">
                Medical Equipment Capabilities
              </Label>
              <Input
                id="capabilities"
                placeholder="e.g. VENTILATOR, ECG_MONITOR, DEFIBRILLATOR"
                value={capabilities}
                onChange={(e) => setCapabilities(e.target.value)}
              />
              <p className="text-[11px] text-text-muted">
                Comma-separated list of onboard medical hardware.
              </p>
            </div>

            {/* Coordinates Lat / Lng */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="base-lat">Base Latitude *</Label>
                <Input
                  id="base-lat"
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="base-lng">Base Longitude *</Label>
                <Input
                  id="base-lng"
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Hospital & Year */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="station-hosp">Base Hospital ID</Label>
                <Input
                  id="station-hosp"
                  value={hospitalId}
                  onChange={(e) => setHospitalId(e.target.value)}
                  placeholder="e.g. hosp_001"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mfg-year">Manufacture Year</Label>
                <Input
                  id="mfg-year"
                  type="number"
                  value={mfgYear}
                  onChange={(e) => setMfgYear(e.target.value)}
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
                Register Unit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
