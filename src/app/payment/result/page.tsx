import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentResultView } from "@/components/views/PaymentResultView";

export const metadata: Metadata = {
  title: "Payment Confirmation | LifeDispatch",
  description:
    "Official digital receipt and payment status for LifeDispatch emergency transport services.",
};

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-text-muted">
          Verifying payment gateway response...
        </div>
      }
    >
      <PaymentResultView />
    </Suspense>
  );
}
