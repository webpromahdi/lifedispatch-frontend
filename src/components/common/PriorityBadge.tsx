"use client";

import { motion } from "framer-motion";
import type { EmergencyPriority } from "@/lib/types/enums";
import { cn } from "@/lib/utils";

export interface PriorityBadgeProps {
  priority: EmergencyPriority | string | null | undefined;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  if (!priority) {
    return (
      <span className={cn("text-xs text-text-muted", className)}>
        Unassigned
      </span>
    );
  }

  const p = priority.toUpperCase();

  let textColor = "text-text-muted";
  let label = priority;

  if (p.includes("P1") || p === "P1_CRITICAL") {
    textColor = "text-destructive font-semibold";
    label = "P1 Critical";
  } else if (p.includes("P2") || p === "P2_EMERGENCY") {
    textColor = "text-orange-600 font-semibold";
    label = "P2 Emergency";
  } else if (p.includes("P3") || p === "P3_URGENT") {
    textColor = "text-amber-600 font-medium";
    label = "P3 Urgent";
  } else if (p.includes("P4") || p === "P4_NON_URGENT") {
    textColor = "text-text-secondary font-medium";
    label = "P4 Non-Urgent";
  } else if (p.includes("P5") || p === "P5_ROUTINE") {
    textColor = "text-text-muted font-medium";
    label = "P5 Routine";
  }

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "inline-flex items-center text-xs tracking-tight",
        textColor,
        className,
      )}
    >
      {label}
    </motion.span>
  );
}
