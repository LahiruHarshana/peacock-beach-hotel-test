"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { useHaldenScroll } from "@/components/site/halden/use-halden-scroll";

type HaldenLightShellProps = {
  children: ReactNode;
  /** Show faint architectural column guides (Halden interior). */
  grid?: boolean;
  className?: string;
};

export function HaldenLightShell({ children, grid = true, className }: HaldenLightShellProps) {
  const root = useRef<HTMLDivElement>(null);
  useHaldenScroll(root);

  return (
    <div ref={root} className={["halden-light halden-light-shell relative text-paper", className].filter(Boolean).join(" ")}>
      {grid ? (
        <div className="halden-light-grid pointer-events-none absolute inset-0 z-0 opacity-[0.55]" aria-hidden="true" />
      ) : null}
      <div
        className="pointer-events-none absolute top-0 bottom-0 left-[max(0.75rem,2vw)] z-[2] hidden w-px bg-line/70 md:block"
        aria-hidden="true"
      >
        <div data-scroll-rail className="h-full w-full origin-top bg-paper" />
      </div>
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}