"use client";

import { Edit3, Loader2, UserCheck } from "lucide-react";
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
import { useGetAmbulances, useUpdateDriver } from "@/hooks";
import type { DriverWithUser } from "@/lib/types/driver.types";
import { CertificationLevel } from "@/lib/types/enums";

interface EditDriverDialogProps {
  driver: DriverWithUser;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function EditDriverDialog({
  driver,
  open: externalOpen,
  onOpenChange: setExternalOpen,
  trigger,
}: EditDriverDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen =
    isControlled && setExternalOpen ? setExternalOpen : setInternalOpen;

  const [licenseNumber, setLicenseNumber] = useState(driver.licenseNumber);
  const [licenseExpiry, setLicenseExpiry] = useState(
    driver.licenseExpiry ? driver.licenseExpiry.split("T")[0] : "",
  );
  const [certLevel, setCertLevel] = useState<CertificationLevel>(
    driver.certificationLevel || CertificationLevel.PARAMEDIC,
  );
  const [assignedAmbulanceId, setAssignedAmbulanceId] = useState<string>(
    driver.assignedAmbulanceId || "NONE",
  );

  const updateDriverMutation = useUpdateDriver();
  const { data: ambulancesResponse, isLoading: isLoadingAmbulances } =
    useGetAmbulances({ limit: 100 });
  const ambulances = ambulancesResponse?.data || [];

  useEffect(() => {
    if (open) {
      setLicenseNumber(driver.licenseNumber);
      setLicenseExpiry(
        driver.licenseExpiry ? driver.licenseExpiry.split("T")[0] : "",
      );
      setCertLevel(driver.certificationLevel || CertificationLevel.PARAMEDIC);
      setAssignedAmbulanceId(driver.assignedAmbulanceId || "NONE");
    }
  }, [driver, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!licenseNumber.trim()) {
      toast.error("License number is required.");
      return;
    }

    if (!licenseExpiry) {
      toast.error("License expiry date is required.");
      return;
    }

    updateDriverMutation.mutate(
      {
        id: driver.id,
        payload: {
          licenseNumber: licenseNumber.trim(),
          licenseExpiry,
          certificationLevel: certLevel,
          assignedAmbulanceId:
            assignedAmbulanceId === "NONE" ? null : assignedAmbulanceId,
        },
      },
      {
        onSuccess: () => {
          toast.success("Driver Profile Updated", {
            description: `Credentials updated for ${driver.user?.name || "driver"}.`,
          });
          setOpen(false);
        },
        onError: (err) => {
          toast.error("Update Failed", {
            description:
              (err as { data?: { message?: string } })?.data?.message ||
              err.message ||
              "Failed to update driver details.",
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <UserCheck className="h-4 w-4 text-primary" />
              Edit Paramedic Driver — {driver.user?.name || "Driver"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Update commercial driving license number, expiration, clinical
              certification level, and assigned fleet vehicle.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Read-only User Summary */}
            <div className="bg-surface p-3 border border-border text-xs rounded-none space-y-1">
              <div className="flex justify-between">
                <span className="text-text-muted">Paramedic Name:</span>
                <span className="font-semibold text-text-primary">
                  {driver.user?.name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Account Email:</span>
                <span className="font-mono text-text-secondary">
                  {driver.user?.email || "N/A"}
                </span>
              </div>
              {driver.user?.phone && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Contact Phone:</span>
                  <span className="font-mono text-text-secondary">
                    {driver.user.phone}
                  </span>
                </div>
              )}
            </div>

            {/* Certification Level */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-cert-level">
                Clinical Certification Level *
              </Label>
              <Select
                value={certLevel}
                onValueChange={(val) =>
                  val && setCertLevel(val as CertificationLevel)
                }
              >
                <SelectTrigger
                  id="edit-cert-level"
                  aria-label="Select certification level"
                >
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CertificationLevel.PARAMEDIC}>
                    Paramedic (ALS Specialist)
                  </SelectItem>
                  <SelectItem value={CertificationLevel.EMT_ADVANCED}>
                    EMT-Advanced (AEMT)
                  </SelectItem>
                  <SelectItem value={CertificationLevel.EMT_BASIC}>
                    EMT-Basic (BLS Specialist)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

          {/* License Number & Expiry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-driver-license-num">License Number *</Label>
              <Input
                id="edit-driver-license-num"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-license-expiry">Expiry Date *</Label>
              <Input
                id="edit-license-expiry"
                type="date"
                value={licenseExpiry}
                onChange={(e) => setLicenseExpiry(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Assigned Ambulance Select */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-assigned-ambulance">
              Assigned Ambulance Unit
            </Label>
            <Select
              value={assignedAmbulanceId}
              onValueChange={(val) => val && setAssignedAmbulanceId(val)}
            >
              <SelectTrigger
                id="edit-assigned-ambulance"
                aria-label="Select assigned ambulance"
              >
                <SelectValue placeholder="Select unit or unassign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">
                  None (Standby / Unassigned)
                </SelectItem>
                {isLoadingAmbulances ? (
                  <SelectItem value="loading" disabled>
                    Loading fleet units...
                  </SelectItem>
                ) : (
                  ambulances.map((amb) => (
                    <SelectItem key={amb.id} value={amb.id}>
                      {amb.registrationNumber} ({amb.type.replace(/_/g, " ")})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={updateDriverMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateDriverMutation.isPending}
              className="gap-2 cursor-pointer"
            >
              {updateDriverMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
