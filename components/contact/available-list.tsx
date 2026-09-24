"use client";

/**
 * AvailableList — indexed list of engagement types, adapted from the
 * motion-primitives "InView" + "Animated Group" pattern (21st.dev):
 * rows reveal staggered with the signature blur-rise, each hairline draws in
 * from the left. Hover (fine pointers only) nudges the row and lights the
 * index — nothing essential is hover-only.
 */
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { blurRise, duration, ease, stagger } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/device";
import { cn } from "@/lib/utils";

export type AvailableListProps = {
  label: string;
  items: readonly string[];
  className?: string;
};

export function AvailableList({ label, items, className }: AvailableListProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const shown = reduce || inView;
  const total = String(items.length).padStart(2, "0");

  return (
    <div ref={ref} className={className}>
      <div className="text-meta mb-5 flex items-baseline justify-between text-fg-dim">
        <span id="contact-available">{label}</span>
        <span aria-hidden>({total})</span>
      </div>
      <ul aria-labelledby="contact-available" className="relative">
        {items.map((item, i) => {
          const d = reduce ? 0 : 0.15 + i * stagger.items * 1.5;
          return (
            <li key={item} className="group/av relative">
              <motion.span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left bg-line-strong"
                initial={reduce ? false : { scaleX: 0 }}
                animate={shown ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: reduce ? 0 : duration.cinematic, delay: d, ease: ease.outExpo }}
              />
              <motion.div
                className="flex items-baseline gap-5 py-3.5 md:py-4"
                initial={reduce ? false : "hidden"}
                animate={shown ? "visible" : "hidden"}
                variants={blurRise}
                transition={{ duration: reduce ? 0 : duration.slow, delay: d + 0.08, ease: ease.outExpo }}
              >
                <span className="text-meta w-7 shrink-0 tabular-nums text-fg-dim transition-colors duration-300 group-hover/av:text-electric-soft">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "font-wide text-[1.0625rem] font-medium leading-tight tracking-[-0.01em] text-fg md:text-xl",
                    "transition-transform duration-500 ease-out-expo group-hover/av:translate-x-1.5",
                  )}
                >
                  {item}
                </span>
              </motion.div>
            </li>
          );
        })}
        <motion.li
          aria-hidden
          className="h-px origin-left bg-line-strong"
          initial={reduce ? false : { scaleX: 0 }}
          animate={shown ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: reduce ? 0 : duration.cinematic, delay: reduce ? 0 : 0.15 + items.length * stagger.items * 1.5, ease: ease.outExpo }}
        />
      </ul>
    </div>
  );
}
