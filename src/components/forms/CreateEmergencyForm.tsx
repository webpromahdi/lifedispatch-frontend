"use client";

import {
  AlertTriangle,
  LocateFixed,
  MapPin,
  Phone,
  Send,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmergencyType, RequiredCapability } from "@/lib/types/enums";

export interface CreateEmergencyFormProps {
  onSuccess?: (incidentNumber: string) => void;
  onCancel?: () => void;
}

export function CreateEmergencyForm({
  onSuccess,
  onCancel,
}: CreateEmergencyFormProps) {
  const [emergencyType, setEmergencyType] = useState<string>(
    EmergencyType.CARDIAC,
  );
  const [capability, setCapability] = useState<string>(RequiredCapability.ALS);
  const [description, setDescription] = useState(
    "Severe acute chest pain, shortness of breath, radiating down left arm.",
  );
  const [locationAddress, setLocationAddress] = useState(
    "House 14, Road 7, Sector 3, Uttara, Dhaka",
  );
  const [callerName, setCallerName] = useState("Nafisa Anjum");
  const [callerPhone, setCallerPhone] = useState("+880 1711-555555");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedIncident = `INC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Emergency Response Dispatched!", {
        description: `Incident ${generatedIncident} logged. Nearest ALS unit alert sent.`,
      });
      if (onSuccess) onSuccess(generatedIncident);
    }, 600);
  };

  const handleDetectLocation = () => {
    toast.info("GPS Coordinates Resolved", {
      description: "23.8759° N, 90.3795° E (Sector 3, Uttara)",
    });
    setLocationAddress("House 14, Road 7, Sector 3, Uttara, Dhaka");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 rounded-lg bg-destructive-bg border border-destructive/20 text-destructive text-xs flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          If you or the patient are in immediate cardiac or respiratory arrest,
          stay on the line or call 999 directly.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Emergency Type */}
        <div className="space-y-1.5">
          <Label htmlFor="emergency-type" className="text-xs font-medium">
            Emergency Condition Type *
          </Label>
          <Select
            value={emergencyType}
            onValueChange={(val) => val && setEmergencyType(val)}
          >
            <SelectTrigger id="emergency-type" className="text-base md:text-xs h-10 md:h-9">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CARDIAC">
                Cardiac / Chest Pain / Heart
              </SelectItem>
              <SelectItem value="TRAUMA">
                Severe Trauma / Accident / Bleeding
              </SelectItem>
              <SelectItem value="RESPIRATORY">
                Respiratory / Severe Asthma
              </SelectItem>
              <SelectItem value="NEUROLOGICAL">
                Neurological / Stroke / Seizure
              </SelectItem>
              <SelectItem value="OBSTETRIC">
                Obstetric / Labor Complication
              </SelectItem>
              <SelectItem value="PEDIATRIC">
                Pediatric Emergency
              </SelectItem>
              <SelectItem value="OTHER">Other Clinical Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Required Ambulance Capability */}
        <div className="space-y-1.5">
          <Label htmlFor="required-capability" className="text-xs font-medium">
            Required Fleet Support *
          </Label>
          <Select
            value={capability}
            onValueChange={(val) => val && setCapability(val)}
          >
            <SelectTrigger id="required-capability" className="text-base md:text-xs h-10 md:h-9">
              <SelectValue placeholder="Select capability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALS">
                ALS — Advanced Life Support (Paramedic + Defibrillator)
              </SelectItem>
              <SelectItem value="BLS">
                BLS — Basic Life Support (EMT + Oxygen)
              </SelectItem>
              <SelectItem value="NEONATAL">
                Neonatal Critical Care Transport
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description / Symptoms */}
      <div className="space-y-1.5">
        <Label htmlFor="symptoms-desc" className="text-xs font-medium">
          Symptoms &amp; Scene Description *
        </Label>
        <textarea
          id="symptoms-desc"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe symptoms, patient consciousness, and hazards..."
          className="w-full text-base md:text-xs rounded-md border border-input bg-background p-2.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary leading-relaxed"
          required
        />
      </div>

      {/* Location Address with GPS detect */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="pickup-address" className="text-xs font-medium">
            Pickup Location Address *
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDetectLocation}
            className="h-6 text-[11px] text-primary hover:text-primary-dark gap-1 p-0 cursor-pointer"
          >
            <LocateFixed className="h-3 w-3" aria-hidden="true" />
            Use Current GPS Location
          </Button>
        </div>
        <div className="relative">
          <MapPin
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <Input
            id="pickup-address"
            value={locationAddress}
            onChange={(e) => setLocationAddress(e.target.value)}
            placeholder="Enter street address, building number, landmark..."
            className="pl-9 text-base md:text-xs h-10 md:h-9"
            required
          />
        </div>
      </div>

      {/* Caller Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="caller-name" className="text-xs font-medium">
            Contact / Caller Name *
          </Label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
              aria-hidden="true"
            />
            <Input
              id="caller-name"
              value={callerName}
              onChange={(e) => setCallerName(e.target.value)}
              className="pl-9 text-base md:text-xs h-10 md:h-9"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="caller-phone" className="text-xs font-medium">
            Contact Phone Number *
          </Label>
          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
              aria-hidden="true"
            />
            <Input
              id="caller-phone"
              type="tel"
              value={callerPhone}
              onChange={(e) => setCallerPhone(e.target.value)}
              className="pl-9 text-base md:text-xs h-10 md:h-9"
              required
            />
          </div>
        </div>
      </div>

      {/* Modal Actions */}
      <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="text-xs min-h-[44px] cursor-pointer order-2 sm:order-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary-dark text-white text-xs min-h-[44px] px-5 font-semibold cursor-pointer gap-1.5 order-1 sm:order-2"
        >
          <Send className="h-3.5 w-3.5" aria-hidden="true" />
          {isSubmitting ? "Broadcasting..." : "Dispatch Emergency Request"}
        </Button>
      </div>
    </form>
  );
}
