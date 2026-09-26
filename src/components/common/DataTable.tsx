import type React from "react";
import { cn } from "@/lib/utils";

export interface DataTableProps {
  children: React.ReactNode;
  className?: string;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
}

export function DataTable({
  children,
  className,
  headerSlot,
  footerSlot,
}: DataTableProps) {
  return (
    <div
      className={cn(
        "w-full bg-surface border border-border rounded-xl shadow-xs overflow-hidden flex flex-col",
        className,
      )}
    >
      {headerSlot && (
        <div className="p-4 border-b border-border bg-surface flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {headerSlot}
        </div>
      )}

      {/* Responsive table wrapper: horizontally scrollable on mobile without body overflow */}
      <section
        aria-label="Data table scroll container"
        className="w-full overflow-x-auto focus:outline-hidden"
      >
        <div className="inline-block min-w-full align-middle">{children}</div>
      </section>

      {footerSlot && (
        <div className="p-3 border-t border-border bg-surface">
          {footerSlot}
        </div>
      )}
    </div>
  );
}
