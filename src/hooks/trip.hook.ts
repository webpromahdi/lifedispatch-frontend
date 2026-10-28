import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  completeTrip,
  getMyTrips,
  getTripById,
  selectTripHospital,
  updateTripStatus,
} from "@/api";
import type {
  CompleteTripPayload,
  GetDriverTripsParams,
  SelectHospitalPayload,
  UpdateTripStatusPayload,
} from "@/lib/types/trip.types";

export function useGetTripById(id?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["trips", id],
    queryFn: () => getTripById(id as string),
    enabled: Boolean(id) && (options?.enabled ?? true),
  });
}

export function useGetMyTrips(
  params?: GetDriverTripsParams,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: ["trips", "me", params],
    queryFn: () => getMyTrips(params),
    ...options,
  });
}

export function useUpdateTripStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTripStatusPayload;
    }) => updateTripStatus(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trips", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["trips", "me"] });
    },
  });
}

export function useSelectTripHospital() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SelectHospitalPayload;
    }) => selectTripHospital(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trips", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["trips", "me"] });
    },
  });
}

export function useCompleteTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CompleteTripPayload;
    }) => completeTrip(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["trips", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["trips", "me"] });
      queryClient.invalidateQueries({ queryKey: ["dispatch"] });
      queryClient.invalidateQueries({ queryKey: ["emergencies"] });
      queryClient.invalidateQueries({ queryKey: ["ambulances"] });
    },
  });
}
