"use client";

/**
 * Magnetic — adapted from the motion-primitives "Magnetic" component
 * (ibelick, published on 21st.dev). Restyled for RDP: critically damped
 * spring (no wobble), measures the *untransformed* position so the pull
 * doesn't feed back on itself, and switches off for touch + reduced motion.
 */
import { motion, useMotionValue, useSpring, type SpringOptions } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { springValue } from "@/lib/animations";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/device";
import { cn } from "@/lib/utils";

export type MagneticProps = {
  children: ReactNode;
  /** Fraction of the pointer offset the element follows (0..1). */
  intensity?: number;
  /** Extra px around the element's box where the pull begins. */
  range?: number;
  springOptions?: SpringOptions;
  className?: string;
  disabled?: boolean;
};

export function Magnetic({
  children,
  intensity = 0.35,
  range = 70,
  springOptions = springValue.magnetic,
  className,
  disabled = false,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduce = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springOptions);
  const sy = useSpring(y, springOptions);
  const active = fine && !reduce && !disabled;

  useEffect(() => {
    if (!active) {
      x.set(0);
      y.set(0);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // Subtract the current spring offset → centre of the element at rest.
      const cx = r.left + r.width / 2 - sx.get();
      const cy = r.top + r.height / 2 - sy.get();
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const within = Math.abs(dx) < r.width / 2 + range && Math.abs(dy) < r.height / 2 + range;
      if (within) {
        x.set(dx * intensity);
        y.set(dy * intensity);
      } else if (x.get() !== 0 || y.get() !== 0) {
        x.set(0);
        y.set(0);
      }
    };
    const reset = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", reset);
    };
  }, [active, intensity, range, x, y, sx, sy]);

  return (
    <motion.div ref={ref} className={cn("inline-block", className)} style={{ x: sx, y: sy }}>
      {children}
    </motion.div>
  );
}
