"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [localStatus, setLocalStatus] = useState<string>(dispatch.status);
  const [isExpired, setIsExpired] = useState<boolean>(
    dispatch.status === "TIMED_OUT",
  );
  const [isReviewed, setIsReviewed] = useState<boolean>(
    dispatch.status === "ACCEPTED",
  );
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>(
    "MECHANICAL_ISSUE",
  );

  const handleExpire = () => {
    setIsExpired(true);
    setLocalStatus("TIMED_OUT");
    toast.error("Dispatch assignment expired", {
      description: `Incident ${emergency.incidentNumber} response timeout reached.`,
    });
  };

  const handleAccept = () => {
    setLocalStatus("ACCEPTED");
    setIsReviewed(true);
    toast.success("Dispatch assignment accepted! Trip is now active.", {
      description: `Incident ${emergency.incidentNumber} assigned.`,
    });
    if (onAccept) onAccept(dispatch.id);
  };

  const handleConfirmReject = () => {
    setRejectDialogOpen(false);
    setLocalStatus("REJECTED");
    setIsDismissed(true);
    toast.error("Dispatch assignment rejected.", {
      description: "Ambulance returned to available fleet.",
    });
    if (onReject) onReject(dispatch.id);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {isReviewed ? (
          <motion.div
            key="reviewed-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "bg-status-bg border border-status/30 rounded-xl p-5 shadow-xs flex flex-col items-center justify-center text-center space-y-3",
              className,
            )}
          >
            <div className="h-12 w-12 rounded-full bg-status/10 flex items-center justify-center text-status">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary text-sm">
                Dispatch Assignment Accepted
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Incident{" "}
                <span className="font-mono font-medium text-text-primary">
                  {emergency.incidentNumber}
                </span>{" "}
                assigned. Route initialized.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 pt-1 text-xs text-status-text font-medium">
              <span className="h-2 w-2 rounded-full bg-status animate-ping" />
              Active Mission in Progress
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="active-dispatch-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, height: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "bg-surface border rounded-xl p-5 shadow-xs transition-all duration-200 flex flex-col justify-between",
              isExpired
                ? "border-destructive/30 bg-destructive-bg/20 opacity-90"
                : "border-border hover:shadow-md",
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
                  <StatusBadge
                    status={isExpired ? "TIMED_OUT" : localStatus}
                  />
                  {localStatus === "PENDING_ACCEPTANCE" && !isExpired && (
                    <CountdownTimer
                      timeoutAt={dispatch.timeoutAt}
                      onExpire={handleExpire}
                    />
                  )}
                  {isExpired && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-destructive bg-destructive-bg border border-destructive/30 px-2 py-0.5 rounded-md">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      EXPIRED
                    </span>
                  )}
                </div>
              </div>

              {/* Expired alert banner if expired */}
              {isExpired && (
                <div className="mt-3 p-2.5 rounded-lg bg-destructive-bg/60 border border-destructive/20 flex items-center gap-2 text-xs text-destructive">
                  <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    This dispatch alert has timed out and can no longer be accepted.
                  </span>
                </div>
              )}

              {/* Emergency context and location */}
              <div className="mt-4 space-y-2.5">
                <div className="flex items-start gap-2 text-sm">
                  <ShieldAlert
                    className={cn(
                      "h-4 w-4 shrink-0 mt-0.5",
                      isExpired ? "text-text-muted" : "text-primary",
                    )}
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
                  <span className="line-clamp-2">
                    {emergency.locationAddress}
                  </span>
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

            {/* Action buttons (only enabled during PENDING_ACCEPTANCE and not expired) */}
            {localStatus === "PENDING_ACCEPTANCE" ? (
              <div className="mt-5 pt-3 border-t border-border flex flex-col sm:flex-row items-center gap-2.5">
                <Button
                  onClick={handleAccept}
                  disabled={isExpired}
                  aria-label={`Accept dispatch assignment for incident ${emergency.incidentNumber}`}
                  className={cn(
                    "w-full sm:flex-1 min-h-[44px] font-medium rounded-lg transition-colors",
                    isExpired
                      ? "bg-muted text-text-muted cursor-not-allowed border border-border"
                      : "bg-primary hover:bg-primary-dark text-primary-foreground cursor-pointer",
                  )}
                >
                  <Check className="h-4 w-4 mr-1.5" aria-hidden="true" />
                  Accept Dispatch
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setRejectDialogOpen(true)}
                  disabled={isExpired}
                  aria-label={`Reject dispatch assignment for incident ${emergency.incidentNumber}`}
                  className={cn(
                    "w-full sm:flex-1 min-h-[44px] border-border font-medium rounded-lg transition-colors",
                    isExpired
                      ? "text-text-muted cursor-not-allowed opacity-50"
                      : "text-destructive hover:bg-destructive-bg hover:border-destructive/30 cursor-pointer",
                  )}
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
        )}
      </AnimatePresence>

      {/* Reject Confirmation Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-destructive-bg text-destructive">
                <X className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <DialogTitle>Reject Dispatch Assignment</DialogTitle>
                <DialogDescription>
                  Are you sure you want to decline Incident{" "}
                  <span className="font-mono font-semibold text-text-primary">
                    {emergency.incidentNumber}
                  </span>
                  ? It will be re-routed immediately.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Label htmlFor="reject-reason" className="text-xs font-medium">
              Reason for Rejection
            </Label>
            <Select
              value={rejectionReason}
              onValueChange={(val) => val && setRejectionReason(val)}
            >
              <SelectTrigger id="reject-reason" className="w-full text-xs">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MECHANICAL_ISSUE">
                  Mechanical / Equipment Issue
                </SelectItem>
                <SelectItem value="TRAFFIC_DELAY">
                  Severe Route / Traffic Congestion
                </SelectItem>
                <SelectItem value="CREW_UNAVAILABLE">
                  Crew Unavailable / End of Shift
                </SelectItem>
                <SelectItem value="DISTANCE_TOO_FAR">
                  Distance Beyond SLA Response Radius
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              className="text-xs min-h-[40px] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReject}
              className="bg-destructive hover:bg-destructive/90 text-white text-xs min-h-[40px] cursor-pointer"
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
