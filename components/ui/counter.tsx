"use client";

/**
 * Counter — animated number reveal (00 → 24+). Writes textContent directly
 * from Motion's animate() so React never re-renders per frame.
 */
import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { ease } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/device";
import { cn } from "@/lib/utils";

export type CounterProps = {
  value: number;
  /** Zero-pad to this many digits ("08"). */
  pad?: number;
  suffix?: string;
  duration?: number;
  delay?: number;
  className?: string;
};

function format(v: number, pad: number, suffix: string) {
  return `${Math.round(v).toString().padStart(pad, "0")}${suffix}`;
}

export function Counter({ value, pad = 2, suffix = "", duration = 1.8, delay = 0, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (!inView) {
      el.textContent = format(0, pad, suffix);
      return;
    }
    const controls = animate(0, value, {
      duration,
      delay,
      ease: ease.outExpo,
      onUpdate: (v) => {
        el.textContent = format(v, pad, suffix);
      },
    });
    return () => controls.stop();
  }, [inView, value, pad, suffix, duration, delay, reduce]);

  return (
    <span ref={ref} aria-label={`${value}${suffix}`} className={cn("tabular-nums", className)}>
      {format(value, pad, suffix)}
    </span>
  );
}
