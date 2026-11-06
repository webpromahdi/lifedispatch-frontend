"use client";

import { AlertTriangle, Ban, Loader2 } from "lucide-react";
import type React from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCancelEmergency } from "@/hooks";

interface CancelEmergencyDialogProps {
  emergencyId: string;
  incidentNumber?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function CancelEmergencyDialog({
  emergencyId,
  incidentNumber,
  open: externalOpen,
  onOpenChange: setExternalOpen,
  trigger,
}: CancelEmergencyDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen =
    isControlled && setExternalOpen ? setExternalOpen : setInternalOpen;

  const [reason, setReason] = useState("");
  const cancelMutation = useCancelEmergency();

  const handleCancelEmergency = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast.error("Cancellation reason required", {
        description:
          "Please state the operational reason for aborting this emergency call.",
      });
      return;
    }

    cancelMutation.mutate(
      { id: emergencyId, reason: reason.trim() },
      {
        onSuccess: () => {
          toast.success("Incident Aborted", {
            description: `Emergency ${incidentNumber || emergencyId} has been cancelled.`,
          });
          setReason("");
          setOpen(false);
        },
        onError: (err) => {
          toast.error("Cancellation Failed", {
            description:
              (err as { data?: { message?: string } })?.data?.message ||
              err.message ||
              "Could not abort emergency incident.",
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
          className="bg-transparent border-0 p-0 text-left cursor-pointer inline-flex outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
        >
          {trigger}
        </button>
      ) : !isControlled ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="min-h-11 md:min-h-7 h-9 md:h-7 px-2.5 md:px-2 text-xs text-destructive hover:bg-destructive-bg border-destructive/20 gap-1 cursor-pointer"
        >
          <Ban className="h-3 w-3" />
          Cancel
        </Button>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Cancel Incident {incidentNumber ? `(${incidentNumber})` : ""}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Aborting this CAD emergency will permanently stop dispatching and
              telematics tracking. Please record a mandatory audit explanation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCancelEmergency} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="cancel-reason">
                Audit Reason for Cancellation *
              </Label>
              <Textarea
                id="cancel-reason"
                placeholder="e.g. Caller reported false alarm, duplicate CAD ticket, patient transport refused, or patient transported by private vehicle."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                required
                className="text-xs resize-none"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={cancelMutation.isPending}
              >
                Keep Incident Active
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={cancelMutation.isPending}
                className="gap-2 cursor-pointer"
              >
                {cancelMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Confirm Cancellation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
