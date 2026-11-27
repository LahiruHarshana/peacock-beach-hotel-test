"use client";

import { useCallback, useRef } from "react";
import { ABOUT_SCRUB } from "@/components/site/about/about-motion.config";
import { aboutInFlowTimeline } from "@/components/site/about/about-motion-utils";
import { AboutSceneLabel } from "@/components/site/about/about-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

export function AboutFooterTransition({ closingLabel }: { closingLabel: string }) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const wordmark = section.querySelector<HTMLElement>("[data-about-footer-wordmark]");
    const line = section.querySelector<HTMLElement>("[data-about-footer-line]");
    const timeline = aboutInFlowTimeline(gsap, section, ABOUT_SCRUB.footer, "top 90%", "top 28%");

    if (line) timeline.fromTo(line, { scaleX: 0 }, { scaleX: 1, ease: "power2.out", duration: 0.45 }, 0);
    if (wordmark) {
      timeline.fromTo(wordmark, { yPercent: 60, autoAlpha: 0.25 }, { yPercent: 0, autoAlpha: 1, ease: "power2.out", duration: 0.85 }, 0.1);
      timeline.fromTo(wordmark, { letterSpacing: "0.18em" }, { letterSpacing: "0.08em", ease: "none", duration: 0.85 }, 0.1);
    }
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section ref={root} data-cinema="about-footer-bridge" className="bg-canvas px-[5vw] py-20 md:py-28">
      <div className="mx-auto flex flex-col items-center justify-center">
        <AboutSceneLabel className="mb-6">{closingLabel}</AboutSceneLabel>
        <div data-about-footer-line className="mb-8 h-px w-full max-w-lg origin-left bg-line" aria-hidden="true" />
        <div className="w-full overflow-hidden pb-[0.16em]">
          <p
            data-about-footer-wordmark
            className="halden-spaced select-none text-center text-[clamp(3.6rem,14vw,11.5rem)] font-light leading-[0.88] tracking-[0.08em] text-paper motion-reduce:translate-y-0"
          >
            peacock
          </p>
        </div>
      </div>
    </section>
  );
}
