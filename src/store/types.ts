import type { StateCreator } from "zustand";
import type { UISlice } from "./slices/createUISlice";

/**
 * Union of all slices that compose the global app store.
 * As new slices (e.g. DispatchSlice, FilterSlice) are created, add them here.
 */
export type BoundState = UISlice;

export type SliceCreator<T> = StateCreator<BoundState, [], [], T>;

