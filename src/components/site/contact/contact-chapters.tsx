"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useCallback, useRef } from "react";
import { EventsDisplayLine, EventsSceneLabel } from "@/components/site/events/events-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

const scroller = () => document.documentElement;

export function ContactEnquiryChapter({
  scene,
  title,
  lede,
  image,
  alt,
  children,
}: {
  scene: string;
  title: string;
  lede: string;
  image: string;
  alt: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const frame = section.querySelector<HTMLElement>("[data-contact-enq-frame]");
    const media = section.querySelector<HTMLElement>("[data-contact-enq-media]");
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, scroller: scroller(), start: "top 82%", end: "top 30%", scrub: 0.75 },
    });
    if (frame) tl.fromTo(frame, { clipPath: "inset(10% 8% 10% 8% round 20px)" }, { clipPath: "inset(0% 0% 0% 0% round 20px)", ease: "power2.out", duration: 0.6 }, 0);
    if (media) tl.fromTo(media, { scale: 1.12 }, { scale: 1, ease: "none", duration: 0.8 }, 0);
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      id="enquiry"
      className="scroll-mt-24 border-t border-line bg-surface px-[5vw] py-20 md:px-[7vw] md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 grid grid-cols-1 items-end gap-6 md:mb-12 md:grid-cols-[0.85fr_1.15fr] md:gap-8">
          <div>
            <EventsSceneLabel className="text-signal">{scene}</EventsSceneLabel>
            <h2 className="mt-3 text-[clamp(2.2rem,4vw,3.4rem)] font-light leading-[0.96] tracking-[-0.045em] text-paper md:mt-4">
              {title}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-mist md:mt-5">{lede}</p>
          </div>
          <div
            data-contact-enq-frame
            className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] shadow-[0_24px_72px_rgb(8_43_45_/_0.1)] will-change-[clip-path] md:aspect-[16/8]"
          >
            <div data-contact-enq-media className="relative h-full w-full will-change-transform">
              <Image src={image} alt={alt} fill className="object-cover" sizes="44vw" />
            </div>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

export function ContactClose({
  scene,
  line1,
  line2,
  roomsHref,
  exploreRooms,
  disclaimer,
  image,
  alt,
}: {
  scene: string;
  line1: string;
  line2: string;
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
    const frame = section.querySelector<HTMLElement>("[data-contact-close-frame]");
    const media = section.querySelector<HTMLElement>("[data-contact-close-media]");
    const copy = section.querySelector<HTMLElement>("[data-contact-close-copy]");

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        scroller: scroller(),
        start: "top top",
        end: "bottom bottom",
        scrub: 1.15,
        invalidateOnRefresh: true,
      },
    });

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
      className="relative h-[165svh] border-t border-line bg-canvas motion-reduce:h-auto"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:relative motion-reduce:min-h-[90svh]">
        <div data-contact-close-frame className="absolute inset-0 overflow-hidden will-change-[clip-path]">
          <div data-contact-close-media className="relative h-full w-full will-change-transform">
            <Image src={image} alt={alt} fill className="object-cover" sizes="100vw" />
          </div>
          <div className="home-scrim-ivory absolute inset-0" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-canvas/85 via-canvas/55 to-canvas/92"
            aria-hidden="true"
          />
        </div>

        <div
          data-contact-close-copy
          className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-[6vw] text-center text-paper"
        >
          <EventsSceneLabel className="mb-5 text-signal">{scene}</EventsSceneLabel>
          <h2 className="max-w-[12ch] text-[clamp(2.5rem,5.5vw,5.4rem)] font-light leading-[0.94] tracking-[-0.05em]">
            <EventsDisplayLine>{line1}</EventsDisplayLine>
            <EventsDisplayLine>{line2}</EventsDisplayLine>
          </h2>
          <p className="mt-6 max-w-md text-xs leading-6 text-paper/80">{disclaimer}</p>
          <div className="mt-9">
            <Link
              href={roomsHref}
              className="group inline-flex min-w-[11rem] items-center justify-center gap-2.5 rounded-full bg-paper px-7 py-3.5 text-[0.58rem] uppercase tracking-[0.22em] text-canvas transition-colors duration-300 hover:bg-paper/90"
            >
              <span>{exploreRooms}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                ↗
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactWordmark({ label }: { label: string }) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const wordmark = section.querySelector<HTMLElement>("[data-contact-wordmark]");
    const line = section.querySelector<HTMLElement>("[data-contact-wordmark-line]");
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        scroller: scroller(),
        start: "top 90%",
        end: "top 28%",
        scrub: 0.9,
      },
    });
    if (line) tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, ease: "power2.out", duration: 0.45 }, 0);
    if (wordmark) tl.fromTo(wordmark, { yPercent: 55, autoAlpha: 0.25 }, { yPercent: 0, autoAlpha: 1, ease: "power2.out", duration: 0.85 }, 0.1);
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section ref={root} className="bg-canvas px-[5vw] py-20 text-paper md:py-28">
      <div className="mx-auto flex flex-col items-center justify-center">
        <EventsSceneLabel className="mb-6">{label}</EventsSceneLabel>
        <div data-contact-wordmark-line className="mb-8 h-px w-full max-w-lg origin-left bg-line" aria-hidden="true" />
        <div className="w-full overflow-hidden pb-[0.16em]">
          <p
            data-contact-wordmark
            className="halden-spaced select-none text-center text-[clamp(3.6rem,14vw,11.5rem)] font-light leading-[0.88] tracking-[0.08em] text-paper motion-reduce:translate-y-0"
          >
            peacock
          </p>
        </div>
      </div>
    </section>
  );
}
