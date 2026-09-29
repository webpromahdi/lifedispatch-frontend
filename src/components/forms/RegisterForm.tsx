"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Eye,
  EyeOff,
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!password) {
      toast.error("Please enter a password.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", {
        description: "Please verify that your password and confirmation match.",
      });
      return;
    }

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

  const handleGoogleLogin = () => {
    toast.info("Google OAuth", {
      description: "Redirecting to Google Account Authentication...",
    });
    setTimeout(() => {
      router.push("/dashboard/patient");
    }, 800);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="relative w-full">
        {/* Ambient horizontal circuit trace lines (desktop only) */}
        <div
          className="hidden lg:block absolute inset-0 pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          {/* Left trace */}
          <svg
            className="absolute top-[86px] left-0 w-[calc(50%-280px)] h-6 text-primary/40"
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
            className="absolute top-[86px] right-0 w-[calc(50%-280px)] h-6 text-primary/40"
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

        {/* Centered Registration Card */}
        <div className="relative z-10 w-full flex justify-center py-6 sm:py-8 lg:py-10">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-[540px] filter drop-shadow-[0_8px_24px_rgba(20,184,166,0.12)]"
          >
            {/* Outer teal 2px framed border with chamfered corners */}
            <div
              className="w-full bg-primary p-[2px]"
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
                {/* Centered Heading */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    Create LifeDispatch Account
                  </h1>
                  <p className="text-sm sm:text-[15px] text-slate-500 font-normal mt-1.5">
                    Register to access LifeDispatch emergency medical services
                    and rapid ambulance dispatch.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name - Full Width */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="register-name"
                      className="block text-xs sm:text-sm font-bold text-slate-800"
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <div
                        className="flex items-center bg-white border-2 border-slate-300 focus-within:border-primary rounded-lg transition-colors"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
                        }}
                      >
                        <User
                          className="ml-3.5 h-4 w-4 text-slate-400 shrink-0 pointer-events-none"
                          aria-hidden="true"
                        />
                        <input
                          id="register-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Nafisa Anjum"
                          className="w-full h-11 pl-2.5 pr-4 bg-transparent text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                        />
                      </div>
                      {/* Teal corner notch */}
                      <svg
                        className="absolute top-0 right-0 w-[14px] h-[14px] text-primary pointer-events-none"
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

                  {/* Email Address - Full Width */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="register-email"
                      className="block text-xs sm:text-sm font-bold text-slate-800"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
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
                          id="register-email"
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
                        className="absolute top-0 right-0 w-[14px] h-[14px] text-primary pointer-events-none"
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

                  {/* Phone Number + Blood Group - Two Columns on Desktop/Tablet, Single on Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="register-phone"
                        className="block text-xs sm:text-sm font-bold text-slate-800"
                      >
                        Phone Number{" "}
                        <span className="text-slate-400 font-normal text-xs">
                          (Optional)
                        </span>
                      </Label>
                      <div className="relative">
                        <div
                          className="flex items-center bg-white border-2 border-slate-300 focus-within:border-primary rounded-lg transition-colors"
                          style={{
                            clipPath:
                              "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
                          }}
                        >
                          <Phone
                            className="ml-3.5 h-4 w-4 text-slate-400 shrink-0 pointer-events-none"
                            aria-hidden="true"
                          />
                          <input
                            id="register-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+880 1700-000000"
                            className="w-full h-11 pl-2.5 pr-4 bg-transparent text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                          />
                        </div>
                        {/* Teal corner notch */}
                        <svg
                          className="absolute top-0 right-0 w-[14px] h-[14px] text-primary pointer-events-none"
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

                    {/* Blood Group */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="register-blood-type"
                        className="block text-xs sm:text-sm font-bold text-slate-800"
                      >
                        Blood Group{" "}
                        <span className="text-slate-400 font-normal text-xs">
                          (Optional)
                        </span>
                      </Label>
                      <div className="relative">
                        <div
                          className="flex items-center bg-white border-2 border-slate-300 focus-within:border-primary rounded-lg transition-colors relative"
                          style={{
                            clipPath:
                              "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
                          }}
                        >
                          <Heart
                            className="ml-3.5 h-4 w-4 text-slate-400 shrink-0 pointer-events-none"
                            aria-hidden="true"
                          />
                          <select
                            id="register-blood-type"
                            value={bloodType}
                            onChange={(e) => setBloodType(e.target.value)}
                            className="w-full h-11 pl-2.5 pr-8 bg-transparent text-base sm:text-sm text-slate-900 focus:outline-hidden cursor-pointer appearance-none truncate"
                          >
                            {BLOOD_TYPE_OPTIONS.map((opt) => (
                              <option
                                key={opt.value}
                                value={opt.value}
                                className="bg-white text-slate-900 py-1"
                              >
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
                            aria-hidden="true"
                          />
                        </div>
                        {/* Teal corner notch */}
                        <svg
                          className="absolute top-0 right-0 w-[14px] h-[14px] text-primary pointer-events-none"
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
                  </div>

                  {/* Password + Confirm Password - Two Columns on Desktop/Tablet, Single on Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Password */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="register-password"
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
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create password"
                            className="w-full h-11 pl-2.5 pr-11 bg-transparent text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer transition-colors"
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
                          className="absolute top-0 right-0 w-[14px] h-[14px] text-primary pointer-events-none"
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

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="register-confirm-password"
                        className="block text-xs sm:text-sm font-bold text-slate-800"
                      >
                        Confirm Password
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
                            id="register-confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            className="w-full h-11 pl-2.5 pr-11 bg-transparent text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            aria-label={
                              showConfirmPassword
                                ? "Hide confirm password"
                                : "Show confirm password"
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" aria-hidden="true" />
                            ) : (
                              <Eye className="h-4 w-4" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                        {/* Teal corner notch */}
                        <svg
                          className="absolute top-0 right-0 w-[14px] h-[14px] text-primary pointer-events-none"
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
                  </div>

                  {/* Emergency notice */}
                  <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                    By creating an account, you consent to emergency geolocation
                    broadcasting during active 999 dispatch alerts.
                  </p>

                  {/* Create Account Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 min-h-[48px] bg-primary hover:bg-primary-dark text-white font-bold text-base rounded-md flex items-center justify-between px-5 transition-all shadow-[0_3px_0_0_#0f766e] active:translate-y-[2px] active:shadow-none cursor-pointer disabled:opacity-60"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                      }}
                    >
                      <ShieldCheck
                        className="h-4 w-4 text-white shrink-0"
                        aria-hidden="true"
                      />
                      <span className="flex-1 text-center font-bold">
                        {loading ? "Creating Account..." : "Create Account"}
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
                  className="relative w-full h-12 min-h-[48px] group flex items-center justify-center cursor-pointer select-none active:translate-x-[1px] active:translate-y-[1px] transition-transform"
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
                      className="absolute inset-[2px] bg-white group-hover:bg-slate-50 transition-colors"
                      style={{
                        clipPath:
                          "polygon(6px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)",
                      }}
                    />
                  </div>

                  {/* Top-right corner black notch */}
                  <div
                    className="absolute top-0 right-0 w-[14px] h-[14px] bg-slate-900 pointer-events-none"
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

                {/* Existing Account Link */}
                <p className="mt-5 text-center text-xs sm:text-sm text-slate-500 font-medium">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-primary font-bold hover:text-primary-dark hover:underline transition-colors ml-0.5"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
