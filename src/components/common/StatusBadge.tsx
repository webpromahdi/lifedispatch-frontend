"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

// Positive statuses that display a single green dot (#22C55E) per PRD §3.3 & color-design.md
const POSITIVE_STATUSES = new Set([
  "ACTIVE",
  "AVAILABLE",
  "ACCEPTING",
  "PAID",
  "COMPLETED",
  "ACCEPTED",
]);

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status?.toUpperCase() || "";
  const isPositive = POSITIVE_STATUSES.has(normalized);

  // Format label from SNAKE_CASE to Title Case
  const formattedLabel = normalized
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

  // Text color logic per design specifications
  let colorClasses = "text-text-secondary";

  if (isPositive) {
    colorClasses = "text-status-text font-medium";
  } else if (normalized === "TIMED_OUT") {
    colorClasses = "text-text-muted";
  } else if (normalized === "REASSIGNMENT_REQUIRED") {
    colorClasses = "text-amber-600 font-medium";
  } else if (
    [
      "FAILED",
      "CANCELLED",
      "REJECTED",
      "DELETED",
      "SUSPENDED",
      "CLOSED",
      "OUT_OF_SERVICE",
    ].includes(normalized)
  ) {
    colorClasses = "text-destructive font-medium";
  } else if (
    [
      "PENDING",
      "PENDING_ACCEPTANCE",
      "DISPATCHING",
      "PRIORITIZED",
      "DIVERTING",
    ].includes(normalized)
  ) {
    colorClasses = "text-text-primary font-medium";
  }

  return (
    <motion.span
      layout
      transition={{ duration: 0.2 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border border-border bg-surface shadow-xs transition-colors",
        colorClasses,
        className,
      )}
    >
      {isPositive && (
        <span
          className="h-1.5 w-1.5 rounded-full bg-status shrink-0 animate-pulse"
          aria-hidden="true"
        />
      )}
      <span>{formattedLabel}</span>
    </motion.span>
  );
}
