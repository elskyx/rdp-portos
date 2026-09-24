"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { appStore } from "@/lib/app-store";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { emitScroll, scrollState, setLenis } from "@/lib/scroll-store";

/**
 * Global scroll engine.
 *  - Lenis inertia scrolling (desktop + touch keeps native feel via syncTouch=false)
 *  - Lenis is ticked by GSAP's ticker so ScrollTrigger stays frame-perfect
 *  - Writes y / velocity / direction / progress + pointer NDC into scrollState
 *  - Locks scrolling while the loader runs and while the mobile menu is open
 *  - prefers-reduced-motion → native scrolling, no inertia
 */
export function SmoothScroll() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const onPointer = (e: PointerEvent) => {
      scrollState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    // --- Reduced motion: native scroll, still feed the shared state -------
    if (reduce) {
      let lastY = window.scrollY;
      const onNative = () => {
        const y = window.scrollY;
        const max = Math.max(1, root.scrollHeight - window.innerHeight);
        scrollState.velocity = y - lastY;
        scrollState.direction = y > lastY ? 1 : y < lastY ? -1 : 0;
        scrollState.y = y;
        scrollState.progress = y / max;
        lastY = y;
        emitScroll();
      };
      const syncLock = () => {
        const { loaded, menuOpen } = appStore.get();
        root.style.overflow = !loaded || menuOpen ? "hidden" : "";
      };
      window.addEventListener("scroll", onNative, { passive: true });
      const unsub = appStore.subscribe(syncLock);
      syncLock();
      onNative();
      return () => {
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("scroll", onNative);
        unsub();
        root.style.overflow = "";
      };
    }

    // --- Lenis inertia --------------------------------------------------------
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
      syncTouch: false,
    });
    setLenis(lenis);

    const offScroll = lenis.on("scroll", (l: Lenis) => {
      scrollState.y = l.scroll;
      scrollState.velocity = l.velocity;
      scrollState.direction = l.direction;
      scrollState.progress = l.progress;
      ScrollTrigger.update();
      emitScroll();
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const syncLock = () => {
      const { loaded, menuOpen } = appStore.get();
      if (!loaded || menuOpen) lenis.stop();
      else lenis.start();
    };
    const unsub = appStore.subscribe(syncLock);
    syncLock();

    return () => {
      window.removeEventListener("pointermove", onPointer);
      unsub();
      offScroll();
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
