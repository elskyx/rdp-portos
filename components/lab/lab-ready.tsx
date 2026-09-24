"use client";

import { useEffect } from "react";
import { appStore } from "@/lib/app-store";

/**
 * Dev-only helper for /lab preview routes: marks the app as loaded so
 * components waiting on the loader (hero text, scene intro, scroll lock)
 * behave as they would after the loading screen.
 */
export function LabReady() {
  useEffect(() => {
    appStore.set({ loaded: true, sceneReady: true });
  }, []);
  return null;
}
