"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "@/hooks/auth.hook";
import { changePasswordSchema } from "@/validations";

export interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isForced?: boolean;
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  isForced = false,
}: ChangePasswordDialogProps) {
  const queryClient = useQueryClient();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutate: changePasswordMutate, isPending } = useChangePassword();

  const handleClose = (nextOpen: boolean) => {
    if (isForced && !nextOpen) {
      toast.warning("Action Required", {
        description:
          "You must change your temporary password before continuing.",
      });
      return;
    }
    setErrorMsg(null);
    setNewPassword("");
    setConfirmPassword("");
    onOpenChange(nextOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const validationResult = changePasswordSchema.safeParse({
      newPassword,
      confirmPassword,
    });

    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0];
      setErrorMsg(firstIssue?.message || "Invalid password format.");
      return;
    }

    changePasswordMutate(
      { newPassword },
      {
        onSuccess: () => {
          toast.success("Password Changed Successfully", {
            description: "Your account is now secured with your new password.",
          });
          queryClient.invalidateQueries({ queryKey: ["user", "me"] });
          setNewPassword("");
          setConfirmPassword("");
          setErrorMsg(null);
          onOpenChange(false);
        },
        onError: (err: unknown) => {
          const fetchErr = err as {
            data?: { message?: string };
            message?: string;
          };
          const message =
            fetchErr?.data?.message ||
            fetchErr?.message ||
            "Failed to change password. Please try again.";
          setErrorMsg(message);
          toast.error("Password Update Failed", {
            description: message,
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[440px] rounded-none border-border"
        showCloseButton={!isForced}
      >
        <DialogHeader className="text-left space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-none bg-primary-light text-primary flex items-center justify-center shrink-0">
              <KeyRound className="h-4 w-4" aria-hidden="true" />
            </div>
            <DialogTitle className="text-lg font-bold text-text-primary tracking-tight">
              {isForced ? "Set Your Permanent Password" : "Change Password"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-text-secondary leading-relaxed">
            {isForced
              ? "Your account currently has a temporary credentials requirement. Please create a new secure password to activate full platform access."
              : "Update your account password below. Ensure it meets the security complexity rules."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* New Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="new-password-input"
              className="text-xs font-semibold text-text-primary uppercase tracking-wider"
            >
              New Password
            </Label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
                aria-hidden="true"
              />
              <Input
                id="new-password-input"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="pl-9 pr-10 rounded-none h-10 border-border focus-visible:ring-primary text-sm"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer p-0.5"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="confirm-password-input"
              className="text-xs font-semibold text-text-primary uppercase tracking-wider"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <ShieldCheck
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
                aria-hidden="true"
              />
              <Input
                id="confirm-password-input"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="pl-9 pr-10 rounded-none h-10 border-border focus-visible:ring-primary text-sm"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer p-0.5"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-none">
              {errorMsg}
            </div>
          )}

          {/* Complexity hints */}
          <div className="bg-slate-50 border border-slate-200 p-3 text-[11px] text-text-secondary space-y-1">
            <p className="font-semibold text-text-primary">
              Password requirements:
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-text-muted">
              <li>Minimum 8 characters</li>
              <li>At least 1 lowercase &amp; 1 uppercase letter</li>
              <li>At least 1 number and 1 special symbol</li>
            </ul>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            {!isForced && (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
                disabled={isPending}
                className="rounded-none cursor-pointer"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isPending || !newPassword || !confirmPassword}
              className="bg-primary hover:bg-primary-dark text-white rounded-none cursor-pointer w-full sm:w-auto"
            >
              {isPending ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  Updating...
                </>
              ) : (
                "Save New Password"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
