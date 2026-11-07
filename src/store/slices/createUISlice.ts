import type { SliceCreator } from "../types";

export interface UISlice {
  isMobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
  toggleMobileDrawer: () => void;
}

export const createUISlice: SliceCreator<UISlice> = (set) => ({
  isMobileDrawerOpen: false,
  setMobileDrawerOpen: (open: boolean) => set({ isMobileDrawerOpen: open }),
  toggleMobileDrawer: () =>
    set((state) => ({ isMobileDrawerOpen: !state.isMobileDrawerOpen })),
});
