"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

/**
 * Lightweight read-only hydration observer hook.
 * Subscribes to Zustand persist hydration status without triggering rehydration.
 * Rehydration is executed exactly once in DashboardShell.
 */
export function useHasHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() =>
    useAppStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    setHydrated(useAppStore.persist.hasHydrated());
    return () => unsub();
  }, []);

  return hydrated;
}
