import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelEmergency,
  createEmergency,
  getEmergencies,
  getEmergencyById,
  updateEmergencyPriority,
} from "@/api";
import type {
  CreateEmergencyPayload,
  GetEmergenciesParams,
} from "@/lib/types/emergency.types";
import type { EmergencyPriority } from "@/lib/types/enums";

export function useGetEmergencies(
  params?: GetEmergenciesParams,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: ["emergencies", params],
    queryFn: () => getEmergencies(params),
    ...options,
  });
}

export function useGetEmergencyById(
  id?: string,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: ["emergencies", id],
    queryFn: () => getEmergencyById(id as string),
    enabled: Boolean(id) && (options?.enabled ?? true),
    ...options,
  });
}

export function useCreateEmergency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEmergencyPayload) => createEmergency(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergencies"] });
    },
  });
}

export function useUpdateEmergencyPriority() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      priority,
    }: {
      id: string;
      priority: EmergencyPriority;
    }) => updateEmergencyPriority(id, priority),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["emergencies"] });
      queryClient.invalidateQueries({
        queryKey: ["emergencies", variables.id],
      });
    },
  });
}

export function useCancelEmergency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      cancelEmergency(id, reason),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["emergencies"] });
      queryClient.invalidateQueries({
        queryKey: ["emergencies", variables.id],
      });
    },
  });
}
