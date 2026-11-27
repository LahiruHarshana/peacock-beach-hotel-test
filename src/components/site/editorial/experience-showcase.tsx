"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { loadGsap, prefersReducedMotion } from "@/lib/motion/gsap-runtime";

export type ExperienceItem = {
  key: string;
  index: string;
  label: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  image: string;
  alt: string;
};

export function ExperienceShowcase({ items, label }: { items: ExperienceItem[]; label: string }) {
  const [current, setCurrent] = useState(0);
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const indexRef = useRef(0);
  const item = items[current] ?? items[0];

  useLayoutEffect(() => {
    const section = root.current;
    if (!section || prefersReducedMotion() || items.length < 2) return;
    const desktop = window.matchMedia("(min-width: 768px)");
    if (!desktop.matches) return;
    let revert = () => {};
    let cancelled = false;
    void (async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (cancelled) return;
      const context = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const next = Math.min(items.length - 1, Math.floor(self.progress * items.length * 0.999));
            const shot = photo.current;
            if (shot) gsap.set(shot, { scale: 1.12 - (self.progress % (1 / items.length)) * 0.4 });
            if (next === indexRef.current) return;
            indexRef.current = next;
            pending.current = true;
            setCurrent(next);
          },
        });
      }, section);
      revert = () => context.revert();
    })();
    return () => {
      cancelled = true;
      revert();
    };
  }, [items.length]);

  useLayoutEffect(() => {
    if (!pending.current || prefersReducedMotion()) {
      pending.current = false;
      return;
    }
    pending.current = false;
    const media = panel.current;
    const text = copy.current;
    let cancelled = false;
    void (async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      if (media) {
        gsap.fromTo(media, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.65, ease: "power3.inOut" });
      }
      if (text) {
        gsap.fromTo(text, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [current]);

  if (!item) return null;

  const select = (index: number) => {
    if (index === current) return;
    indexRef.current = index;
    const media = panel.current;
    if (!media || prefersReducedMotion()) {
      setCurrent(index);
      return;
    }
    void (async () => {
      const { gsap } = await loadGsap();
      await gsap.to(media, { clipPath: "inset(0 0 100% 0)", duration: 0.32, ease: "power3.in" });
      pending.current = true;
      setCurrent(index);
    })();
  };

  return (
    <section ref={root} className="bg-canvas text-fog md:h-[280vh]" aria-label={label}>
      <div className="px-[5vw] py-8 md:sticky md:top-0 md:flex md:h-[100svh] md:flex-col md:justify-center md:py-10">
      <div className="mb-8 flex items-center justify-between gap-6">
        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-signal">{label}</p>
        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-mist">
          {item.index} / {String(items.length).padStart(2, "0")}
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
        <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" role="tablist" aria-label={label}>
          {items.map((entry, index) => {
            const active = index === current;
            return (
              <button
                key={entry.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => select(index)}
                className={`min-h-11 shrink-0 border-b px-1 py-3 text-left text-[0.72rem] uppercase tracking-[0.16em] lg:border-b-0 lg:border-l lg:px-4 ${
                  active ? "border-signal text-fog" : "border-line text-mist hover:text-fog"
                }`}
              >
                <span className="mr-3 text-signal">{entry.index}</span>
                {entry.label}
              </button>
            );
          })}
        </div>
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(16rem,0.7fr)] md:items-stretch">
          <div ref={panel} className="relative min-h-[46vh] overflow-hidden rounded-[14px] bg-surface md:min-h-[62vh]">
            <div ref={photo} className="absolute inset-0 will-change-transform">
              <Image src={item.image} alt={item.alt} fill className="object-cover" sizes="(min-width: 1024px) 55vw, 90vw" />
            </div>
          </div>
          <div ref={copy} className="flex flex-col justify-end border-t border-line pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-mist">{item.label}</p>
            <h2 className="mt-4 text-[clamp(2.2rem,4vw,4rem)] leading-[0.92] font-light tracking-[-0.05em]">{item.title}</h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-mist">{item.body}</p>
            <Link href={item.href} className="mt-8 inline-flex w-fit items-center gap-3 text-[0.68rem] uppercase tracking-[0.18em]">
              {item.cta}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
