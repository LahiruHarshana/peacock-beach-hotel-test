"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { RESTAURANT_SCRUB } from "@/components/site/restaurant/restaurant-motion.config";
import { RestaurantBody, RestaurantDisplayTitle, RestaurantLine, RestaurantSceneLabel } from "@/components/site/restaurant/restaurant-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

export function RestaurantMaterialsScene({
  scene,
  line1,
  line2,
  body,
  images,
}: {
  scene: string;
  line1: string;
  line2: string;
  body: string;
  images: { src: string; alt: string; caption?: string }[];
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const cards = gsap.utils.toArray<HTMLElement>("[data-restaurant-material-card]", section);
    const media = gsap.utils.toArray<HTMLElement>("[data-restaurant-material-media]", section);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        scroller: document.documentElement,
        start: "top 82%",
        end: "top 25%",
        scrub: RESTAURANT_SCRUB.materials,
      },
    });
    cards.forEach((card, index) => {
      tl.fromTo(card, { y: 36, autoAlpha: 0.25 }, { y: 0, autoAlpha: 1, ease: "power2.out", duration: 0.45 }, index * 0.08);
    });
    media.forEach((item) => {
      tl.fromTo(item, { scale: 1.12 }, { scale: 1, ease: "none", duration: 0.8 }, 0);
    });
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      data-cinema="restaurant-materials"
      className="relative border-t border-line bg-canvas px-[5vw] py-20 md:px-[7vw] md:py-28"
    >
      <div className="grid grid-cols-12 items-end gap-6 pb-10 md:gap-8 md:pb-14">
        <div className="col-span-5">
          <RestaurantSceneLabel className="text-signal">{scene}</RestaurantSceneLabel>
          <RestaurantDisplayTitle className="mt-4 text-[clamp(1.75rem,4.8vw,4.8rem)] leading-[0.94]">
            <RestaurantLine>{line1}</RestaurantLine>
            <RestaurantLine>{line2}</RestaurantLine>
          </RestaurantDisplayTitle>
        </div>
        <div className="col-span-6 col-start-7">
          <RestaurantBody className="text-xs md:text-base">{body}</RestaurantBody>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 md:gap-6">
        {images.map((item, index) => (
          <figure
            key={item.src}
            data-restaurant-material-card
            className={`relative overflow-hidden rounded-[14px] border border-line bg-surface shadow-[0_20px_60px_rgb(8_43_45_/_0.08)] will-change-transform motion-reduce:translate-y-0 md:rounded-[20px] ${
              index === 0 ? "col-span-2 row-span-2 aspect-[16/11]" : "aspect-[4/5]"
            }`}
          >
            <div data-restaurant-material-media className="relative h-full w-full will-change-transform">
              <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="(min-width:768px) 25vw, 25vw" />
            </div>
            {item.caption ? (
              <figcaption className="absolute bottom-3 left-3 rounded-full border border-paper/15 bg-surface/90 px-3 py-1 text-[0.52rem] uppercase tracking-[0.2em] text-paper backdrop-blur-md">
                {item.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}
