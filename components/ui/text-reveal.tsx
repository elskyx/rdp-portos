"use client";

/**
 * TextReveal — adapted from the 21st.dev "Text Generate Effect" (Aceternity)
 * and motion-primitives "Text Effect" patterns, unified into RDP's two
 * signature entrances:
 *
 *   variant="blur"  → blur(14px) → sharp, fade in, slight rise (hero / body)
 *   variant="mask"  → lines slide up from behind a mask (oversized headings)
 *
 * Staggered per line (default), word or char. Starts when scrolled into view
 * or when `trigger` flips to true (e.g. after the loader). Screen readers get
 * the plain sentence via aria-label; split spans are aria-hidden.
 * Reduced motion → text is simply shown.
 */
import { motion, useInView } from "motion/react";
import { Fragment, useRef, type CSSProperties } from "react";
import { blurRise, duration as D, ease, maskRise, stagger as S } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/device";
import { cn } from "@/lib/utils";

const TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
  div: motion.div,
} as const;

export type TextRevealProps = {
  /** One string (single line) or an array of lines. */
  lines: string | readonly string[];
  as?: keyof typeof TAGS;
  className?: string;
  lineClassName?: string | ((index: number) => string);
  variant?: "blur" | "mask";
  split?: "lines" | "words" | "chars";
  /** Seconds before the first unit animates. */
  delay?: number;
  /** Seconds between lines. */
  lineStagger?: number;
  /** Seconds between words/chars inside a line. */
  unitStagger?: number;
  duration?: number;
  /** "view" (default) = when scrolled into view. boolean = controlled. */
  trigger?: "view" | boolean;
  once?: boolean;
  /** Fraction of the element visible before triggering. */
  amount?: number;
  style?: CSSProperties;
  id?: string;
};

export function TextReveal({
  lines,
  as = "div",
  className,
  lineClassName,
  variant = "blur",
  split = "lines",
  delay = 0,
  lineStagger = S.lines,
  unitStagger,
  duration,
  trigger = "view",
  once = true,
  amount = 0.4,
  style,
  id,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const inView = useInView(ref, { once, amount });
  const list = typeof lines === "string" ? [lines] : lines;
  const label = list.join(" ");
  const Tag = TAGS[as];

  const shown = reduce || (trigger === "view" ? inView : trigger);
  const dur = duration ?? (variant === "mask" ? D.cinematic : D.slow + 0.2);
  const uStagger = unitStagger ?? (split === "chars" ? S.chars : S.words);
  const states = variant === "mask" ? maskRise : blurRise;
  const transitionEase = variant === "mask" ? ease.cinematic : ease.outExpo;

  const renderUnit = (text: string, lineIndex: number, unitIndex: number, key: string) => {
    const d = delay + lineIndex * lineStagger + (split === "lines" ? 0 : unitIndex * uStagger);
    return (
      <motion.span
        key={key}
        className="inline-block will-change-[transform,opacity,filter]"
        initial={reduce ? false : "hidden"}
        animate={shown ? "visible" : "hidden"}
        variants={states}
        transition={{ duration: reduce ? 0 : dur, delay: reduce ? 0 : d, ease: transitionEase }}
      >
        {text}
      </motion.span>
    );
  };

  return (
    <Tag ref={ref as never} aria-label={label} className={className} style={style} id={id}>
      {list.map((line, li) => {
        const lc = typeof lineClassName === "function" ? lineClassName(li) : lineClassName;
        const words = line.split(" ");
        // Stagger restarts per line (offset by lineStagger); chars count across words.
        const charStarts = words.map((_, wi) => words.slice(0, wi).join("").length);
        const content =
          split === "lines"
            ? renderUnit(line, li, 0, `l${li}`)
            : words.map((word, wi) => (
                <Fragment key={`w${li}-${wi}`}>
                  {split === "words" ? (
                    renderUnit(word, li, wi, `u${li}-${wi}`)
                  ) : (
                    <span className="inline-block whitespace-nowrap">
                      {Array.from(word).map((ch, ci) => renderUnit(ch, li, charStarts[wi] + ci, `c${li}-${wi}-${ci}`))}
                    </span>
                  )}
                  {wi < words.length - 1 ? " " : null}
                </Fragment>
              ));
        return (
          <span
            key={li}
            aria-hidden
            className={cn(
              "block",
              variant === "mask" && "overflow-hidden pb-[0.12em] -mb-[0.12em]",
              lc,
            )}
          >
            {content}
          </span>
        );
      })}
    </Tag>
  );
}
