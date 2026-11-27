"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { EventsSceneLabel, EventsTextLink } from "@/components/site/events/events-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

export function ContactDirections({
  scene,
  title,
  address,
  directionsLabel,
  mapPending,
  mapUrl,
  mapIsEmbed,
  image,
  alt,
}: {
  scene: string;
  title: string;
  address: string;
  directionsLabel: string;
  mapPending: string;
  mapUrl: string | null;
  mapIsEmbed: boolean;
  image: string;
  alt: string;
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const frame = section.querySelector<HTMLElement>("[data-contact-dir-frame]");
    const media = section.querySelector<HTMLElement>("[data-contact-dir-media]");
    const copy = section.querySelector<HTMLElement>("[data-contact-dir-copy]");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        scroller: document.documentElement,
        start: "top 82%",
        end: "top 30%",
        scrub: 0.75,
      },
    });
    if (frame) {
      tl.fromTo(frame, { clipPath: "inset(10% 8% 10% 8% round 20px)" }, { clipPath: "inset(0% 0% 0% 0% round 20px)", ease: "power2.out", duration: 0.6 }, 0);
    }
    if (media) tl.fromTo(media, { scale: 1.12 }, { scale: 1, ease: "none", duration: 0.8 }, 0);
    if (copy) tl.fromTo(copy, { y: 28, autoAlpha: 0.3 }, { y: 0, autoAlpha: 1, ease: "power3.out", duration: 0.45 }, 0.05);
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section ref={root} className="border-t border-line bg-surface px-[5vw] py-20 md:px-[7vw] md:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-7 md:grid-cols-2 md:gap-12">
        <div
          data-contact-dir-copy
          className="order-2 rounded-2xl border border-paper/10 bg-canvas/70 p-6 backdrop-blur-md md:order-1 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none"
        >
          <EventsSceneLabel className="text-signal">{scene}</EventsSceneLabel>
          <h2 className="mt-3 text-[clamp(2.2rem,4vw,3.4rem)] font-light leading-[0.96] tracking-[-0.045em] text-paper md:mt-4">
            {title}
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-mist md:mt-6">{address}</p>
          {mapUrl ? (
            <div className="mt-6 md:mt-8">
              <EventsTextLink href={mapUrl}>{directionsLabel}</EventsTextLink>
            </div>
          ) : (
            <p className="mt-6 text-sm text-mist md:mt-8">{mapPending}</p>
          )}
        </div>

        <div
          data-contact-dir-frame
          className="relative order-1 aspect-[5/4] w-full overflow-hidden rounded-[20px] border border-line bg-canvas shadow-[0_24px_72px_rgb(8_43_45_/_0.1)] will-change-[clip-path] md:order-2"
        >
          {mapIsEmbed && mapUrl ? (
            <iframe title={title} src={mapUrl} className="absolute inset-0 h-full w-full border-0" loading="lazy" />
          ) : (
            <div data-contact-dir-media className="relative h-full w-full will-change-transform">
              <Image src={image} alt={alt} fill className="object-cover" sizes="(min-width:1024px) 46vw, 100vw" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function ContactMethods({
  scene,
  methods,
}: {
  scene: string;
  methods: { index: string; label: string; value: string; href?: string }[];
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const rows = gsap.utils.toArray<HTMLElement>("[data-contact-method-row]", section);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        scroller: document.documentElement,
        start: "top 82%",
        end: "top 35%",
        scrub: 0.65,
      },
    });
    rows.forEach((row, i) => {
      tl.fromTo(row, { y: 24, autoAlpha: 0.25 }, { y: 0, autoAlpha: 1, ease: "power2.out", duration: 0.4 }, i * 0.08);
    });
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section ref={root} className="border-t border-line bg-canvas px-[5vw] py-16 md:px-[7vw] md:py-24">
      <div className="mx-auto max-w-6xl">
        <EventsSceneLabel className="mb-8 text-signal">{scene}</EventsSceneLabel>
        <ul className="divide-y divide-line border-y border-line">
          {methods.map((method) => {
            const body = (
              <>
                <span className="text-[0.62rem] uppercase tracking-[0.2em] text-signal">{method.index}</span>
                <div>
                  <h3 className="text-xl font-light tracking-[-0.03em] text-paper">{method.label}</h3>
                  <p className="mt-2 text-sm text-mist">{method.value}</p>
                </div>
              </>
            );
            return (
              <li key={method.index} data-contact-method-row>
                {method.href ? (
                  <a
                    href={method.href}
                    className="grid grid-cols-[3.5rem_1fr] gap-4 px-3 py-6 transition-colors hover:bg-surface md:grid-cols-[5rem_1fr] md:px-4 md:py-8"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="grid grid-cols-[3.5rem_1fr] gap-4 px-3 py-6 md:grid-cols-[5rem_1fr] md:px-4 md:py-8">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
