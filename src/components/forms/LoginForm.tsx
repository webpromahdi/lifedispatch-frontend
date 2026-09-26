"use client";

import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isStaff = searchParams.get("role") === "staff";

  const [email, setEmail] = useState(
    isStaff ? "dispatcher@lifedispatch.org" : "nafisa.anjum@gmail.com",
  );
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    toast.success("Welcome back!", {
      description: isStaff
        ? "Authenticated as Dispatcher (Operational Staff)."
        : "Authenticated as Patient (Nafisa Anjum).",
    });

    setTimeout(() => {
      setLoading(false);
      if (isStaff) {
        router.push("/dashboard/dispatcher");
      } else {
        router.push("/dashboard/patient");
      }
    }, 600);
  };

  const handleGoogleLogin = () => {
    toast.info("Google OAuth", {
      description: "Redirecting to Google Account Authentication...",
    });
    setTimeout(() => {
      router.push("/dashboard/patient");
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs"
    >
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold mb-3 border border-primary/20">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          <span>
            {isStaff ? "Operations Staff Access" : "Patient Portal Login"}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          Sign In to LifeDispatch
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          {isStaff
            ? "Access central dispatch queue, fleet monitors & telemetry."
            : "Request rapid ambulances & track live emergency status."}
        </p>
      </div>

      {/* Google OAuth Button (UI Only) */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        className="w-full min-h-[44px] border-border text-text-primary hover:bg-background hover:border-primary/40 font-medium transition-colors cursor-pointer flex items-center justify-center gap-2.5 mb-6"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </Button>

      {/* Divider */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="border-t border-border w-full" />
        <span className="bg-surface px-3 text-xs uppercase tracking-wider text-text-muted font-medium shrink-0">
          Or with email
        </span>
      </div>

      {/* Credentials Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <Label
            htmlFor="login-email"
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
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="pl-10 h-11 w-full text-base sm:text-sm bg-surface border-border focus-visible:border-primary focus-visible:ring-primary/20"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="login-password"
              className="text-xs font-semibold text-text-primary"
            >
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:text-primary-dark font-medium transition-colors focus:outline-hidden"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
              aria-hidden="true"
            />
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="pl-10 pr-10 h-11 w-full text-base sm:text-sm bg-surface border-border focus-visible:border-primary focus-visible:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary focus:outline-hidden min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Role Toggle Helper */}
        <div className="pt-1 flex items-center justify-between text-xs text-text-secondary">
          <span>Target Mode:</span>
          <Link
            href={isStaff ? "/login" : "/login?role=staff"}
            className="text-primary hover:underline font-medium"
          >
            {isStaff ? "Switch to Patient Login" : "Switch to Staff Login"}
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full min-h-[44px] h-11 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold rounded-lg shadow-xs cursor-pointer transition-colors mt-2"
        >
          {loading ? (
            <span>Authenticating...</span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          )}
        </Button>
      </form>

      {/* Footer Navigation */}
      <div className="mt-6 pt-5 border-t border-border text-center text-xs text-text-secondary">
        <span>Don&apos;t have an account? </span>
        <Link
          href="/register"
          className="text-primary font-semibold hover:text-primary-dark hover:underline transition-colors"
        >
          Create account
        </Link>
      </div>
    </motion.div>
  );
}
