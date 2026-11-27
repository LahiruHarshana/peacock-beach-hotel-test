"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { RESTAURANT_PIN, RESTAURANT_SCRUB } from "@/components/site/restaurant/restaurant-motion.config";
import { restaurantScrollTimeline } from "@/components/site/restaurant/restaurant-motion-utils";
import { RestaurantDisplayTitle, RestaurantLine, RestaurantSceneLabel } from "@/components/site/restaurant/restaurant-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

export function RestaurantDayDuskScene({
  scene,
  dayLabel,
  duskLabel,
  line1,
  line2,
  dayImage,
  duskImage,
  altDay,
  altDusk,
}: {
  scene: string;
  dayLabel: string;
  duskLabel: string;
  line1: string;
  line2: string;
  dayImage: string;
  duskImage: string;
  altDay: string;
  altDusk: string;
}) {
  const root = useRef<HTMLElement>(null);

  const bind = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const evening = section.querySelector<HTMLElement>("[data-restaurant-dusk-layer]");
    const dayMedia = section.querySelector<HTMLElement>("[data-restaurant-day-media]");
    const duskMedia = section.querySelector<HTMLElement>("[data-restaurant-dusk-media]");
    const dayTag = section.querySelector<HTMLElement>("[data-restaurant-day-tag]");
    const duskTag = section.querySelector<HTMLElement>("[data-restaurant-dusk-tag]");
    const meter = section.querySelector<HTMLElement>("[data-restaurant-dusk-meter]");

    const timeline = restaurantScrollTimeline(gsap, section, RESTAURANT_SCRUB.dayDusk);

    if (dayMedia) timeline.fromTo(dayMedia, { scale: 1.08, yPercent: 2 }, { scale: 1, yPercent: -2, ease: "none", duration: 0.6 }, 0);
    if (evening) {
      timeline.fromTo(evening, { autoAlpha: 0 }, { autoAlpha: 1, ease: "power1.inOut", duration: 0.42 }, 0.28);
    }
    if (duskMedia) timeline.fromTo(duskMedia, { scale: 1.12, yPercent: 2 }, { scale: 1, yPercent: -2, ease: "none", duration: 0.72 }, 0.28);
    if (dayTag && duskTag) {
      timeline.to(dayTag, { autoAlpha: 0.45, duration: 0.25 }, 0.3);
      timeline.fromTo(duskTag, { autoAlpha: 0.45 }, { autoAlpha: 1, duration: 0.25 }, 0.35);
    }
    if (meter) timeline.fromTo(meter, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
  }, []);

  const setup = useCallback((gsap: typeof import("gsap").default) => bind(gsap), [bind]);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      data-cinema="restaurant-day-dusk"
      className="relative h-[var(--pin)] border-t border-line bg-surface motion-reduce:h-auto"
      style={{ ["--pin" as string]: RESTAURANT_PIN.dayDuskDesktop }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:relative motion-reduce:min-h-[90svh]">
        <div className="absolute inset-0 overflow-hidden">
          <div data-restaurant-day-media className="relative h-full w-full will-change-transform">
            <Image src={dayImage} alt={altDay} fill className="object-cover" sizes="100vw" />
          </div>
        </div>
        <div data-restaurant-dusk-layer className="absolute inset-0 overflow-hidden opacity-0 will-change-opacity">
          <div data-restaurant-dusk-media className="relative h-full w-full will-change-transform">
            <Image src={duskImage} alt={altDusk} fill className="object-cover" sizes="100vw" />
          </div>
        </div>

        <div className="home-scrim-ivory absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-canvas/90 via-canvas/45 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-canvas/95 via-canvas/65 to-transparent"
          aria-hidden="true"
        />

        <div className="absolute inset-x-[5vw] top-20 z-10 flex items-center gap-6 text-[0.54rem] uppercase tracking-[0.28em] text-paper md:inset-x-[7vw] md:top-24">
          <span data-restaurant-day-tag>{dayLabel}</span>
          <span className="h-px w-8 bg-paper/25" aria-hidden="true" />
          <span data-restaurant-dusk-tag className="opacity-45">{duskLabel}</span>
        </div>

        <div
          data-restaurant-dusk-title
          className="absolute inset-x-[5vw] bottom-[12vh] z-10 text-paper md:inset-x-[7vw]"
        >
          <RestaurantSceneLabel className="text-signal">{scene}</RestaurantSceneLabel>
          <RestaurantDisplayTitle className="mt-4 text-[clamp(2.5rem,5.2vw,5.2rem)] leading-[0.92]">
            <RestaurantLine>{line1}</RestaurantLine>
            <RestaurantLine>{line2}</RestaurantLine>
          </RestaurantDisplayTitle>
        </div>

        <div className="absolute inset-x-[5vw] bottom-6 z-10 flex items-center gap-4 text-[0.52rem] uppercase tracking-[0.26em] text-mist md:inset-x-[7vw]">
          <span>{dayLabel}</span>
          <span className="relative h-px flex-1 overflow-hidden bg-line">
            <span data-restaurant-dusk-meter className="absolute inset-0 origin-left scale-x-0 bg-signal motion-reduce:scale-x-100" />
          </span>
          <span>{duskLabel}</span>
        </div>
      </div>
    </section>
  );
}
