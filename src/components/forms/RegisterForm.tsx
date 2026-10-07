"use client";

import { useForm } from "@tanstack/react-form";
import {
  ArrowRight,
  Clock,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GoogleIcon, TealCornerNotch } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRegister, useVerifyEmail } from "@/hooks";
import { type RegisterFormValues, registerSchema } from "@/validations";

// ─── Step 1: Registration details form ───────────────────────────────────────

function DetailsForm({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate: register, isPending } = useRegister();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    } as RegisterFormValues,
    validators: {
      onBlur: registerSchema,
    },
    onSubmit: async ({ value }) => {
      register(
        {
          name: value.name,
          email: value.email,
          password: value.password,
          phone: value.phone || undefined,
        },
        {
          onSuccess: () => {
            toast.success("OTP Sent!", {
              description:
                "Check your email for the 6-digit code. Valid for 5 minutes.",
            });
            onSuccess(value.email);
          },
          onError: (err) => {
            toast.error("Registration Failed", {
              description:
                (err as { message?: string })?.message ||
                "Something went wrong. Please try again.",
            });
          },
        },
      );
    },
  });

  return (
    <div className="w-full flex flex-col">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="w-full"
      >
        <FieldGroup>
          {/* Full Name */}
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="block text-xs sm:text-sm font-bold text-slate-800"
                  >
                    Full Name
                  </FieldLabel>
                  <div className="relative">
                    <div
                      className="flex items-center bg-white border-2 border-slate-300 focus-within:border-primary rounded-lg transition-colors overflow-hidden"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
                      }}
                    >
                      <User
                        className="ml-3.5 h-4 w-4 text-slate-400 shrink-0 pointer-events-none"
                        aria-hidden="true"
                      />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        required
                        placeholder="e.g. Nafisa Anjum"
                        autoComplete="name"
                        aria-invalid={isInvalid}
                        className="w-full h-11 border-0 pl-2.5 pr-4 bg-transparent text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-0 aria-invalid:ring-0 aria-invalid:border-0 rounded-none"
                      />
                    </div>
                    <TealCornerNotch className="absolute top-0 right-0 w-3.5 h-3.5 text-primary pointer-events-none" />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Email */}
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="block text-xs sm:text-sm font-bold text-slate-800"
                  >
                    Email Address
                  </FieldLabel>
                  <div className="relative">
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
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        required
                        placeholder="you@example.com"
                        autoComplete="email"
                        aria-invalid={isInvalid}
                        className="w-full h-11 border-0 pl-2.5 pr-4 bg-transparent text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-0 aria-invalid:ring-0 aria-invalid:border-0 rounded-none"
                      />
                    </div>
                    <TealCornerNotch className="absolute top-0 right-0 w-3.5 h-3.5 text-primary pointer-events-none" />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Phone (Optional) */}
          <form.Field name="phone">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="block text-xs sm:text-sm font-bold text-slate-800"
                  >
                    Phone Number{" "}
                    <span className="text-slate-400 font-normal text-xs">
                      (Optional)
                    </span>
                  </FieldLabel>
                  <div className="relative">
                    <div
                      className="flex items-center bg-white border-2 border-slate-300 focus-within:border-primary rounded-lg transition-colors overflow-hidden"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
                      }}
                    >
                      <Phone
                        className="ml-3.5 h-4 w-4 text-slate-400 shrink-0 pointer-events-none"
                        aria-hidden="true"
                      />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="tel"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="+880 1700-000000"
                        autoComplete="tel"
                        aria-invalid={isInvalid}
                        className="w-full h-11 border-0 pl-2.5 pr-4 bg-transparent text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-0 aria-invalid:ring-0 aria-invalid:border-0 rounded-none"
                      />
                    </div>
                    <TealCornerNotch className="absolute top-0 right-0 w-3.5 h-3.5 text-primary pointer-events-none" />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Password + Confirm Password — two columns on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <form.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
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
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          required
                          placeholder="Create password"
                          autoComplete="new-password"
                          aria-invalid={isInvalid}
                          className="w-full h-11 border-0 pl-2.5 pr-11 bg-transparent text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-0 aria-invalid:ring-0 aria-invalid:border-0 rounded-none"
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
                      <TealCornerNotch className="absolute top-0 right-0 w-3.5 h-3.5 text-primary pointer-events-none" />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Confirm Password */}
            <form.Field name="confirmPassword">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="block text-xs sm:text-sm font-bold text-slate-800"
                    >
                      Confirm Password
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
                          type={showConfirm ? "text" : "password"}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          required
                          placeholder="Confirm password"
                          autoComplete="new-password"
                          aria-invalid={isInvalid}
                          className="w-full h-11 border-0 pl-2.5 pr-11 bg-transparent text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-0 aria-invalid:ring-0 aria-invalid:border-0 rounded-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          aria-label={
                            showConfirm
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 min-h-11 min-w-11 flex items-center justify-center cursor-pointer transition-colors"
                        >
                          {showConfirm ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
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
          </div>

          {/* Consent notice */}
          <p className="text-[11px] text-slate-500 leading-relaxed -mt-1">
            By creating an account, you consent to emergency geolocation
            broadcasting during active 999 dispatch alerts.
          </p>

          {/* Submit */}
          <div className="pt-1">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 min-h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base rounded-none flex items-center justify-between px-5 shadow-[0_3px_0_0_#0f766e] active:translate-y-0.5 active:shadow-none"
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
                {isPending ? "Creating Account..." : "Create Account"}
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

      {/* Continue with Google */}
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

      {/* Sign in link */}
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
  );
}

