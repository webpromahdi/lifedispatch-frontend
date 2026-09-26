"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard route error:", error);
  }, [error]);

  return (
    <div className="min-h-[400px] w-full p-8 flex flex-col items-center justify-center text-center bg-surface border border-destructive/20 rounded-2xl shadow-xs">
      <div className="h-14 w-14 rounded-2xl bg-destructive-bg text-destructive flex items-center justify-center mb-4">
        <AlertTriangle className="h-7 w-7" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-bold text-text-primary">
        Dashboard View Encountered An Issue
      </h2>
      <p className="mt-2 text-sm text-text-secondary max-w-md">
        {error.message ||
          "An unexpected error occurred in this dashboard section."}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button
          onClick={() => reset()}
          className="min-h-[44px] px-5 bg-primary hover:bg-primary-dark text-primary-foreground font-medium rounded-lg cursor-pointer transition-colors"
        >
          <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
          Reload Section
        </Button>
      </div>
    </div>
  );
}
