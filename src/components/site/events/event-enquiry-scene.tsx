"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { EventsBody, EventsSceneLabel, EventsTextLink } from "@/components/site/events/events-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

export function EventEnquiryScene({
  scene,
  title,
  body,
  contactHref,
  contactCta,
  roomsHref,
  exploreRooms,
  disclaimer,
  image,
  alt,
}: {
  scene: string;
  title: string;
  body: string;
  contactHref: string;
  contactCta: string;
  roomsHref: string;
  exploreRooms: string;
  disclaimer: string;
  image: string;
  alt: string;
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const photo = section.querySelector<HTMLElement>("[data-events-enquire-photo]");
    const media = section.querySelector<HTMLElement>("[data-events-enquire-media]");
    const copy = section.querySelector<HTMLElement>("[data-events-enquire-copy]");
    const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: "top 82%", end: "top 30%", scrub: 0.75 } });
    if (photo) tl.fromTo(photo, { clipPath: "inset(10% 8% 10% 8% round 20px)" }, { clipPath: "inset(0% 0% 0% 0% round 20px)", ease: "power2.out", duration: 0.6 }, 0);
    if (media) tl.fromTo(media, { scale: 1.12 }, { scale: 1, ease: "none", duration: 0.8 }, 0);
    if (copy) tl.fromTo(copy, { y: 28, autoAlpha: 0.3 }, { y: 0, autoAlpha: 1, ease: "power3.out", duration: 0.45 }, 0.05);
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      data-cinema="events-enquire"
      className="border-t border-line bg-canvas px-[5vw] py-20 md:px-[7vw] md:py-28"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-7 md:grid-cols-2 md:gap-12">
        <div
          data-events-enquire-copy
          className="order-2 rounded-2xl border border-paper/10 bg-surface/75 p-6 backdrop-blur-md md:order-1 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none"
        >
          <EventsSceneLabel className="text-signal">{scene}</EventsSceneLabel>
          <h2 className="mt-3 text-[clamp(2.1rem,3.8vw,3.4rem)] font-light leading-[0.96] tracking-[-0.045em] text-paper md:mt-4">
            {title}
          </h2>
          <EventsBody className="mt-4 md:mt-6">{body}</EventsBody>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
            <EventsTextLink href={contactHref}>{contactCta}</EventsTextLink>
            <EventsTextLink href={roomsHref}>{exploreRooms}</EventsTextLink>
          </div>
          <p className="mt-5 max-w-md text-xs leading-6 text-mist md:mt-6">{disclaimer}</p>
        </div>
        <div
          data-events-enquire-photo
          className="relative order-1 aspect-[4/3] w-full overflow-hidden rounded-[20px] shadow-[0_24px_72px_rgb(8_43_45_/_0.12)] will-change-[clip-path] md:order-2"
        >
          <div data-events-enquire-media className="relative h-full w-full will-change-transform">
            <Image src={image} alt={alt} fill className="object-cover" sizes="(min-width:768px) 44vw, 100vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
