"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("nafisa.anjum@gmail.com");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Security OTP Dispatched", {
        description: `6-digit verification code has been sent to ${email}`,
      });
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs"
    >
      {!submitted ? (
        <>
          <div className="text-center mb-6">
            <div className="h-12 w-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto mb-3 shadow-2xs">
              <KeyRound className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Reset Your Password
            </h1>
            <p className="mt-1.5 text-sm text-text-secondary max-w-sm mx-auto">
              Enter your verified LifeDispatch email address to receive a
              6-digit one-time password (OTP).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="forgot-email"
                className="text-xs font-semibold text-text-primary"
              >
                Account Email Address
              </Label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
                  aria-hidden="true"
                />
                <Input
                  id="forgot-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
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
                <span>Generating OTP...</span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Send OTP Verification</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
        </>
      ) : (
        /* Dummy Success State */
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-2 space-y-4"
        >
          <div className="h-14 w-14 rounded-2xl bg-status-bg text-status-text flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Verification OTP Sent!
          </h2>

          <p className="text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
            We have dispatched a 6-digit recovery code to{" "}
            <strong className="font-semibold text-text-primary">{email}</strong>
            . It will expire in 10 minutes.
          </p>

          <div className="pt-3 space-y-3">
            <Button
              onClick={() =>
                router.push(
                  `/reset-password?email=${encodeURIComponent(email)}`,
                )
              }
              className="w-full min-h-[44px] h-11 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              <span>Proceed to Enter OTP</span>
              <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Button>

            <Button
              variant="outline"
              onClick={() => setSubmitted(false)}
              className="w-full min-h-[44px] border-border text-text-secondary hover:text-text-primary cursor-pointer"
            >
              Didn&apos;t receive it? Try again
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
