import Image from "next/image";
import { EventsBody, EventsSceneLabel, EventsTextLink } from "@/components/site/events/events-ui";
import type { PublicEventCard } from "@/components/site/events/types";

export function PastEventsArchive({
  scene,
  heading,
  intro,
  display,
  viewLabel,
  locale,
  events,
}: {
  scene: string;
  heading: string;
  intro: string;
  display: string;
  viewLabel: string;
  locale: string;
  events: PublicEventCard[];
}) {
  if (events.length === 0) return null;

  return (
    <section data-cinema="events-past" className="border-t border-line bg-canvas px-[5vw] py-20 md:px-[7vw] md:py-28">
      <div className="mb-12 grid grid-cols-2 items-end gap-4 md:gap-6">
        <div>
          <EventsSceneLabel className="text-signal">{scene}</EventsSceneLabel>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] font-light tracking-[-0.045em] text-paper">{heading}</h2>
          <p className="mt-3 text-[clamp(1.4rem,2.6vw,2.1rem)] font-light text-mist" aria-hidden="true">
            {display}
          </p>
        </div>
        <EventsBody>{intro}</EventsBody>
      </div>
      <ul className="divide-y divide-line border-y border-line">
        {events.map((event, index) => (
          <li key={event.slug} className="grid grid-cols-[5rem_minmax(0,1fr)_9rem] items-center gap-4 py-8 md:grid-cols-[8rem_minmax(0,1fr)_14rem] md:gap-6 md:py-10">
            <p className="text-[clamp(1.6rem,3vw,2.4rem)] font-light tracking-[-0.04em] text-signal">
              {String(index + 1).padStart(2, "0")}
            </p>
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.22em] text-mist">{event.dateLabel}</p>
              <h3 className="mt-2 text-2xl font-light tracking-[-0.03em] text-paper">{event.title}</h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-mist">{event.description}</p>
              <div className="mt-5">
                <EventsTextLink href={`/${locale}/events/${event.slug}`}>{viewLabel}</EventsTextLink>
              </div>
            </div>
            {event.imageSrc ? (
              <figure className="relative aspect-[4/3] overflow-hidden rounded-[16px] border border-line">
                <Image src={event.imageSrc} alt={event.title} fill className="object-cover" sizes="14rem" />
              </figure>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