// ─── Step 2: OTP verification form ───────────────────────────────────────────

function OtpForm({ email }: { email: string }) {
  const router = useRouter();
  const { mutate: verifyEmailMutation, isPending } = useVerifyEmail();

  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const form = useForm({
    defaultValues: { otp: "" },
    onSubmit: async ({ value }) => {
      verifyEmailMutation(
        { email, otp: value.otp },
        {
          onSuccess: () => {
            toast.success("Email Verified!", {
              description: "Your account is active. Please sign in.",
            });
            router.push("/login");
          },
          onError: (err) => {
            toast.error("Verification Failed", {
              description:
                (err as { message?: string })?.message ||
                "Invalid or expired OTP. Please try again.",
            });
          },
        },
      );
    },
  });

  return (
    <div className="w-full flex flex-col items-center gap-5">
      {/* Icon + copy */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
          <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-black text-slate-900 tracking-tight">
          Check Your Email
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-slate-800">{email}</span>. Enter
          it below to activate your account.
        </p>
        <div
          className={`mt-3 flex items-center justify-center gap-1.5 text-sm ${
            timeLeft > 0 ? "text-slate-500" : "text-red-500 font-semibold"
          }`}
        >
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span>
            {timeLeft > 0
              ? `Code expires in ${formatTime(timeLeft)}`
              : "Code has expired. Please register again."}
          </span>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="w-full"
      >
        <FieldGroup>
          <form.Field name="otp">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="block text-xs sm:text-sm font-bold text-slate-800"
                  >
                    Verification Code
                  </FieldLabel>
                  <div className="relative">
                    <div
                      className="flex items-center bg-white border-2 border-slate-300 focus-within:border-primary rounded-lg transition-colors overflow-hidden"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
                      }}
                    >
                      <ShieldCheck
                        className="ml-3.5 h-4 w-4 text-slate-400 shrink-0 pointer-events-none"
                        aria-hidden="true"
                      />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(
                            e.target.value.replace(/\D/g, "").slice(0, 6),
                          )
                        }
                        onBlur={field.handleBlur}
                        required
                        placeholder="000000"
                        autoComplete="one-time-code"
                        aria-invalid={isInvalid}
                        className="w-full h-11 border-0 pl-2.5 pr-4 bg-transparent text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-0 aria-invalid:ring-0 aria-invalid:border-0 rounded-none tracking-widest font-mono"
                      />
                    </div>
                    <TealCornerNotch className="absolute top-0 right-0 w-3.5 h-3.5 text-primary pointer-events-none" />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <div className="pt-1">
            <Button
              type="submit"
              disabled={isPending || timeLeft <= 0}
              className="w-full h-12 min-h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base rounded-none flex items-center justify-between px-5 shadow-[0_3px_0_0_#0f766e] active:translate-y-0.5 active:shadow-none"
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
                {isPending ? "Verifying..." : "Verify Email"}
              </span>
              <ArrowRight
                className="h-4 w-4 text-white shrink-0"
                aria-hidden="true"
              />
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}

// ─── Main export — orchestrates the two steps ─────────────────────────────────

export function RegisterForm() {
  const [step, setStep] = useState<"details" | "otp">("details");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleDetailsSuccess = (email: string) => {
    setRegisteredEmail(email);
    setStep("otp");
  };

  if (step === "otp") {
    return <OtpForm email={registeredEmail} />;
  }

  return <DetailsForm onSuccess={handleDetailsSuccess} />;
}
