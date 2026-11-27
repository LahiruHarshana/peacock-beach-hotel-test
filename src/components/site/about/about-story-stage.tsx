"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef } from "react";
import { ABOUT_SCRUB } from "@/components/site/about/about-motion.config";
import { aboutRevealLines, aboutScrollTimeline } from "@/components/site/about/about-motion-utils";
import { AboutBody, AboutLine, AboutSceneLabel } from "@/components/site/about/about-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

/**
 * Horizontal cinema film reel for Scene 03: glides smoothly sideways on scroll
 * (identical layout and animation on mobile and desktop).
 */
export function AboutStoryStage({
  sceneTag,
  eyebrow,
  headline,
  body,
  mainUrl,
  secondaryUrl,
  detailUrl,
  mainAlt,
}: {
  sceneTag: string;
  eyebrow: string;
  headline: string;
  body: string;
  mainUrl: string;
  secondaryUrl: string;
  detailUrl: string;
  mainAlt: string;
}) {
  const root = useRef<HTMLElement>(null);
  const frames = useMemo(
    () => [
      { src: mainUrl, alt: mainAlt },
      { src: secondaryUrl, alt: "" },
      { src: detailUrl, alt: "" },
    ],
    [detailUrl, mainAlt, mainUrl, secondaryUrl],
  );

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const track = section.querySelector<HTMLElement>("[data-about-strip-track]");
    const media = gsap.utils.toArray<HTMLElement>("[data-about-strip-media]", section);
    const copy = section.querySelector<HTMLElement>("[data-about-deck-copy]");
    const steps = gsap.utils.toArray<HTMLElement>("[data-about-strip-step]", section);
    const rule = section.querySelector<HTMLElement>("[data-about-hospitality-rule]");
    const bar = section.querySelector<HTMLElement>("[data-about-strip-bar]");

    const timeline = aboutScrollTimeline(gsap, section, ABOUT_SCRUB.hospitality);

    if (copy) {
      timeline.fromTo(copy, { x: -24, autoAlpha: 0.35 }, { x: 0, autoAlpha: 1, ease: "power2.out", duration: 0.22 }, 0);
    }
    aboutRevealLines(gsap, section, "[data-about-line]", timeline, 0.04, 0.22);
    if (rule) timeline.fromTo(rule, { scaleY: 0 }, { scaleY: 1, ease: "power2.out", duration: 0.28 }, 0.06);

    if (track) {
      timeline.fromTo(track, { xPercent: 0 }, { xPercent: -66.7, ease: "none", duration: 0.78 }, 0.14);
    }

    media.forEach((item, index) => {
      const beat = index * 0.24;
      timeline.fromTo(item, { scale: 1.14 }, { scale: 1, ease: "none", duration: 0.36 }, beat + 0.08);
    });

    if (bar) timeline.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);

    timeline.eventCallback("onUpdate", () => {
      const progress = timeline.progress();
      const active = progress < 0.38 ? 0 : progress < 0.72 ? 1 : 2;
      steps.forEach((step, index) => step.toggleAttribute("data-active", index === active));
    });
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      data-cinema="about-hospitality"
      className="relative h-[240svh] overflow-clip bg-surface text-paper motion-reduce:h-auto"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-7 overflow-hidden px-[5vw] pb-10 pt-20 md:grid md:grid-cols-12 md:items-center md:gap-0 md:px-[7vw] md:py-0 motion-reduce:relative motion-reduce:h-auto motion-reduce:py-16">
        <div
          data-about-hospitality-rule
          className="absolute bottom-10 left-[41.5%] top-24 hidden w-px origin-top bg-line md:block"
          aria-hidden="true"
        />

        <div data-about-deck-copy className="relative z-20 w-full md:col-span-4 md:pr-[3vw]">
          <AboutSceneLabel className="mb-3 text-signal md:mb-4">{sceneTag}</AboutSceneLabel>
          <p className="about-hospitality-kicker mb-2 md:mb-3">{eyebrow}</p>
          <h2 className="font-light tracking-[-0.045em] text-[clamp(2rem,3.6vw,3.75rem)] leading-[1.02] text-paper">
            <AboutLine>{headline}</AboutLine>
          </h2>
          <AboutBody className="mt-3 max-w-md text-sm md:mt-6 md:text-base">{body}</AboutBody>
        </div>

        <div className="relative w-full md:col-span-8 md:pl-[4vw]">
          <div className="overflow-hidden rounded-2xl">
            <div
              data-about-strip-track
              className="flex w-[309%] gap-3 will-change-transform md:gap-5 motion-reduce:w-full motion-reduce:flex-col motion-reduce:gap-4"
            >
              {frames.map((frame, index) => (
                <figure
                  key={frame.src + index}
                  data-about-strip-panel
                  className="relative aspect-[4/3.6] w-[32%] shrink-0 overflow-hidden rounded-2xl border border-line bg-canvas shadow-[0_24px_72px_rgb(8_43_45_/_0.1)] md:aspect-[5/4] motion-reduce:w-full"
                >
                  <div data-about-strip-media className="relative h-full w-full overflow-hidden will-change-transform">
                    <Image src={frame.src} alt={frame.alt} fill className="object-cover" sizes="(min-width: 768px) 42vw, 90vw" />
                  </div>
                </figure>
              ))}
            </div>
          </div>

          <div className="about-hospitality-progress mt-5 flex items-center justify-between gap-4 md:mt-8">
            <StripProgress total={frames.length} />
            <span className="relative mx-2 h-px flex-1 overflow-hidden bg-line md:mx-4" aria-hidden="true">
              <span data-about-strip-bar className="absolute inset-0 origin-left scale-x-0 bg-signal" />
            </span>
            <span className="text-[0.52rem] uppercase tracking-[0.24em] text-mist" aria-hidden="true">
              Scroll
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function StripProgress({ total }: { total: number }) {
  return (
    <div className="flex items-center gap-2 md:gap-4">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          data-about-strip-step
          data-active={index === 0 ? "true" : undefined}
          className="relative pl-3.5 text-mist/60 transition-colors duration-500 before:absolute before:left-0 before:top-1/2 before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-line before:transition-colors before:duration-500 data-[active=true]:text-paper data-[active=true]:before:bg-signal md:pl-4"
        >
          0{index + 1}
        </span>
      ))}
    </div>
  );
}
