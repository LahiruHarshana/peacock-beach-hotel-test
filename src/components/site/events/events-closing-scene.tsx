"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { EVENTS_PIN, EVENTS_SCRUB } from "@/components/site/events/events-motion.config";
import { eventsScrollTimeline } from "@/components/site/events/events-motion-utils";
import { EventsDisplayLine, EventsSceneLabel } from "@/components/site/events/events-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

export function EventsClosingScene({
  scene,
  line1,
  line2,
  image,
  alt,
}: {
  scene: string;
  line1: string;
  line2: string;
  image: string;
  alt: string;
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const frame = section.querySelector<HTMLElement>("[data-events-close-frame]");
    const media = section.querySelector<HTMLElement>("[data-events-close-media]");
    const copy = section.querySelector<HTMLElement>("[data-events-close-copy]");
    const timeline = eventsScrollTimeline(gsap, section, EVENTS_SCRUB.closing);

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
      data-cinema="events-closing"
      className="relative h-[var(--pin)] border-t border-line bg-surface motion-reduce:h-auto"
      style={{ ["--pin" as string]: EVENTS_PIN.closingDesktop }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:relative motion-reduce:min-h-[90svh]">
        <div data-events-close-frame className="absolute inset-0 overflow-hidden will-change-[clip-path]">
          <div data-events-close-media className="relative h-full w-full will-change-transform">
            <Image src={image} alt={alt} fill className="object-cover" sizes="100vw" />
          </div>
          <div className="home-scrim-ivory absolute inset-0" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-canvas/85 via-canvas/55 to-canvas/92"
            aria-hidden="true"
          />
        </div>

        <div
          data-events-close-copy
          className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-[6vw] text-center text-paper"
        >
          <EventsSceneLabel className="mb-5 text-signal">{scene}</EventsSceneLabel>
          <h2 className="max-w-[12ch] text-[clamp(2.5rem,5.5vw,5.4rem)] font-light leading-[0.94] tracking-[-0.05em]">
            <EventsDisplayLine>{line1}</EventsDisplayLine>
            <EventsDisplayLine>{line2}</EventsDisplayLine>
          </h2>
        </div>
      </div>
    </section>
  );
}
