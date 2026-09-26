"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BLOOD_TYPE_OPTIONS = [
  { value: "A_POSITIVE", label: "A+ (A Positive)" },
  { value: "A_NEGATIVE", label: "A- (A Negative)" },
  { value: "B_POSITIVE", label: "B+ (B Positive)" },
  { value: "B_NEGATIVE", label: "B- (B Negative)" },
  { value: "AB_POSITIVE", label: "AB+ (AB Positive)" },
  { value: "AB_NEGATIVE", label: "AB- (AB Negative)" },
  { value: "O_POSITIVE", label: "O+ (O Positive)" },
  { value: "O_NEGATIVE", label: "O- (O Negative - Universal)" },
  { value: "UNKNOWN", label: "I don't know my blood group" },
];

export function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("Nafisa Anjum");
  const [email, setEmail] = useState("nafisa.anjum@gmail.com");
  const [password, setPassword] = useState("SecurePass2026!");
  const [confirmPassword, setConfirmPassword] = useState("SecurePass2026!");
  const [phone, setPhone] = useState("+880 1711-555555");
  const [bloodType, setBloodType] = useState("O_NEGATIVE");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    toast.success("Account Created Successfully!", {
      description:
        "Redirecting to login. Please sign in with your credentials.",
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
      {/* Title Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold mb-3 border border-primary/20">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Patient Registration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          Create LifeDispatch Account
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          Register to summon fast paramedic triage and track ambulance GPS in
          emergencies.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label
            htmlFor="register-name"
            className="text-xs font-semibold text-text-primary"
          >
            Full Name
          </Label>
          <div className="relative">
            <User
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
              aria-hidden="true"
            />
            <Input
              id="register-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nafisa Anjum"
              className="pl-10 h-11 w-full text-base sm:text-sm bg-surface border-border focus-visible:border-primary focus-visible:ring-primary/20"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <Label
            htmlFor="register-email"
            className="text-xs font-semibold text-text-primary"
          >
            Email Address
          </Label>
          <div className="relative">
            <Mail
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
              aria-hidden="true"
            />
            <Input
              id="register-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="pl-10 h-11 w-full text-base sm:text-sm bg-surface border-border focus-visible:border-primary focus-visible:ring-primary/20"
            />
          </div>
        </div>

        {/* Phone & Blood Type Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="register-phone"
              className="text-xs font-semibold text-text-primary"
            >
              Phone Number{" "}
              <span className="text-text-muted font-normal">(Optional)</span>
            </Label>
            <div className="relative">
              <Phone
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
                aria-hidden="true"
              />
              <Input
                id="register-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1700-000000"
                className="pl-10 h-11 w-full text-base sm:text-sm bg-surface border-border focus-visible:border-primary focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="register-blood-type"
              className="text-xs font-semibold text-text-primary"
            >
              Blood Group{" "}
              <span className="text-text-muted font-normal">(Optional)</span>
            </Label>
            <div className="relative">
              <Heart
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive pointer-events-none"
                aria-hidden="true"
              />
              <select
                id="register-blood-type"
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="h-11 w-full pl-10 pr-4 text-base sm:text-sm rounded-lg border border-border bg-surface text-text-primary outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                {BLOOD_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Password & Confirm Password Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="register-password"
              className="text-xs font-semibold text-text-primary"
            >
              Password
            </Label>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
                aria-hidden="true"
              />
              <Input
                id="register-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="pl-10 h-11 w-full text-base sm:text-sm bg-surface border-border focus-visible:border-primary focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="register-confirm-password"
              className="text-xs font-semibold text-text-primary"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
                aria-hidden="true"
              />
              <Input
                id="register-confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="pl-10 h-11 w-full text-base sm:text-sm bg-surface border-border focus-visible:border-primary focus-visible:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Terms notice */}
        <p className="text-[11px] text-text-muted leading-relaxed pt-1">
          By creating an account, you consent to emergency geolocation
          broadcasting during active 999 dispatch alerts.
        </p>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full min-h-[44px] h-11 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold rounded-lg shadow-xs cursor-pointer transition-colors mt-2"
        >
          {loading ? (
            <span>Creating Account...</span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          )}
        </Button>
      </form>

      {/* Footer Navigation */}
      <div className="mt-6 pt-5 border-t border-border text-center text-xs text-text-secondary">
        <span>Already have an account? </span>
        <Link
          href="/login"
          className="text-primary font-semibold hover:text-primary-dark hover:underline transition-colors"
        >
          Sign In
        </Link>
      </div>
    </motion.div>
  );
}
