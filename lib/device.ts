"use client";

import { useSyncExternalStore } from "react";

/**
 * Device quality tiers for the WebGL scene and heavy effects.
 *   high → desktop, fine pointer, ≥1200px, ≥6 cores: full cinematic
 *          (post-processing, DOF, reflections, full cloud count)
 *   mid  → tablets / small laptops: reduced clouds, no DOF, cheap bloom
 *   low  → phones / coarse pointer / weak CPUs: no post-processing,
 *          minimal clouds + particles, DPR capped at 1.25
 */
export type DeviceTier = "low" | "mid" | "high";

export function getDeviceTier(): DeviceTier {
  if (typeof window === "undefined") return "high";
  const w = window.innerWidth;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  if (w < 768 || (coarse && w < 1024) || cores <= 2 || memory <= 2) return "low";
  if (w < 1200 || coarse || cores <= 4 || memory <= 4) return "mid";
  return "high";
}

/** Max device pixel ratio per tier. */
export const DPR_CAP: Record<DeviceTier, [number, number]> = {
  low: [1, 1.25],
  mid: [1, 1.5],
  high: [1, 1.75],
};

function subscribeResize(cb: () => void) {
  window.addEventListener("resize", cb, { passive: true });
  return () => window.removeEventListener("resize", cb);
}

export function useDeviceTier(): DeviceTier {
  return useSyncExternalStore(subscribeResize, getDeviceTier, () => "high");
}

function makeMediaHook(query: string, serverValue: boolean) {
  const subscribe = (cb: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  };
  const get = () => window.matchMedia(query).matches;
  return function useMedia() {
    return useSyncExternalStore(subscribe, get, () => serverValue);
  };
}

/** True on devices with a precise hovering pointer (mouse / trackpad). */
export const useFinePointer = makeMediaHook("(hover: hover) and (pointer: fine)", false);

/** True when the user asked the OS to reduce motion. */
export const usePrefersReducedMotion = makeMediaHook("(prefers-reduced-motion: reduce)", false);

/** True below the md breakpoint (768px). */
export const useIsMobile = makeMediaHook("(max-width: 767px)", false);

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasFinePointer() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Feature-detect WebGL2/1 without keeping the context alive. */
export function supportsWebGL(): boolean {
  if (typeof document === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return false;
    (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}
