import { type ClassValue, clsx } from "clsx";
import { format, isValid } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: string | Date | null | undefined,
  pattern: string = "MMM dd, yyyy hh:mm a",
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (!isValid(d)) return "—";
  return format(d, pattern);
}

export function formatBDT(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount)))
    return "৳0";
  return `৳${Number(amount).toLocaleString("en-BD", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

/**
 * Calculates Haversine distance in kilometers between two GPS coordinates
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Calculates ambulance dispatch score based on PRD §Feature Set 4
 * Distance (weight 0.5), Priority match (weight 0.3), Type match (weight 0.2)
 */
export function calculateDispatchScore(params: {
  distanceKm: number;
  maxDistanceKm?: number;
  capabilityMatch: "EXACT" | "OVERQUALIFIED" | "UNDERQUALIFIED";
  typeMatch: "EXACT" | "OVERQUALIFIED";
}): {
  compositeScore: number;
  distanceScore: number;
  priorityScore: number;
  typeScore: number;
} {
  const maxDist = params.maxDistanceKm || 25;
  const distanceScore = Math.max(0, 1 - params.distanceKm / maxDist);

  const priorityScore =
    params.capabilityMatch === "EXACT"
      ? 1.0
      : params.capabilityMatch === "OVERQUALIFIED"
        ? 0.8
        : 0.5;

  const typeScore = params.typeMatch === "EXACT" ? 1.0 : 0.8;

  const compositeScore =
    Math.round(
      (distanceScore * 0.5 + priorityScore * 0.3 + typeScore * 0.2) * 1000,
    ) / 1000;

  return {
    compositeScore,
    distanceScore: Math.round(distanceScore * 100) / 100,
    priorityScore,
    typeScore,
  };
}
