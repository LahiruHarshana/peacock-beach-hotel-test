"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { RESTAURANT_PIN, RESTAURANT_SCRUB } from "@/components/site/restaurant/restaurant-motion.config";
import { restaurantScrollTimeline } from "@/components/site/restaurant/restaurant-motion-utils";
import { RestaurantDisplayTitle, RestaurantSceneLabel } from "@/components/site/restaurant/restaurant-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

export function RestaurantGallery({
  scene,
  title,
  images,
}: {
  scene: string;
  title: string;
  images: { src: string; alt: string; wide?: boolean }[];
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const track = section.querySelector<HTMLElement>("[data-restaurant-gallery-track]");
    const media = gsap.utils.toArray<HTMLElement>("[data-restaurant-gallery-media]", section);
    if (!track) return;
    const distance = Math.max(0, track.scrollWidth - window.innerWidth + 140);
    const timeline = restaurantScrollTimeline(gsap, section, RESTAURANT_SCRUB.gallery);
    timeline.fromTo(track, { x: 0 }, { x: -distance, ease: "none", duration: 1 }, 0);
    media.forEach((item) => {
      timeline.fromTo(item, { scale: 1.1 }, { scale: 1, ease: "none", duration: 1 }, 0);
    });
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      data-cinema="restaurant-gallery"
      className="relative h-[var(--pin)] bg-canvas motion-reduce:h-auto motion-reduce:py-16"
      style={{ ["--pin" as string]: RESTAURANT_PIN.galleryDesktop }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-[5vw] md:px-[7vw]">
        <RestaurantSceneLabel className="text-signal">{scene}</RestaurantSceneLabel>
        <RestaurantDisplayTitle as="h2" className="mb-8 mt-3 text-[clamp(1.85rem,3.4vw,3.4rem)] md:mb-10">
          {title}
        </RestaurantDisplayTitle>
        <div className="overflow-hidden rounded-[20px]">
          <div data-restaurant-gallery-track className="flex w-max gap-4 will-change-transform md:gap-6">
            {images.map((item) => (
              <figure
                key={item.src}
                data-restaurant-gallery-item
                className={`relative shrink-0 overflow-hidden rounded-[20px] border border-line bg-surface shadow-[0_20px_60px_rgb(8_43_45_/_0.08)] ${
                  item.wide ? "h-[48svh] w-[72vw] md:h-[54vh] md:w-[62vw]" : "h-[48svh] w-[48vw] md:h-[54vh] md:w-[34vw]"
                }`}
              >
                <div data-restaurant-gallery-media className="relative h-full w-full will-change-transform">
                  <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="50vw" />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function RestaurantGalleryMobile() {
  return null;
}
