"use client";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface DemoRole {
  name: string;
  email: string;
  password: string;
  roleName: string;
  displayName: string;
  redirectPath: string;
}

const DEMO_ROLES: DemoRole[] = [
  {
    name: "Patient",
    email: "nafisa.anjum@gmail.com",
    password: "••••••••••••",
    roleName: "Patient",
    displayName: "Nafisa Anjum",
    redirectPath: "/dashboard/patient",
  },
  {
    name: "Dispatcher",
    email: "dispatcher@lifedispatch.org",
    password: "••••••••••••",
    roleName: "Dispatcher",
    displayName: "Kazi Nabil",
    redirectPath: "/dashboard/dispatcher",
  },
  {
    name: "Driver",
    email: "driver.kamal@lifedispatch.org",
    password: "••••••••••••",
    roleName: "Fleet Driver",
    displayName: "Kamal Hossain",
    redirectPath: "/dashboard/driver",
  },
  {
    name: "Hospital Staff",
    email: "er.dmc@lifedispatch.org",
    password: "••••••••••••",
    roleName: "Hospital Staff",
    displayName: "Dr. Rafiqul Islam",
    redirectPath: "/dashboard/hospital-staff",
  },
  {
    name: "Admin",
    email: "admin@lifedispatch.org",
    password: "••••••••••••",
    roleName: "System Admin",
    displayName: "Farhana Yasmin",
    redirectPath: "/dashboard/admin",
  },
  {
    name: "Super Admin",
    email: "superadmin@lifedispatch.org",
    password: "••••••••••••",
    roleName: "Super Admin",
    displayName: "Dr. Tariq Rahman",
    redirectPath: "/dashboard/super-admin",
  },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isStaff = searchParams.get("role") === "staff";

  const [email, setEmail] = useState(
    isStaff ? "dispatcher@lifedispatch.org" : "",
  );
  const [password, setPassword] = useState(isStaff ? "••••••••••••" : "");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email or select a Quick Access role.");
      return;
    }

    setLoading(true);

    const matchedRole = DEMO_ROLES.find(
      (r) => r.email.toLowerCase() === email.trim().toLowerCase(),
    );

    const targetRoleName = matchedRole
      ? matchedRole.roleName
      : isStaff
        ? "Dispatcher"
        : "Patient";
    const targetDisplayName = matchedRole
      ? matchedRole.displayName
      : isStaff
        ? "Operational Staff"
        : "Authorized User";
    const targetPath = matchedRole
      ? matchedRole.redirectPath
      : isStaff
        ? "/dashboard/dispatcher"
        : "/dashboard/patient";

    toast.success("Welcome back!", {
      description: `Authenticated as ${targetRoleName} (${targetDisplayName}).`,
    });

    setTimeout(() => {
      setLoading(false);
      router.push(targetPath);
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

  const handleQuickLogin = (role: DemoRole) => {
    setEmail(role.email);
    setPassword("••••••••••••");
    toast.info(`${role.name} credentials loaded!`, {
      description: "Click the Login button above to proceed.",
    });

    if (typeof window !== "undefined" && window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* ══════════════════════════════════════════════════════
          SECTION 1: Centered Main Login Card
      ══════════════════════════════════════════════════════ */}
      <div className="relative w-full">
        {/* Ambient horizontal circuit trace lines (desktop only) */}
        <div
          className="hidden lg:block absolute inset-0 pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          {/* Left trace */}
          <svg
            className="absolute top-21.5 left-0 w-[calc(50%-240px)] h-6 text-primary/40"
            preserveAspectRatio="none"
            viewBox="0 0 400 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0 12 L360 12 L380 4 L400 4"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          {/* Right trace */}
          <svg
            className="absolute top-21.5 right-0 w-[calc(50%-240px)] h-6 text-primary/40"
            preserveAspectRatio="none"
            viewBox="0 0 400 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M400 12 L40 12 L20 4 L0 4"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Centered Login Card */}
        <div className="relative z-10 w-full flex justify-center py-6 sm:py-8 lg:py-10">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-115 filter drop-shadow-[0_8px_24px_rgba(20,184,166,0.12)]"
          >
            {/* Outer teal 2px framed border with chamfered corners */}
            <div
              className="w-full bg-primary p-0.5"
              style={{
                clipPath:
                  "polygon(16px 0, calc(100% - 24px) 0, 100% 24px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 24px 100%, 0 calc(100% - 24px), 0 16px)",
              }}
            >
              {/* Inner white card */}
              <div
                className="relative w-full bg-white px-6 py-8 sm:px-8 sm:py-9"
                style={{
                  clipPath:
                    "polygon(15px 0, calc(100% - 23px) 0, 100% 23px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 23px 100%, 0 calc(100% - 23px), 0 15px)",
                }}
              >
                {/* SECURE ACCESS badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-primary rounded-md shadow-2xs mb-5">
                  <ShieldCheck
                    className="h-4 w-4 text-primary shrink-0"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-800">
                    SECURE ACCESS
                  </span>
                </div>

                {/* Heading */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Welcome Back 👋
                </h1>
                <p className="text-sm sm:text-[15px] text-slate-500 font-normal mt-1 mb-6">
                  Sign in to your LifeDispatch account.
                </p>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="login-email"
                      className="block text-xs sm:text-sm font-bold text-slate-800"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      {/* Clipped input container */}
                      <div
                        className="flex items-center bg-white border-2 border-slate-300 focus-within:border-primary rounded-lg transition-colors"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
                        }}
                      >
                        <Mail
                          className="ml-3.5 h-4 w-4 text-slate-400 shrink-0 pointer-events-none"
                          aria-hidden="true"
                        />
                        <input
                          id="login-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full h-11 pl-2.5 pr-4 bg-transparent text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                        />
                      </div>
                      {/* Teal corner notch */}
                      <svg
                        className="absolute top-0 right-0 w-3.5 h-3.5 text-primary pointer-events-none"
                        viewBox="0 0 14 14"
                        fill="none"
                        aria-hidden="true"
                      >
                        <line
                          x1="0"
                          y1="0"
                          x2="14"
                          y2="14"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="login-password"
                      className="block text-xs sm:text-sm font-bold text-slate-800"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <div
                        className="flex items-center bg-white border-2 border-slate-300 focus-within:border-primary rounded-lg transition-colors"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
                        }}
                      >
                        <Lock
                          className="ml-3.5 h-4 w-4 text-slate-400 shrink-0 pointer-events-none"
                          aria-hidden="true"
                        />
                        <input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full h-11 pl-2.5 pr-11 bg-transparent text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 min-h-11 min-w-11 flex items-center justify-center cursor-pointer transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                      {/* Teal corner notch */}
                      <svg
                        className="absolute top-0 right-0 w-3.5 h-3.5 text-primary pointer-events-none"
                        viewBox="0 0 14 14"
                        fill="none"
                        aria-hidden="true"
                      >
                        <line
                          x1="0"
                          y1="0"
                          x2="14"
                          y2="14"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Login Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 min-h-12 bg-primary hover:bg-primary-dark text-white font-bold text-base rounded-md flex items-center justify-between px-5 transition-all shadow-[0_3px_0_0_#0f766e] active:translate-y-0.5 active:shadow-none cursor-pointer disabled:opacity-60"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                      }}
                    >
                      <Lock
                        className="h-4 w-4 text-white shrink-0"
                        aria-hidden="true"
                      />
                      <span className="flex-1 text-center font-bold">
                        {loading ? "Authenticating..." : "Login"}
                      </span>
                      <ArrowRight
                        className="h-4 w-4 text-white shrink-0"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </form>

                {/* OR Divider */}
                <div className="relative flex items-center justify-center my-5">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-xs uppercase tracking-wider text-slate-400 font-semibold shrink-0 absolute">
                    OR
                  </span>
                </div>

                {/* Continue with Google button — with continuous chamfered border and top-right dark notch */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="relative w-full h-12 min-h-12 group flex items-center justify-center cursor-pointer select-none active:translate-x-[1px] active:translate-y-[1px] transition-transform"
                >
                  {/* Outer border container */}
                  <div
                    className="absolute inset-0 bg-slate-900 pointer-events-none drop-shadow-[2px_2px_0px_rgba(15,23,42,0.9)]"
                    style={{
                      clipPath:
                        "polygon(7px 0, calc(100% - 9px) 0, 100% 9px, 100% calc(100% - 7px), calc(100% - 7px) 100%, 7px 100%, 0 calc(100% - 7px), 0 7px)",
                    }}
                  >
                    <div
                      className="absolute inset-0.5 bg-white group-hover:bg-slate-50 transition-colors"
                      style={{
                        clipPath:
                          "polygon(6px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)",
                      }}
                    />
                  </div>

                  {/* Top-right corner black notch */}
                  <div
                    className="absolute top-0 right-0 w-3.5 h-3.5 bg-slate-900 pointer-events-none"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                    }}
                    aria-hidden="true"
                  />

                  <span className="relative z-10 flex items-center justify-center gap-2.5 text-sm sm:text-base font-bold text-slate-900">
                    <svg
                      className="h-4 w-4 shrink-0"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
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
                  </span>
                </button>

                {/* Registration link */}
                <p className="mt-5 text-center text-xs sm:text-sm text-slate-500 font-medium">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-primary font-bold hover:text-primary-dark hover:underline transition-colors ml-0.5"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 2: Quick Access Section
      ══════════════════════════════════════════════════════ */}
      <div className="w-full pt-6 sm:pt-8">
        <section
          aria-label="Quick Access Role Selection"
          className="relative w-full max-w-210 mx-auto"
        >
          {/* Outer teal framed box — 8-point chamfered corners */}
          <div
            className="w-full bg-primary p-0.5 relative"
            style={{
              clipPath:
                "polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)",
            }}
          >
            {/* Top-right corner teal diagonal accent */}
            <div
              className="absolute top-0 right-0 w-6 h-6 bg-primary pointer-events-none z-10"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 100%)",
              }}
              aria-hidden="true"
            />

            {/* Inner background card */}
            <div
              className="relative w-full bg-white/95 backdrop-blur-xs px-4 py-8 sm:px-8 sm:py-9 lg:px-10 lg:py-10"
              style={{
                clipPath:
                  "polygon(19px 0, calc(100% - 19px) 0, 100% 19px, 100% calc(100% - 19px), calc(100% - 19px) 100%, 19px 100%, 0 calc(100% - 19px), 0 19px)",
              }}
            >
              {/* Circuit divider lines flanking the centered QUICK ACCESS badge */}
              <div
                className="w-full flex items-center justify-between mb-6 pointer-events-none"
                aria-hidden="true"
              >
                <div className="h-[1.5px] flex-1 max-w-35 sm:max-w-50 bg-primary/35" />
                <div className="flex-1" />
                <div className="h-[1.5px] flex-1 max-w-35 sm:max-w-50 bg-primary/35" />
              </div>

              {/* 3×2 grid — 1 col mobile, 2 col tablet, 3 col desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
                {DEMO_ROLES.map((role) => (
                  <div key={role.name} className="relative group">
                    {/* Role Card Box with chamfered top-right corner cut */}
                    <div
                      className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-between text-center transition-all hover:border-slate-300 shadow-2xs overflow-hidden"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
                      }}
                    >
                      {/* Role name */}
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        {role.name}
                      </h3>

                      {/* Quick Login button with continuous chamfered border and top-right dark notch */}
                      <button
                        type="button"
                        onClick={() => handleQuickLogin(role)}
                        className="mt-2.5 relative w-full h-10 min-h-10.5 group/btn flex items-center justify-center cursor-pointer select-none active:translate-x-[1px] active:translate-y-[1px] transition-transform"
                      >
                        {/* Outer continuous dark border with 4-corner chamfer */}
                        <div
                          className="absolute inset-0 bg-slate-900 pointer-events-none drop-shadow-[2px_2px_0px_rgba(15,23,42,0.9)]"
                          style={{
                            clipPath:
                              "polygon(6px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)",
                          }}
                        >
                          {/* Inner fill with 4-corner chamfer */}
                          <div
                            className="absolute inset-[1.5px] bg-white group-hover/btn:bg-slate-50 transition-colors"
                            style={{
                              clipPath:
                                "polygon(5px 0, calc(100% - 7px) 0, 100% 7px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)",
                            }}
                          />
                        </div>

                        {/* Top-right corner solid black wedge / notch */}
                        <div
                          className="absolute top-0 right-0 w-3 h-3 bg-slate-900 pointer-events-none"
                          style={{
                            clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                          }}
                          aria-hidden="true"
                        />

                        {/* Button Text & Arrow */}
                        <span className="relative z-10 flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm text-slate-900">
                          <span>Quick Login</span>
                          <ArrowRight
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </span>
                      </button>
                    </div>

                    {/* Teal diagonal corner accent on the role card */}
                    <div
                      className="absolute top-0 right-0 w-3.5 h-3.5 bg-primary pointer-events-none"
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                      }}
                      aria-hidden="true"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QUICK ACCESS badge centered on the top border */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="px-5 py-1.5 bg-white border-2 border-primary rounded-md shadow-2xs whitespace-nowrap">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
                QUICK ACCESS
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
