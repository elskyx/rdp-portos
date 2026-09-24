"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

/**
 * "IDN 09:41" — local time in Jakarta, ticking on the minute. Rendered
 * client-only through useSyncExternalStore (server snapshot = placeholder),
 * so there is never a hydration mismatch.
 */
const fmt =
  typeof Intl !== "undefined"
    ? new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", hour12: false })
    : null;

function subscribe(cb: () => void) {
  let t: ReturnType<typeof setTimeout>;
  const schedule = () => {
    t = setTimeout(() => {
      cb();
      schedule();
    }, 60_000 - (Date.now() % 60_000) + 40);
  };
  schedule();
  return () => clearTimeout(t);
}

const getTime = () => (fmt ? fmt.format(Date.now()) : "--:--");
const getServerTime = () => "--:--";

export function LocalTime({ className }: { className?: string }) {
  const time = useSyncExternalStore(subscribe, getTime, getServerTime);
  const [hh, mm] = time.split(":");
  return (
    <p className={cn("text-meta flex items-center gap-2.5 text-fg-muted", className)}>
      <span className="text-fg-dim">IDN</span>
      <span aria-hidden className="h-px w-5 bg-line-strong" />
      <time className="tabular-nums text-fg" suppressHydrationWarning>
        <span className="sr-only">Local time in Indonesia </span>
        {hh}
        <span className="animate-pulse text-fg-muted [animation-duration:2s]">:</span>
        {mm}
      </time>
      <span className="text-fg-dim">GMT+7</span>
    </p>
  );
}
