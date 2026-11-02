import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/lib/types/emergency.types";
import type { InitiatePaymentResult, Payment } from "@/lib/types/payment.types";

export function getPaymentById(paymentId: string) {
  return apiClient<ApiResponse<Payment>>(`/payment/${paymentId}`, {
    method: "GET",
  });
}

export function initiatePayment(paymentId: string) {
  return apiClient<ApiResponse<InitiatePaymentResult>>(
    `/payment/${paymentId}/initiate`,
    {
      method: "POST",
    },
  );
}
