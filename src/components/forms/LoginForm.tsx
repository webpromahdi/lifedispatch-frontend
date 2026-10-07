"use client";
import { useForm } from "@tanstack/react-form";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  CircuitTraceLeft,
  CircuitTraceRight,
  GoogleIcon,
  TealCornerNotch,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/validations";

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
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onBlur: loginSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Form Submitted:", value);
    },
  });

  return (
    <div className="w-full flex flex-col">
      {/*SECTION 1: Centered Main Login Card*/}

      <div className="relative w-full">
        {/* Ambient horizontal circuit trace lines (desktop only) */}
        <div
          className="hidden lg:block absolute inset-0 pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          {/* Left trace */}
          <CircuitTraceLeft className="absolute top-21.5 left-0 w-[calc(50%-240px)] h-6 text-primary/40" />
          {/* Right trace */}
          <CircuitTraceRight className="absolute top-21.5 right-0 w-[calc(50%-240px)] h-6 text-primary/40" />
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
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                >
                  <FieldGroup>
                    {/* Email */}
                    <form.Field name="email">
                      {(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel
                              htmlFor={field.name}
                              className="block text-xs sm:text-sm font-bold text-slate-800"
                            >
                              Email
                            </FieldLabel>
                            <div className="relative">
                              {/* Clipped input container */}
                              <div
                                className="flex items-center bg-white border-2 border-slate-300 focus-within:border-primary rounded-lg transition-colors overflow-hidden"
                                style={{
                                  clipPath:
                                    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
                                }}
                              >
                                <Mail
                                  className="ml-3.5 h-4 w-4 text-slate-400 shrink-0 pointer-events-none"
                                  aria-hidden="true"
                                />
                                <Input
                                  id={field.name}
                                  name={field.name}
                                  type="email"
                                  value={field.state.value}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  onBlur={field.handleBlur}
                                  required
                                  placeholder="you@example.com"
                                  autoComplete="off"
                                  aria-invalid={isInvalid}
                                  className="w-full h-11 border-0 pl-2.5 pr-4 bg-transparent text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-0 rounded-none"
                                />
                              </div>
                              {/* Teal corner notch */}
                              <TealCornerNotch className="absolute top-0 right-0 w-3.5 h-3.5 text-primary pointer-events-none" />
                            </div>
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    </form.Field>

                    {/* Password */}
                    <form.Field name="password">
                      {(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel
                              htmlFor={field.name}
                              className="block text-xs sm:text-sm font-bold text-slate-800"
                            >
                              Password
                            </FieldLabel>
                            <div className="relative">
                              <div
                                className="flex items-center bg-white border-2 border-slate-300 focus-within:border-primary rounded-lg transition-colors overflow-hidden"
                                style={{
                                  clipPath:
                                    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
                                }}
                              >
                                <Lock
                                  className="ml-3.5 h-4 w-4 text-slate-400 shrink-0 pointer-events-none"
                                  aria-hidden="true"
                                />
                                <Input
                                  id={field.name}
                                  name={field.name}
                                  type={showPassword ? "text" : "password"}
                                  value={field.state.value}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  onBlur={field.handleBlur}
                                  required
                                  placeholder="Enter your password"
                                  autoComplete="new-password"
                                  aria-invalid={isInvalid}
                                  className="w-full h-11 border-0 pl-2.5 pr-11 bg-transparent text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-0 rounded-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 min-h-11 min-w-11 flex items-center justify-center cursor-pointer transition-colors"
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                              <TealCornerNotch className="absolute top-0 right-0 w-3.5 h-3.5 text-primary pointer-events-none" />
                            </div>
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    </form.Field>

                    {/* Login Button */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        className="w-full h-12 min-h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base rounded-none flex items-center justify-between px-5 shadow-[0_3px_0_0_#0f766e] active:translate-y-0.5 active:shadow-none"
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
                          Login
                        </span>
                        <ArrowRight
                          className="h-4 w-4 text-white shrink-0"
                          aria-hidden="true"
                        />
                      </Button>
                    </div>
                  </FieldGroup>
                </form>

                {/* OR Divider */}
                <div className="relative flex items-center justify-center my-5">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-xs uppercase tracking-wider text-slate-400 font-semibold shrink-0 absolute">
                    OR
                  </span>
                </div>

                {/* Continue with Google button — with continuous chamfered border and top-right dark notch */}
                <Button
                  type="button"
                  variant="ghost"
                  className="relative w-full h-12 min-h-12 group flex items-center justify-center select-none active:translate-x-px active:translate-y-px hover:bg-transparent rounded-none p-0"
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
                    <GoogleIcon className="h-4 w-4 shrink-0" />
                    <span>Continue with Google</span>
                  </span>
                </Button>

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
                      <Button
                        type="button"
                        variant="ghost"
                        className="mt-2.5 relative w-full h-10 min-h-10 group/btn flex items-center justify-center select-none active:translate-x-px active:translate-y-px hover:bg-transparent rounded-none p-0"
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
                      </Button>
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
