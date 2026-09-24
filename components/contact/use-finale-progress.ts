"use client";

/**
 * Writes `scrollState.finaleProgress` for the WebGL finale.
 *
 *   finaleProgress = clamp((scrollY + innerHeight - sectionTop) / innerHeight)
 *   0 → section top is at (or below) the viewport bottom
 *   1 → section top has reached the viewport top
 *
 * `sectionTop` is cached in document coordinates and re-measured on resize and
 * whenever the document body changes size (images / fonts / late sections).
 * The scroll listener is allocation-free; an optional `onProgress` callback lets
 * the section drive decorative transforms from the same value (no React state).
 */
import { useEffect, useRef, type RefObject } from "react";
import { clamp } from "@/lib/animations";
import { onScroll, scrollState, type ScrollState } from "@/lib/scroll-store";

export function useFinaleProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress?: (progress: number) => void,
) {
  const cbRef = useRef(onProgress);
  useEffect(() => {
    cbRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let top = 0;
    let vh = window.innerHeight || 1;
    let last = -1;

    const update = (s: ScrollState) => {
      const p = clamp((s.y + vh - top) / vh);
      scrollState.finaleProgress = p;
      if (p !== last) {
        last = p;
        cbRef.current?.(p);
      }
    };

    const measure = () => {
      vh = window.innerHeight || 1;
      top = el.getBoundingClientRect().top + window.scrollY;
      update(scrollState);
    };

    measure();
    const off = onScroll(update);
    window.addEventListener("resize", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);

    return () => {
      off();
      window.removeEventListener("resize", measure);
      ro.disconnect();
      scrollState.finaleProgress = 0;
    };
  }, [ref]);
}
