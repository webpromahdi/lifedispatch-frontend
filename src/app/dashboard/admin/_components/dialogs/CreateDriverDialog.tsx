"use client";

import { Plus, UserCheck } from "lucide-react";
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
import { seedAmbulances } from "@/lib/dummy/ambulances";
import { seedUsers } from "@/lib/dummy/users";
import { CertificationLevel } from "@/lib/types/enums";

export function CreateDriverDialog() {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState(
    seedUsers.find((u) => u.role === "DRIVER")?.id || "usr_003",
  );
  const [certLevel, setCertLevel] = useState<string>(
    CertificationLevel.PARAMEDIC,
  );
  const [licenseExpiry, setLicenseExpiry] = useState("2028-12-31");
  const [assignedAmbulanceId, setAssignedAmbulanceId] = useState(
    seedAmbulances[0]?.id || "amb_001",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = seedUsers.find((u) => u.id === userId);
    toast.success("Driver Profile Created", {
      description: `Paramedic credential registered for ${user?.name || "Driver"}.`,
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
        Add Driver
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary-light text-primary">
                <UserCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <DialogTitle>Register Paramedic Driver</DialogTitle>
            </div>
            <DialogDescription>
              Attach certified EMS driver credentials and emergency vehicle
              assignment to a user account.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* User Account Select */}
            <div className="space-y-1.5">
              <Label htmlFor="driver-user">Assign to User Account *</Label>
              <Select
                value={userId}
                onValueChange={(val) => val && setUserId(val)}
              >
                <SelectTrigger
                  id="driver-user"
                  aria-label="Select user account"
                >
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {seedUsers
                    .filter((u) => u.role === "DRIVER" || u.role === "PATIENT")
                    .map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Certification Level */}
            <div className="space-y-1.5">
              <Label htmlFor="driver-cert">Certification Level *</Label>
              <Select
                value={certLevel}
                onValueChange={(val) => val && setCertLevel(val)}
              >
                <SelectTrigger
                  id="driver-cert"
                  aria-label="Select certification level"
                >
                  <SelectValue placeholder="Select certification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CertificationLevel.EMT_BASIC}>
                    EMT-Basic (Emergency Medical Technician)
                  </SelectItem>
                  <SelectItem value={CertificationLevel.EMT_ADVANCED}>
                    A-EMT (Advanced EMT)
                  </SelectItem>
                  <SelectItem value={CertificationLevel.PARAMEDIC}>
                    Paramedic (ALS Field Lead)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* License Expiry Date */}
            <div className="space-y-1.5">
              <Label htmlFor="license-expiry">
                Commercial Driver License Expiry *
              </Label>
              <Input
                id="license-expiry"
                type="date"
                value={licenseExpiry}
                onChange={(e) => setLicenseExpiry(e.target.value)}
                required
              />
            </div>

            {/* Assigned Ambulance */}
            <div className="space-y-1.5">
              <Label htmlFor="assigned-ambulance">
                Assigned Ambulance Unit (Optional)
              </Label>
              <Select
                value={assignedAmbulanceId}
                onValueChange={(val) => val && setAssignedAmbulanceId(val)}
              >
                <SelectTrigger
                  id="assigned-ambulance"
                  aria-label="Select assigned ambulance"
                >
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {seedAmbulances.map((amb) => (
                    <SelectItem key={amb.id} value={amb.id}>
                      {amb.registrationNumber} ({amb.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                Authorize Driver
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
