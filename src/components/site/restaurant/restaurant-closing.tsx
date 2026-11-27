"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { RESTAURANT_PIN, RESTAURANT_SCRUB } from "@/components/site/restaurant/restaurant-motion.config";
import { restaurantScrollTimeline } from "@/components/site/restaurant/restaurant-motion-utils";
import {
  RestaurantBody,
  RestaurantDisplayTitle,
  RestaurantLine,
  RestaurantPrimaryCta,
  RestaurantSecondaryCta,
  RestaurantSceneLabel,
} from "@/components/site/restaurant/restaurant-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

export function RestaurantClosingScene({
  scene,
  title,
  body,
  menuHref,
  reserveHref,
  menuCta,
  reserveCta,
  image,
  alt,
}: {
  scene: string;
  title: string;
  body: string;
  menuHref: string;
  reserveHref: string;
  menuCta: string;
  reserveCta: string;
  image: string;
  alt: string;
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const frame = section.querySelector<HTMLElement>("[data-restaurant-close-frame]");
    const media = section.querySelector<HTMLElement>("[data-restaurant-close-media]");
    const copy = section.querySelector<HTMLElement>("[data-restaurant-close-copy]");

    const timeline = restaurantScrollTimeline(gsap, section, RESTAURANT_SCRUB.closing);
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
      data-cinema="restaurant-closing"
      className="relative h-[var(--pin)] border-t border-line bg-surface motion-reduce:h-auto"
      style={{ ["--pin" as string]: RESTAURANT_PIN.closingDesktop }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:relative motion-reduce:min-h-[90svh]">
        <div data-restaurant-close-frame className="absolute inset-0 overflow-hidden will-change-[clip-path]">
          <div data-restaurant-close-media className="relative h-full w-full will-change-transform">
            <Image src={image} alt={alt} fill className="object-cover" sizes="100vw" />
          </div>
          <div className="home-scrim-ivory absolute inset-0" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-canvas/85 via-canvas/55 to-canvas/92"
            aria-hidden="true"
          />
        </div>

        <div
          data-restaurant-close-copy
          className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-[6vw] text-center text-paper"
        >
          <RestaurantSceneLabel className="mb-5 text-signal">{scene}</RestaurantSceneLabel>
          <RestaurantDisplayTitle as="h2" className="max-w-[12ch] text-[clamp(2.4rem,5.5vw,5.4rem)] leading-[0.94]">
            <RestaurantLine>{title}</RestaurantLine>
          </RestaurantDisplayTitle>
          <RestaurantBody className="mt-6 text-center text-paper/80">{body}</RestaurantBody>
          <div className="mt-9 flex flex-row flex-wrap items-center justify-center gap-3">
            <RestaurantPrimaryCta href={menuHref}>{menuCta}</RestaurantPrimaryCta>
            <RestaurantSecondaryCta href={reserveHref}>{reserveCta}</RestaurantSecondaryCta>
          </div>
        </div>
      </div>
    </section>
  );
}
