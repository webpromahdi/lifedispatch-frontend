"use client";

import type { EmergencyPriority } from "@/lib/types/enums";
import { cn } from "@/lib/utils";

export interface PriorityBadgeProps {
  priority: EmergencyPriority | string | null | undefined;
  className?: string;
  variant?: "default" | "square" | "compact";
}

export function PriorityBadge({
  priority,
  className,
  variant = "default",
}: PriorityBadgeProps) {
  if (!priority) {
    if (variant === "square") {
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary",
            className,
          )}
        >
          <span className="w-2 h-2 bg-text-muted shrink-0" />
          <span>Unset</span>
        </span>
      );
    }
    return (
      <span className={cn("text-xs text-text-muted", className)}>
        Unassigned
      </span>
    );
  }

  const p = priority.toUpperCase();

  if (variant === "square") {
    if (p.includes("P1") || p === "P1_CRITICAL") {
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-bold text-[#DC2626]",
            className,
          )}
        >
          <span className="w-2 h-2 bg-[#DC2626] shrink-0" />
          <span>P1</span>
        </span>
      );
    }
    if (p.includes("P2") || p === "P2_EMERGENCY") {
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706]",
            className,
          )}
        >
          <span className="w-2 h-2 bg-[#D97706] shrink-0" />
          <span>P2</span>
        </span>
      );
    }
    const label = p.includes("P3") ? "P3" : p.includes("P4") ? "P4" : "P5";
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary",
          className,
        )}
      >
        <span className="w-2 h-2 bg-text-muted shrink-0" />
        <span>{label}</span>
      </span>
    );
  }

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
    <span
      className={cn(
        "inline-flex items-center text-xs tracking-tight",
        textColor,
        className,
      )}
    >
      {label}
    </span>
  );
}
