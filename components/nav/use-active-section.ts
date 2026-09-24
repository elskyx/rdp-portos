"use client";

import { useEffect, useState } from "react";
import type { NavId } from "@/lib/content";

const NAV_IDS = new Set<string>(["work", "experiments", "about", "contact"]);

/**
 * Which `[data-nav]` section currently crosses the centre band of the
 * viewport (45%–50% from the top). `null` while the hero (no data-nav) is
 * in the band. Sections may mount after the navigation (dynamic imports,
 * lab pages) — a MutationObserver picks them up; text-only mutations
 * (scramble / counters writing textContent) are ignored so it stays cheap.
 */
export function useActiveSection(): NavId | null {
  const [active, setActive] = useState<NavId | null>(null);

  useEffect(() => {
    const visible = new Set<Element>();
    const observed = new WeakSet<Element>();

    const resolve = () => {
      let next: NavId | null = null;
      for (const el of visible) {
        if (!el.isConnected) {
          visible.delete(el);
          continue;
        }
        const id = el.getAttribute("data-nav");
        if (id && NAV_IDS.has(id)) next = id as NavId;
      }
      setActive(next);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        resolve();
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    const scan = () => {
      const els = document.querySelectorAll("[data-nav]");
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (observed.has(el)) continue;
        observed.add(el);
        io.observe(el);
      }
    };
    scan();

    let raf = 0;
    const mo = new MutationObserver((records) => {
      if (raf) return;
      let structural = false;
      for (let r = 0; r < records.length && !structural; r++) {
        const rec = records[r];
        for (let i = 0; i < rec.addedNodes.length; i++) {
          if (rec.addedNodes[i].nodeType === 1) {
            structural = true;
            break;
          }
        }
        if (!structural && rec.removedNodes.length) {
          for (let i = 0; i < rec.removedNodes.length; i++) {
            if (rec.removedNodes[i].nodeType === 1) {
              structural = true;
              break;
            }
          }
        }
      }
      if (!structural) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        scan();
        resolve();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return active;
}
