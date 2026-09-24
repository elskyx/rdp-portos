import type Lenis from "lenis";

/**
 * Mutable, render-free scroll + pointer state shared between the DOM and the
 * WebGL scene. Written by producers (SmoothScroll, CinematicHero,
 * ContactSection), read every frame by consumers (ThreeScene). Never put this
 * in React state — read it inside rAF / useFrame / event callbacks only.
 */
export const scrollState = {
  /** Current scroll offset in px (smoothed when Lenis is active). */
  y: 0,
  /** Scroll velocity in px/frame (signed, smoothed by Lenis). */
  velocity: 0,
  /** 1 = down, -1 = up, 0 = idle. */
  direction: 0 as -1 | 0 | 1,
  /** Whole-page progress 0..1. */
  progress: 0,

  /**
   * Hero sequence progress 0..1 — written by CinematicHero.
   * 0 = top of page, 1 = the sticky hero sequence has fully played.
   *   0.00–0.45  sky: car floats, camera dollies forward, clouds drift
   *   0.45–0.75  transition: sky darkens, clouds sink/fade, car rises + turns
   *   0.75–1.00  studio: dark studio environment, car lit by strip lights
   */
  heroProgress: 0,
  /**
   * 0..1 after the hero sequence ends, while the Selected Work intro band
   * (transparent) scrolls over the studio. 1 = canvas fully covered.
   * Written by CinematicHero.
   */
  heroExit: 0,

  /**
   * Finale (Contact) progress 0..1 — written by ContactSection.
   * 0 = contact not yet in view, 1 = contact fully in view.
   */
  finaleProgress: 0,

  /** Pointer in normalised device coords (-1..1, y up). Written by SmoothScroll. */
  pointer: { x: 0, y: 0 },
};

export type ScrollState = typeof scrollState;

// ---------------------------------------------------------------------------
// Lightweight subscription — fires on every scroll tick (already rAF-batched
// by Lenis). Keep listeners allocation-free.
// ---------------------------------------------------------------------------

type Listener = (state: ScrollState) => void;
const listeners = new Set<Listener>();

export function onScroll(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function emitScroll() {
  for (const l of listeners) l(scrollState);
}

// ---------------------------------------------------------------------------
// Lenis instance access
// ---------------------------------------------------------------------------

let lenisInstance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  lenisInstance = lenis;
}

export function getLenis() {
  return lenisInstance;
}

/**
 * Scroll to a section id ("#work"), element, or offset. Uses Lenis inertia
 * when available, otherwise native scrolling (reduced motion / no JS smooth).
 */
export function scrollToTarget(
  target: string | number | HTMLElement,
  options: { offset?: number; immediate?: boolean; duration?: number } = {},
) {
  const { offset = 0, immediate = false, duration = 1.8 } = options;
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset,
      immediate,
      duration,
      easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    });
    return;
  }
  if (typeof window === "undefined") return;
  let top: number;
  if (typeof target === "number") {
    top = target;
  } else {
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;
    top = el.getBoundingClientRect().top + window.scrollY;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: top + offset, behavior: immediate || reduce ? "auto" : "smooth" });
}
