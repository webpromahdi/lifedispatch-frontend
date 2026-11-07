import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createAlertSlice } from "./slices/createAlertSlice";
import { createPreferencesSlice } from "./slices/createPreferencesSlice";
import { createUISlice } from "./slices/createUISlice";
import type { BoundState, PersistedPreferences } from "./types";

export const useAppStore = create<BoundState>()(
  devtools(
    persist(
      (...a) => ({
        ...createUISlice(...a),
        ...createPreferencesSlice(...a),
        ...createAlertSlice(...a),
      }),
      {
        name: "lifedispatch-preferences",
        version: 1,
        skipHydration: true,
        partialize: (state): PersistedPreferences => ({
          isSidebarCollapsed: state.isSidebarCollapsed,
          isEmergencySoundMuted: state.isEmergencySoundMuted,
          tableDensity: state.tableDensity,
        }),
        migrate: (
          persistedState: unknown,
          _version: number,
        ): PersistedPreferences => persistedState as PersistedPreferences,
      },
    ),
    {
      name: "LifeDispatchStore",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);

// Atomic exported hooks - UI Slice
export const useIsMobileDrawerOpen = () =>
  useAppStore((state) => state.isMobileDrawerOpen);

export const useSetMobileDrawerOpen = () =>
  useAppStore((state) => state.setMobileDrawerOpen);

export const useToggleMobileDrawer = () =>
  useAppStore((state) => state.toggleMobileDrawer);

// Atomic exported hooks - Preferences Slice
export const useIsSidebarCollapsed = () =>
  useAppStore((state) => state.isSidebarCollapsed);

export const useToggleSidebarCollapsed = () =>
  useAppStore((state) => state.toggleSidebarCollapsed);

export const useSetSidebarCollapsed = () =>
  useAppStore((state) => state.setSidebarCollapsed);

export const useIsEmergencySoundMuted = () =>
  useAppStore((state) => state.isEmergencySoundMuted);

export const useToggleEmergencySoundMuted = () =>
  useAppStore((state) => state.toggleEmergencySoundMuted);

export const useSetEmergencySoundMuted = () =>
  useAppStore((state) => state.setEmergencySoundMuted);

export const useTableDensity = () =>
  useAppStore((state) => state.tableDensity);

export const useSetTableDensity = () =>
  useAppStore((state) => state.setTableDensity);

// Atomic exported hooks - Alert Slice
export const useDismissedAlertIds = () =>
  useAppStore((state) => state.dismissedAlertIds);

export const useAudioPlaying = () =>
  useAppStore((state) => state.audioPlaying);

export const useAudioBlocked = () =>
  useAppStore((state) => state.audioBlocked);

export const useSetAudioPlaying = () =>
  useAppStore((state) => state.setAudioPlaying);

export const useSetAudioBlocked = () =>
  useAppStore((state) => state.setAudioBlocked);

export const useDismissAlert = () =>
  useAppStore((state) => state.dismissAlert);

export const useDismissAllAlerts = () =>
  useAppStore((state) => state.dismissAllAlerts);

export const usePruneDismissedAlerts = () =>
  useAppStore((state) => state.pruneDismissedAlerts);
