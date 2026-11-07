import type { SliceCreator } from "../types";

export interface AlertSlice {
  dismissedAlertIds: string[];
  audioPlaying: boolean;
  audioBlocked: boolean;
  setAudioPlaying: (playing: boolean) => void;
  setAudioBlocked: (blocked: boolean) => void;
  dismissAlert: (id: string) => void;
  dismissAllAlerts: (ids: string[]) => void;
  pruneDismissedAlerts: (activeIds: string[]) => void;
}

export const createAlertSlice: SliceCreator<AlertSlice> = (set) => ({
  dismissedAlertIds: [],
  audioPlaying: false,
  audioBlocked: false,
  setAudioPlaying: (playing) => set({ audioPlaying: playing }),
  setAudioBlocked: (blocked) => set({ audioBlocked: blocked }),
  dismissAlert: (id) =>
    set((state) => ({
      audioPlaying: false,
      dismissedAlertIds: state.dismissedAlertIds.includes(id)
        ? state.dismissedAlertIds
        : [...state.dismissedAlertIds, id],
    })),
  dismissAllAlerts: (ids) =>
    set((state) => ({
      audioPlaying: false,
      dismissedAlertIds: Array.from(
        new Set([...state.dismissedAlertIds, ...ids]),
      ),
    })),
  pruneDismissedAlerts: (activeIds) =>
    set((state) => ({
      dismissedAlertIds: state.dismissedAlertIds.filter((id) =>
        activeIds.includes(id),
      ),
    })),
});
