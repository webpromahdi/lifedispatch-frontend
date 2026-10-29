import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createUISlice } from "./slices/createUISlice";
import type { BoundState } from "./types";

export const useAppStore = create<BoundState>()(
  devtools(
    (...a) => ({
      ...createUISlice(...a),
    }),
    {
      name: "LifeDispatchStore",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);

// Atomic exported hooks — components subscribe only to their slice to prevent unnecessary re-renders
export const useIsMobileDrawerOpen = () =>
  useAppStore((state) => state.isMobileDrawerOpen);

export const useSetMobileDrawerOpen = () =>
  useAppStore((state) => state.setMobileDrawerOpen);

export const useToggleMobileDrawer = () =>
  useAppStore((state) => state.toggleMobileDrawer);

