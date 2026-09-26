import type { PaymentStatus } from "./enums";

export interface Payment {
  id: string;
  tripId: string;
  patientId: string;
  invoiceNumber: string;
  status: PaymentStatus;
  currency: string;
  baseFare: number;
  distanceCharge: number;
  waitingCharge: number;
  additionalCharges: number;
  discount: number;
  totalAmount: number;
  transactionId: string | null;
  paymentMethod: string | null;
  paymentInitiatedAt: string | null;
  paymentConfirmedAt: string | null;
  gatewayUrl: string | null;
  refundAmount: number | null;
  refundReason: string | null;
  refundedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
