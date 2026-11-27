"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useHomeScrollRefresh } from "@/components/site/home/use-home-scroll-refresh";

export function ReviewsPageShell({ children }: { children: ReactNode }) {
  useHomeScrollRefresh(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-reviews-page", "");
    return () => document.documentElement.removeAttribute("data-reviews-page");
  }, []);

  return (
    <div data-reviews-experience className="reviews-experience halden-light relative -mt-16 overflow-clip bg-canvas text-paper">
      <div className="halden-light-grid pointer-events-none absolute inset-0 z-0 opacity-[0.28]" aria-hidden="true" />
      <div className="about-film-grain pointer-events-none absolute inset-0 z-[2] opacity-[0.08]" aria-hidden="true" />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
