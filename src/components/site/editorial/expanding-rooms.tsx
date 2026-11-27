"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { loadMotion, prefersReducedMotion } from "@/lib/motion/gsap-runtime";

export type StayCard = {
  key: string;
  title: string;
  description: string | null;
  href: string;
  cta: string;
  image: string;
  alt: string;
  price: string | null;
  index: string;
};

type MotionApi = Awaited<ReturnType<typeof loadMotion>>;

export function ExpandingRooms({
  rooms,
  heading,
  empty,
}: {
  rooms: StayCard[];
  heading: string;
  empty: string | null;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const title = headingRef.current;
    if (!section || !title || prefersReducedMotion()) return;
    let revert = () => {};
    let cancelled = false;
    void (async () => {
      const { gsap } = await loadMotion();
      if (cancelled) return;
      const context = gsap.context(() => {
        gsap.fromTo(
          title,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            ease: "none",
            scrollTrigger: { trigger: title, start: "top 90%", end: "top 45%", scrub: 0.6 },
          },
        );
        const track = row.current;
        if (track && window.matchMedia("(min-width: 768px)").matches) {
          gsap.fromTo(
            track,
            { xPercent: 8 },
            {
              xPercent: 0,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top 80%", end: "top 30%", scrub: 0.7 },
            },
          );
        }
      }, section);
      revert = () => context.revert();
    })();
    return () => {
      cancelled = true;
      revert();
    };
  }, [rooms.length]);
  const row = useRef<HTMLDivElement>(null);
  const motion = useRef<MotionApi | null>(null);
  const snapshot = useRef<ReturnType<MotionApi["Flip"]["getState"]> | null>(null);

  useLayoutEffect(() => {
    let cancelled = false;
    void loadMotion().then((api) => {
      if (!cancelled) motion.current = api;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    const state = snapshot.current;
    const api = motion.current;
    snapshot.current = null;
    if (!state || !api || prefersReducedMotion()) return;
    api.Flip.from(state, {
      duration: 0.7,
      ease: "power3.inOut",
      absolute: true,
      nested: true,
    });
  }, [active]);

  const select = (index: number) => {
    if (index === active) return;
    const cards = row.current?.querySelectorAll("[data-room]");
    if (cards && motion.current && !prefersReducedMotion()) {
      snapshot.current = motion.current.Flip.getState(cards);
    }
    setActive(index);
  };

  return (
    <section ref={sectionRef} className="bg-canvas px-[5vw] py-20 text-fog md:py-28" aria-label={heading}>
      {rooms.length === 0 ? (
        <p className="text-sm text-mist" role="status">{empty}</p>
      ) : (
        <div
          ref={row}
          data-room-row
          className="pb-2"
          role="list"
        >
          {rooms.map((room, index) => {
            const selected = index === active;
            return (
              <article
                key={room.key}
                data-room
                data-active={selected ? "true" : "false"}
                role="listitem"
                className="bg-surface"
              >
                <button
                  type="button"
                  className="absolute inset-0 z-10"
                  aria-pressed={selected}
                  aria-label={room.title}
                  onClick={() => select(index)}
                />
                <Image src={room.image} alt={room.alt} fill className="object-cover" sizes="(min-width: 768px) 40vw, 86vw" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/80 via-canvas/10 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 md:p-5">
                  <p className="text-[0.62rem] uppercase tracking-[0.2em] text-signal">{room.index}</p>
                  <h3 className="mt-2 text-2xl font-light tracking-[-0.04em] md:text-3xl">{room.title}</h3>
                  {selected ? (
                    <div className="mt-3 max-w-sm">
                      {room.description ? <p className="text-sm leading-6 text-fog/85">{room.description}</p> : null}
                      {room.price ? <p className="mt-2 text-sm text-mist">{room.price}</p> : null}
                      <Link href={room.href} className="pointer-events-auto relative z-30 mt-4 inline-flex text-[0.68rem] uppercase tracking-[0.16em] underline underline-offset-4">
                        {room.cta}
                      </Link>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
      <h2 ref={headingRef} className="mt-10 text-[clamp(3.2rem,9vw,8.5rem)] leading-[0.84] font-light tracking-[-0.06em] uppercase md:mt-14">
        {heading}
      </h2>
    </section>
  );
}
