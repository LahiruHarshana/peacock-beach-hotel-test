"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { RESTAURANT_SCRUB } from "@/components/site/restaurant/restaurant-motion.config";
import { restaurantScrollTimeline } from "@/components/site/restaurant/restaurant-motion-utils";
import { RestaurantBody, RestaurantDisplayTitle, RestaurantPrimaryCta, RestaurantSceneLabel } from "@/components/site/restaurant/restaurant-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

export function RestaurantFlavoursScene({
  scene,
  title,
  body,
  menuHref,
  menuCta,
  image,
  alt,
}: {
  scene: string;
  title: string;
  body: string;
  menuHref: string;
  menuCta: string;
  image: string;
  alt: string;
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const frame = section.querySelector<HTMLElement>("[data-restaurant-flavours-mask]");
    const media = section.querySelector<HTMLElement>("[data-restaurant-flavours-media]");
    const copy = section.querySelector<HTMLElement>("[data-restaurant-flavours-copy]");

    const timeline = restaurantScrollTimeline(gsap, section, RESTAURANT_SCRUB.flavours);

    if (frame) {
      timeline.fromTo(
        frame,
        { clipPath: "inset(8% 12% 8% 0% round 20px)" },
        { clipPath: "inset(0% 0% 0% 0% round 20px)", ease: "power2.inOut", duration: 0.45 },
        0,
      );
    }
    if (media) timeline.fromTo(media, { scale: 1.14, yPercent: 3 }, { scale: 1, yPercent: -3, ease: "none", duration: 1 }, 0);
    if (copy) {
      gsap.fromTo(
        copy,
        { y: 28, autoAlpha: 0.2 },
        {
          y: 0,
          autoAlpha: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            scroller: document.documentElement,
            start: "top 82%",
            end: "top 28%",
            scrub: 0.9,
          },
        },
      );
    }
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      data-cinema="restaurant-flavours"
      className="relative h-[165svh] border-t border-line bg-surface motion-reduce:h-auto"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between gap-4 overflow-hidden px-[5vw] pb-8 pt-20 md:grid md:grid-cols-12 md:items-center md:gap-[4vw] md:px-[7vw] md:py-20 motion-reduce:relative motion-reduce:h-auto">
        <div className="flex items-center justify-between gap-4 md:hidden">
          <RestaurantSceneLabel className="text-signal">{scene}</RestaurantSceneLabel>
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
        </div>

        <div className="w-full flex-1 md:col-span-7 md:flex-none">
          <div
            data-restaurant-flavours-mask
            className="relative h-full min-h-[34svh] overflow-hidden rounded-[22px] shadow-[0_28px_80px_rgb(8_43_45_/_0.14)] will-change-[clip-path] md:aspect-[5/4] md:h-auto md:rounded-[20px]"
          >
            <div data-restaurant-flavours-media className="relative h-full w-full will-change-transform">
              <Image src={image} alt={alt} fill className="object-cover" sizes="(min-width: 768px) 54vw, 90vw" />
            </div>
          </div>
        </div>
        <div
          data-restaurant-flavours-copy
          className="flex w-full flex-col justify-center rounded-2xl border border-paper/10 bg-canvas/70 p-5 backdrop-blur-md will-change-transform md:col-span-5 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none"
        >
          <RestaurantSceneLabel className="hidden text-signal md:block">{scene}</RestaurantSceneLabel>
          <RestaurantDisplayTitle as="h2" className="text-[clamp(2rem,4.2vw,4.4rem)] leading-[0.94] md:mt-4">
            {title}
          </RestaurantDisplayTitle>
          <RestaurantBody className="mt-3 text-sm md:mt-6 md:text-base">{body}</RestaurantBody>
          <div className="mt-5 md:mt-9">
            <RestaurantPrimaryCta href={menuHref}>{menuCta}</RestaurantPrimaryCta>
          </div>
        </div>
      </div>
    </section>
  );
}
