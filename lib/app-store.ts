"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny global app state (no dependency). Low-frequency flags only —
 * per-frame values live in lib/scroll-store.ts.
 */
export type AppState = {
  /** Loader has finished and revealed the page. Hero choreography waits on this. */
  loaded: boolean;
  /** WebGL scene has rendered its first frame (or failed and fell back). */
  sceneReady: boolean;
  /** WebGL unavailable → scene renders a static fallback. */
  webglFailed: boolean;
  /** Mobile fullscreen menu is open (scroll is locked while true). */
  menuOpen: boolean;
};

let state: AppState = {
  loaded: false,
  sceneReady: false,
  webglFailed: false,
  menuOpen: false,
};

const serverState: AppState = { ...state };
const listeners = new Set<() => void>();

export const appStore = {
  get: () => state,
  set(partial: Partial<AppState>) {
    let changed = false;
    for (const key in partial) {
      const k = key as keyof AppState;
      if (partial[k] !== undefined && partial[k] !== state[k]) {
        changed = true;
        break;
      }
    }
    if (!changed) return;
    state = { ...state, ...partial };
    for (const l of listeners) l();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

/** Select a slice of app state; re-renders only when the slice changes. */
export function useAppStore<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    appStore.subscribe,
    () => selector(state),
    () => selector(serverState),
  );
}
