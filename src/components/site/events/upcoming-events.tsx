"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { EVENTS_SCRUB } from "@/components/site/events/events-motion.config";
import { eventsScrollTimeline } from "@/components/site/events/events-motion-utils";
import { EventsBody, EventsSceneLabel, EventsTextLink } from "@/components/site/events/events-ui";
import type { PublicEventCard } from "@/components/site/events/types";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

export function UpcomingEvents({
  scene,
  heading,
  intro,
  emptyPrimary,
  emptySecondary,
  emptyDisplay,
  viewLabel,
  locale,
  events,
  atmosphereSrc,
  atmosphereAlt,
}: {
  scene: string;
  heading: string;
  intro: string;
  emptyPrimary: string;
  emptySecondary: string;
  emptyDisplay: string;
  viewLabel: string;
  locale: string;
  events: PublicEventCard[];
  atmosphereSrc: string;
  atmosphereAlt: string;
}) {
  const root = useRef<HTMLElement>(null);
  const count = events.length;

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section || count < 4) return;
    const track = section.querySelector<HTMLElement>("[data-events-track]");
    if (!track) return;
    const distance = Math.max(track.scrollWidth - window.innerWidth + 80, 0);
    if (distance <= 0) return;
    const timeline = eventsScrollTimeline(gsap, section, EVENTS_SCRUB.showcase);
    timeline.fromTo(track, { x: 0 }, { x: -distance, ease: "none", duration: 1 }, 0);
  }, [count]);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      id="upcoming"
      data-cinema="events-upcoming"
      className={`border-t border-line bg-surface px-[5vw] py-20 md:px-[7vw] md:py-28 ${count >= 4 ? "h-[175svh]" : ""}`}
    >
      <div className={count >= 4 ? "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden" : ""}>
        <div className="mb-8 grid grid-cols-1 gap-4 md:mb-12 md:grid-cols-2 md:items-end md:gap-6">
          <div>
            <EventsSceneLabel className="text-signal">{scene}</EventsSceneLabel>
            <h2 className="mt-3 text-[clamp(2.2rem,4vw,3.6rem)] font-light tracking-[-0.045em] text-paper md:mt-4">{heading}</h2>
          </div>
          <EventsBody>{intro}</EventsBody>
        </div>

        {count === 0 ? (
          <div className="grid grid-cols-1 items-center gap-6 rounded-[20px] border border-line bg-canvas p-5 md:grid-cols-2 md:gap-10 md:p-10">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] md:aspect-[16/11]">
              <Image src={atmosphereSrc} alt={atmosphereAlt} fill className="object-cover" sizes="(min-width:768px) 50vw, 90vw" />
            </div>
            <div role="status" className="space-y-3 md:space-y-4">
              <p className="text-[clamp(2rem,3.8vw,3rem)] font-light leading-[0.98] tracking-[-0.04em] text-paper" aria-hidden="true">
                {emptyDisplay}
              </p>
              <p className="text-lg font-light leading-8 text-paper">{emptyPrimary}</p>
              <EventsBody>{emptySecondary}</EventsBody>
            </div>
          </div>
        ) : null}

        {count > 0 && count < 4 ? (
          <ul className="divide-y divide-line border-y border-line">
            {events.map((event, index) => (
              <li key={event.slug}>
                <EventRow event={event} index={index} locale={locale} viewLabel={viewLabel} featured={count === 1} />
              </li>
            ))}
          </ul>
        ) : null}

        {count >= 4 ? (
          <div className="overflow-hidden">
            <div data-events-track className="flex w-max gap-4 will-change-transform md:gap-6">
              {events.map((event, index) => (
                <article key={event.slug} className="w-[82vw] shrink-0 rounded-[20px] border border-line bg-canvas p-5 md:w-[42vw] md:p-8">
                  <EventBody event={event} index={index} locale={locale} viewLabel={viewLabel} />
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function EventRow({
  event,
  index,
  locale,
  viewLabel,
  featured = false,
}: {
  event: PublicEventCard;
  index: number;
  locale: string;
  viewLabel: string;
  featured?: boolean;
}) {
  return (
    <article className="grid gap-6 py-10 md:grid-cols-[minmax(0,1.4fr)_16rem] md:items-center">
      <EventBody event={event} index={index} locale={locale} viewLabel={viewLabel} featured={featured} />
      {event.imageSrc ? (
        <figure className="relative aspect-[4/3] overflow-hidden rounded-[16px] border border-line">
          <Image src={event.imageSrc} alt={event.title} fill className="object-cover" sizes="16rem" />
        </figure>
      ) : (
        <div className="flex aspect-[4/3] items-end rounded-[16px] border border-line bg-canvas p-6 text-signal">
          <p className="text-4xl font-light leading-none">{String(index + 1).padStart(2, "0")}</p>
        </div>
      )}
    </article>
  );
}

function EventBody({
  event,
  index,
  locale,
  viewLabel,
  featured = false,
}: {
  event: PublicEventCard;
  index: number;
  locale: string;
  viewLabel: string;
  featured?: boolean;
}) {
  return (
    <div>
      <p className="text-[0.6rem] uppercase tracking-[0.22em] text-signal">
        {String(index + 1).padStart(2, "0")} · {event.dateLabel}
      </p>
      <h3 className={`mt-3 font-light tracking-[-0.04em] text-paper ${featured ? "text-[clamp(2rem,4vw,3.4rem)]" : "text-2xl"}`}>
        {event.title}
      </h3>
      <p className="mt-4 max-w-xl text-sm leading-7 text-mist">{event.description}</p>
      <div className="mt-6">
        <EventsTextLink href={`/${locale}/events/${event.slug}`}>{viewLabel}</EventsTextLink>
      </div>
    </div>
  );
}
