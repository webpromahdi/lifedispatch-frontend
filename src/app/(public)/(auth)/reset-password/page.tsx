import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import {
  CircuitTraceLeft,
  CircuitTraceRight,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Reset Password | LifeDispatch",
  description:
    "Verify your OTP and create a new secure password for your LifeDispatch account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="w-full flex flex-col">
      <div className="relative w-full">
        {/* Ambient horizontal circuit trace lines (desktop only) */}
        <div
          className="hidden lg:block absolute inset-0 pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          {/* Left trace */}
          <CircuitTraceLeft className="absolute top-21.5 left-0 w-[calc(50%-280px)] h-6 text-primary/40" />
          {/* Right trace */}
          <CircuitTraceRight className="absolute top-21.5 right-0 w-[calc(50%-280px)] h-6 text-primary/40" />
        </div>

        {/* Centered Card */}
        <div className="relative z-10 w-full flex justify-center py-6 sm:py-8 lg:py-10">
          <div className="relative w-full max-w-135 filter drop-shadow-[0_8px_24px_rgba(20,184,166,0.12)]">
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
                {/* Heading */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    Enter Verification OTP
                  </h1>
                  <p className="text-sm sm:text-[15px] text-slate-500 font-normal mt-1.5">
                    Enter your 6-digit security OTP code along with your new password.
                  </p>
                </div>

                <Suspense
                  fallback={
                    <div className="h-48 w-full flex items-center justify-center text-slate-400 text-sm">
                      Loading...
                    </div>
                  }
                >
                  <ResetPasswordForm />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
