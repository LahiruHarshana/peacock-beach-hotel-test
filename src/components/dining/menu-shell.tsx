"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useCallback, useMemo, useRef } from "react";
import { useHomeScrollRefresh } from "@/components/site/home/use-home-scroll-refresh";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { DESKTOP_MOTION, MOTION } from "@/components/site/motion/home/constants";

const scroller = () => document.documentElement;

const MENU_HERO_CLIP = {
  desktopStart: "inset(15svh 5.5vw 12svh 44vw round 20px)",
  mobileStart: "inset(13svh 5vw 36svh 5vw round 16px)",
  full: "inset(0svh 0vw 0svh 0vw round 0px)",
} as const;

export function MenuPageShell({ children }: { children: ReactNode }) {
  useHomeScrollRefresh(true);

  return (
    <div className="halden-light relative -mt-16 overflow-clip bg-canvas text-paper">
      <div className="halden-light-grid pointer-events-none absolute inset-0 z-0 opacity-[0.28]" aria-hidden="true" />
      <div className="about-film-grain pointer-events-none absolute inset-0 z-[2] opacity-[0.08]" aria-hidden="true" />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

export function MenuHero({
  eyebrow,
  title,
  intro,
  image,
  alt,
  backHref,
  backLabel,
  scrollLabel,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  alt: string;
  backHref: string;
  backLabel: string;
  scrollLabel: string;
}) {
  const root = useRef<HTMLElement>(null);
  const titleWords = useMemo(() => title.split(/\s+/).filter(Boolean), [title]);

  const bind = useCallback((gsap: typeof import("gsap").default, mobile: boolean) => {
    const section = root.current;
    if (!section) return;

    const frame = section.querySelector<HTMLElement>("[data-menu-hero-frame]");
    const border = section.querySelector<HTMLElement>("[data-menu-hero-border]");
    const media = section.querySelector<HTMLElement>("[data-menu-hero-media]");
    const washes = gsap.utils.toArray<HTMLElement>("[data-menu-hero-wash]", section);
    const copy = section.querySelector<HTMLElement>("[data-menu-hero-copy]");
    const lines = gsap.utils.toArray<HTMLElement>("[data-menu-hero-line]", section);
    const kicker = section.querySelector<HTMLElement>("[data-menu-hero-kicker]");
    const rule = section.querySelector<HTMLElement>("[data-menu-hero-rule]");
    const introNode = section.querySelector<HTMLElement>("[data-menu-hero-intro]");
    const meter = section.querySelector<HTMLElement>("[data-menu-hero-meter]");

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
        scrub: mobile ? 0.95 : 1.15,
        invalidateOnRefresh: true,
      },
    });

    if (copy) {
      timeline.to(copy, { y: mobile ? -24 : -42, autoAlpha: 0, ease: "power2.inOut", duration: 0.34 }, 0.05);
    }
    if (border) {
      timeline.to(border, { scale: 1.03, autoAlpha: 0, ease: "power2.out", duration: 0.32 }, 0.05);
    }
    if (frame) {
      timeline.fromTo(
        frame,
        { clipPath: mobile ? MENU_HERO_CLIP.mobileStart : MENU_HERO_CLIP.desktopStart },
        { clipPath: MENU_HERO_CLIP.full, ease: "power2.inOut", duration: 0.58 },
        0.06,
      );
    }
    if (media) {
      timeline.fromTo(media, { scale: 1.14, yPercent: 3 }, { scale: 1.0, yPercent: -3, ease: "none", duration: 1 }, 0);
    }
    if (washes.length > 0) {
      timeline.fromTo(washes, { opacity: 0 }, { opacity: 1, ease: "power1.inOut", duration: 0.35 }, 0.2);
    }
    if (meter) {
      timeline.fromTo(meter, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
    }
  }, []);

  const setup = useCallback((gsap: typeof import("gsap").default) => bind(gsap, false), [bind]);
  const setupMobile = useCallback((gsap: typeof import("gsap").default) => bind(gsap, true), [bind]);

  useCinematic(root, setup, DESKTOP_MOTION);
  useCinematic(root, setupMobile, `${MOTION} and (max-width: 767px)`);

  return (
    <section
      ref={root}
      data-cinema="menu-hero"
      className="home-ivory-blue relative h-[145svh] md:h-[175svh] motion-reduce:h-auto"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:relative motion-reduce:min-h-[100svh]">
        <div
          data-menu-hero-border
          className="pointer-events-none absolute inset-x-[5vw] bottom-[36svh] top-[13svh] z-[9] rounded-[16px] border border-paper/15 shadow-[0_24px_70px_rgb(8_43_45_/_0.14)] will-change-[transform,opacity] md:inset-auto md:bottom-[12svh] md:left-[44vw] md:right-[5.5vw] md:top-[15svh] md:rounded-[20px]"
          aria-hidden="true"
        />

        <div
          data-menu-hero-frame
          className="about-hero-frame absolute inset-0 z-10 overflow-hidden will-change-[clip-path]"
        >
          <div data-menu-hero-media className="absolute inset-[-6%] will-change-transform">
            <Image src={image} alt={alt} fill className="object-cover" sizes="100vw" priority />
          </div>
          <div
            data-menu-hero-wash
            className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-canvas via-canvas/80 to-transparent opacity-0"
            aria-hidden="true"
          />
          <div
            data-menu-hero-wash
            className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-canvas/95 via-canvas/60 to-transparent opacity-0"
            aria-hidden="true"
          />
        </div>

        <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-[5vw] pb-6 pt-[4.5rem] text-[0.54rem] uppercase tracking-[0.28em] text-paper/85 md:px-[7vw] md:pt-20">
          <span>01 · {eyebrow}</span>
          <Link href={backHref} className="transition-colors hover:text-signal">
            ← {backLabel}
          </Link>
        </div>

        <div
          data-menu-hero-copy
          className="absolute inset-x-[5vw] bottom-[9.5svh] z-30 will-change-[transform,opacity] md:inset-x-auto md:bottom-auto md:left-[7vw] md:top-1/2 md:max-w-[33vw] md:-translate-y-1/2"
        >
          <p data-menu-hero-kicker className="mb-3 text-[0.54rem] uppercase tracking-[0.28em] text-signal md:mb-5">
            {eyebrow}
          </p>
          <h1 className="max-w-[9ch] text-[clamp(2.85rem,6.6vw,6.8rem)] font-light leading-[0.9] tracking-[-0.06em] text-paper">
            {titleWords.map((word, index) => (
              <span key={`${word}-${index}`} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
                <span data-menu-hero-line className="block will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </h1>
          <div data-menu-hero-rule className="mt-5 h-px w-20 origin-left bg-paper/25 md:mt-7" aria-hidden="true" />
          <p data-menu-hero-intro className="mt-4 max-w-[34ch] text-sm leading-relaxed text-mist md:mt-5 md:text-[0.98rem]">
            {intro}
          </p>
        </div>

        <div className="absolute inset-x-[5vw] bottom-6 z-30 flex items-center gap-4 text-[0.52rem] uppercase tracking-[0.26em] text-mist md:inset-x-[7vw] md:bottom-7">
          <span>{scrollLabel}</span>
          <span className="relative h-px flex-1 overflow-hidden bg-line">
            <span data-menu-hero-meter className="absolute inset-0 origin-left scale-x-0 bg-signal motion-reduce:scale-x-100" />
          </span>
          <span>01</span>
        </div>
      </div>
    </section>
  );
}
