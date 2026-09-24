"use client";

/**
 * MagneticButton — RDP's single button language. Built on the 21st.dev
 * motion-primitives Magnetic pattern, combined with a rolling label and a
 * swapping arrow. Fast + responsive: 450ms expo-out on every state.
 *
 *   ┌──────────────────────────┬─────┐
 *   │  EXPLORE WORK            │  ↗  │   hairline border, mono uppercase
 *   └──────────────────────────┴─────┘   hover: fill wipe, soft blue glow,
 *                                         label rolls, arrow exits/enters
 */
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import { scrollToTarget } from "@/lib/scroll-store";
import { cn } from "@/lib/utils";
import { Magnetic } from "./magnetic";

type IconName = "arrow-up-right" | "arrow-right" | "arrow-down" | "arrow-up" | "none";

export type MagneticButtonProps = {
  children: string;
  href?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  external?: boolean;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: IconName;
  className?: string;
  ariaLabel?: string;
  /** Magnetic pull 0..1 (0 disables). */
  magnetic?: number;
  /** Optional leading element (e.g. index number). */
  leading?: ReactNode;
};

const ICONS = {
  "arrow-up-right": ArrowUpRight,
  "arrow-right": ArrowRight,
  "arrow-down": ArrowDown,
  "arrow-up": ArrowUp,
} as const;

/** Exit / enter offsets per arrow direction (Tailwind classes). */
const ARROW_MOTION: Record<Exclude<IconName, "none">, { out: string; in: string }> = {
  "arrow-up-right": {
    out: "group-hover/mb:translate-x-[140%] group-hover/mb:-translate-y-[140%]",
    in: "-translate-x-[140%] translate-y-[140%] group-hover/mb:translate-x-0 group-hover/mb:translate-y-0",
  },
  "arrow-right": {
    out: "group-hover/mb:translate-x-[160%]",
    in: "-translate-x-[160%] group-hover/mb:translate-x-0",
  },
  "arrow-down": {
    out: "group-hover/mb:translate-y-[160%]",
    in: "-translate-y-[160%] group-hover/mb:translate-y-0",
  },
  "arrow-up": {
    out: "group-hover/mb:-translate-y-[160%]",
    in: "translate-y-[160%] group-hover/mb:translate-y-0",
  },
};

const SIZES = {
  sm: { root: "h-10 text-[0.625rem]", label: "px-4", icon: "w-10", svg: "size-3.5" },
  md: { root: "h-12 text-meta", label: "px-5 sm:px-6", icon: "w-12", svg: "size-4" },
  lg: { root: "h-14 sm:h-16 text-meta", label: "px-6 sm:px-8", icon: "w-14 sm:w-16", svg: "size-[1.1rem]" },
} as const;

const VARIANTS = {
  solid: {
    root: "bg-fg text-ink border-fg",
    fill: "bg-electric",
    hoverText: "group-hover/mb:text-white",
    divider: "bg-ink/15",
  },
  outline: {
    root: "bg-ink/20 text-fg border-line-strong backdrop-blur-[2px] hover:border-fg/40",
    fill: "bg-fg/[0.07]",
    hoverText: "",
    divider: "bg-line-strong",
  },
  ghost: {
    root: "bg-transparent text-fg border-transparent hover:border-line",
    fill: "bg-fg/[0.05]",
    hoverText: "",
    divider: "bg-transparent",
  },
} as const;

export function MagneticButton({
  children,
  href,
  onClick,
  external,
  variant = "outline",
  size = "md",
  icon = "arrow-up-right",
  className,
  ariaLabel,
  magnetic = 0.3,
  leading,
}: MagneticButtonProps) {
  const s = SIZES[size];
  const v = VARIANTS[variant];
  const Icon = icon === "none" ? null : ICONS[icon];
  const motionCls = icon === "none" ? null : ARROW_MOTION[icon];

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (href && href.startsWith("#")) {
      e.preventDefault();
      scrollToTarget(href === "#top" ? 0 : href);
    }
  };

  const classes = cn(
    "group/mb relative isolate inline-flex select-none items-stretch overflow-hidden rounded-[2px] border font-mono uppercase tracking-[0.18em]",
    "transition-[transform,box-shadow,border-color,color] duration-500 ease-out-expo",
    "hover:scale-[1.03] active:scale-[0.98]",
    "hover:shadow-[0_0_40px_-10px_rgba(61,139,255,0.55)]",
    s.root,
    v.root,
    className,
  );

  const inner = (
    <>
      {/* fill wipe */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 origin-bottom scale-y-0 transition-transform duration-500 ease-out-expo group-hover/mb:scale-y-100",
          v.fill,
        )}
      />
      {leading ? <span className="flex items-center pl-4 opacity-60">{leading}</span> : null}
      {/* rolling label — clipped to exactly one line box */}
      <span className={cn("relative flex items-center", s.label)}>
        <span className="relative block overflow-hidden py-[0.2em] leading-none">
          <span className={cn("block transition-transform duration-500 ease-out-expo group-hover/mb:-translate-y-[160%]", v.hoverText)}>
            {children}
          </span>
          <span
            aria-hidden
            className={cn(
              "absolute inset-x-0 top-[0.2em] block translate-y-[160%] transition-transform duration-500 ease-out-expo group-hover/mb:translate-y-0",
              v.hoverText,
            )}
          >
            {children}
          </span>
        </span>
      </span>
      {Icon && motionCls ? (
        <span className={cn("relative flex shrink-0 items-center justify-center", s.icon)}>
          <span aria-hidden className={cn("absolute left-0 top-1/4 h-1/2 w-px", v.divider)} />
          {/* icon swap — clipped to the icon's own box */}
          <span className={cn("relative block overflow-hidden", s.svg)}>
            <Icon
              aria-hidden
              className={cn("absolute inset-0 size-full transition-transform duration-500 ease-out-expo", motionCls.out, v.hoverText)}
              strokeWidth={1.5}
            />
            <Icon
              aria-hidden
              className={cn("absolute inset-0 size-full transition-transform duration-500 ease-out-expo", motionCls.in, v.hoverText)}
              strokeWidth={1.5}
            />
          </span>
        </span>
      ) : null}
    </>
  );

  const el = href ? (
    <a
      href={href}
      onClick={handleClick}
      aria-label={ariaLabel}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {inner}
    </a>
  ) : (
    <button type="button" onClick={handleClick} aria-label={ariaLabel} className={classes}>
      {inner}
    </button>
  );

  if (!magnetic) return el;
  return <Magnetic intensity={magnetic}>{el}</Magnetic>;
}
