import { FolderOpen } from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-surface border border-dashed border-border rounded-xl",
        className,
      )}
    >
      <div className="h-14 w-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-4 shadow-xs">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-text-primary">
        {title}
      </h3>

      <p className="mt-1 text-sm text-text-secondary max-w-sm">{description}</p>

      {action && (
        <div className="mt-5 flex items-center justify-center">{action}</div>
      )}
    </div>
  );
}
