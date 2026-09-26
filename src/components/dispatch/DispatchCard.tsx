"use client";

import { motion } from "framer-motion";
import {
  Check,
  MapPin,
  Phone,
  ShieldAlert,
  User as UserIcon,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import type { Ambulance } from "@/lib/types/ambulance.types";
import type { Dispatch } from "@/lib/types/dispatch.types";
import type { EmergencyRequest } from "@/lib/types/emergency.types";
import { cn } from "@/lib/utils";
import { CountdownTimer } from "./CountdownTimer";

export interface DispatchCardProps {
  dispatch: Dispatch;
  emergency: EmergencyRequest;
  ambulance?: Ambulance | null;
  onAccept?: (dispatchId: string) => void;
  onReject?: (dispatchId: string) => void;
  className?: string;
}

export function DispatchCard({
  dispatch,
  emergency,
  ambulance,
  onAccept,
  onReject,
  className,
}: DispatchCardProps) {
  const [localStatus, setLocalStatus] = useState(dispatch.status);

  const handleAccept = () => {
    setLocalStatus("ACCEPTED");
    toast.success("Dispatch assignment accepted! Trip is now active.", {
      description: `Incident ${emergency.incidentNumber} assigned.`,
    });
    if (onAccept) onAccept(dispatch.id);
  };

  const handleReject = () => {
    setLocalStatus("REJECTED");
    toast.error("Dispatch assignment rejected.", {
      description: "Ambulance returned to available fleet.",
    });
    if (onReject) onReject(dispatch.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-surface border border-border rounded-xl p-5 shadow-xs transition-shadow hover:shadow-md flex flex-col justify-between",
        className,
      )}
    >
      <div>
        {/* Header with Incident number and badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-sm text-text-primary">
              {emergency.incidentNumber}
            </span>
            <PriorityBadge priority={emergency.priority} />
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={localStatus} />
            {localStatus === "PENDING_ACCEPTANCE" && (
              <CountdownTimer timeoutAt={dispatch.timeoutAt} />
            )}
          </div>
        </div>

        {/* Emergency context and location */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-start gap-2 text-sm">
            <ShieldAlert
              className="h-4 w-4 text-primary shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <span className="font-medium text-text-primary capitalize">
                {emergency.emergencyType.toLowerCase()} Emergency
              </span>
              <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                {emergency.description}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-text-secondary">
            <MapPin
              className="h-4 w-4 text-text-muted shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span className="line-clamp-2">{emergency.locationAddress}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted pt-1">
            <span className="flex items-center gap-1">
              <UserIcon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{emergency.callerName}</span>
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{emergency.callerPhone}</span>
            </span>
          </div>
        </div>

        {/* Assigned Ambulance Info */}
        {ambulance && (
          <div className="mt-4 p-2.5 rounded-lg bg-background border border-border flex items-center justify-between text-xs">
            <span className="text-text-muted">Unit:</span>
            <span className="font-medium text-text-primary">
              {ambulance.registrationNumber}
            </span>
            <span className="text-text-secondary uppercase">
              ({ambulance.type.replace(/_/g, " ")})
            </span>
          </div>
        )}
      </div>

      {/* Action buttons (only enabled during PENDING_ACCEPTANCE) */}
      {localStatus === "PENDING_ACCEPTANCE" ? (
        <div className="mt-5 pt-3 border-t border-border flex flex-col sm:flex-row items-center gap-2.5">
          <Button
            onClick={handleAccept}
            className="w-full sm:flex-1 min-h-[44px] bg-primary hover:bg-primary-dark text-primary-foreground font-medium rounded-lg cursor-pointer transition-colors"
          >
            <Check className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Accept Dispatch
          </Button>

          <Button
            variant="outline"
            onClick={handleReject}
            className="w-full sm:flex-1 min-h-[44px] border-border text-destructive hover:bg-destructive-bg hover:border-destructive/30 font-medium rounded-lg cursor-pointer transition-colors"
          >
            <X className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Reject
          </Button>
        </div>
      ) : (
        <div className="mt-4 pt-2 border-t border-border text-center text-xs text-text-muted">
          Assignment status:{" "}
          <span className="font-medium text-text-primary">{localStatus}</span>
        </div>
      )}
    </motion.div>
  );
}
