"use client";

import { useLayoutEffect, type RefObject } from "react";
import { prefersReducedMotion } from "@/lib/motion/gsap-runtime";
import { whenScrollReady } from "@/lib/motion/lenis-scroll";

export function useHaldenScroll(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;

    let revert = () => {};
    let cancelled = false;

    void (async () => {
      try {
        const { gsap, ScrollTrigger } = await whenScrollReady();
        if (cancelled) return;

        const scroller = document.documentElement;
        const scrub = 0.65;

        const context = gsap.context(() => {
          const skipCinema = (el: Element | null) => !!el?.closest("[data-cinema]");

          root.querySelectorAll<HTMLElement>("[data-word]").forEach((word) => {
            if (skipCinema(word)) return;
            gsap.fromTo(
              word,
              { yPercent: 110 },
              {
                yPercent: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: word,
                  scroller,
                  start: "top 96%",
                  end: "top 68%",
                  scrub,
                },
              },
            );
          });

          root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-row])").forEach((node) => {
            if (skipCinema(node)) return;
            gsap.fromTo(
              node,
              { y: 48, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: node,
                  scroller,
                  start: "top 92%",
                  end: "top 64%",
                  scrub,
                },
              },
            );
          });

          root.querySelectorAll<HTMLElement>("[data-fade]").forEach((node) => {
            if (skipCinema(node)) return;
            gsap.fromTo(
              node,
              { y: 36, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: node,
                  scroller,
                  start: "top 94%",
                  end: "top 70%",
                  scrub: 0.5,
                },
              },
            );
          });

          root.querySelectorAll<HTMLElement>("[data-row]").forEach((row, index) => {
            const fromX = index % 2 === 0 ? -56 : 56;
            gsap.fromTo(
              row,
              { x: fromX, y: 40, opacity: 0.15 },
              {
                x: 0,
                y: 0,
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: row,
                  scroller,
                  start: "top 94%",
                  end: "top 62%",
                  scrub: 0.7,
                },
              },
            );
          });

          root.querySelectorAll<HTMLElement>("[data-mask-in]").forEach((frame) => {
            gsap.fromTo(
              frame,
              { clipPath: "inset(18% 8% 18% 8%)", scale: 0.94 },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  scroller,
                  start: "top 92%",
                  end: "top 48%",
                  scrub: 0.8,
                },
              },
            );
          });

          root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((target) => {
            const host = target.parentElement ?? target;
            gsap.fromTo(
              target,
              { yPercent: -14, scale: 1.16 },
              {
                yPercent: 14,
                scale: 1.02,
                ease: "none",
                scrollTrigger: {
                  trigger: host,
                  scroller,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          });

          root.querySelectorAll<HTMLElement>("[data-rule-grow]").forEach((rule) => {
            gsap.fromTo(
              rule,
              { scaleX: 0, transformOrigin: "left center" },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: rule,
                  scroller,
                  start: "top 96%",
                  end: "top 70%",
                  scrub: 0.45,
                },
              },
            );
          });

          const rail = root.querySelector<HTMLElement>("[data-scroll-rail]");
          if (rail) {
            gsap.fromTo(
              rail,
              { scaleY: 0, transformOrigin: "top center" },
              {
                scaleY: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: root,
                  scroller,
                  start: "top 80%",
                  end: "bottom bottom",
                  scrub: 0.3,
                },
              },
            );
          }

          if (!root.hasAttribute("data-home-shell")) {
            ScrollTrigger.refresh();
          }
        }, root);

        revert = () => context.revert();
        if (!root.hasAttribute("data-home-shell")) {
          const refresh = () => ScrollTrigger.refresh();
          requestAnimationFrame(() => requestAnimationFrame(refresh));
        }
      } catch {
        /* tests / no smooth scroll */
      }
    })();

    return () => {
      cancelled = true;
      revert();
    };
  }, [scope]);
}
