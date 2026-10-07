"use client";
import { useForm } from "@tanstack/react-form";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
import { useLogin } from "@/hooks";
import { DEMO_ROLES } from "@/lib/demo-roles";
import { loginSchema } from "@/validations";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const { mutate: login, isPending: loginPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onBlur: loginSchema,
    },
    onSubmit: async ({ value }) => {
      const loginData = {
        email: value.email,
        password: value.password,
      };

      login(loginData, {
        onSuccess: () => {
          toast.success("Login Successful", {
            description: "Welcome back!",
          });
          router.push("/");
        },
        onError: (err: any) => {
          toast.error("Authorization Failure", {
            description: err?.message || "Something went wrong. Please try again.",
          });
        },
      });
    },
  });

  useEffect(() => {
    const demo = searchParams.get("demo");
    if (demo) {
      const role = DEMO_ROLES.find((r) => r.name === demo);
      if (role) {
        // Auto-fill the form fields
        form.setFieldValue("email", role.email);
        form.setFieldValue("password", role.password);

        // Clear the query parameter without refreshing the page
        router.replace("/login", { scroll: false });
      }
    }
  }, [searchParams, form, router]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="w-full"
    >
      <FieldGroup>
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
                      onChange={(e) => field.handleChange(e.target.value)}
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
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

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
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        {/* Login Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={loginPending}
            className="w-full h-12 min-h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base rounded-none flex items-center justify-between px-5 shadow-[0_3px_0_0_#0f766e] active:translate-y-0.5 active:shadow-none"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            }}
          >
            <Lock className="h-4 w-4 text-white shrink-0" aria-hidden="true" />
            <span className="flex-1 text-center font-bold">
              {loginPending ? "Logging in..." : "Login"}
            </span>
            <ArrowRight
              className="h-4 w-4 text-white shrink-0"
              aria-hidden="true"
            />
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
