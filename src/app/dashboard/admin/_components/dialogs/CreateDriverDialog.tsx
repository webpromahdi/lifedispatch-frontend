"use client";

import { Loader2, Plus, UserCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FileUpload } from "@/components/common/FileUpload";
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
import { useCreateDriver, useGetAmbulances } from "@/hooks";
import { AmbulanceStatus, CertificationLevel } from "@/lib/types/enums";

export function CreateDriverDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("2028-12-31");
  const [certLevel, setCertLevel] = useState<CertificationLevel>(
    CertificationLevel.PARAMEDIC,
  );
  const [assignedAmbulanceId, setAssignedAmbulanceId] =
    useState<string>("NONE");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  const createDriverMutation = useCreateDriver();
  const { data: ambulancesResponse, isLoading: isLoadingAmbulances } =
    useGetAmbulances({ status: AmbulanceStatus.AVAILABLE });

  const availableAmbulances = ambulancesResponse?.data || [];

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setLicenseNumber("");
    setLicenseExpiry("2028-12-31");
    setCertLevel(CertificationLevel.PARAMEDIC);
    setAssignedAmbulanceId("NONE");
    setLicenseFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!licenseFile) {
      toast.error("License Document Required", {
        description:
          "Please upload a copy of the commercial driving license (PDF or image).",
      });
      return;
    }

    createDriverMutation.mutate(
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        licenseNumber: licenseNumber.trim(),
        licenseExpiry,
        certificationLevel: certLevel,
        assignedAmbulanceId:
          assignedAmbulanceId === "NONE" ? undefined : assignedAmbulanceId,
        licenseDocument: licenseFile,
      },
      {
        onSuccess: (res) => {
          toast.success("Driver Profile Created", {
            description: `Paramedic profile registered for ${res.data?.user?.name || name}.`,
          });
          resetForm();
          setOpen(false);
        },
        onError: (err) => {
          toast.error("Registration Failed", {
            description:
              (err as { data?: { message?: string } })?.data?.message ||
              err.message ||
              "Failed to register paramedic driver.",
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
        Add Driver
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary-light text-primary">
                <UserCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <DialogTitle>Register Paramedic Driver</DialogTitle>
            </div>
            <DialogDescription>
              Create a new EMS driver profile, attach professional paramedic
              certification, and optionally assign to an active ambulance.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Driver Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="driver-name">Full Name *</Label>
              <Input
                id="driver-name"
                placeholder="e.g. Tariqul Islam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="driver-email">Email Address *</Label>
                <Input
                  id="driver-email"
                  type="email"
                  placeholder="driver@lifedispatch.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="driver-phone">Phone Number</Label>
                <Input
                  id="driver-phone"
                  placeholder="+8801700000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Certification Level */}
            <div className="space-y-1.5">
              <Label htmlFor="driver-cert">Certification Level *</Label>
              <Select
                value={certLevel}
                onValueChange={(val) =>
                  val && setCertLevel(val as CertificationLevel)
                }
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

            {/* Commercial License Number & Expiry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="driver-license-num">License Number *</Label>
                <Input
                  id="driver-license-num"
                  placeholder="e.g. DL-DH-99201"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="license-expiry">License Expiry Date *</Label>
                <Input
                  id="license-expiry"
                  type="date"
                  value={licenseExpiry}
                  onChange={(e) => setLicenseExpiry(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Assigned Ambulance Select */}
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
                  <SelectValue placeholder="Select unit or leave unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">
                    None (Standby / Unassigned)
                  </SelectItem>
                  {isLoadingAmbulances ? (
                    <SelectItem value="loading" disabled>
                      Loading available units...
                    </SelectItem>
                  ) : (
                    availableAmbulances.map((amb) => (
                      <SelectItem key={amb.id} value={amb.id}>
                        {amb.registrationNumber} ({amb.type.replace(/_/g, " ")})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* License Document File Upload (Required) */}
            <FileUpload
              id="driver-license-doc"
              label="Commercial Driver License Document"
              description="Official document proof required for backend verification (PDF, PNG, JPG up to 5MB)."
              value={licenseFile}
              onChange={setLicenseFile}
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              maxSizeMB={5}
              required
            />

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createDriverMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createDriverMutation.isPending}
                className="bg-primary text-white hover:bg-primary-hover font-semibold"
              >
                {createDriverMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                    Registering...
                  </>
                ) : (
                  "Authorize Driver"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
