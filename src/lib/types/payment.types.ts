import type { PaymentStatus } from "./enums";

export interface PaymentTrip {
  id: string;
  status: string;
}

export interface PaymentPatient {
  id: string;
  name: string;
  email: string;
}

export interface Payment {
  id: string;
  tripId: string;
  patientId: string;
  invoiceNumber: string;
  paymentStatus: PaymentStatus;
  status?: PaymentStatus;
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
  refundAmount: number | null;
  refundReason: string | null;
  refundedAt: string | null;
  createdAt: string;
  updatedAt: string;
  trip?: PaymentTrip;
  patient?: PaymentPatient;
}

export interface InitiatePaymentResult {
  gatewayUrl: string;
  transactionId: string;
}
