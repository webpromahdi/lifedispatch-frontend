import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createHospitalStaff,
  deleteHospitalStaff,
  getHospitalById,
  getHospitalInboundTrips,
  getHospitalStaff,
  getHospitals,
  getMyHospitalStaffProfile,
  toggleHospitalStaffShift,
  updateHospital,
  updateHospitalDiversion,
  updateHospitalStaff,
} from "@/api";
import type {
  CreateHospitalStaffPayload,
  GetHospitalStaffParams,
  GetHospitalsParams,
  ToggleStaffShiftPayload,
  UpdateDiversionPayload,
  UpdateHospitalPayload,
  UpdateHospitalStaffPayload,
} from "@/lib/types/hospital.types";

export function useGetHospitals(
  params?: GetHospitalsParams,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: ["hospitals", params],
    queryFn: () => getHospitals(params),
    ...options,
  });
}

export function useGetHospitalById(
  id?: string,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: ["hospitals", id],
    queryFn: () => getHospitalById(id as string),
    enabled: Boolean(id) && (options?.enabled ?? true),
    ...options,
  });
}

export function useGetMyHospitalStaffProfile(options?: {
  enabled?: boolean;
  refetchInterval?: number | false;
}) {
  return useQuery({
    queryKey: ["hospitals", "staff", "me"],
    queryFn: () => getMyHospitalStaffProfile(),
    ...options,
  });
}

export function useUpdateHospital() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateHospitalPayload;
    }) => updateHospital(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["hospitals", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["hospitals", "staff", "me"],
      });
      queryClient.invalidateQueries({
        queryKey: ["hospitals"],
      });
    },
  });
}

export function useUpdateHospitalDiversion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDiversionPayload;
    }) => updateHospitalDiversion(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["hospitals", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["hospitals", "staff", "me"],
      });
      queryClient.invalidateQueries({
        queryKey: ["hospitals"],
      });
    },
  });
}

export function useToggleHospitalStaffShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ToggleStaffShiftPayload) =>
      toggleHospitalStaffShift(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["hospitals", "staff", "me"],
      });
      queryClient.invalidateQueries({
        queryKey: ["hospitals"],
      });
    },
  });
}

export function useGetHospitalStaff(
  hospitalId?: string,
  params?: GetHospitalStaffParams,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: ["hospitals", hospitalId, "staff", params],
    queryFn: () => getHospitalStaff(hospitalId as string, params),
    enabled: Boolean(hospitalId) && (options?.enabled ?? true),
    ...options,
  });
}

export function useCreateHospitalStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      hospitalId,
      payload,
    }: {
      hospitalId: string;
      payload: CreateHospitalStaffPayload;
    }) => createHospitalStaff(hospitalId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["hospitals", variables.hospitalId, "staff"],
      });
    },
  });
}

export function useUpdateHospitalStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      hospitalId,
      staffId,
      payload,
    }: {
      hospitalId: string;
      staffId: string;
      payload: UpdateHospitalStaffPayload;
    }) => updateHospitalStaff(hospitalId, staffId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["hospitals", variables.hospitalId, "staff"],
      });
    },
  });
}

export function useDeleteHospitalStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      hospitalId,
      staffId,
    }: {
      hospitalId: string;
      staffId: string;
    }) => deleteHospitalStaff(hospitalId, staffId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["hospitals", variables.hospitalId, "staff"],
      });
    },
  });
}

export function useGetHospitalInboundTrips(
  hospitalId?: string,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: ["hospitals", hospitalId, "inbound"],
    queryFn: () => getHospitalInboundTrips(hospitalId as string),
    enabled: Boolean(hospitalId) && (options?.enabled ?? true),
    ...options,
  });
}
