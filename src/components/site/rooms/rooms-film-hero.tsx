"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

const scroller = () => document.documentElement;

const HERO_CLIP = {
  start: "inset(15svh 5.5vw 12svh 44vw round 20px)",
  full: "inset(0svh 0vw 0svh 0vw round 0px)",
} as const;

export function RoomsFilmHero({
  scene,
  eyebrow,
  title,
  intro,
  image,
  alt,
  scrollLabel,
}: {
  scene: string;
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  alt: string;
  scrollLabel: string;
}) {
  const root = useRef<HTMLElement>(null);
  const titleWords = useMemo(() => title.split(/\s+/).filter(Boolean), [title]);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;

    const frame = section.querySelector<HTMLElement>("[data-room-hero-frame]");
    const border = section.querySelector<HTMLElement>("[data-room-hero-border]");
    const media = section.querySelector<HTMLElement>("[data-room-hero-media]");
    const washes = gsap.utils.toArray<HTMLElement>("[data-room-hero-wash]", section);
    const copy = section.querySelector<HTMLElement>("[data-room-hero-copy]");
    const lines = gsap.utils.toArray<HTMLElement>("[data-room-hero-line]", section);
    const kicker = section.querySelector<HTMLElement>("[data-room-hero-kicker]");
    const rule = section.querySelector<HTMLElement>("[data-room-hero-rule]");
    const introNode = section.querySelector<HTMLElement>("[data-room-hero-intro]");
    const meter = section.querySelector<HTMLElement>("[data-room-hero-meter]");

    const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (kicker) entrance.from(kicker, { y: 12, autoAlpha: 0, duration: 0.6 }, 0.05);
    if (lines.length > 0) entrance.from(lines, { yPercent: 108, duration: 0.85, stagger: 0.08 }, 0.1);
    if (rule) entrance.from(rule, { scaleX: 0, duration: 0.7, ease: "power2.out" }, 0.28);
    if (introNode) entrance.from(introNode, { y: 14, autoAlpha: 0, duration: 0.65 }, 0.34);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        scroller: scroller(),
        start: "top top",
        end: "bottom bottom",
        scrub: 1.25,
        invalidateOnRefresh: true,
      },
    });

    if (copy) timeline.to(copy, { y: -46, autoAlpha: 0, ease: "power2.inOut", duration: 0.32 }, 0.05);
    if (border) timeline.to(border, { scale: 1.03, autoAlpha: 0, ease: "power2.out", duration: 0.3 }, 0.05);
    if (frame) {
      timeline.fromTo(
        frame,
        { clipPath: HERO_CLIP.start },
        { clipPath: HERO_CLIP.full, ease: "power2.inOut", duration: 0.56 },
        0.06,
      );
    }
    if (media) timeline.fromTo(media, { scale: 1.14, yPercent: 3 }, { scale: 1.0, yPercent: -3, ease: "none", duration: 1 }, 0);
    if (washes.length > 0) timeline.fromTo(washes, { opacity: 0 }, { opacity: 1, ease: "power1.inOut", duration: 0.35 }, 0.2);
    if (meter) timeline.fromTo(meter, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      data-cinema="rooms-rack-focus"
      className="home-ivory-blue relative h-[210svh] motion-reduce:h-auto"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:relative motion-reduce:min-h-[100svh]">
        <div
          data-room-hero-border
          className="pointer-events-none absolute bottom-[12svh] left-[44vw] right-[5.5vw] top-[15svh] z-[9] rounded-[20px] border border-paper/15 shadow-[0_24px_70px_rgb(8_43_45_/_0.14)] will-change-[transform,opacity]"
          aria-hidden="true"
        />

        <div
          data-room-hero-frame
          className="about-hero-frame absolute inset-0 z-10 overflow-hidden will-change-[clip-path]"
        >
          <div data-room-hero-media className="absolute inset-[-6%] will-change-transform">
            <Image src={image} alt={alt} fill className="object-cover" sizes="100vw" priority />
          </div>
          <div
            data-room-hero-wash
            className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-canvas via-canvas/80 to-transparent opacity-0"
            aria-hidden="true"
          />
          <div
            data-room-hero-wash
            className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-canvas/95 via-canvas/60 to-transparent opacity-0"
            aria-hidden="true"
          />
        </div>

        <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-[5vw] pb-6 pt-20 text-[0.54rem] uppercase tracking-[0.28em] text-paper/85 md:px-[7vw]">
          <span>{scene}</span>
          <span>{eyebrow}</span>
        </div>

        <div
          data-room-hero-copy
          className="absolute left-[5vw] top-1/2 z-30 max-w-[35vw] -translate-y-1/2 will-change-[transform,opacity] md:left-[7vw] md:max-w-[32vw]"
        >
          <p data-room-hero-kicker className="mb-3 text-[0.54rem] uppercase tracking-[0.28em] text-signal md:mb-5">
            {eyebrow}
          </p>
          <h1 className="max-w-[9ch] text-[clamp(2.1rem,6.6vw,6.8rem)] font-light leading-[0.9] tracking-[-0.06em] text-paper">
            {titleWords.map((word, index) => (
              <span key={`${word}-${index}`} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
                <span data-room-hero-line className="block will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </h1>
          <div data-room-hero-rule className="mt-4 h-px w-16 origin-left bg-paper/25 md:mt-7 md:w-20" aria-hidden="true" />
          <p data-room-hero-intro className="mt-3 max-w-[34ch] text-xs leading-relaxed text-mist md:mt-5 md:text-[0.98rem]">
            {intro}
          </p>
        </div>

        <div className="absolute inset-x-[5vw] bottom-6 z-30 flex items-center gap-4 text-[0.52rem] uppercase tracking-[0.26em] text-mist md:inset-x-[7vw] md:bottom-7">
          <span>{scrollLabel}</span>
          <span className="relative h-px flex-1 overflow-hidden bg-line">
            <span data-room-hero-meter className="absolute inset-0 origin-left scale-x-0 bg-signal motion-reduce:scale-x-100" />
          </span>
          <span>01</span>
        </div>
      </div>
    </section>
  );
}
