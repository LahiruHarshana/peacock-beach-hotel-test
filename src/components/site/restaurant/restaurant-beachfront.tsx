"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { RESTAURANT_PIN, RESTAURANT_SCRUB } from "@/components/site/restaurant/restaurant-motion.config";
import { restaurantScrollTimeline } from "@/components/site/restaurant/restaurant-motion-utils";
import { RestaurantBody, RestaurantDisplayTitle, RestaurantLine, RestaurantSceneLabel } from "@/components/site/restaurant/restaurant-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

export function RestaurantBeachfrontScene({
  scene,
  line1,
  line2,
  caption,
  image,
  alt,
}: {
  scene: string;
  line1: string;
  line2: string;
  caption: string;
  image: string;
  alt: string;
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const frame = section.querySelector<HTMLElement>("[data-restaurant-beach-frame]");
    const media = section.querySelector<HTMLElement>("[data-restaurant-beach-media]");
    const title = section.querySelector<HTMLElement>("[data-restaurant-beach-title]");

    const timeline = restaurantScrollTimeline(gsap, section, RESTAURANT_SCRUB.beach);
    if (frame) {
      timeline.fromTo(
        frame,
        { clipPath: "inset(10% 12% 10% 12% round 22px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 0.6 },
        0,
      );
    }
    if (media) timeline.fromTo(media, { scale: 1.14, yPercent: 3 }, { scale: 1.0, yPercent: -3, ease: "none", duration: 1 }, 0);
    if (title) {
      timeline.fromTo(title, { y: 24, autoAlpha: 0.35 }, { y: 0, autoAlpha: 1, ease: "power2.out", duration: 0.36 }, 0.14);
    }
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      data-cinema="restaurant-beach"
      className="relative h-[var(--pin)] border-t border-line bg-canvas motion-reduce:h-auto"
      style={{ ["--pin" as string]: RESTAURANT_PIN.beachDesktop }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:relative motion-reduce:min-h-[90svh]">
        <div
          data-restaurant-beach-frame
          className="absolute inset-0 overflow-hidden will-change-[clip-path]"
        >
          <div data-restaurant-beach-media className="relative h-full w-full will-change-transform">
            <Image src={image} alt={alt} fill className="object-cover" sizes="100vw" priority={false} />
          </div>
          <div className="home-scrim-ivory absolute inset-0" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-canvas/95 via-canvas/60 to-transparent"
            aria-hidden="true"
          />
        </div>

        <div
          data-restaurant-beach-title
          className="pointer-events-none absolute inset-x-[5vw] bottom-[10vh] z-10 max-w-xl text-paper md:inset-x-[7vw]"
        >
          <RestaurantSceneLabel className="text-signal">{scene}</RestaurantSceneLabel>
          <RestaurantDisplayTitle className="mt-4 text-[clamp(2.4rem,5.4vw,5.4rem)] leading-[0.92]">
            <RestaurantLine>{line1}</RestaurantLine>
            <RestaurantLine>{line2}</RestaurantLine>
          </RestaurantDisplayTitle>
          <RestaurantBody className="mt-4 max-w-md text-paper/80">{caption}</RestaurantBody>
        </div>
      </div>
    </section>
  );
}
