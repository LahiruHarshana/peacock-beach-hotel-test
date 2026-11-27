"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";
import type { RoomsFilmCard } from "@/components/site/rooms/types";

const scroller = () => document.documentElement;

const tones = ["bg-surface", "bg-canvas", "bg-surface"] as const;

export function RoomsFilmCollection({
  scene,
  title,
  intro,
  cards,
  emptyMessage,
}: {
  scene: string;
  title: string;
  intro: string;
  cards: RoomsFilmCard[];
  emptyMessage?: string;
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const scenes = gsap.utils.toArray<HTMLElement>("[data-room-film-scene]", section);

    scenes.forEach((item, index) => {
      const frame = item.querySelector<HTMLElement>("[data-room-film-frame]");
      const media = item.querySelector<HTMLElement>("[data-room-film-media]");
      const copy = item.querySelector<HTMLElement>("[data-room-film-copy]");

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          scroller: scroller(),
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      if (frame) {
        timeline.fromTo(
          frame,
          { clipPath: index % 2 === 0 ? "inset(8% 0% 8% 18% round 20px)" : "inset(8% 18% 8% 0% round 20px)" },
          { clipPath: "inset(0% 0% 0% 0% round 20px)", duration: 0.45, ease: "power2.inOut" },
          0,
        );
      }
      if (media) {
        timeline.fromTo(media, { scale: 1.15, yPercent: 4 }, { scale: 1.0, yPercent: -4, duration: 1, ease: "none" }, 0);
      }
      if (copy) {
        gsap.fromTo(
          copy,
          { y: 28, autoAlpha: 0.2 },
          {
            y: 0,
            autoAlpha: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              scroller: scroller(),
              start: "top 82%",
              end: "top 25%",
              scrub: 0.9,
            },
          },
        );
      }
    });
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section ref={root} data-cinema="rooms-film-collection" className="relative">
      <header className="grid grid-cols-[0.7fr_1.3fr] gap-6 border-y border-line bg-canvas px-[5vw] py-16 text-paper md:gap-8 md:px-[7vw] md:py-24">
        <div>
          <p className="text-[0.54rem] uppercase tracking-[0.28em] text-signal">{scene}</p>
          <p className="mt-5 text-xs uppercase tracking-[0.2em] text-mist">{String(cards.length).padStart(2, "0")} frames</p>
        </div>
        <div>
          <h2 className="max-w-[11ch] text-[clamp(2rem,6.2vw,6.4rem)] font-light leading-[0.88] tracking-[-0.06em]">{title}</h2>
          <p className="mt-5 max-w-lg text-xs leading-6 text-mist md:ml-auto md:mt-7 md:text-[0.95rem] md:leading-7">{intro}</p>
          {emptyMessage ? (
            <p className="mt-4 max-w-lg border-l border-signal/50 pl-4 text-xs leading-6 text-mist md:ml-auto md:mt-5" role="status">
              {emptyMessage}
            </p>
          ) : null}
        </div>
      </header>

      {cards.map((card, index) => (
        <article
          key={card.key}
          data-room-film-scene
          className={`relative h-[185svh] border-t border-line motion-reduce:h-auto ${tones[index % tones.length]}`}
        >
          <div className="sticky top-0 flex h-[100svh] flex-col justify-between gap-4 overflow-hidden px-[5vw] pb-8 pt-20 md:grid md:grid-cols-12 md:items-center md:gap-[4vw] md:px-[7vw] md:py-20 motion-reduce:relative motion-reduce:h-auto">
            <div className="flex items-center justify-between gap-4 md:hidden">
              <p className="text-[0.52rem] uppercase tracking-[0.26em] text-signal">{card.meta}</p>
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
              <span className="text-[0.52rem] uppercase tracking-[0.24em] text-mist">
                {card.index} / {String(cards.length).padStart(2, "0")}
              </span>
            </div>

            <figure
              data-room-film-frame
              className={`relative z-10 aspect-[4/4.1] w-full flex-1 overflow-hidden rounded-[22px] shadow-[0_28px_80px_rgb(8_43_45_/_0.14)] will-change-[clip-path] md:aspect-[5/4] md:flex-none md:rounded-[20px] md:col-span-7 ${
                index % 2 === 0 ? "md:col-start-6 md:row-start-1" : "md:col-start-1 md:row-start-1"
              }`}
            >
              <div data-room-film-media className="relative h-full w-full will-change-transform">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  className="object-cover object-[center_22%]"
                  sizes="(min-width: 768px) 56vw, 90vw"
                  priority={index === 0}
                />
              </div>
              <figcaption className="absolute bottom-3 left-3 rounded-full border border-paper/15 bg-surface/90 px-3 py-1 text-[0.48rem] uppercase tracking-[0.24em] text-paper backdrop-blur-md md:bottom-6 md:left-6 md:px-3.5 md:text-[0.52rem]">
                {card.index} / {String(cards.length).padStart(2, "0")} · Peacock
              </figcaption>
            </figure>

            <div
              data-room-film-copy
              className={`relative z-20 w-full rounded-2xl border border-paper/10 bg-surface/65 p-5 text-paper backdrop-blur-md will-change-[transform,opacity] md:col-span-4 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none ${
                index % 2 === 0 ? "md:col-start-1 md:row-start-1" : "md:col-start-9 md:row-start-1"
              }`}
            >
              <p className="hidden text-[0.5rem] uppercase tracking-[0.26em] text-signal md:block md:text-[0.54rem]">{card.meta}</p>
              <h3 className="text-[clamp(2rem,4.4vw,4.6rem)] font-light leading-[0.94] tracking-[-0.05em] text-paper md:mt-4">
                {card.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-mist md:mt-6 md:text-[0.95rem] md:leading-7">{card.description}</p>
              {card.price ? (
                <p className="mt-4 text-[0.54rem] uppercase tracking-[0.2em] text-paper/80 md:mt-5 md:text-[0.58rem]">{card.price}</p>
              ) : null}
              {card.href && card.cta ? (
                <Link
                  href={card.href}
                  className="group mt-5 inline-flex items-center gap-2 rounded-full border border-paper/20 px-4 py-2 text-[0.52rem] uppercase tracking-[0.22em] text-paper transition-colors duration-300 hover:bg-paper hover:text-canvas md:mt-8 md:gap-3 md:px-6 md:py-3 md:text-[0.58rem]"
                >
                  <span>{card.cta}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
