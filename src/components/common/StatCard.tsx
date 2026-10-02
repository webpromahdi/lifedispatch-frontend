import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ElementType;
  trend?: {
    value: number | string;
    isPositive?: boolean;
    label?: string;
  };
  subtitle?: string;
  className?: string;
  delay?: number;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  subtitle,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-none p-5 shadow-xs flex flex-col justify-between min-h-30",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-text-secondary truncate">
          {label}
        </span>
        {Icon && (
          <div className="h-9 w-9 rounded-none bg-primary-light text-primary flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="text-2xl lg:text-3xl font-bold tracking-tight text-text-primary">
          {value}
        </div>

        {trend && (
          <div
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full shrink-0",
              trend.isPositive === true
                ? "bg-status-bg text-status-text"
                : trend.isPositive === false
                  ? "bg-destructive-bg text-destructive"
                  : "bg-muted text-text-secondary",
            )}
          >
            {trend.isPositive === true ? (
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
            ) : trend.isPositive === false ? (
              <TrendingDown className="h-3 w-3" aria-hidden="true" />
            ) : (
              <Minus className="h-3 w-3" aria-hidden="true" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>

      {subtitle && <p className="mt-2 text-xs text-text-muted">{subtitle}</p>}
    </div>
  );
}
