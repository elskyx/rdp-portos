"use client";

/**
 * Spotlight — adapted from the 21st.dev "Spotlight" (ibelick /
 * motion-primitives). Drop it inside any `relative overflow-hidden` element:
 * it listens to its parent's pointer and trails a soft cold-blue light with a
 * spring. Transform-only, no re-renders. Hidden on touch / reduced motion.
 */
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { springValue } from "@/lib/animations";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/device";
import { cn } from "@/lib/utils";

export type SpotlightProps = {
  className?: string;
  /** Diameter in px. */
  size?: number;
  /** Any CSS color; keep alpha low. */
  color?: string;
};

export function Spotlight({ className, size = 460, color = "rgba(61, 139, 255, 0.18)" }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduce = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springValue.tilt);
  const sy = useSpring(y, springValue.tilt);
  const enabled = fine && !reduce;

  useEffect(() => {
    if (!enabled) return;
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const onMove = (e: PointerEvent) => {
      const r = parent.getBoundingClientRect();
      x.set(e.clientX - r.left - size / 2);
      y.set(e.clientY - r.top - size / 2);
    };
    const onEnter = (e: PointerEvent) => {
      const r = parent.getBoundingClientRect();
      // Jump (no spring) to the entry point so the light doesn't fly in.
      sx.jump(e.clientX - r.left - size / 2);
      sy.jump(e.clientY - r.top - size / 2);
      setHovered(true);
    };
    const onLeave = () => setHovered(false);
    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerenter", onEnter);
    parent.addEventListener("pointerleave", onLeave);
    return () => {
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerenter", onEnter);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, size, x, y, sx, sy]);

  if (!enabled) return <div ref={ref} hidden />;

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute left-0 top-0 z-0 rounded-full transition-opacity duration-500 ease-out-expo",
        hovered ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{
        width: size,
        height: size,
        x: sx,
        y: sy,
        background: `radial-gradient(circle at center, ${color} 0%, transparent 65%)`,
      }}
    />
  );
}
