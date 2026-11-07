import type { SliceCreator } from "../types";

export type TableDensity = "compact" | "comfortable";

export interface PreferencesSlice {
  isSidebarCollapsed: boolean;
  isEmergencySoundMuted: boolean;
  tableDensity: TableDensity;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setEmergencySoundMuted: (muted: boolean) => void;
  toggleEmergencySoundMuted: () => void;
  setTableDensity: (density: TableDensity) => void;
}

export type PersistedPreferences = Pick<
  PreferencesSlice,
  "isSidebarCollapsed" | "isEmergencySoundMuted" | "tableDensity"
>;

export const createPreferencesSlice: SliceCreator<PreferencesSlice> = (
  set,
) => ({
  isSidebarCollapsed: false,
  isEmergencySoundMuted: false,
  tableDensity: "comfortable",
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleSidebarCollapsed: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setEmergencySoundMuted: (muted) => set({ isEmergencySoundMuted: muted }),
  toggleEmergencySoundMuted: () =>
    set((state) => ({ isEmergencySoundMuted: !state.isEmergencySoundMuted })),
  setTableDensity: (density) => set({ tableDensity: density }),
});
