"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useForgotPassword } from "@/hooks";
import {
  type ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/validations";

export function ForgotPasswordForm() {
  const router = useRouter();
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const form = useForm({
    defaultValues: {
      email: "",
    } as ForgotPasswordFormValues,
    validators: {
      onBlur: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      forgotPassword(value, {
        onSuccess: () => {
          toast.success("Security OTP Dispatched", {
            description: `A 6-digit verification code has been sent to ${value.email}`,
          });
          router.push(
            `/reset-password?email=${encodeURIComponent(value.email)}`,
          );
        },
        onError: (err) => {
          toast.error("Failed to send OTP", {
            description:
              err?.message || "Something went wrong. Please try again.",
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
                    Account Email Address
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
                        placeholder="name@example.com"
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
              <span className="flex-1 text-center font-bold">
                {isPending ? "Generating OTP..." : "Send OTP Verification"}
              </span>
              <ArrowRight
                className="h-4 w-4 text-white shrink-0"
                aria-hidden="true"
              />
            </Button>
          </div>
        </FieldGroup>
      </form>

      <div className="mt-5 text-center text-xs sm:text-sm text-slate-500 font-medium">
        Remembered your password?{" "}
        <Link
          href="/login"
          className="text-primary font-bold hover:text-primary-dark hover:underline transition-colors ml-0.5"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
