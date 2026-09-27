import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | LifeDispatch",
  description:
    "Secure login portal for LifeDispatch patients and operational emergency staff.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="h-96 w-full flex items-center justify-center text-text-muted">
          Loading sign in...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
