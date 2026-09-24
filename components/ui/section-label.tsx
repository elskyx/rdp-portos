"use client";

/**
 * SectionLabel — "01 / SELECTED WORK". The technical metadata voice of the
 * site: mono, uppercase, wide tracking, with a hairline that draws in.
 */
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { duration, ease } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/device";
import { cn } from "@/lib/utils";

export type SectionLabelProps = {
  index: string;
  label: string;
  className?: string;
  /** Draw a hairline after the label that fills remaining width. */
  rule?: boolean;
  /** Right-aligned secondary meta, e.g. "(04)" or "2024 — 2026". */
  aside?: string;
};

export function SectionLabel({ index, label, className, rule = false, aside }: SectionLabelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = usePrefersReducedMotion();
  const shown = reduce || inView;

  return (
    <div ref={ref} className={cn("text-meta flex items-center gap-3 text-fg-muted", className)}>
      <motion.span
        className="flex items-center gap-2 whitespace-nowrap"
        initial={reduce ? false : { opacity: 0, x: -8 }}
        animate={shown ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
        transition={{ duration: duration.base, ease: ease.outExpo }}
      >
        <span className="text-fg">{index}</span>
        <span className="text-fg-dim">/</span>
        <span>{label}</span>
      </motion.span>
      {rule ? (
        <motion.span
          aria-hidden
          className="h-px flex-1 origin-left bg-line-strong"
          initial={reduce ? false : { scaleX: 0 }}
          animate={shown ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: duration.cinematic, ease: ease.outExpo, delay: 0.15 }}
        />
      ) : null}
      {aside ? <span className="whitespace-nowrap text-fg-dim">{aside}</span> : null}
    </div>
  );
}
