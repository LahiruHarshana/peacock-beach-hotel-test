"use client";

import { useEffect, useRef, type RefObject } from "react";

type Build = (
  gsap: typeof import("gsap").default,
  scrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger,
) => void;

let refreshFrame: number | null = null;

function scheduleRefresh(scrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger) {
  if (refreshFrame !== null) window.cancelAnimationFrame(refreshFrame);

  refreshFrame = window.requestAnimationFrame(() => {
    refreshFrame = window.requestAnimationFrame(() => {
      refreshFrame = null;
      scrollTrigger.sort();
      scrollTrigger.refresh();
    });
  });
}

/** Loads GSAP after paint and removes timelines when the component unmounts. */
export function useCinematic(scope: RefObject<HTMLElement | null>, build: Build, query: string) {
  const buildRef = useRef(build);

  useEffect(() => {
    buildRef.current = build;
    const root = scope.current;
    if (!root) return;
    let revert = () => {};
    let cancelled = false;

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !scope.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add(query, () => {
        const context = gsap.context(() => buildRef.current(gsap, ScrollTrigger), scope);
        scheduleRefresh(ScrollTrigger);
        return () => context.revert();
      });
      revert = () => media.revert();
    })();

    return () => {
      cancelled = true;
      revert();
    };
  }, [build, query, scope]);
}
