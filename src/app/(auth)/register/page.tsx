import type { Metadata } from "next";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account | LifeDispatch",
  description:
    "Register for LifeDispatch emergency medical service and rapid ambulance dispatching.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
