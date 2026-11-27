"use client";

import { useCallback, useRef, useState } from "react";
import { RESTAURANT_SCRUB } from "@/components/site/restaurant/restaurant-motion.config";
import { RestaurantBody, RestaurantDisplayTitle, RestaurantSceneLabel, RestaurantTextLink } from "@/components/site/restaurant/restaurant-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

type LinkItem = { index: string; label: string; href: string; lede: string };

export function RestaurantMenuChapter({
  scene,
  title,
  body,
  links,
  navRestaurant,
}: {
  scene: string;
  title: string;
  body: string;
  links: LinkItem[];
  navRestaurant: string;
}) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const panel = section.querySelector<HTMLElement>("[data-restaurant-menu-panel]");
    if (panel) {
      gsap.fromTo(
        panel,
        { y: 28, autoAlpha: 0.25 },
        {
          y: 0,
          autoAlpha: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            scroller: document.documentElement,
            start: "top 82%",
            end: "top 35%",
            scrub: RESTAURANT_SCRUB.flavours,
          },
        },
      );
    }
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      data-cinema="restaurant-menu"
      className="border-y border-line bg-surface px-[5vw] py-20 md:px-[7vw] md:py-28"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-8 md:gap-16">
        <div className="col-span-5">
          <RestaurantSceneLabel className="text-signal">{scene}</RestaurantSceneLabel>
          <RestaurantDisplayTitle as="h2" className="mt-4 text-[clamp(1.65rem,3.8vw,3.8rem)] leading-[0.95]">
            {title}
          </RestaurantDisplayTitle>
          <RestaurantBody className="mt-4 text-xs md:mt-6 md:text-base">{body}</RestaurantBody>
        </div>
        <div data-restaurant-menu-panel className="col-span-7">
          <div className="mb-8 flex flex-wrap gap-6 border-b border-line pb-5">
            {links.map((item, index) => (
              <button
                key={item.index}
                type="button"
                className={`relative pb-2 text-[0.58rem] uppercase tracking-[0.22em] transition-colors ${
                  active === index ? "text-paper" : "text-mist hover:text-paper"
                }`}
                onClick={() => setActive(index)}
                aria-current={active === index ? "true" : undefined}
              >
                {item.label}
                <span
                  className={`absolute inset-x-0 -bottom-px h-px origin-left bg-signal transition-transform duration-300 ${
                    active === index ? "scale-x-100" : "scale-x-0"
                  }`}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
          <div className="relative min-h-[12rem]">
            {links.map((item, index) => (
              <article
                key={item.index}
                className={`transition-opacity duration-300 ${
                  active === index ? "relative opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
                }`}
                aria-hidden={active !== index}
              >
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-signal">{item.index}</p>
                <h3 className="mt-3 text-2xl font-light tracking-[-0.03em] text-paper">{item.label}</h3>
                <RestaurantBody className="mt-4">{item.lede}</RestaurantBody>
                <div className="mt-8">
                  <RestaurantTextLink href={item.href}>
                    {navRestaurant} — {item.label}
                  </RestaurantTextLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
