"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { TealCornerNotch } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/hooks";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/validations";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledEmail = searchParams.get("email") || "";
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useForm({
    defaultValues: {
      email: prefilledEmail,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    } as ResetPasswordFormValues,
    validators: {
      onBlur: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      resetPassword(value, {
        onSuccess: () => {
          toast.success("Password Updated Successfully!", {
            description: "You can now sign in with your new password.",
          });
          router.push("/login");
        },
        onError: (err) => {
          toast.error("Password Reset Failed", {
            description:
              err?.message || "Invalid OTP or something went wrong.",
          });
        },
      });
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
          {/* OTP Code Input */}
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
                    6-Digit OTP Code
                  </FieldLabel>
                  <div className="relative">
                    <div
                      className="flex items-center bg-white border-2 border-slate-300 focus-within:border-primary rounded-lg transition-colors overflow-hidden"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
                      }}
                    >
                      <KeyRound
                        className="ml-3.5 h-4 w-4 text-slate-400 shrink-0 pointer-events-none"
                        aria-hidden="true"
                      />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        maxLength={6}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        required
                        placeholder="e.g. 492815"
                        autoComplete="one-time-code"
                        aria-invalid={isInvalid}
                        className="w-full h-11 border-0 pl-2.5 pr-4 bg-transparent font-mono tracking-widest text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-0 aria-invalid:ring-0 aria-invalid:border-0 rounded-none"
                      />
                    </div>
                    <TealCornerNotch className="absolute top-0 right-0 w-3.5 h-3.5 text-primary pointer-events-none" />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* New Password */}
          <form.Field name="newPassword">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="block text-xs sm:text-sm font-bold text-slate-800"
                  >
                    New Password
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
                        placeholder="Create new password"
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Confirm New Password */}
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
                    Confirm New Password
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
                        placeholder="Confirm new password"
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 min-h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base rounded-none flex items-center justify-between px-5 shadow-[0_3px_0_0_#0f766e] active:translate-y-0.5 active:shadow-none"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
              }}
            >
              <CheckCircle2
                className="h-4 w-4 text-white shrink-0"
                aria-hidden="true"
              />
              <span className="flex-1 text-center font-bold">
                {isPending ? "Updating Password..." : "Reset & Sign In"}
              </span>
              {/* spacer for alignment */}
              <div className="w-4" aria-hidden="true" />
            </Button>
          </div>
        </FieldGroup>
      </form>

      <div className="mt-5 text-center text-xs sm:text-sm text-slate-500 font-medium">
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-1.5 text-primary font-bold hover:text-primary-dark hover:underline transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
