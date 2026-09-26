"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  className?: string;
  totalRecords?: number;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
  totalRecords,
}: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotalPages);

  const canPrev = safePage > 1;
  const canNext = safePage < safeTotalPages;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-text-secondary w-full",
        className,
      )}
    >
      <div className="text-xs text-text-muted">
        {totalRecords !== undefined ? (
          <span>
            Total records:{" "}
            <strong className="font-medium text-text-primary">
              {totalRecords}
            </strong>
          </span>
        ) : (
          <span>
            Page{" "}
            <strong className="font-medium text-text-primary">
              {safePage}
            </strong>{" "}
            of{" "}
            <strong className="font-medium text-text-primary">
              {safeTotalPages}
            </strong>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-text-secondary sm:inline hidden mr-2">
          Page {safePage} of {safeTotalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(safePage - 1)}
          disabled={!canPrev}
          aria-label="Previous page"
          className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] px-3 border-border hover:bg-primary-light hover:text-primary transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
          <span>Prev</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(safePage + 1)}
          disabled={!canNext}
          aria-label="Next page"
          className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] px-3 border-border hover:bg-primary-light hover:text-primary transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
