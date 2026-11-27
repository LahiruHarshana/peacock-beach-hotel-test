"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { ABOUT_SCRUB } from "@/components/site/about/about-motion.config";
import { aboutRevealLines, aboutScrollTimeline } from "@/components/site/about/about-motion-utils";
import { AboutDisplayTitle, AboutLine, AboutSceneLabel } from "@/components/site/about/about-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

/**
 * Widescreen cinema showcase: a 3D-tilted coastal frame levels into full
 * panoramic focus as you scroll (identical on mobile and desktop).
 */
export function AboutIntroScene({
  sceneTag,
  headline,
  statement,
  image,
  alt,
}: {
  sceneTag: string;
  headline: string;
  statement: string;
  image: string;
  alt: string;
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const stage = section.querySelector<HTMLElement>("[data-about-intro-stage]");
    const frame = section.querySelector<HTMLElement>("[data-about-intro-frame]");
    const media = section.querySelector<HTMLElement>("[data-about-intro-media]");
    const copy = section.querySelector<HTMLElement>("[data-about-intro-copy]");
    const progress = section.querySelector<HTMLElement>("[data-about-intro-meter]");

    const timeline = aboutScrollTimeline(gsap, section, ABOUT_SCRUB.intro);

    if (stage) {
      gsap.set(stage, { transformPerspective: 1400, transformStyle: "preserve-3d" });
      timeline.fromTo(
        stage,
        { rotateX: 9, scale: 0.88, yPercent: 6 },
        { rotateX: 0, scale: 1, yPercent: 0, ease: "power2.out", duration: 0.55 },
        0,
      );
    }
    if (frame) {
      timeline.fromTo(
        frame,
        { clipPath: "inset(6% 7% 6% 7% round 22px)" },
        { clipPath: "inset(0% 0% 0% 0% round 16px)", ease: "power2.inOut", duration: 0.6 },
        0,
      );
    }
    if (media) {
      timeline.fromTo(media, { scale: 1.18, yPercent: 4 }, { scale: 1, yPercent: -4, ease: "none", duration: 1 }, 0);
    }
    if (copy) {
      timeline.fromTo(copy, { y: 36, autoAlpha: 0.2 }, { y: 0, autoAlpha: 1, ease: "power3.out", duration: 0.42 }, 0.1);
    }
    aboutRevealLines(gsap, section, "[data-about-line]", timeline, 0.14, 0.24);
    if (progress) {
      timeline.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
    }
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      data-cinema="about-intro"
      className="home-ivory-blue relative h-[220svh] text-paper motion-reduce:h-auto"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between overflow-hidden px-[5vw] pb-8 pt-20 motion-reduce:relative motion-reduce:min-h-[100svh] md:px-[7vw] md:pb-10 md:pt-24">
        <div className="relative z-20 flex items-center justify-between">
          <AboutSceneLabel>{sceneTag}</AboutSceneLabel>
          <span className="h-px w-16 bg-paper/20" aria-hidden="true" />
        </div>

        <div
          data-about-intro-stage
          className="relative my-auto h-[62svh] w-full will-change-transform md:h-[64svh]"
        >
          <figure
            data-about-intro-frame
            className="relative h-full w-full overflow-hidden rounded-[1.25rem] border border-paper/10 bg-surface shadow-[0_28px_90px_rgb(8_43_45_/_0.14)] will-change-[clip-path]"
          >
            <div data-about-intro-media className="absolute inset-[-6%] will-change-transform">
              <Image src={image} alt={alt} fill className="object-cover" sizes="92vw" />
            </div>
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/95 via-canvas/50 to-transparent"
              aria-hidden="true"
            />
            <div
              data-about-intro-copy
              className="absolute inset-x-5 bottom-6 z-10 flex flex-col gap-3 md:inset-x-12 md:bottom-10 md:flex-row md:items-end md:justify-between md:gap-4"
            >
              <AboutDisplayTitle className="max-w-[10ch] text-[clamp(2.2rem,5.5vw,5.4rem)] leading-[0.9] text-paper">
                <AboutLine>{headline}</AboutLine>
              </AboutDisplayTitle>
              <p className="max-w-md text-xs leading-relaxed text-paper/80 md:text-base">{statement}</p>
            </div>
          </figure>
        </div>

        <div className="relative z-20 flex items-center gap-4 text-[0.52rem] uppercase tracking-[0.26em] text-mist">
          <span>02</span>
          <span className="relative h-px flex-1 overflow-hidden bg-line">
            <span data-about-intro-meter className="absolute inset-0 origin-left scale-x-0 bg-signal motion-reduce:scale-x-100" />
          </span>
          <span>Unawatuna</span>
        </div>
      </div>
    </section>
  );
}
