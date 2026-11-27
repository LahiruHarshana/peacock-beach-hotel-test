"use client";

import { useLayoutEffect } from "react";
import { whenScrollReady } from "@/lib/motion/lenis-scroll";

/** One coordinated ScrollTrigger refresh after home cinematic blocks mount. */
export function useHomeScrollRefresh(enabled: boolean) {
  useLayoutEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const refresh = () => {
      if (cancelled) return;
      void whenScrollReady().then(({ ScrollTrigger }) => ScrollTrigger.refresh());
    };

    const onLoad = () => refresh();

    requestAnimationFrame(() => {
      requestAnimationFrame(refresh);
    });
    const late = window.setTimeout(refresh, 400);

    if (document.readyState === "complete") {
      refresh();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      cancelled = true;
      window.clearTimeout(late);
      window.removeEventListener("load", onLoad);
    };
  }, [enabled]);
}
