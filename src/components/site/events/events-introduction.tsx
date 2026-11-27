"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { EVENTS_PIN, EVENTS_SCRUB } from "@/components/site/events/events-motion.config";
import { eventsScrollTimeline } from "@/components/site/events/events-motion-utils";
import { EventsBody, EventsSceneLabel } from "@/components/site/events/events-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

export function EventsIntroduction({
  scene,
  lede,
  image,
  alt,
}: {
  scene: string;
  lede: string;
  image: string;
  alt: string;
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const frame = section.querySelector<HTMLElement>("[data-events-intro-frame]");
    const media = section.querySelector<HTMLElement>("[data-events-intro-media]");
    const copy = section.querySelector<HTMLElement>("[data-events-intro-copy]");

    const timeline = eventsScrollTimeline(gsap, section, EVENTS_SCRUB.intro);

    if (frame) {
      timeline.fromTo(
        frame,
        { clipPath: "inset(8% 12% 8% 0% round 20px)" },
        { clipPath: "inset(0% 0% 0% 0% round 20px)", ease: "power2.inOut", duration: 0.5 },
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
      data-cinema="events-intro"
      className="relative h-[var(--pin)] border-t border-line bg-surface motion-reduce:h-auto"
      style={{ ["--pin" as string]: EVENTS_PIN.introDesktop }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between gap-4 overflow-hidden px-[5vw] pb-8 pt-20 md:grid md:grid-cols-12 md:items-center md:gap-[4vw] md:px-[7vw] md:py-20 motion-reduce:relative motion-reduce:h-auto">
        <div className="flex items-center justify-between gap-4 md:hidden">
          <EventsSceneLabel className="text-signal">{scene}</EventsSceneLabel>
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
        </div>

        <div
          data-events-intro-copy
          className="order-2 w-full rounded-2xl border border-paper/10 bg-canvas/70 p-5 backdrop-blur-md md:order-1 md:col-span-5 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none"
        >
          <EventsSceneLabel className="mb-4 hidden text-signal md:mb-5 md:block">{scene}</EventsSceneLabel>
          <EventsBody className="text-sm leading-relaxed text-paper md:text-[clamp(1.05rem,1.45vw,1.25rem)] md:leading-[1.75]">
            {lede}
          </EventsBody>
        </div>
        <div className="w-full flex-1 md:order-2 md:col-span-7 md:col-start-6 md:flex-none">
          <div
            data-events-intro-frame
            className="relative h-full min-h-[34svh] overflow-hidden rounded-[22px] shadow-[0_28px_80px_rgb(8_43_45_/_0.14)] will-change-[clip-path] md:aspect-[5/4] md:h-auto md:rounded-[20px]"
          >
            <div data-events-intro-media className="relative h-full w-full will-change-transform">
              <Image src={image} alt={alt} fill className="object-cover" sizes="(min-width:768px) 52vw, 90vw" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
