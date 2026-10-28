import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAmbulance,
  getAmbulanceById,
  getAmbulances,
  updateAmbulance,
  updateAmbulanceStatus,
} from "@/api";
import type {
  CreateAmbulancePayload,
  GetAmbulancesParams,
  UpdateAmbulancePayload,
} from "@/lib/types/ambulance.types";
import type { AmbulanceStatus } from "@/lib/types/enums";

export function useGetAmbulances(
  params?: GetAmbulancesParams,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: ["ambulances", params],
    queryFn: () => getAmbulances(params),
    ...options,
  });
}

export function useGetAmbulanceById(
  id?: string,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: ["ambulances", id],
    queryFn: () => getAmbulanceById(id as string),
    enabled: Boolean(id) && (options?.enabled ?? true),
    ...options,
  });
}

export function useCreateAmbulance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAmbulancePayload) => createAmbulance(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ambulances"] });
    },
  });
}

export function useUpdateAmbulance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAmbulancePayload;
    }) => updateAmbulance(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ambulances"] });
      queryClient.invalidateQueries({ queryKey: ["ambulances", variables.id] });
    },
  });
}

export function useUpdateAmbulanceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: AmbulanceStatus;
    }) => updateAmbulanceStatus(id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ambulances"] });
      queryClient.invalidateQueries({ queryKey: ["ambulances", variables.id] });
    },
  });
}

