"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { RESTAURANT_HERO_CLIP, RESTAURANT_PIN, RESTAURANT_SCRUB } from "@/components/site/restaurant/restaurant-motion.config";
import { restaurantScrollTimeline } from "@/components/site/restaurant/restaurant-motion-utils";
import {
  RestaurantBody,
  RestaurantDisplayTitle,
  RestaurantLine,
  RestaurantPrimaryCta,
  RestaurantSceneLabel,
} from "@/components/site/restaurant/restaurant-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

export function RestaurantHero({
  scene,
  eyebrow,
  line1,
  line2,
  support,
  scrollLabel,
  menuHref,
  menuCta,
  image,
  alt,
}: {
  scene: string;
  eyebrow: string;
  line1: string;
  line2: string;
  support: string;
  scrollLabel: string;
  menuHref: string;
  menuCta: string;
  image: string;
  alt: string;
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;

    const frame = section.querySelector<HTMLElement>("[data-restaurant-hero-frame]");
    const border = section.querySelector<HTMLElement>("[data-restaurant-hero-border]");
    const media = section.querySelector<HTMLElement>("[data-restaurant-hero-media]");
    const washes = gsap.utils.toArray<HTMLElement>("[data-restaurant-hero-wash]", section);
    const copy = section.querySelector<HTMLElement>("[data-restaurant-hero-copy]");
    const lines = gsap.utils.toArray<HTMLElement>("[data-restaurant-line]", section);
    const supportEl = section.querySelector<HTMLElement>("[data-restaurant-hero-support]");
    const ctaEl = section.querySelector<HTMLElement>("[data-restaurant-hero-cta]");
    const meter = section.querySelector<HTMLElement>("[data-restaurant-hero-meter]");

    const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (lines.length > 0) entrance.from(lines, { yPercent: 108, duration: 0.85, stagger: 0.08 }, 0.08);
    if (supportEl) entrance.from(supportEl, { y: 14, autoAlpha: 0, duration: 0.65 }, 0.28);
    if (ctaEl) entrance.from(ctaEl, { y: 12, autoAlpha: 0, duration: 0.6 }, 0.36);

    const timeline = restaurantScrollTimeline(gsap, section, RESTAURANT_SCRUB.hero);

    if (copy) timeline.to(copy, { y: -44, autoAlpha: 0, ease: "power2.inOut", duration: 0.32 }, 0.05);
    if (border) timeline.to(border, { scale: 1.03, autoAlpha: 0, ease: "power2.out", duration: 0.3 }, 0.05);
    if (frame) {
      timeline.fromTo(
        frame,
        { clipPath: RESTAURANT_HERO_CLIP.start },
        { clipPath: RESTAURANT_HERO_CLIP.full, ease: "power2.inOut", duration: 0.56 },
        0.06,
      );
    }
    if (media) timeline.fromTo(media, { scale: 1.14, yPercent: 3 }, { scale: 1.0, yPercent: -3, ease: "none", duration: 1 }, 0);
    if (washes.length > 0) timeline.fromTo(washes, { opacity: 0 }, { opacity: 1, ease: "power1.inOut", duration: 0.35 }, 0.2);
    if (meter) timeline.fromTo(meter, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      data-cinema="restaurant-hero"
      className="home-ivory-blue relative h-[var(--restaurant-pin-hero)] motion-reduce:h-auto"
      style={{ ["--restaurant-pin-hero" as string]: RESTAURANT_PIN.heroDesktop }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:relative motion-reduce:min-h-[100svh]">
        <div
          data-restaurant-hero-border
          className="pointer-events-none absolute bottom-[12svh] left-[44vw] right-[5.5vw] top-[15svh] z-[9] rounded-[20px] border border-paper/15 shadow-[0_24px_70px_rgb(8_43_45_/_0.14)] will-change-[transform,opacity]"
          aria-hidden="true"
        />

        <div
          data-restaurant-hero-frame
          className="about-hero-frame absolute inset-0 z-10 overflow-hidden will-change-[clip-path]"
        >
          <div data-restaurant-hero-media className="absolute inset-[-6%] will-change-transform">
            <Image src={image} alt={alt} fill className="object-cover" sizes="100vw" priority />
          </div>
          <div
            data-restaurant-hero-wash
            className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-canvas via-canvas/80 to-transparent opacity-0"
            aria-hidden="true"
          />
          <div
            data-restaurant-hero-wash
            className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-canvas/95 via-canvas/60 to-transparent opacity-0"
            aria-hidden="true"
          />
        </div>

        <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-[5vw] pb-6 pt-20 text-[0.54rem] uppercase tracking-[0.28em] text-paper/85 md:px-[7vw]">
          <span>{scene}</span>
          <RestaurantSceneLabel className="!text-paper/85">{eyebrow}</RestaurantSceneLabel>
        </div>

        <div
          data-restaurant-hero-copy
          className="absolute left-[5vw] top-1/2 z-30 max-w-[35vw] -translate-y-1/2 will-change-[transform,opacity] md:left-[7vw] md:max-w-[33vw]"
        >
          <RestaurantDisplayTitle as="h1" className="text-[clamp(2rem,6.2vw,6.4rem)] leading-[0.9] tracking-[-0.055em]">
            <RestaurantLine>{line1}</RestaurantLine>
            <RestaurantLine>{line2}</RestaurantLine>
          </RestaurantDisplayTitle>
          <RestaurantBody data-restaurant-hero-support className="mt-4 max-w-[32ch] text-xs text-mist md:mt-6 md:text-base">
            {support}
          </RestaurantBody>
          <div data-restaurant-hero-cta className="mt-5 md:mt-7">
            <RestaurantPrimaryCta href={menuHref}>{menuCta}</RestaurantPrimaryCta>
          </div>
        </div>

        <div className="absolute inset-x-[5vw] bottom-6 z-30 flex items-center gap-4 text-[0.52rem] uppercase tracking-[0.26em] text-mist md:inset-x-[7vw] md:bottom-7">
          <span>{scrollLabel}</span>
          <span className="relative h-px flex-1 overflow-hidden bg-line">
            <span data-restaurant-hero-meter className="absolute inset-0 origin-left scale-x-0 bg-signal motion-reduce:scale-x-100" />
          </span>
          <span>01</span>
        </div>
      </div>
    </section>
  );
}
