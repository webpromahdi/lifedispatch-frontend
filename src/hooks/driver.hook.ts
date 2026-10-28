import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDriver,
  getDrivers,
  toggleDriverShift,
  updateDriver,
} from "@/api";
import type {
  CreateDriverPayload,
  GetDriversParams,
  UpdateDriverPayload,
} from "@/lib/types/driver.types";

export function useGetDrivers(
  params?: GetDriversParams,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: ["drivers", params],
    queryFn: () => getDrivers(params),
    ...options,
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDriverPayload) => createDriver(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
}

export function useUpdateDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDriverPayload;
    }) => updateDriver(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["drivers", variables.id] });
    },
  });
}

export function useToggleDriverShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: "start" | "end") => toggleDriverShift(action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
}

