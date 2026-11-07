import type { StateCreator } from "zustand";
import type { AlertSlice } from "./slices/createAlertSlice";
import type {
  PersistedPreferences,
  PreferencesSlice,
} from "./slices/createPreferencesSlice";
import type { UISlice } from "./slices/createUISlice";

/**
 * Union of all slices that compose the global app store.
 */
export type BoundState = UISlice & PreferencesSlice & AlertSlice;

export type { PreferencesSlice, AlertSlice, PersistedPreferences };

export type SliceCreator<T> = StateCreator<
  BoundState,
  [["zustand/devtools", never], ["zustand/persist", unknown]],
  [],
  T
>;
