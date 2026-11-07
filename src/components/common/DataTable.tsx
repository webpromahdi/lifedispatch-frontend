"use client";

import type React from "react";
import { useHasHydrated } from "@/hooks/useHasHydrated";
import { cn } from "@/lib/utils";
import type { TableDensity } from "@/store/slices/createPreferencesSlice";
import { useSetTableDensity, useTableDensity } from "@/store/useAppStore";

export interface DataTableProps {
  children: React.ReactNode;
  className?: string;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  density?: TableDensity;
  showDensityToggle?: boolean;
}

export function TableDensityToggle({ className }: { className?: string }) {
  const density = useTableDensity();
  const setDensity = useSetTableDensity();
  const hasHydrated = useHasHydrated();
  const currentDensity = hasHydrated ? density : "comfortable";

  return (
    <fieldset
      className={cn(
        "inline-flex items-center rounded-sm border border-border bg-muted/40 p-0.5 text-xs select-none m-0",
        className,
      )}
      aria-label="Table density selector"
    >
      <button
        type="button"
        onClick={() => setDensity("compact")}
        aria-pressed={currentDensity === "compact"}
        className={cn(
          "px-2 py-0.5 rounded-[2px] font-medium transition-colors cursor-pointer",
          currentDensity === "compact"
            ? "bg-white text-text-primary shadow-2xs font-semibold"
            : "text-text-muted hover:text-text-primary",
        )}
      >
        Compact
      </button>
      <button
        type="button"
        onClick={() => setDensity("comfortable")}
        aria-pressed={currentDensity === "comfortable"}
        className={cn(
          "px-2 py-0.5 rounded-[2px] font-medium transition-colors cursor-pointer",
          currentDensity === "comfortable"
            ? "bg-white text-text-primary shadow-2xs font-semibold"
            : "text-text-muted hover:text-text-primary",
        )}
      >
        Comfortable
      </button>
    </fieldset>
  );
}

export function DataTable({
  children,
  className,
  headerSlot,
  footerSlot,
  density,
  showDensityToggle = false,
}: DataTableProps) {
  const storeDensity = useTableDensity();
  const hasHydrated = useHasHydrated();
  const activeDensity = density ?? (hasHydrated ? storeDensity : "comfortable");

  return (
    <div
      data-density={activeDensity}
      className={cn(
        "w-[calc(100%+2rem)] -mx-4 sm:w-full sm:mx-0 bg-surface border-y sm:border border-border rounded-none shadow-xs overflow-hidden flex flex-col",
        activeDensity === "compact"
          ? "[&_td:not([colspan])]:!py-1.5 [&_td:not([colspan])]:!px-2.5 [&_td:not([colspan])]:text-xs [&_th]:!py-1.5 [&_th]:!px-2.5 [&_th]:!h-8 [&_th]:text-xs"
          : "[&_td:not([colspan])]:!py-3.5 [&_td:not([colspan])]:!px-3.5 [&_th]:!py-2.5 [&_th]:!px-3.5 [&_th]:!h-10",
        className,
      )}
    >
      {(headerSlot || showDensityToggle) && (
        <div className="px-4 py-4 sm:p-4 border-b border-border bg-surface flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {headerSlot}
          {showDensityToggle && (
            <div className="shrink-0 self-end sm:self-auto">
              <TableDensityToggle />
            </div>
          )}
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
        <div className="px-4 py-3 sm:p-3 border-t border-border bg-surface">
          {footerSlot}
        </div>
      )}
    </div>
  );
}
