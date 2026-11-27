"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";
import type { HomeRoomCard } from "@/components/site/home/types";

const scroller = () => document.documentElement;

export function HomeRoomsReel({
  tag,
  title,
  lead,
  allHref,
  allLabel,
  cards,
}: {
  tag: string;
  title: string;
  lead: string;
  allHref: string;
  allLabel: string;
  cards: HomeRoomCard[];
}) {
  const track = useRef<HTMLDivElement>(null);
  const pinHost = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const host = pinHost.current;
    const row = track.current;
    if (!host || !row || row.children.length < 2) return;

    const distance = () => Math.max(0, row.scrollWidth - window.innerWidth + 48);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: host,
        scroller: scroller(),
        start: "top 64px",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.75,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    timeline.to(row, { x: () => -distance(), ease: "none" }, 0);

    timeline.eventCallback("onUpdate", () => {
      if (!progress.current) return;
      const current = Math.min(row.children.length, Math.floor(timeline.progress() * row.children.length) + 1);
      progress.current.textContent = `${String(current).padStart(2, "0")} / ${String(row.children.length).padStart(2, "0")}`;
    });
  }, []);

  useCinematic(pinHost, setup, MOTION);

  return (
    <section data-cinema="home-reel" className="home-reel-blue-ivory overflow-x-clip py-12 md:py-0">
      <div className="px-[5vw] pt-8 md:pt-[8svh]">
        <div className="mx-auto grid max-w-[110rem] gap-6 md:grid-cols-[1fr_1.4fr_auto] md:items-end md:gap-10">
          <p className="self-start text-[0.58rem] uppercase tracking-[0.24em] text-paper/60">04 · {tag}</p>
          <div>
            <h2 className="max-w-[9ch] text-[clamp(2.8rem,7vw,7.5rem)] font-light leading-[0.82] tracking-[-0.075em]">{title}</h2>
            <p className="mt-4 max-w-md text-xs leading-6 text-paper/70 md:mt-6 md:text-sm">{lead}</p>
          </div>
          <Link href={allHref} className="group inline-flex items-center gap-4 text-[0.6rem] uppercase tracking-[0.2em] text-paper">
            {allLabel}
            <span className="grid size-9 place-items-center rounded-full border border-paper/20 transition-colors group-hover:bg-paper group-hover:text-canvas md:size-10" aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      <div ref={pinHost} className="relative mt-8 overflow-hidden md:mt-[8svh] motion-reduce:overflow-visible" data-reel-pin>
        <div ref={track} className="flex h-[68svh] w-max items-stretch gap-4 px-[5vw] pb-6 will-change-transform md:h-[calc(100svh-6rem)] md:w-auto md:gap-6 md:pl-[5vw] md:pr-[9vw] md:pb-[5svh] motion-reduce:h-auto motion-reduce:flex-wrap">
          {cards.map((card) => (
            <article
              key={card.index + card.href}
              className="relative h-full w-[78vw] shrink-0 overflow-hidden rounded-[1.25rem] bg-elevated md:w-[min(66vw,52rem)] md:rounded-[1.5rem] motion-reduce:h-[28rem] motion-reduce:md:h-[32rem] motion-reduce:md:w-[calc(50%-0.75rem)]"
            >
              <Link href={card.href} className="group absolute inset-0 flex flex-col justify-end">
                <div className="absolute inset-0">
                  <Image src={card.image} alt={card.alt} fill className="object-cover transition-transform duration-1000 ease-halden group-hover:scale-[1.04]" sizes="(min-width: 768px) 66vw, 85vw" />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-paper/78 via-mist/25 to-transparent"
                    aria-hidden="true"
                  />
                </div>
                <div className="relative z-10 flex items-end justify-between gap-6 p-6 text-canvas md:p-9">
                  <div>
                    <p className="text-[0.58rem] uppercase tracking-[0.22em] text-elevated/90">{tag} · {card.index}</p>
                    <h3 className="mt-3 text-[clamp(1.6rem,3vw,3.2rem)] font-light leading-none tracking-[-0.05em]">{card.title}</h3>
                    <p className="mt-3 text-xs uppercase tracking-[0.14em] text-canvas/85">{card.meta}</p>
                  </div>
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-full border border-canvas/50 transition-colors group-hover:bg-canvas group-hover:text-paper md:size-11"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
        <div className="pointer-events-none absolute right-5 bottom-8 z-20 rounded-full border border-paper/15 bg-surface/90 px-3 py-2 text-[0.5rem] tracking-[0.18em] text-paper backdrop-blur-md">
          <span ref={progress}>01 / {String(cards.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
