import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | LifeDispatch",
  description:
    "Enter your OTP verification code to reset your account password.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="h-96 w-full flex items-center justify-center text-text-muted">
          Loading reset form...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
