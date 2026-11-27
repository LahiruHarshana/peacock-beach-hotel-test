"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef } from "react";
import { ABOUT_HERO_CLIP, ABOUT_SCRUB } from "@/components/site/about/about-motion.config";
import { aboutScrollTimeline } from "@/components/site/about/about-motion-utils";
import { AboutDisplayTitle, AboutSceneLabel } from "@/components/site/about/about-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

type AboutFilmLeaderProps = {
  sceneTag: string;
  eyebrow: string;
  kicker: string;
  title: string;
  subtitle: string;
  scrollLabel: string;
  image: string;
  secondaryImage: string;
  reelImageTwo: string;
  reelImageThree: string;
  alt: string;
};

/**
 * Editorial split hero for the About page that opens into a continuous
 * multi-frame scroll-scrubbed cinema sequence (identical on mobile and desktop).
 */
export function AboutFilmLeader({
  sceneTag,
  eyebrow,
  kicker,
  title,
  subtitle,
  scrollLabel,
  image,
  secondaryImage,
  reelImageTwo,
  reelImageThree,
  alt,
}: AboutFilmLeaderProps) {
  const root = useRef<HTMLElement>(null);
  const titleWords = useMemo(() => title.split(/\s+/).filter(Boolean), [title]);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;

    const frame = section.querySelector<HTMLElement>("[data-about-hero-frame]");
    const border = section.querySelector<HTMLElement>("[data-about-hero-border]");
    const media = section.querySelector<HTMLElement>("[data-about-hero-media]");
    const cutTwo = section.querySelector<HTMLElement>("[data-about-hero-cut-two]");
    const cutTwoMedia = section.querySelector<HTMLElement>("[data-about-hero-cut-two-media]");
    const cutThree = section.querySelector<HTMLElement>("[data-about-hero-cut-three]");
    const cutThreeMedia = section.querySelector<HTMLElement>("[data-about-hero-cut-three-media]");
    const scrim = section.querySelector<HTMLElement>("[data-about-hero-scrim]");
    const washes = gsap.utils.toArray<HTMLElement>("[data-about-hero-wash]", section);
    const copyWrap = section.querySelector<HTMLElement>("[data-about-hero-copy]");
    const kickerEl = section.querySelector<HTMLElement>("[data-about-hero-kicker]");
    const lines = gsap.utils.toArray<HTMLElement>("[data-about-hero-line]", section);
    const rule = section.querySelector<HTMLElement>("[data-about-hero-rule]");
    const subtitleEl = section.querySelector<HTMLElement>("[data-about-hero-subtitle]");
    const insetWrap = section.querySelector<HTMLElement>("[data-about-hero-inset-wrap]");
    const insetCard = section.querySelector<HTMLElement>("[data-about-hero-inset]");
    const insetMedia = section.querySelector<HTMLElement>("[data-about-hero-inset-media]");
    const meter = section.querySelector<HTMLElement>("[data-about-hero-meter]");
    const frameTag = section.querySelector<HTMLElement>("[data-about-hero-frame-tag]");

    const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (kickerEl) entrance.from(kickerEl, { y: 12, autoAlpha: 0, duration: 0.6 }, 0.05);
    if (lines.length > 0) entrance.from(lines, { yPercent: 108, duration: 0.85, stagger: 0.08 }, 0.1);
    if (rule) entrance.from(rule, { scaleX: 0, duration: 0.7, ease: "power2.out" }, 0.28);
    if (subtitleEl) entrance.from(subtitleEl, { y: 14, autoAlpha: 0, duration: 0.65 }, 0.34);
    if (insetCard) entrance.from(insetCard, { y: 24, scale: 0.94, autoAlpha: 0, duration: 0.85, ease: "power2.out" }, 0.24);

    const timeline = aboutScrollTimeline(gsap, section, ABOUT_SCRUB.opening);

    if (copyWrap) timeline.to(copyWrap, { y: -48, autoAlpha: 0, ease: "power2.inOut", duration: 0.24 }, 0.04);
    if (insetWrap) timeline.to(insetWrap, { yPercent: -32, xPercent: -8, rotate: -2, autoAlpha: 0, ease: "power2.in", duration: 0.26 }, 0.03);
    if (border) timeline.to(border, { scale: 1.03, autoAlpha: 0, ease: "power2.out", duration: 0.24 }, 0.04);
    if (frame) {
      timeline.fromTo(
        frame,
        { clipPath: ABOUT_HERO_CLIP.start },
        { clipPath: ABOUT_HERO_CLIP.full, ease: "power2.inOut", duration: 0.38 },
        0.05,
      );
    }
    if (media) timeline.fromTo(media, { scale: 1.14, yPercent: 3 }, { scale: 1.02, yPercent: -3, ease: "none", duration: 0.55 }, 0);
    if (insetMedia) timeline.fromTo(insetMedia, { scale: 1.08 }, { scale: 1, ease: "none", duration: 0.3 }, 0);

    if (cutTwo) timeline.fromTo(cutTwo, { autoAlpha: 0 }, { autoAlpha: 1, ease: "power1.inOut", duration: 0.22 }, 0.42);
    if (cutTwoMedia) timeline.fromTo(cutTwoMedia, { scale: 1.1, yPercent: 2 }, { scale: 1, yPercent: -3, ease: "none", duration: 0.42 }, 0.4);
    if (cutThree) timeline.fromTo(cutThree, { autoAlpha: 0 }, { autoAlpha: 1, ease: "power1.inOut", duration: 0.22 }, 0.72);
    if (cutThreeMedia) timeline.fromTo(cutThreeMedia, { scale: 1.09, yPercent: 2 }, { scale: 1, yPercent: -2, ease: "none", duration: 0.3 }, 0.7);

    if (frameTag) {
      timeline.fromTo(frameTag, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.16 }, 0.44);
      timeline.to(frameTag, { autoAlpha: 0, y: -10, ease: "power2.in", duration: 0.12 }, 0.88);
    }

    if (scrim) timeline.fromTo(scrim, { opacity: 0.25 }, { opacity: 0.62, ease: "power1.inOut", duration: 0.35 }, 0.22);
    if (washes.length > 0) timeline.fromTo(washes, { opacity: 0 }, { opacity: 1, ease: "power1.inOut", duration: 0.28 }, 0.18);
    if (meter) timeline.fromTo(meter, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      data-cinema="about-opening"
      className="relative h-[260svh] bg-canvas motion-reduce:h-auto"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:relative motion-reduce:min-h-[100svh]">
        <div className="halden-light-grid pointer-events-none absolute inset-0 z-[1] opacity-[0.3]" aria-hidden="true" />

        <div
          data-about-hero-border
          className="pointer-events-none absolute bottom-[12svh] left-[44vw] right-[5.5vw] top-[15svh] z-[9] rounded-[20px] border border-paper/15 shadow-[0_24px_70px_rgb(8_43_45_/_0.14)] will-change-[transform,opacity]"
          aria-hidden="true"
        />

        <div
          data-about-hero-frame
          className="about-hero-frame absolute inset-0 z-10 overflow-hidden will-change-[clip-path]"
        >
          <div data-about-hero-media className="absolute inset-[-6%] will-change-transform">
            <Image
              src={image}
              alt={alt}
              fill
              className="object-cover object-[center_44%]"
              sizes="100vw"
              priority
            />
          </div>

          <div data-about-hero-cut-two className="pointer-events-none absolute inset-0 opacity-0 will-change-opacity">
            <div data-about-hero-cut-two-media className="absolute inset-[-6%] will-change-transform">
              <Image src={reelImageTwo} alt="" fill className="object-cover" sizes="100vw" />
            </div>
          </div>

          <div data-about-hero-cut-three className="pointer-events-none absolute inset-0 opacity-0 will-change-opacity">
            <div data-about-hero-cut-three-media className="absolute inset-[-6%] will-change-transform">
              <Image src={reelImageThree} alt="" fill className="object-cover" sizes="100vw" />
            </div>
          </div>

          <div
            data-about-hero-scrim
            className="about-hero-scrim pointer-events-none absolute inset-0 opacity-25"
            aria-hidden="true"
          />
          <div
            data-about-hero-wash
            className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-canvas via-canvas/80 to-transparent opacity-0"
            aria-hidden="true"
          />
          <div
            data-about-hero-wash
            className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-canvas/95 via-canvas/60 to-transparent opacity-0"
            aria-hidden="true"
          />
        </div>

        <div
          data-about-hero-inset-wrap
          className="pointer-events-none absolute bottom-[15svh] left-[36vw] z-20 w-[16vw] max-w-[13rem] will-change-[transform,opacity] md:left-[35.5vw] md:w-[13.5vw]"
        >
          <figure
            data-about-hero-inset
            className="relative aspect-[3/4] w-full overflow-hidden rounded-[0.9rem] border-[0.3rem] border-canvas bg-surface shadow-[0_24px_65px_rgb(8_43_45_/_0.2)] will-change-transform md:border-[0.4rem]"
          >
            <div data-about-hero-inset-media className="absolute inset-[-6%] will-change-transform">
              <Image src={secondaryImage} alt="" fill className="object-cover" sizes="16vw" priority />
            </div>
          </figure>
        </div>

        <div
          data-about-hero-meta
          className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-[5vw] pb-6 pt-20 md:px-[7vw]"
        >
          <AboutSceneLabel>{sceneTag}</AboutSceneLabel>
          <AboutSceneLabel>{eyebrow}</AboutSceneLabel>
        </div>

        <div
          data-about-hero-copy
          className="absolute left-[5vw] top-1/2 z-30 max-w-[35vw] -translate-y-1/2 will-change-[transform,opacity] md:left-[7vw] md:max-w-[31vw]"
        >
          <p data-about-hero-kicker className="about-scene-label mb-3 text-signal md:mb-5">
            {kicker}
          </p>
          <AboutDisplayTitle
            as="h1"
            className="max-w-[9ch] text-[clamp(2.2rem,7vw,7.2rem)] leading-[0.88] tracking-[-0.06em]"
          >
            {titleWords.map((word, index) => (
              <span key={`${word}-${index}`} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
                <span data-about-hero-line className="block will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </AboutDisplayTitle>
          <div
            data-about-hero-rule
            className="mt-4 h-px w-16 origin-left bg-paper/25 md:mt-7 md:w-20"
            aria-hidden="true"
          />
          <p
            data-about-hero-subtitle
            className="mt-3 max-w-[26ch] text-xs leading-relaxed text-mist md:mt-5 md:text-[0.98rem]"
          >
            {subtitle}
          </p>
        </div>

        <div
          data-about-hero-frame-tag
          className="pointer-events-none absolute bottom-16 left-[5vw] z-30 rounded-full border border-paper/15 bg-canvas/85 px-4 py-1.5 text-[0.54rem] uppercase tracking-[0.24em] text-paper opacity-0 backdrop-blur-md md:left-[7vw]"
        >
          {eyebrow}
        </div>

        <div className="absolute inset-x-[5vw] bottom-6 z-30 flex items-center gap-4 text-[0.52rem] uppercase tracking-[0.26em] text-mist md:inset-x-[7vw] md:bottom-7">
          <span>{scrollLabel}</span>
          <span className="relative h-px flex-1 overflow-hidden bg-line">
            <span data-about-hero-meter className="absolute inset-0 origin-left scale-x-0 bg-signal motion-reduce:scale-x-100" />
          </span>
          <span>01</span>
        </div>
      </div>
    </section>
  );
}
