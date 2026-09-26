"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, KeyRound, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledEmail = searchParams.get("email");

  const [otp, setOtp] = useState("492815");
  const [newPassword, setNewPassword] = useState("NewSecurePass2026!");
  const [confirmPassword, setConfirmPassword] = useState("NewSecurePass2026!");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    toast.success("Password Updated Successfully!", {
      description: "You can now sign in with your new password.",
    });

    setTimeout(() => {
      setLoading(false);
      router.push("/login");
    }, 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs"
    >
      <div className="text-center mb-6">
        <div className="h-12 w-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <KeyRound className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          Enter Verification OTP
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary max-w-sm mx-auto">
          {prefilledEmail
            ? `Enter the 6-digit code dispatched to ${prefilledEmail} along with your new password.`
            : "Enter your 6-digit security OTP code along with your new password."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* OTP Code Input */}
        <div className="space-y-1.5">
          <Label
            htmlFor="reset-otp"
            className="text-xs font-semibold text-text-primary"
          >
            6-Digit OTP Code
          </Label>
          <div className="relative">
            <KeyRound
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
              aria-hidden="true"
            />
            <Input
              id="reset-otp"
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="e.g. 492815"
              className="pl-10 h-11 w-full text-base sm:text-sm font-mono tracking-widest bg-surface border-border focus-visible:border-primary focus-visible:ring-primary/20"
            />
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="reset-new-password"
            className="text-xs font-semibold text-text-primary"
          >
            New Password
          </Label>
          <div className="relative">
            <Lock
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
              aria-hidden="true"
            />
            <Input
              id="reset-new-password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="pl-10 h-11 w-full text-base sm:text-sm bg-surface border-border focus-visible:border-primary focus-visible:ring-primary/20"
            />
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="reset-confirm-password"
            className="text-xs font-semibold text-text-primary"
          >
            Confirm New Password
          </Label>
          <div className="relative">
            <Lock
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
              aria-hidden="true"
            />
            <Input
              id="reset-confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="pl-10 h-11 w-full text-base sm:text-sm bg-surface border-border focus-visible:border-primary focus-visible:ring-primary/20"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full min-h-[44px] h-11 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold rounded-lg shadow-xs cursor-pointer transition-colors mt-2"
        >
          {loading ? (
            <span>Updating Password...</span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              <span>Reset & Sign In</span>
            </span>
          )}
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-border text-center text-xs text-text-secondary">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-primary font-semibold hover:text-primary-dark hover:underline transition-colors min-h-[44px]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </motion.div>
  );
}
