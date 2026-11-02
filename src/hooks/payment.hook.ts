import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPaymentById, initiatePayment } from "@/api/payment.api";

export function useGetPaymentById(
  paymentId?: string,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: ["payment", paymentId],
    queryFn: () => getPaymentById(paymentId as string),
    enabled: Boolean(paymentId) && (options?.enabled ?? true),
    ...options,
  });
}

export function useInitiatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) => initiatePayment(paymentId),
    onSuccess: (_data, paymentId) => {
      queryClient.invalidateQueries({ queryKey: ["payment", paymentId] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}
