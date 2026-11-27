"use client";

import { useCallback, useRef } from "react";
import { RESTAURANT_SCRUB } from "@/components/site/restaurant/restaurant-motion.config";
import { RestaurantSceneLabel } from "@/components/site/restaurant/restaurant-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

export function RestaurantFooterTransition({ closingLabel }: { closingLabel: string }) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const wordmark = section.querySelector<HTMLElement>("[data-restaurant-footer-wordmark]");
    const line = section.querySelector<HTMLElement>("[data-restaurant-footer-line]");

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        scroller: document.documentElement,
        start: "top 90%",
        end: "top 28%",
        scrub: RESTAURANT_SCRUB.footer,
      },
    });
    if (line) timeline.fromTo(line, { scaleX: 0 }, { scaleX: 1, ease: "power2.out", duration: 0.45 }, 0);
    if (wordmark) {
      timeline.fromTo(wordmark, { yPercent: 55, autoAlpha: 0.25 }, { yPercent: 0, autoAlpha: 1, ease: "power2.out", duration: 0.85 }, 0.1);
    }
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section ref={root} data-cinema="restaurant-footer" className="bg-canvas px-[5vw] py-20 text-paper md:py-28">
      <div className="mx-auto flex flex-col items-center justify-center">
        <RestaurantSceneLabel className="mb-6">{closingLabel}</RestaurantSceneLabel>
        <div data-restaurant-footer-line className="mb-8 h-px w-full max-w-lg origin-left bg-line" aria-hidden="true" />
        <div className="w-full overflow-hidden pb-[0.16em]">
          <p
            data-restaurant-footer-wordmark
            className="halden-spaced select-none text-center text-[clamp(3.6rem,14vw,11.5rem)] font-light leading-[0.88] tracking-[0.08em] text-paper motion-reduce:translate-y-0"
          >
            peacock
          </p>
        </div>
      </div>
    </section>
  );
}
