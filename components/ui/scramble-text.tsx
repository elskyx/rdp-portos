"use client";

/**
 * ScrambleText — technical "decode" reveal for metadata values
 * (LOCATION → INDONESIA). Characters resolve left → right out of a mono
 * glyph set. Server renders the final text (no-JS safe); after mount the
 * element is armed and plays once when it enters view (or when `trigger`
 * becomes true). Reduced motion → final text immediately.
 */
import { useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/device";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_-+<>";

export type ScrambleTextProps = {
  text: string;
  className?: string;
  /** Total duration in ms. */
  duration?: number;
  delay?: number;
  trigger?: "view" | boolean;
  as?: "span" | "div" | "p";
};

export function ScrambleText({ text, className, duration = 900, delay = 0, trigger = "view", as = "span" }: ScrambleTextProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = usePrefersReducedMotion();
  const shouldPlay = trigger === "view" ? inView : trigger;

  // Effects only run on the client, so SSR/no-JS keeps the real text; once
  // mounted the value is masked until it plays.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = text;
      return;
    }
    if (!shouldPlay) {
      el.textContent = text.replace(/[^\s]/g, "·");
      return;
    }
    let raf = 0;
    let start = 0;
    const chars = Array.from(text);
    const tick = (now: number) => {
      if (!start) start = now + delay;
      const t = Math.max(0, now - start) / duration;
      let out = "";
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        if (c === " ") {
          out += " ";
          continue;
        }
        const resolveAt = (i / chars.length) * 0.75 + 0.2;
        out += t >= resolveAt ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (t < 1) raf = requestAnimationFrame(tick);
      else el.textContent = text;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shouldPlay, text, duration, delay, reduce]);

  const Tag = as;
  return (
    <Tag ref={ref as never} aria-label={text} className={cn("tabular-nums", className)}>
      {text}
    </Tag>
  );
}
