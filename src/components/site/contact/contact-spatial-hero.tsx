"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { EventsBody, EventsDisplayLine, EventsSceneLabel } from "@/components/site/events/events-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

const scroller = () => document.documentElement;

const CONTACT_HERO_CLIP = {
  start: "inset(15svh 5.5vw 12svh 43vw round 20px)",
  full: "inset(0svh 0vw 0svh 0vw round 0px)",
} as const;

export function ContactSpatialHero({
  scene,
  eyebrow,
  location,
  title,
  line1,
  line2,
  support,
  scrollLabel,
  images,
}: {
  scene: string;
  eyebrow: string;
  location: string;
  title: string;
  address: string;
  line1: string;
  line2: string;
  support: string;
  scrollLabel: string;
  images: { coast: string; lounge: string; terrace: string };
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;

    const frame = section.querySelector<HTMLElement>("[data-contact-hero-frame]");
    const border = section.querySelector<HTMLElement>("[data-contact-hero-border]");
    const media = section.querySelector<HTMLElement>("[data-contact-hero-media]");
    const cutTwo = section.querySelector<HTMLElement>("[data-contact-hero-cut-two]");
    const cutTwoMedia = section.querySelector<HTMLElement>("[data-contact-hero-cut-two-media]");
    const cutThree = section.querySelector<HTMLElement>("[data-contact-hero-cut-three]");
    const cutThreeMedia = section.querySelector<HTMLElement>("[data-contact-hero-cut-three-media]");
    const washes = gsap.utils.toArray<HTMLElement>("[data-contact-hero-wash]", section);
    const copy = section.querySelector<HTMLElement>("[data-contact-hero-copy]");
    const lines = gsap.utils.toArray<HTMLElement>("[data-events-line]", section);
    const kicker = section.querySelector<HTMLElement>("[data-contact-hero-kicker]");
    const rule = section.querySelector<HTMLElement>("[data-contact-hero-rule]");
    const supportEl = section.querySelector<HTMLElement>("[data-contact-hero-support]");
    const insetWrap = section.querySelector<HTMLElement>("[data-contact-hero-inset-wrap]");
    const insetCard = section.querySelector<HTMLElement>("[data-contact-hero-inset]");
    const meter = section.querySelector<HTMLElement>("[data-contact-hero-meter]");

    const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (kicker) entrance.from(kicker, { y: 12, autoAlpha: 0, duration: 0.6 }, 0.05);
    if (lines.length > 0) entrance.from(lines, { yPercent: 108, duration: 0.85, stagger: 0.08 }, 0.1);
    if (rule) entrance.from(rule, { scaleX: 0, duration: 0.7, ease: "power2.out" }, 0.28);
    if (supportEl) entrance.from(supportEl, { y: 14, autoAlpha: 0, duration: 0.65 }, 0.34);
    if (insetCard) {
      entrance.from(insetCard, { y: 24, scale: 0.94, autoAlpha: 0, duration: 0.85, ease: "power2.out" }, 0.24);
    }

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        scroller: scroller(),
        start: "top top",
        end: "bottom bottom",
        scrub: 1.3,
        invalidateOnRefresh: true,
      },
    });

    if (copy) timeline.to(copy, { y: -46, autoAlpha: 0, ease: "power2.inOut", duration: 0.24 }, 0.04);
    if (insetWrap) timeline.to(insetWrap, { yPercent: -32, xPercent: -8, rotate: -2, autoAlpha: 0, ease: "power2.in", duration: 0.26 }, 0.03);
    if (border) timeline.to(border, { scale: 1.03, autoAlpha: 0, ease: "power2.out", duration: 0.24 }, 0.04);
    if (frame) {
      timeline.fromTo(
        frame,
        { clipPath: CONTACT_HERO_CLIP.start },
        { clipPath: CONTACT_HERO_CLIP.full, ease: "power2.inOut", duration: 0.38 },
        0.05,
      );
    }
    if (media) timeline.fromTo(media, { scale: 1.14, yPercent: 3 }, { scale: 1.02, yPercent: -3, ease: "none", duration: 0.55 }, 0);
    if (cutTwo) timeline.fromTo(cutTwo, { autoAlpha: 0 }, { autoAlpha: 1, ease: "power1.inOut", duration: 0.22 }, 0.42);
    if (cutTwoMedia) timeline.fromTo(cutTwoMedia, { scale: 1.1, yPercent: 2 }, { scale: 1, yPercent: -3, ease: "none", duration: 0.42 }, 0.4);
    if (cutThree) timeline.fromTo(cutThree, { autoAlpha: 0 }, { autoAlpha: 1, ease: "power1.inOut", duration: 0.22 }, 0.72);
    if (cutThreeMedia) timeline.fromTo(cutThreeMedia, { scale: 1.09, yPercent: 2 }, { scale: 1, yPercent: -2, ease: "none", duration: 0.3 }, 0.7);
    if (washes.length > 0) timeline.fromTo(washes, { opacity: 0 }, { opacity: 1, ease: "power1.inOut", duration: 0.28 }, 0.18);
    if (meter) timeline.fromTo(meter, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section ref={root} data-cinema="contact-hero" className="home-ivory-blue relative h-[240svh] motion-reduce:h-auto">
      <div className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:relative motion-reduce:min-h-[100svh]">
        <div
          data-contact-hero-border
          className="pointer-events-none absolute bottom-[12svh] left-[43vw] right-[5.5vw] top-[15svh] z-[9] rounded-[20px] border border-paper/15 shadow-[0_24px_70px_rgb(8_43_45_/_0.14)] will-change-[transform,opacity]"
          aria-hidden="true"
        />

        <div
          data-contact-hero-frame
          className="about-hero-frame absolute inset-0 z-10 overflow-hidden will-change-[clip-path]"
        >
          <div data-contact-hero-media className="absolute inset-[-6%] will-change-transform">
            <Image src={images.terrace} alt={title} fill className="object-cover" sizes="100vw" priority />
          </div>
          <div data-contact-hero-cut-two className="pointer-events-none absolute inset-0 opacity-0 will-change-opacity">
            <div data-contact-hero-cut-two-media className="absolute inset-[-6%] will-change-transform">
              <Image src={images.coast} alt="" fill className="object-cover" sizes="100vw" />
            </div>
          </div>
          <div data-contact-hero-cut-three className="pointer-events-none absolute inset-0 opacity-0 will-change-opacity">
            <div data-contact-hero-cut-three-media className="absolute inset-[-6%] will-change-transform">
              <Image src={images.lounge} alt="" fill className="object-cover" sizes="100vw" />
            </div>
          </div>
          <div
            data-contact-hero-wash
            className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-canvas via-canvas/80 to-transparent opacity-0"
            aria-hidden="true"
          />
          <div
            data-contact-hero-wash
            className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-canvas/95 via-canvas/60 to-transparent opacity-0"
            aria-hidden="true"
          />
        </div>

        <div
          data-contact-hero-inset-wrap
          className="pointer-events-none absolute bottom-[15svh] left-[35.5vw] z-20 w-[16vw] max-w-[13rem] will-change-[transform,opacity] md:w-[13.5vw]"
        >
          <figure
            data-contact-hero-inset
            className="relative aspect-[3/4] w-full overflow-hidden rounded-[0.9rem] border-[0.4rem] border-canvas bg-surface shadow-[0_24px_65px_rgb(8_43_45_/_0.2)] will-change-transform"
          >
            <Image src={images.coast} alt="" fill className="object-cover" sizes="15vw" priority />
          </figure>
        </div>

        <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-[5vw] pb-6 pt-20 text-[0.54rem] uppercase tracking-[0.28em] text-paper/85 md:px-[7vw]">
          <EventsSceneLabel className="!text-paper/85">{scene} · {location}</EventsSceneLabel>
          <EventsSceneLabel className="!text-paper/85 text-right">{eyebrow}</EventsSceneLabel>
        </div>

        <div
          data-contact-hero-copy
          className="absolute left-[5vw] top-1/2 z-30 max-w-[36vw] -translate-y-1/2 will-change-[transform,opacity] md:left-[7vw] md:max-w-[33vw]"
        >
          <p data-contact-hero-kicker className="mb-4 text-[0.54rem] uppercase tracking-[0.28em] text-signal md:mb-5">
            {title}
          </p>
          <h1 className="max-w-[10ch] text-[clamp(2rem,5.6vw,5.6rem)] font-light leading-[0.92] tracking-[-0.055em] text-paper">
            <EventsDisplayLine>{line1}</EventsDisplayLine>
            <EventsDisplayLine>{line2}</EventsDisplayLine>
          </h1>
          <div data-contact-hero-rule className="mt-5 h-px w-20 origin-left bg-paper/25 md:mt-7" aria-hidden="true" />
          <EventsBody data-contact-hero-support className="mt-4 max-w-[32ch] md:mt-5">
            {support}
          </EventsBody>
        </div>

        <div className="absolute inset-x-[5vw] bottom-7 z-30 flex items-center gap-4 text-[0.52rem] uppercase tracking-[0.26em] text-mist md:inset-x-[7vw]">
          <span>{scrollLabel}</span>
          <span className="relative h-px flex-1 overflow-hidden bg-line">
            <span data-contact-hero-meter className="absolute inset-0 origin-left scale-x-0 bg-signal motion-reduce:scale-x-100" />
          </span>
          <span>01</span>
        </div>
      </div>
    </section>
  );
}
