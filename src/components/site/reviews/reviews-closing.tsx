"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { REVIEWS_PIN, REVIEWS_SCRUB } from "@/components/site/reviews/reviews-motion.config";
import { reviewsScrollTimeline } from "@/components/site/reviews/reviews-motion-utils";
import { ReviewsBody, ReviewsDisplayLine, ReviewsPrimaryCta, ReviewsSceneLabel } from "@/components/site/reviews/reviews-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

export function ReviewsClosingScene({
  scene,
  line1,
  line2,
  exploreRooms,
  roomsHref,
  introFooter,
  image,
  alt,
}: {
  scene: string;
  line1: string;
  line2: string;
  exploreRooms: string;
  roomsHref: string;
  introFooter: string;
  image: string;
  alt: string;
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const frame = section.querySelector<HTMLElement>("[data-reviews-close-frame]");
    const media = section.querySelector<HTMLElement>("[data-reviews-close-media]");
    const copy = section.querySelector<HTMLElement>("[data-reviews-close-copy]");
    const timeline = reviewsScrollTimeline(gsap, section, REVIEWS_SCRUB.closing);

    if (frame) {
      timeline.fromTo(
        frame,
        { clipPath: "inset(12% 14% 12% 14% round 24px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 0.6 },
        0,
      );
    }
    if (media) timeline.fromTo(media, { scale: 1.14 }, { scale: 1, ease: "none", duration: 1 }, 0);
    if (copy) timeline.fromTo(copy, { y: 32, autoAlpha: 0.35 }, { y: 0, autoAlpha: 1, ease: "power3.out", duration: 0.42 }, 0.14);
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      data-cinema="reviews-closing"
      className="relative h-[var(--pin)] border-t border-line bg-canvas motion-reduce:h-auto"
      style={{ ["--pin" as string]: REVIEWS_PIN.closingDesktop }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:relative motion-reduce:min-h-[90svh]">
        <div data-reviews-close-frame className="absolute inset-0 overflow-hidden will-change-[clip-path]">
          <div data-reviews-close-media className="relative h-full w-full will-change-transform">
            <Image src={image} alt={alt} fill className="object-cover" sizes="100vw" />
          </div>
          <div className="home-scrim-ivory absolute inset-0" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-canvas/85 via-canvas/55 to-canvas/92"
            aria-hidden="true"
          />
        </div>

        <div
          data-reviews-close-copy
          className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-[6vw] text-center text-paper"
        >
          <ReviewsSceneLabel className="mb-5 text-signal">{scene}</ReviewsSceneLabel>
          <h2 className="max-w-[12ch] text-[clamp(2.4rem,5.5vw,5.4rem)] font-light leading-[0.94] tracking-[-0.05em]">
            <ReviewsDisplayLine>{line1}</ReviewsDisplayLine>
            <ReviewsDisplayLine>{line2}</ReviewsDisplayLine>
          </h2>
          <ReviewsBody className="mt-6 text-center text-paper/80">{introFooter}</ReviewsBody>
          <div className="mt-9">
            <ReviewsPrimaryCta href={roomsHref}>{exploreRooms}</ReviewsPrimaryCta>
          </div>
        </div>
      </div>
    </section>
  );
}
