import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptDispatch,
  cancelDispatch,
  createDispatch,
  getDispatchById,
  getMyPendingDispatches,
  recommendAmbulances,
  rejectDispatch,
} from "@/api";
import type { CreateDispatchPayload } from "@/lib/types/dispatch.types";

export function useRecommendAmbulances() {
  return useMutation({
    mutationFn: (emergencyId: string) => recommendAmbulances(emergencyId),
  });
}

export function useCreateDispatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDispatchPayload) => createDispatch(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergencies"] });
      queryClient.invalidateQueries({ queryKey: ["dispatch"] });
    },
  });
}

export function useCancelDispatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      cancelDispatch(id, { reason }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["emergencies"] });
      queryClient.invalidateQueries({ queryKey: ["dispatch"] });
      queryClient.invalidateQueries({ queryKey: ["dispatch", variables.id] });
    },
  });
}

export function useGetDispatchById(
  id?: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["dispatch", id],
    queryFn: () => getDispatchById(id as string),
    enabled: Boolean(id) && (options?.enabled ?? true),
  });
}

export function useGetMyPendingDispatches(options?: {
  refetchInterval?: number | false;
}) {
  return useQuery({
    queryKey: ["dispatch", "me"],
    queryFn: getMyPendingDispatches,
    ...options,
  });
}

export function useAcceptDispatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => acceptDispatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispatch"] });
      queryClient.invalidateQueries({ queryKey: ["emergencies"] });
    },
  });
}

export function useRejectDispatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectDispatch(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispatch"] });
      queryClient.invalidateQueries({ queryKey: ["emergencies"] });
    },
  });
}
