"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Headphones,
  Receipt,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatBDT } from "@/lib/utils";

export function PaymentResultView() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status")?.toLowerCase() || "success";

  const isSuccess = statusParam === "success" || statusParam === "paid";
  const isFailed = statusParam === "failed" || statusParam === "fail";
  const isCancelled = statusParam === "cancelled" || statusParam === "cancel";

  const invoiceNumber = searchParams.get("invoice") || "INV-2026-000101";
  const amount = searchParams.get("amount") || "941";
  const transactionId = searchParams.get("txn") || "SSL_TXN_992817412";

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-8">
      {/* Top Bar */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6">
        <Link
          href="/"
          className="font-extrabold text-lg text-primary tracking-tight"
        >
          LifeDispatch
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <ShieldCheck className="h-4 w-4 text-status" aria-hidden="true" />
          <span>SSLCommerz Secured Gateway</span>
        </div>
      </header>

      {/* Main Status Container */}
      <main className="max-w-md w-full mx-auto my-auto">
        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs text-center">
          {/* SUCCESS STATE */}
          {isSuccess && (
            <div className="space-y-5">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="h-16 w-16 rounded-full bg-status-bg text-status-text flex items-center justify-center mx-auto shadow-xs"
              >
                <CheckCircle2
                  className="h-9 w-9 text-status"
                  aria-hidden="true"
                />
              </motion.div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-status-text bg-status-bg px-2.5 py-1 rounded-full border border-status/20">
                  Payment Verified
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mt-2">
                  Trip Fare Settled
                </h1>
                <p className="text-sm text-text-secondary mt-1">
                  Thank you! Your emergency transport invoice has been settled
                  via digital gateway.
                </p>
              </div>

              {/* Receipt Details Box */}
              <div className="bg-background border border-border rounded-xl p-4 text-left space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-text-muted pb-2 border-b border-border">
                  <span className="flex items-center gap-1.5 font-medium text-text-primary">
                    <Receipt
                      className="h-4 w-4 text-primary"
                      aria-hidden="true"
                    />
                    <span>Official Receipt</span>
                  </span>
                  <span className="font-mono text-[11px]">{invoiceNumber}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-text-secondary">Amount Settled:</span>
                  <span className="font-bold text-sm text-text-primary">
                    {formatBDT(amount)}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-text-secondary">Transaction Ref:</span>
                  <span className="font-mono text-text-primary text-[11px] truncate max-w-[180px]">
                    {transactionId}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-text-secondary">Payment Method:</span>
                  <span className="text-text-primary font-medium">
                    bKash Online / MFS
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/dashboard/patient">
                  <Button className="w-full min-h-[44px] h-11 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold rounded-lg shadow-xs cursor-pointer transition-colors">
                    <span>Return to Dashboard</span>
                    <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* FAILED STATE */}
          {isFailed && (
            <div className="space-y-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="h-16 w-16 rounded-full bg-destructive-bg text-destructive flex items-center justify-center mx-auto shadow-xs"
              >
                <XCircle
                  className="h-9 w-9 text-destructive"
                  aria-hidden="true"
                />
              </motion.div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-destructive bg-destructive-bg px-2.5 py-1 rounded-full border border-destructive/20">
                  Transaction Failed
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mt-2">
                  Payment Unsuccessful
                </h1>
                <p className="text-sm text-text-secondary mt-1">
                  The banking provider declined the transaction or network
                  timeout occurred. Your account has not been debited.
                </p>
              </div>

              <div className="pt-2 space-y-2.5">
                <Link href="/payment/result?status=success">
                  <Button className="w-full min-h-[44px] h-11 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold rounded-lg shadow-xs cursor-pointer transition-colors">
                    <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
                    <span>Try Again (Simulate Success)</span>
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={() =>
                    alert(
                      "LifeDispatch Emergency Billing Hotline: +880 2 999 111",
                    )
                  }
                  className="w-full min-h-[44px] h-11 border-border text-text-secondary hover:text-text-primary cursor-pointer"
                >
                  <Headphones className="h-4 w-4 mr-2" aria-hidden="true" />
                  <span>Contact Billing Support</span>
                </Button>
              </div>
            </div>
          )}

          {/* CANCELLED STATE */}
          {isCancelled && (
            <div className="space-y-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="h-16 w-16 rounded-full bg-warning-bg text-warning-foreground flex items-center justify-center mx-auto shadow-xs"
              >
                <AlertTriangle
                  className="h-9 w-9 text-warning"
                  aria-hidden="true"
                />
              </motion.div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-warning-foreground bg-warning-bg px-2.5 py-1 rounded-full border border-warning/30">
                  Cancelled
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mt-2">
                  Payment Session Cancelled
                </h1>
                <p className="text-sm text-text-secondary mt-1">
                  You cancelled the transaction before completing verification
                  on the gateway page.
                </p>
              </div>

              <div className="pt-2 space-y-2.5">
                <Link href="/payment/result?status=success">
                  <Button className="w-full min-h-[44px] h-11 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold rounded-lg shadow-xs cursor-pointer transition-colors">
                    <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
                    <span>Resume Payment</span>
                  </Button>
                </Link>

                <Link href="/dashboard/patient">
                  <Button
                    variant="outline"
                    className="w-full min-h-[44px] h-11 border-border text-text-secondary hover:text-text-primary cursor-pointer"
                  >
                    <span>Return to Dashboard</span>
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-text-muted max-w-md mx-auto pt-6">
        <p>
          In case of dispute, present reference number {transactionId} to
          hospital cashier.
        </p>
      </footer>
    </div>
  );
}
