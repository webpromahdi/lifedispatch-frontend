"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Download,
  FileCheck,
  Lock,
  Receipt,
  Shield,
  Smartphone,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { seedPayments } from "@/lib/dummy/payments";
import { PaymentStatus } from "@/lib/types/enums";
import { formatBDT, formatDate } from "@/lib/utils";

export interface PatientPaymentViewProps {
  paymentId?: string;
}

export function PatientPaymentView({ paymentId = "pay_001" }: PatientPaymentViewProps) {
  const initialPayment =
    seedPayments.find((p) => p.id === paymentId) || seedPayments[1] || seedPayments[0];

  const [payment, setPayment] = useState(initialPayment);
  const [selectedMethod, setSelectedMethod] = useState<string>("BKASH");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handlePayNow = () => {
    setIsProcessing(true);
    toast.info("Redirecting to payment gateway...", {
      description: `Securing transaction for ${payment.invoiceNumber} via SSLCommerz.`,
    });

    setTimeout(() => {
      setIsProcessing(false);
      setPayment((prev) => ({
        ...prev,
        status: PaymentStatus.PAID,
        transactionId: `SSL_TXN_${Math.floor(100000000 + Math.random() * 900000000)}`,
        paymentConfirmedAt: new Date().toISOString(),
      }));
      toast.success("Payment Received!", {
        description: `Invoice ${payment.invoiceNumber} settled in full. Receipt generated.`,
      });
    }, 1200);
  };

  const handleDownloadReceipt = () => {
    toast.success("Receipt Downloaded", {
      description: `${payment.invoiceNumber}-receipt.pdf saved to downloads.`,
    });
  };

  const isPaid = payment.status === "PAID";

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Medical Transport Invoice & Billing"
        description="Official healthcare dispatch invoice, mileage breakdown, and clinical emergency services fee settlement."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/patient" },
          { label: "Billing", href: "/dashboard/patient/history" },
          { label: payment.invoiceNumber },
        ]}
        action={
          <Link href="/dashboard/patient">
            <Button variant="outline" size="sm" className="text-xs min-h-[38px] cursor-pointer">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
              Return to Portal
            </Button>
          </Link>
        }
      />

      {/* Main Invoice Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-bold text-text-primary">
                {payment.invoiceNumber}
              </h2>
            </div>
            <p className="text-xs text-text-secondary">
              LifeDispatch Emergency Medical Services • Reg #GOV-BD-EM-2026
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={payment.status} />
            {isPaid && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadReceipt}
                aria-label={`Download PDF receipt for invoice ${payment.invoiceNumber}`}
                className="h-8 text-xs cursor-pointer gap-1.5"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Download PDF</span>
              </Button>
            )}
          </div>
        </div>

        {/* Invoice Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-background border border-border text-xs">
          <div>
            <span className="text-text-muted block text-[11px]">Invoice Date</span>
            <span className="font-medium text-text-primary">
              {formatDate(payment.createdAt, "dd MMM yyyy")}
            </span>
          </div>

          <div>
            <span className="text-text-muted block text-[11px]">Trip Reference</span>
            <span className="font-mono font-medium text-text-primary">
              {payment.tripId}
            </span>
          </div>

          <div>
            <span className="text-text-muted block text-[11px]">Payment Method</span>
            <span className="font-medium text-text-primary">
              {payment.paymentMethod || selectedMethod}
            </span>
          </div>

          <div>
            <span className="text-text-muted block text-[11px]">Transaction ID</span>
            <span className="font-mono text-text-primary truncate block">
              {payment.transactionId || "Pending Gateway"}
            </span>
          </div>
        </div>

        {/* Itemized Charges Table (Accessibility: aria-label on amounts) */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Itemized Clinical Services & Mileage
          </h3>

          <div className="border border-border rounded-xl overflow-hidden divide-y divide-border text-xs">
            <div className="flex justify-between items-center p-3 bg-muted/40 font-medium text-text-secondary">
              <span>Service Description</span>
              <span>Amount (BDT)</span>
            </div>

            <div className="flex justify-between items-center p-3">
              <div>
                <span className="font-medium text-text-primary block">
                  Base Emergency Ambulance Dispatch
                </span>
                <span className="text-[11px] text-text-muted">
                  Includes paramedic crew dispatch & initial pre-hospital triage
                </span>
              </div>
              <span
                className="font-mono font-semibold text-text-primary"
                aria-label={`Base emergency dispatch fare: ${payment.baseFare} Bangladeshi Taka`}
              >
                {formatBDT(payment.baseFare)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3">
              <div>
                <span className="font-medium text-text-primary block">
                  Mileage Transport Surcharge
                </span>
                <span className="text-[11px] text-text-muted">
                  Traveled distance surcharge at standard tariff (12.6 km)
                </span>
              </div>
              <span
                className="font-mono font-semibold text-text-primary"
                aria-label={`Distance surcharge: ${payment.distanceCharge} Bangladeshi Taka`}
              >
                {formatBDT(payment.distanceCharge)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3">
              <div>
                <span className="font-medium text-text-primary block">
                  Onboard ALS Clinical Equipment & Oxygen Support
                </span>
                <span className="text-[11px] text-text-muted">
                  Cardiac telemetry & vitals monitoring (Subsidy applied)
                </span>
              </div>
              <span
                className="font-mono font-semibold text-status"
                aria-label="Onboard clinical equipment and oxygen support: 0 Bangladeshi Taka, included"
              >
                ৳0.00 (Included)
              </span>
            </div>

            <div className="flex justify-between items-center p-3">
              <div>
                <span className="font-medium text-text-primary block">
                  Govt Healthcare VAT / Healthcare Tax
                </span>
                <span className="text-[11px] text-text-muted">
                  Emergency life-support transport exempt (0% VAT)
                </span>
              </div>
              <span
                className="font-mono font-semibold text-text-secondary"
                aria-label="Government healthcare VAT: 0 Bangladeshi Taka, exempt"
              >
                ৳0.00
              </span>
            </div>

            {/* Total Row */}
            <div className="flex justify-between items-center p-4 bg-primary-light/40 border-t-2 border-primary/30">
              <div>
                <span className="text-sm font-bold text-text-primary block">
                  Total Settlement Amount
                </span>
                <span className="text-[11px] text-text-secondary">
                  Final payable in Bangladeshi Taka (BDT)
                </span>
              </div>
              <span
                className="text-lg font-bold text-primary font-mono"
                aria-label={`Total payable amount: ${payment.totalAmount} Bangladeshi Taka`}
              >
                {formatBDT(payment.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Gateways Selection (if unpaid) */}
        {!isPaid ? (
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Select Payment Method
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "BKASH", name: "bKash", icon: Smartphone },
                { id: "NAGAD", name: "Nagad", icon: Smartphone },
                { id: "CARD", name: "Debit / Credit Card", icon: CreditCard },
                { id: "ROCKET", name: "Rocket", icon: Smartphone },
              ].map((method) => (
                <button
                  type="button"
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    selectedMethod === method.id
                      ? "border-primary bg-primary-light/50 ring-2 ring-primary/20 shadow-xs"
                      : "border-border hover:border-border-strong bg-background"
                  }`}
                >
                  <method.icon className="h-4 w-4 text-primary mb-2" aria-hidden="true" />
                  <span className="font-semibold text-xs text-text-primary">
                    {method.name}
                  </span>
                  <span className="text-[10px] text-text-muted mt-0.5">
                    Instant Clearance
                  </span>
                </button>
              ))}
            </div>

            {/* Security Guarantee & Pay Button */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Lock className="h-4 w-4 text-status shrink-0" aria-hidden="true" />
                <span>
                  256-bit SSL encrypted PCI-DSS certified payment gateway.
                </span>
              </div>

              <Button
                onClick={handlePayNow}
                disabled={isProcessing}
                aria-label={`Pay now ${payment.totalAmount} Bangladeshi Taka via ${selectedMethod}`}
                className="w-full sm:w-auto min-h-[44px] px-8 bg-primary hover:bg-primary-dark text-white font-semibold text-xs cursor-pointer shadow-xs"
              >
                {isProcessing ? "Connecting to Gateway..." : `Pay Now ${formatBDT(payment.totalAmount)}`}
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-status-bg border border-status/30 flex items-center justify-between text-xs text-status-text">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-status shrink-0" aria-hidden="true" />
              <span>
                <strong>Paid in Full</strong> • Confirmation recorded in hospital billing ledger.
              </span>
            </div>
            <span className="font-mono text-[11px] text-text-muted">
              {formatDate(payment.paymentConfirmedAt, "hh:mm a")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
