"use client";

/**
 * TiltCard — adapted from the 21st.dev "3D Card Effect" (Aceternity UI).
 * Very subtle perspective tilt on springs + depth layers (TiltLayer) that
 * float at different translateZ. Also publishes the pointer position as CSS
 * variables (--mx / --my, 0..1) so backgrounds inside can respond to the
 * cursor without React re-renders. Flat on touch / reduced motion.
 */
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { springValue } from "@/lib/animations";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/device";
import { cn } from "@/lib/utils";

export type TiltCardProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  /** Max rotation in degrees. Keep it small — this is premium, not playful. */
  maxTilt?: number;
  perspective?: number;
  style?: CSSProperties;
  onHoverChange?: (hovered: boolean) => void;
  /** Extra attributes for the outer element (e.g. data-cursor). */
  dataCursor?: string;
  dataCursorLabel?: string;
};

export function TiltCard({
  children,
  className,
  innerClassName,
  maxTilt = 5,
  perspective = 1400,
  style,
  onHoverChange,
  dataCursor,
  dataCursorLabel,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduce = usePrefersReducedMotion();
  const enabled = fine && !reduce;
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, springValue.tilt);
  const sry = useSpring(ry, springValue.tilt);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", nx.toFixed(4));
    el.style.setProperty("--my", ny.toFixed(4));
    if (!enabled) return;
    ry.set((nx - 0.5) * 2 * maxTilt);
    rx.set(-(ny - 0.5) * 2 * maxTilt);
  };

  const onEnter = () => onHoverChange?.(true);
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    onHoverChange?.(false);
  };

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      style={{ perspective, ...style, ["--mx" as string]: 0.5, ["--my" as string]: 0.5 }}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      data-cursor={dataCursor}
      data-cursor-label={dataCursorLabel}
    >
      <motion.div
        className={cn("relative h-full w-full", innerClassName)}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** A child layer that floats `depth` px toward the viewer inside a TiltCard. */
export function TiltLayer({
  depth = 20,
  className,
  children,
}: {
  depth?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className} style={{ transform: `translateZ(${depth}px)`, transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}
