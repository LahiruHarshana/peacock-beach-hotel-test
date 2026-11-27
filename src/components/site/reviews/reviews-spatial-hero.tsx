"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { REVIEWS_HERO_CLIP, REVIEWS_PIN, REVIEWS_SCRUB } from "@/components/site/reviews/reviews-motion.config";
import { reviewsScrollTimeline } from "@/components/site/reviews/reviews-motion-utils";
import { ReviewsBody, ReviewsDisplayLine, ReviewsSceneLabel } from "@/components/site/reviews/reviews-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";
import type { ReviewPhotoSlot } from "@/components/site/reviews/types";

export function ReviewsSpatialHero({
  scene,
  eyebrow,
  title,
  lede,
  displayLine1,
  displayLine2,
  scrollLabel,
  photos,
}: {
  scene: string;
  eyebrow: string;
  title: string;
  lede: string;
  displayLine1: string;
  displayLine2: string;
  scrollLabel: string;
  photos: ReviewPhotoSlot[];
}) {
  const root = useRef<HTMLElement>(null);
  const mainPhoto = photos.find((p) => p.focal) ?? photos[0];
  const secondaryPhoto = photos.find((p) => !p.focal) ?? photos[0];
  const cutTwoPhoto = photos[1] ?? mainPhoto;
  const cutThreePhoto = photos[3] ?? photos[4] ?? mainPhoto;

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;

    const frame = section.querySelector<HTMLElement>("[data-reviews-hero-frame]");
    const border = section.querySelector<HTMLElement>("[data-reviews-hero-border]");
    const media = section.querySelector<HTMLElement>("[data-reviews-hero-media]");
    const cutTwo = section.querySelector<HTMLElement>("[data-reviews-hero-cut-two]");
    const cutTwoMedia = section.querySelector<HTMLElement>("[data-reviews-hero-cut-two-media]");
    const cutThree = section.querySelector<HTMLElement>("[data-reviews-hero-cut-three]");
    const cutThreeMedia = section.querySelector<HTMLElement>("[data-reviews-hero-cut-three-media]");
    const washes = gsap.utils.toArray<HTMLElement>("[data-reviews-hero-wash]", section);
    const copy = section.querySelector<HTMLElement>("[data-reviews-hero-copy]");
    const lines = gsap.utils.toArray<HTMLElement>("[data-reviews-line]", section);
    const kicker = section.querySelector<HTMLElement>("[data-reviews-hero-kicker]");
    const rule = section.querySelector<HTMLElement>("[data-reviews-hero-rule]");
    const ledeEl = section.querySelector<HTMLElement>("[data-reviews-hero-lede]");
    const insetWrap = section.querySelector<HTMLElement>("[data-reviews-hero-inset-wrap]");
    const insetCard = section.querySelector<HTMLElement>("[data-reviews-hero-inset]");
    const meter = section.querySelector<HTMLElement>("[data-reviews-hero-meter]");

    const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (kicker) entrance.from(kicker, { y: 12, autoAlpha: 0, duration: 0.6 }, 0.05);
    if (lines.length > 0) entrance.from(lines, { yPercent: 108, duration: 0.85, stagger: 0.08 }, 0.1);
    if (rule) entrance.from(rule, { scaleX: 0, duration: 0.7, ease: "power2.out" }, 0.28);
    if (ledeEl) entrance.from(ledeEl, { y: 14, autoAlpha: 0, duration: 0.65 }, 0.34);
    if (insetCard) entrance.from(insetCard, { y: 24, scale: 0.94, autoAlpha: 0, duration: 0.85, ease: "power2.out" }, 0.24);

    const timeline = reviewsScrollTimeline(gsap, section, REVIEWS_SCRUB.hero);

    if (copy) timeline.to(copy, { y: -46, autoAlpha: 0, ease: "power2.inOut", duration: 0.24 }, 0.04);
    if (insetWrap) timeline.to(insetWrap, { yPercent: -32, xPercent: -8, rotate: -2, autoAlpha: 0, ease: "power2.in", duration: 0.26 }, 0.03);
    if (border) timeline.to(border, { scale: 1.03, autoAlpha: 0, ease: "power2.out", duration: 0.24 }, 0.04);
    if (frame) {
      timeline.fromTo(
        frame,
        { clipPath: REVIEWS_HERO_CLIP.start },
        { clipPath: REVIEWS_HERO_CLIP.full, ease: "power2.inOut", duration: 0.38 },
        0.05,
      );
    }
    if (media) timeline.fromTo(media, { scale: 1.14, yPercent: 3 }, { scale: 1.02, yPercent: -3, ease: "none", duration: 0.55 }, 0);
    if (cutTwo) timeline.fromTo(cutTwo, { autoAlpha: 0 }, { autoAlpha: 1, ease: "power1.inOut", duration: 0.22 }, 0.42);
    if (cutTwoMedia) timeline.fromTo(cutTwoMedia, { scale: 1.1, yPercent: 2 }, { scale: 1, yPercent: -3, ease: "none", duration: 0.42 }, 0.4);
    if (cutThree) timeline.fromTo(cutThree, { autoAlpha: 0 }, { autoAlpha: 1, ease: "power1.inOut", duration: 0.22 }, 0.72);
    if (cutThreeMedia) timeline.fromTo(cutThreeMedia, { scale: 1.09, yPercent: 2 }, { scale: 1, yPercent: -2, ease: "none", duration: 0.3 }, 0.7);
    if (washes.length > 0) timeline.fromTo(washes, { opacity: 0 }, { opacity: 1, ease: "power1.inOut", duration: 0.28 }, 0.18);
    if (meter) timeline.fromTo(meter, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      data-cinema="reviews-spatial-hero"
      className="home-ivory-blue relative h-[var(--pin)] motion-reduce:h-auto"
      style={{ ["--pin" as string]: REVIEWS_PIN.heroDesktop }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:relative motion-reduce:min-h-[100svh]">
        <div
          data-reviews-hero-border
          className="pointer-events-none absolute bottom-[12svh] left-[44vw] right-[5.5vw] top-[15svh] z-[9] rounded-[20px] border border-paper/15 shadow-[0_24px_70px_rgb(8_43_45_/_0.14)] will-change-[transform,opacity]"
          aria-hidden="true"
        />

        <div
          data-reviews-hero-frame
          className="about-hero-frame absolute inset-0 z-10 overflow-hidden will-change-[clip-path]"
        >
          <div data-reviews-hero-media className="absolute inset-[-6%] will-change-transform">
            <Image src={mainPhoto.src} alt={mainPhoto.alt} fill className="object-cover" sizes="100vw" priority />
          </div>
          <div data-reviews-hero-cut-two className="pointer-events-none absolute inset-0 opacity-0 will-change-opacity">
            <div data-reviews-hero-cut-two-media className="absolute inset-[-6%] will-change-transform">
              <Image src={cutTwoPhoto.src} alt="" fill className="object-cover" sizes="100vw" />
            </div>
          </div>
          <div data-reviews-hero-cut-three className="pointer-events-none absolute inset-0 opacity-0 will-change-opacity">
            <div data-reviews-hero-cut-three-media className="absolute inset-[-6%] will-change-transform">
              <Image src={cutThreePhoto.src} alt="" fill className="object-cover" sizes="100vw" />
            </div>
          </div>
          <div
            data-reviews-hero-wash
            className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-canvas via-canvas/80 to-transparent opacity-0"
            aria-hidden="true"
          />
          <div
            data-reviews-hero-wash
            className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-canvas/95 via-canvas/60 to-transparent opacity-0"
            aria-hidden="true"
          />
        </div>

        <div
          data-reviews-hero-inset-wrap
          className="pointer-events-none absolute bottom-[15svh] left-[36vw] z-20 w-[16vw] max-w-[13rem] will-change-[transform,opacity] md:left-[35.5vw] md:w-[13.5vw]"
        >
          <figure
            data-reviews-hero-inset
            className="relative aspect-[3/4] w-full overflow-hidden rounded-[0.9rem] border-[0.3rem] border-canvas bg-surface shadow-[0_24px_65px_rgb(8_43_45_/_0.2)] will-change-transform md:border-[0.4rem]"
          >
            <Image src={secondaryPhoto.src} alt="" fill className="object-cover" sizes="16vw" priority />
          </figure>
        </div>

        <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-[5vw] pb-6 pt-20 text-[0.54rem] uppercase tracking-[0.28em] text-paper/85 md:px-[7vw]">
          <ReviewsSceneLabel className="!text-paper/85">{scene}</ReviewsSceneLabel>
          <ReviewsSceneLabel className="!text-paper/85 text-right">{eyebrow}</ReviewsSceneLabel>
        </div>

        <div
          data-reviews-hero-copy
          className="absolute left-[5vw] top-1/2 z-30 max-w-[35vw] -translate-y-1/2 will-change-[transform,opacity] md:left-[7vw] md:max-w-[33vw]"
        >
          <p data-reviews-hero-kicker className="mb-3 text-[0.54rem] uppercase tracking-[0.28em] text-signal md:mb-5">
            {title}
          </p>
          <h1 className="max-w-[10ch] text-[clamp(1.85rem,5.6vw,5.6rem)] font-light leading-[0.92] tracking-[-0.055em] text-paper">
            <ReviewsDisplayLine>{displayLine1}</ReviewsDisplayLine>
            <ReviewsDisplayLine>{displayLine2}</ReviewsDisplayLine>
          </h1>
          <div data-reviews-hero-rule className="mt-4 h-px w-16 origin-left bg-paper/25 md:mt-7 md:w-20" aria-hidden="true" />
          <ReviewsBody data-reviews-hero-lede className="mt-3 max-w-[34ch] text-xs md:mt-5 md:text-base">
            {lede}
          </ReviewsBody>
        </div>

        <div className="absolute inset-x-[5vw] bottom-6 z-30 flex items-center gap-4 text-[0.52rem] uppercase tracking-[0.26em] text-mist md:inset-x-[7vw] md:bottom-7">
          <span>{scrollLabel}</span>
          <span className="relative h-px flex-1 overflow-hidden bg-line">
            <span data-reviews-hero-meter className="absolute inset-0 origin-left scale-x-0 bg-signal motion-reduce:scale-x-100" />
          </span>
          <span>01</span>
        </div>
      </div>
    </section>
  );
}
