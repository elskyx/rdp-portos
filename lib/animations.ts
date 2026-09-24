/**
 * RDP motion system.
 *
 * Speeds are chosen per surface, never globally:
 *   hero               → slow + cinematic       (duration.cinematic / spring.drift)
 *   navigation         → fast + responsive      (duration.fast / spring.snappy)
 *   project cards      → medium + tactile       (duration.base / spring.tactile)
 *   section transitions→ slow + dramatic        (duration.slow / ease.cinematic)
 *   buttons            → fast + responsive      (spring.snappy / spring.magnetic)
 *
 * No overshoot on anything that reads as "UI" — this is a premium automotive
 * site, not a playful one. Springs below are critically damped or close to it.
 */

type Bezier = [number, number, number, number];

export const ease = {
  /** easeOutExpo — default for reveals. Fast start, long silky settle. */
  outExpo: [0.16, 1, 0.3, 1] as Bezier,
  /** easeOutQuart — slightly firmer settle, good for UI state changes. */
  outQuart: [0.25, 1, 0.5, 1] as Bezier,
  /** easeInOut — symmetric, for scrubbed / looping motion. */
  inOut: [0.65, 0, 0.35, 1] as Bezier,
  /** Cinematic in-out — section wipes, loader exit, menu open. */
  cinematic: [0.76, 0, 0.24, 1] as Bezier,
} as const;

/** CSS equivalents (also declared as --ease-* tokens in globals.css). */
export const cssEase = {
  outExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
  outQuart: "cubic-bezier(0.25, 1, 0.5, 1)",
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  cinematic: "cubic-bezier(0.76, 0, 0.24, 1)",
} as const;

/** GSAP equivalents for scroll choreography. */
export const gsapEase = {
  outExpo: "expo.out",
  inOut: "power3.inOut",
  cinematic: "power4.inOut",
} as const;

export const duration = {
  instant: 0.15,
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
  cinematic: 1.4,
  epic: 2.2,
} as const;

export const stagger = {
  chars: 0.018,
  words: 0.05,
  lines: 0.12,
  items: 0.08,
} as const;

export const spring = {
  /** Navigation, toggles, cursor ring — fast and exact. */
  snappy: { type: "spring", stiffness: 520, damping: 42, mass: 0.6 },
  /** Cards, panels, tilt — medium and tactile, slight weight. */
  tactile: { type: "spring", stiffness: 170, damping: 24, mass: 0.9 },
  /** Hero / large objects — slow, heavy, cinematic drift. */
  drift: { type: "spring", stiffness: 45, damping: 20, mass: 1.4 },
} as const;

/** Options for useSpring() driven by pointer input. */
export const springValue = {
  magnetic: { stiffness: 180, damping: 18, mass: 0.2 },
  cursor: { stiffness: 900, damping: 60, mass: 0.35 },
  cursorRing: { stiffness: 320, damping: 34, mass: 0.6 },
  tilt: { stiffness: 150, damping: 20, mass: 0.6 },
  parallax: { stiffness: 60, damping: 22, mass: 1 },
} as const;

/** The signature text entrance: blur → sharp, fade, slight rise. */
export const blurRise = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(14px)" },
  visible: { opacity: 1, y: "0em", filter: "blur(0px)" },
} as const;

/** Masked line entrance for oversized editorial headings. */
export const maskRise = {
  hidden: { y: "105%" },
  visible: { y: "0%" },
} as const;

/** Frame-rate independent exponential damping (use inside rAF/useFrame). */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

/** Remap v from [a,b] to [0,1], clamped. */
export function progressBetween(v: number, a: number, b: number) {
  return clamp((v - a) / (b - a));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Smooth Hermite step, handy for scroll phase blending. */
export function smoothstep(a: number, b: number, v: number) {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
}
