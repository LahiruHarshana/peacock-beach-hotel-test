"use client";

import { useEffect } from "react";
import type { HomeHeroTheme } from "@/lib/content/home-hero";

export function HomeHeroThemeSync({ theme }: { theme: HomeHeroTheme }) {
  useEffect(() => {
    document.documentElement.dataset.homeHero = theme;
    return () => {
      delete document.documentElement.dataset.homeHero;
    };
  }, [theme]);

  return null;
}