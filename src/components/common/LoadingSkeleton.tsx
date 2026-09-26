import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface LoadingSkeletonProps {
  variant?: "stat" | "table" | "card" | "dispatch" | "list";
  count?: number;
  className?: string;
}

export function LoadingSkeleton({
  variant = "card",
  count = 1,
  className,
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === "stat") {
    return (
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
          className,
        )}
      >
        {items.map((key) => (
          <div
            key={key}
            className="bg-surface border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between h-[120px]"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <div className="flex items-baseline justify-between mt-4">
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div
        className={cn(
          "bg-surface border border-border rounded-xl p-4 shadow-xs space-y-4",
          className,
        )}
      >
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
        <div className="space-y-3">
          {items.map((key) => (
            <div key={key} className="flex items-center gap-4 py-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32 flex-1" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "dispatch") {
    return (
      <div
        className={cn(
          "bg-surface border border-border rounded-xl p-5 shadow-xs space-y-4",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="pt-2 flex items-center gap-3">
          <Skeleton className="h-11 flex-1 rounded-lg" />
          <Skeleton className="h-11 flex-1 rounded-lg" />
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("space-y-3", className)}>
        {items.map((key) => (
          <div
            key={key}
            className="bg-surface border border-border rounded-xl p-4 shadow-xs flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  // Default card variant
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className,
      )}
    >
      {items.map((key) => (
        <div
          key={key}
          className="bg-surface border border-border rounded-xl p-5 shadow-xs space-y-3"
        >
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="pt-2 flex justify-end">
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
