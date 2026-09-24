"use client";

/**
 * CopyEmail — the address as a technical readout with a COPY action.
 * COPY → COPIED (1.5s) with a rolling label and an electric status dot.
 * Announced politely to screen readers. Falls back to a hidden textarea +
 * execCommand when the async Clipboard API is unavailable (http, old Safari).
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

async function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = async () => {
    const ok = await copyText(email);
    setState(ok ? "copied" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 1500);
  };

  const copied = state === "copied";

  return (
    <div className={cn("text-meta flex min-w-0 items-center gap-4", className)}>
      <span className="shrink-0 text-fg-dim">Email</span>
      <a
        href={`mailto:${email}`}
        className="min-w-0 truncate normal-case tracking-[0.06em] text-fg transition-colors duration-300 hover:text-electric-soft"
      >
        {email}
      </a>
      <span aria-hidden className="h-3 w-px shrink-0 bg-line-strong" />
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? "Email address copied" : `Copy email address ${email}`}
        className="group/copy relative flex shrink-0 items-center gap-2 py-2 text-fg-muted transition-colors duration-300 hover:text-fg"
      >
        <span
          aria-hidden
          className={cn(
            "size-1.5 rounded-full transition-[background-color,box-shadow,transform] duration-300",
            copied
              ? "scale-100 bg-electric shadow-[0_0_10px_rgba(61,139,255,0.8)]"
              : "scale-75 bg-fg-dim group-hover/copy:bg-fg-muted",
          )}
        />
        {/* rolling label: COPY ↔ COPIED */}
        <span aria-hidden className="relative block overflow-hidden leading-none">
          <span
            className={cn(
              "block py-[0.2em] transition-transform duration-500 ease-out-expo",
              copied || state === "failed" ? "-translate-y-full" : "translate-y-0",
            )}
          >
            Copy
          </span>
          <span
            className={cn(
              "absolute inset-x-0 top-0 block whitespace-nowrap py-[0.2em] transition-transform duration-500 ease-out-expo",
              copied || state === "failed" ? "translate-y-0" : "translate-y-full",
              copied ? "text-electric-soft" : "text-fg",
            )}
          >
            {state === "failed" ? "Press ⌘C" : "Copied"}
          </span>
          {/* width holder so the button never jumps */}
          <span className="invisible block h-0">Copied</span>
        </span>
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-1 h-px origin-left scale-x-0 bg-fg/40 transition-transform duration-300 ease-out-expo group-hover/copy:scale-x-100"
        />
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : state === "failed" ? "Copy failed — select the address to copy it" : ""}
      </span>
    </div>
  );
}
