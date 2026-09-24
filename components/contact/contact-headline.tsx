"use client";

/**
 * ContactHeadline — the finale's masked line rise (same choreography as
 * <TextReveal variant="mask">, adapted from the 21st.dev / motion-primitives
 * "Text Effect" pattern) but able to tint the closing period electric blue,
 * which the string-only primitive can't. Lines slide up from behind a mask,
 * staggered; the period lands a beat later out of a blur, with a faint static glow.
 * Screen readers get the plain sentence via aria-label.
 */
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { duration, ease, maskRise, stagger } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/device";
import { cn } from "@/lib/utils";

export type ContactHeadlineProps = {
  lines: readonly string[];
  className?: string;
  lineClassName?: (index: number) => string;
  id?: string;
};

export function ContactHeadline({ lines, className, lineClassName, id }: ContactHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = usePrefersReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const shown = reduce || inView;
  const last = lines.length - 1;

  return (
    <h2 ref={ref} id={id} aria-label={lines.join(" ")} className={className}>
      {lines.map((line, i) => {
        const endsWithDot = i === last && line.endsWith(".");
        const text = endsWithDot ? line.slice(0, -1) : line;
        return (
          <span
            key={i}
            aria-hidden
            className={cn("block overflow-hidden pb-[0.12em] -mb-[0.12em]", lineClassName?.(i))}
          >
            <motion.span
              className="inline-block will-change-transform"
              initial={reduce ? false : "hidden"}
              animate={shown ? "visible" : "hidden"}
              variants={maskRise}
              transition={{ duration: reduce ? 0 : duration.cinematic, delay: reduce ? 0 : 0.1 + i * stagger.lines * 1.4, ease: ease.cinematic }}
            >
              {text}
              {endsWithDot ? (
                <motion.span
                  className="inline-block text-electric [text-shadow:0_0_0.35em_rgba(61,139,255,0.35)]"
                  initial={reduce ? false : { opacity: 0, filter: "blur(12px)" }}
                  animate={shown ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(12px)" }}
                  transition={{ duration: reduce ? 0 : duration.slow, delay: reduce ? 0 : 0.95 + i * stagger.lines, ease: ease.outExpo }}
                >
                  .
                </motion.span>
              ) : null}
            </motion.span>
          </span>
        );
      })}
    </h2>
  );
}
