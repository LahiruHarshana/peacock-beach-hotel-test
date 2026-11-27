"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useHomeScrollRefresh } from "@/components/site/home/use-home-scroll-refresh";

export function AboutPageShell({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useHomeScrollRefresh(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-about-page", "");
    return () => document.documentElement.removeAttribute("data-about-page");
  }, []);

  return (
    <div
      ref={root}
      data-about-shell
      data-about-experience
      className="about-experience halden-light relative -mt-16 overflow-clip bg-canvas text-paper"
    >
      <div className="about-film-grain pointer-events-none absolute inset-0 z-[2]" aria-hidden="true" />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
