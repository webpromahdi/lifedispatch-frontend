import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | LifeDispatch",
  description:
    "Request an OTP verification code to reset your LifeDispatch credentials.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
