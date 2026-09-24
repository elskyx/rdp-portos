"use client";

/**
 * Single GSAP entry point. GSAP is only used where scroll choreography gets
 * complex (pinned / scrubbed timelines). Everything else uses Motion.
 * Lenis drives GSAP's ticker, and ScrollTrigger is updated on every Lenis
 * scroll (see components/smooth-scroll.tsx).
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };
