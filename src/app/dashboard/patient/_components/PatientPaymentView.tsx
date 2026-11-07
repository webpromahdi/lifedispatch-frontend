"use client";

import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Download,
  Lock,
  Receipt,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { useGetPaymentById, useInitiatePayment } from "@/hooks";
import { PaymentStatus } from "@/lib/types/enums";
import { formatBDT, formatDate } from "@/lib/utils";

export interface PatientPaymentViewProps {
  paymentId?: string;
}

export function PatientPaymentView({ paymentId }: PatientPaymentViewProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("BKASH");
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const {
    data: paymentResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPaymentById(paymentId, {
    enabled: Boolean(paymentId),
  });

  const { mutate: initiatePaymentMutate, isPending: isInitiating } =
    useInitiatePayment();

  const payment = paymentResponse?.data;

  const handlePayNow = () => {
    if (!paymentId) {
      toast.error("Invalid payment ID.");
      return;
    }

    toast.info("Connecting to payment gateway...", {
      description: `Securing transaction for ${payment?.invoiceNumber ?? "invoice"} via SSLCommerz.`,
    });

    initiatePaymentMutate(paymentId, {
      onSuccess: (res) => {
        if (res.data?.gatewayUrl) {
          window.location.href = res.data.gatewayUrl;
        } else {
          toast.error("Payment Gateway Error", {
            description: "No gateway URL received from server.",
          });
        }
      },
      onError: (err) => {
        toast.error("Payment Gateway Error", {
          description:
            err instanceof Error
              ? err.message
              : "Unable to connect to payment gateway. Please try again.",
        });
      },
    });
  };

  const handleDownloadReceipt = async () => {
    if (!payment) return;
    try {
      setIsDownloading(true);
      toast.info("Downloading receipt...", {
        description: "Preparing your official medical dispatch invoice PDF.",
      });

      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${baseUrl}/payment/${payment.id}/invoice`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Server failed to generate PDF.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${payment.invoiceNumber}-receipt.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Receipt Downloaded", {
        description: `${payment.invoiceNumber}-receipt.pdf saved to downloads.`,
      });
    } catch (err) {
      console.error("PDF download failed, using print fallback:", err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded-none" />
          <div className="h-4 w-96 bg-muted rounded-none" />
        </div>
        <div className="bg-surface border border-border rounded-none p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center pb-6 border-b border-border">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-muted rounded-none" />
              <div className="h-3 w-64 bg-muted rounded-none" />
            </div>
            <div className="h-6 w-24 bg-muted rounded-none" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-background border border-border">
            {[
              "sk-meta-date",
              "sk-meta-trip",
              "sk-meta-method",
              "sk-meta-txn",
            ].map((id) => (
              <div key={id} className="space-y-1">
                <div className="h-3 w-16 bg-muted rounded-none" />
                <div className="h-4 w-24 bg-muted rounded-none" />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <div className="h-4 w-40 bg-muted rounded-none" />
            <div className="border border-border divide-y divide-border">
              {[
                "sk-charge-head",
                "sk-charge-base",
                "sk-charge-dist",
                "sk-charge-total",
              ].map((id) => (
                <div key={id} className="h-10 bg-muted/40" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !payment) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <PageHeader
          title="Medical Transport Invoice & Billing"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/patient" },
            { label: "Billing", href: "/dashboard/patient/history" },
            { label: "Error" },
          ]}
          action={
            <Link href="/dashboard/patient">
              <Button
                variant="outline"
                size="sm"
                className="text-xs min-h-9.5 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                Return to Portal
              </Button>
            </Link>
          }
        />
        <div className="bg-surface border border-destructive/30 rounded-none p-6 sm:p-8 text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-destructive-bg text-destructive flex items-center justify-center rounded-none">
            <Receipt className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-text-primary">
              Invoice Not Found
            </h2>
            <p className="text-xs text-text-secondary max-w-md mx-auto">
              {error instanceof Error
                ? error.message
                : "Unable to retrieve invoice details. The invoice record may have expired or you may not be authorized to view it."}
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="text-xs cursor-pointer"
            >
              Retry Loading
            </Button>
            <Link href="/dashboard/patient">
              <Button size="sm" className="text-xs cursor-pointer">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isPaid = payment.paymentStatus === PaymentStatus.PAID;

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
            <Button
              variant="outline"
              size="sm"
              className="text-xs min-h-9.5 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
              Return to Portal
            </Button>
          </Link>
        }
      />

      {/* Main Invoice Card */}
      <div className="bg-surface border border-border rounded-none p-6 sm:p-8 shadow-xs space-y-6">
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
            <StatusBadge status={payment.paymentStatus} />
            {isPaid && (
              <Button
                variant="outline"
                size="sm"
                disabled={isDownloading}
                onClick={handleDownloadReceipt}
                aria-label={`Download PDF receipt for invoice ${payment.invoiceNumber}`}
                className="h-8 text-xs cursor-pointer gap-1.5"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{isDownloading ? "Downloading..." : "Download PDF"}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Invoice Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-none bg-background border border-border text-xs">
          <div>
            <span className="text-text-muted block text-[11px]">
              Invoice Date
            </span>
            <span className="font-medium text-text-primary">
              {formatDate(payment.createdAt, "dd MMM yyyy")}
            </span>
          </div>

          <div>
            <span className="text-text-muted block text-[11px]">
              Trip Reference
            </span>
            <span className="font-mono font-medium text-text-primary">
              {payment.trip?.id ?? payment.tripId}
            </span>
          </div>

          <div>
            <span className="text-text-muted block text-[11px]">
              Payment Method
            </span>
            <span className="font-medium text-text-primary">
              {payment.paymentMethod || selectedMethod}
            </span>
          </div>

          <div>
            <span className="text-text-muted block text-[11px]">
              Transaction ID
            </span>
            <span className="font-mono text-text-primary truncate block">
              {payment.transactionId || "Pending Gateway"}
            </span>
          </div>
        </div>

        {/* Itemized Charges Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Itemized Clinical Services & Mileage
          </h3>

          <div className="border border-border rounded-none overflow-hidden divide-y divide-border text-xs">
            <div className="flex justify-between items-center p-3 bg-muted/40 font-medium text-text-secondary">
              <span>Service Description</span>
              <span>Amount ({payment.currency || "BDT"})</span>
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
              <div className="font-mono font-semibold text-text-primary">
                {formatBDT(payment.baseFare)}
              </div>
            </div>

            <div className="flex justify-between items-center p-3">
              <div>
                <span className="font-medium text-text-primary block">
                  Mileage Transport Surcharge
                </span>
                <span className="text-[11px] text-text-muted">
                  Traveled distance surcharge at standard tariff
                </span>
              </div>
              <div className="font-mono font-semibold text-text-primary">
                {formatBDT(payment.distanceCharge)}
              </div>
            </div>

            {Number(payment.waitingCharge) > 0 && (
              <div className="flex justify-between items-center p-3">
                <div>
                  <span className="font-medium text-text-primary block">
                    On-Scene Waiting Charge
                  </span>
                  <span className="text-[11px] text-text-muted">
                    Standby duration during on-scene medical stabilization
                  </span>
                </div>
                <div className="font-mono font-semibold text-text-primary">
                  {formatBDT(payment.waitingCharge)}
                </div>
              </div>
            )}

            {Number(payment.additionalCharges) > 0 && (
              <div className="flex justify-between items-center p-3">
                <div>
                  <span className="font-medium text-text-primary block">
                    Additional Clinical Charges
                  </span>
                  <span className="text-[11px] text-text-muted">
                    Supplemental emergency interventions applied during transit
                  </span>
                </div>
                <div className="font-mono font-semibold text-text-primary">
                  {formatBDT(payment.additionalCharges)}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center p-3">
              <div>
                <span className="font-medium text-text-primary block">
                  Onboard ALS Clinical Equipment & Oxygen Support
                </span>
                <span className="text-[11px] text-text-muted">
                  Cardiac telemetry & vitals monitoring (Subsidy applied)
                </span>
              </div>
              <div className="font-mono font-semibold text-status">
                ৳0.00 (Included)
              </div>
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
              <div className="font-mono font-semibold text-text-secondary">
                ৳0.00
              </div>
            </div>

            {/* Total Row */}
            <div className="flex justify-between items-center p-4 bg-primary-light/40 border-t-2 border-primary/30">
              <div>
                <span className="text-sm font-bold text-text-primary block">
                  Total Settlement Amount
                </span>
                <span className="text-[11px] text-text-secondary">
                  Final payable in Bangladeshi Taka ({payment.currency || "BDT"}
                  )
                </span>
              </div>
              <div className="text-lg font-bold text-primary font-mono">
                {formatBDT(payment.totalAmount)}
              </div>
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
                  className={`p-3 rounded-none border text-left flex flex-col justify-between cursor-pointer ${
                    selectedMethod === method.id
                      ? "border-primary bg-primary-light/50 ring-2 ring-primary/20 shadow-xs"
                      : "border-border hover:border-border-strong bg-background"
                  }`}
                >
                  <method.icon
                    className="h-4 w-4 text-primary mb-2"
                    aria-hidden="true"
                  />
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
                <Lock
                  className="h-4 w-4 text-status shrink-0"
                  aria-hidden="true"
                />
                <span>
                  256-bit SSL encrypted PCI-DSS certified payment gateway.
                </span>
              </div>

              <Button
                onClick={handlePayNow}
                disabled={isInitiating}
                aria-label={`Pay now ${payment.totalAmount} Bangladeshi Taka via ${selectedMethod}`}
                className="w-full sm:w-auto min-h-11 px-8 bg-primary hover:bg-primary-dark text-white font-semibold text-xs cursor-pointer shadow-xs"
              >
                {isInitiating
                  ? "Connecting to Gateway..."
                  : `Pay Now ${formatBDT(payment.totalAmount)}`}
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-none bg-status-bg border border-status/30 flex items-center justify-between text-xs text-status-text">
            <div className="flex items-center gap-2">
              <CheckCircle2
                className="h-5 w-5 text-status shrink-0"
                aria-hidden="true"
              />
              <span>
                <strong>Paid in Full</strong> • Confirmation recorded in
                hospital billing ledger.
              </span>
            </div>
            <span className="font-mono text-[11px] text-text-muted">
              {payment.paymentConfirmedAt
                ? formatDate(payment.paymentConfirmedAt, "hh:mm a")
                : "Confirmed"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
