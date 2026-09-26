"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface CountdownTimerProps {
  timeoutAt?: string | Date;
  initialSeconds?: number;
  onExpire?: () => void;
  className?: string;
}

export function CountdownTimer({
  timeoutAt,
  initialSeconds = 120, // 2-minute default per PRD §4.5
  onExpire,
  className,
}: CountdownTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    if (timeoutAt) {
      const diffMs = new Date(timeoutAt).getTime() - Date.now();
      return Math.max(0, Math.floor(diffMs / 1000));
    }
    return initialSeconds;
  });

  useEffect(() => {
    if (remainingSeconds <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds, onExpire]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const isLow = remainingSeconds <= 30 && remainingSeconds > 0;
  const isExpired = remainingSeconds === 0;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors",
        isExpired
          ? "bg-destructive-bg text-destructive border-destructive/30"
          : isLow
            ? "bg-warning-bg text-warning-foreground border-warning/40 animate-pulse"
            : "bg-primary-light text-primary border-primary/20",
        className,
      )}
      role="timer"
      aria-label={`Time remaining: ${formattedTime}`}
    >
      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{isExpired ? "TIMED OUT" : formattedTime}</span>
    </div>
  );
}
