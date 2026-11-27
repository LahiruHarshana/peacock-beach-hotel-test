"use client";

import { useLayoutEffect, type RefObject } from "react";
import { prefersReducedMotion } from "@/lib/motion/gsap-runtime";
import { whenScrollReady } from "@/lib/motion/lenis-scroll";

export function useHaldenReveal(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const section = scope.current;
    if (!section || prefersReducedMotion()) return;
    let revert = () => {};
    let cancelled = false;
    void (async () => {
      try {
        const { gsap, ScrollTrigger } = await whenScrollReady();
        if (cancelled) return;
        const nodes = section.querySelectorAll("[data-reveal]");
        if (!nodes.length) return;

        const scroller = document.documentElement;

        const context = gsap.context(() => {
          gsap.fromTo(
            nodes,
            { yPercent: 108, clipPath: "inset(0 0 100% 0)" },
            {
              yPercent: 0,
              clipPath: "inset(0 0 0% 0)",
              ease: "none",
              stagger: 0.05,
              scrollTrigger: {
                trigger: section,
                scroller,
                start: "top 88%",
                end: "top 52%",
                scrub: 0.45,
              },
            },
          );
        }, section);
        requestAnimationFrame(() => ScrollTrigger.refresh());
        revert = () => context.revert();
      } catch {
        /* SmoothScroll not mounted (e.g. tests) */
      }
    })();
    return () => {
      cancelled = true;
      revert();
    };
  }, [scope]);
}