"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { useHaldenScroll } from "@/components/site/halden/use-halden-scroll";
import { useHomeScrollRefresh } from "@/components/site/home/use-home-scroll-refresh";

type HomePageShellProps = {
  children: ReactNode;
};

/** Light shell for home below the hero; motion targets only non-pinned closer copy. */
export function HomePageShell({ children }: HomePageShellProps) {
  const root = useRef<HTMLDivElement>(null);
  useHaldenScroll(root);
  useHomeScrollRefresh(true);

  return (
    <div
      ref={root}
      data-home-shell
      className="halden-light relative text-paper"
    >
      <div className="halden-light-grid pointer-events-none absolute inset-0 z-0 opacity-[0.4]" aria-hidden="true" />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}