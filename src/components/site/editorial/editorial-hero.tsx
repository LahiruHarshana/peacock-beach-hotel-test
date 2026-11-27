"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { loadMotion, prefersReducedMotion } from "@/lib/motion/gsap-runtime";

type EditorialHeroProps = {
  image: string;
  alt: string;
  lineOne: string;
  lineTwo: string;
  place: string;
  scene: string;
  enquireHref: string;
  enquireLabel: string;
  scrollCue: string;
};

export function EditorialHero({
  image,
  alt,
  lineOne,
  lineTwo,
  place,
  scene,
  enquireHref,
  enquireLabel,
  scrollCue,
}: EditorialHeroProps) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const chrome = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    const panel = frame.current;
    const photo = media.current;
    const heading = title.current;
    const ui = chrome.current;
    const scrollCue = cue.current;
    if (!section || !panel || !photo || !heading || !ui || !scrollCue) return;

    let revert = () => {};
    let cancelled = false;

    void (async () => {
      const { gsap, ScrollTrigger, Flip } = await loadMotion();
      if (cancelled) return;

      const context = gsap.context(() => {
        const reduced = prefersReducedMotion();
        const desktop = window.matchMedia("(min-width: 768px)").matches;
        const target = desktop
          ? { width: Math.max(section.clientWidth - 48, 320), height: window.innerHeight - 92, borderRadius: "18px" }
          : { width: Math.max(section.clientWidth - 20, 240), height: window.innerHeight - 108, borderRadius: "12px" };

        if (reduced) {
          panel.classList.add("is-open");
          heading.classList.add("is-settled");
          gsap.set(ui, { autoAlpha: 1 });
          return;
        }

        gsap.set(ui, { autoAlpha: 0 });
        gsap.set(heading, { autoAlpha: 0 });
        gsap.set(panel, {
          width: desktop ? 256 : 188,
          height: desktop ? 164 : 124,
          borderRadius: "2px",
          autoAlpha: 0,
          clipPath: "inset(10% 10% 10% 10%)",
        });

        const timeline = gsap.timeline({ defaults: { ease: "power3.inOut" } });
        timeline.to(heading, { autoAlpha: 1, duration: 0.45, ease: "power2.out" }, 0.05);
        timeline.to(panel, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.4 }, 0.32);
        timeline.to(panel, { ...target, duration: 0.9 }, 0.58);
        timeline.add(() => {
          const state = Flip.getState(heading);
          heading.classList.add("is-settled");
          Flip.from(state, { duration: 0.6, ease: "power3.inOut", absolute: true });
        }, 1.05);
        timeline.to(ui, { autoAlpha: 1, duration: 0.35, ease: "power2.out" }, 1.3);

        timeline.call(() => {
          const scroll = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.7,
            },
          });
          scroll.fromTo(photo, { scale: 1 }, { scale: desktop ? 1.22 : 1.08, ease: "none", immediateRender: false }, 0);
          scroll.fromTo(panel, { borderRadius: desktop ? 18 : 12 }, { borderRadius: desktop ? 40 : 20, ease: "none", immediateRender: false }, 0);
          scroll.fromTo(
            heading,
            { clipPath: "inset(0% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 100% 0%)", ease: "none", immediateRender: false },
            0,
          );
          scroll.fromTo(ui, { autoAlpha: 1 }, { autoAlpha: 0, ease: "none", immediateRender: false }, 0);
          scroll.fromTo(scrollCue, { autoAlpha: 1 }, { autoAlpha: 0, ease: "none", immediateRender: false }, 0);
        });
      }, section);

      revert = () => context.revert();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    })();

    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  return (
    <section ref={root} className="relative h-[132svh] bg-canvas md:h-[220vh]" aria-label={alt}>
      <div className="sticky top-0 h-[100svh]">
        <div
          ref={frame}
          className="hero-frame absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-elevated will-change-transform"
        >
          <div ref={media} className="absolute inset-0 will-change-transform">
            <Image
              src={image}
              alt={alt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <span className="pointer-events-none absolute top-3 left-3 h-4 w-4 border-t border-l border-fog/80" />
          <span className="pointer-events-none absolute top-3 right-3 h-4 w-4 border-t border-r border-fog/80" />
          <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l border-fog/80" />
          <span className="pointer-events-none absolute right-3 bottom-3 h-4 w-4 border-r border-b border-fog/80" />
          <div ref={chrome} className="absolute inset-x-0 top-0 flex items-start justify-between p-4 text-[0.62rem] uppercase tracking-[0.2em] text-fog md:p-6">
            <p>{place}</p>
            <p className="text-signal">{scene}</p>
          </div>
          <div className="absolute top-14 right-4 md:top-auto md:right-6 md:bottom-6">
            <Link
              href={enquireHref}
              className="inline-flex items-center gap-3 rounded-full bg-fog py-1.5 pr-1.5 pl-4 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-canvas"
            >
              {enquireLabel}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal text-canvas">
                <svg viewBox="0 0 18 18" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M5 13 L13 5 M7 5 H13 V11" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
        <h1
          ref={title}
          className="hero-title pointer-events-none absolute z-10 max-w-[14ch] text-[clamp(2.7rem,7.4vw,7.4rem)] leading-[0.84] font-light tracking-[-0.055em] text-fog uppercase"
        >
          <span className="sr-only">
            {lineOne} {lineTwo}
          </span>
          <span aria-hidden="true">
            <span className="text-signal">(</span>
            {lineOne}
            <span className="text-signal">)</span>
            <span className="mt-[0.08em] block">{lineTwo}</span>
          </span>
        </h1>
        <p ref={cue} className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[0.62rem] uppercase tracking-[0.28em] text-mist">
          {scrollCue}
        </p>
      </div>
    </section>
  );
}
