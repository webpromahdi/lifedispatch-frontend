"use client";

import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: string;
  className?: string;
  variant?: "default" | "square";
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

export function StatusBadge({
  status,
  className,
  variant = "default",
}: StatusBadgeProps) {
  const normalized = status?.toUpperCase() || "";
  const isPositive = POSITIVE_STATUSES.has(normalized);

  // Format label from SNAKE_CASE to Title Case
  const formattedLabel = normalized
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

  if (variant === "square") {
    let squareClasses = "bg-slate-100 border border-slate-200 text-slate-600";
    if (normalized === "PENDING" || normalized === "PENDING_ACCEPTANCE") {
      squareClasses = "bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706]";
    } else if (normalized === "PRIORITIZED") {
      squareClasses = "bg-[#F1F5F9] border border-border-strong text-text-primary";
    } else if (normalized === "DISPATCHING") {
      squareClasses = "bg-[#CCFBF1] border border-[#99F6E4] text-primary-dark";
    } else if (
      normalized === "ACTIVE_TRIP" ||
      normalized === "ACTIVE" ||
      normalized === "ACCEPTING" ||
      normalized === "ON_SHIFT" ||
      normalized === "ON SHIFT"
    ) {
      squareClasses = "bg-[#DCFCE7] border border-[#BBF7D0] text-[#16A34A]";
    } else if (normalized === "COMPLETED") {
      squareClasses = "bg-status-bg border border-[#BBF7D0] text-status-text";
    } else if (
      normalized === "DIVERTING" ||
      normalized === "SUSPENDED" ||
      normalized === "OVERDUE" ||
      normalized === "SERVICE_OVERDUE" ||
      normalized === "SERVICE OVERDUE"
    ) {
      squareClasses = "bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706]";
    } else if (
      normalized === "CLOSED" ||
      normalized === "DELETED"
    ) {
      squareClasses = "bg-red-50 border border-red-200 text-red-600";
    } else if (
      normalized === "CANCELLED" ||
      normalized === "REJECTED" ||
      normalized === "FAILED" ||
      normalized === "OFF_SHIFT" ||
      normalized === "OFF SHIFT"
    ) {
      squareClasses = "bg-slate-100 border border-slate-200 text-slate-500";
    }

    return (
      <span
        className={cn(
          "inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-bold rounded-none select-none tracking-tight",
          squareClasses,
          className,
        )}
      >
        {formattedLabel}
      </span>
    );
  }

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
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs border border-border bg-surface shadow-xs",
        colorClasses,
        className,
      )}
    >
      {isPositive && (
        <span
          className="h-1.5 w-1.5 rounded-none bg-status shrink-0"
          aria-hidden="true"
        />
      )}
      <span>{formattedLabel}</span>
    </span>
  );
}
