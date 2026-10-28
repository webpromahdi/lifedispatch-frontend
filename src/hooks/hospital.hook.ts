import { useQuery } from "@tanstack/react-query";
import { getHospitalById, getHospitals } from "@/api";
import type { GetHospitalsParams } from "@/lib/types/hospital.types";

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
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["hospitals", id],
    queryFn: () => getHospitalById(id as string),
    enabled: Boolean(id) && (options?.enabled ?? true),
  });
}

