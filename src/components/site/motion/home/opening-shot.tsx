"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { DESKTOP_MOTION, setHeaderOverHero } from "@/components/site/motion/home/constants";

const PHONE_MOTION = "(prefers-reduced-motion: no-preference) and (max-width: 767px)";

export function OpeningShot({
  imageUrl,
  imageAlt,
  accentUrl,
  accentAlt,
  accentLabel,
  previewLabel,
  scrollCue,
  children,
}: {
  imageUrl: string | null;
  imageAlt: string;
  accentUrl?: string | null;
  accentAlt?: string;
  accentLabel?: string;
  previewLabel?: string | null;
  scrollCue: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const cardMedia = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLDivElement>(null);
  const cueBar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let current = true;
    setHeaderOverHero(true);
    const onScroll = () => {
      const el = root.current;
      if (!el) return;
      const next = el.getBoundingClientRect().bottom > 80;
      if (next === current) return;
      current = next;
      setHeaderOverHero(next);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      setHeaderOverHero(false);
    };
  }, []);

  const playArrival = useCallback((gsap: typeof import("gsap").default) => {
    const copy = title.current;
    const float = card.current;
    if (!copy) return;
    const kicker = copy.querySelector<HTMLElement>("[data-hero-kicker]");
    const lines = [...copy.querySelectorAll<HTMLElement>("[data-hero-line]")];
    const body = copy.querySelector<HTMLElement>("[data-hero-body]");
    const cta = copy.querySelector<HTMLElement>("[data-hero-cta]");
    const arrival = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (kicker) arrival.from(kicker, { autoAlpha: 0, duration: 0.6 }, 0.08);
    lines.forEach((line, index) => {
      arrival.from(line, { yPercent: 110, duration: 1.05 }, 0.16 + index * 0.12);
    });
    if (body) arrival.from(body, { autoAlpha: 0, duration: 0.7 }, 0.5);
    if (cta) arrival.from(cta, { autoAlpha: 0, duration: 0.6 }, 0.66);
    if (float) arrival.from(float, { autoAlpha: 0, duration: 0.9 }, 0.34);
  }, []);

  const setupDesktop = useCallback((gsap: typeof import("gsap").default) => {
    const opening = root.current;
    const shot = frame.current;
    const media = plate.current;
    const shade = veil.current;
    const copy = title.current;
    if (!opening || !shot || !media || !copy) return;

    const lines = [...copy.querySelectorAll<HTMLElement>("[data-hero-line]")];
    const float = card.current;
    const floatMedia = cardMedia.current;
    const cueEl = cue.current;
    const bar = cueBar.current;

    playArrival(gsap);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: opening,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.15,
        invalidateOnRefresh: true,
      },
    });

    timeline.fromTo(media, { scale: 1.08, yPercent: -8 }, { scale: 1.2, yPercent: 2, ease: "none", duration: 0.58 }, 0);
    timeline.to(media, { scale: 1.32, yPercent: 12, ease: "none", duration: 0.42 }, 0.58);
    if (shade) timeline.fromTo(shade, { opacity: 0 }, { opacity: 0.42, ease: "none", duration: 1 }, 0);

    timeline.to(copy, { y: -32, ease: "none", duration: 0.48, immediateRender: false }, 0);
    lines.forEach((line, index) => {
      const row = line.parentElement ?? line;
      timeline.to(row, { y: -16 - index * 34, ease: "none", duration: 0.5, immediateRender: false }, 0.02);
    });
    timeline.to(copy, { autoAlpha: 0, y: -88, ease: "power1.in", duration: 0.2, immediateRender: false }, 0.5);

    if (float) {
      timeline.to(float, { y: -70, rotation: -1.5, ease: "none", duration: 0.48, immediateRender: false }, 0);
      timeline.to(float, { y: -210, autoAlpha: 0, rotation: -4, ease: "power1.in", duration: 0.24, immediateRender: false }, 0.5);
    }
    if (floatMedia) {
      timeline.fromTo(
        floatMedia,
        { yPercent: -8, scale: 1.12 },
        { yPercent: 18, scale: 1.22, ease: "none", duration: 1 },
        0,
      );
    }

    if (bar) {
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
      timeline.to(bar, { scaleX: 1, ease: "none", duration: 0.62 }, 0);
    }
    if (cueEl) timeline.to(cueEl, { autoAlpha: 0, y: -12, duration: 0.14, immediateRender: false }, 0.58);

    timeline.fromTo(
      shot,
      { clipPath: "inset(0% 0% 0% 0% round 0px)" },
      {
        clipPath: "inset(0px 5vw 12vh 5vw round 0px 0px 32px 32px)",
        ease: "power2.inOut",
        duration: 0.36,
        immediateRender: false,
      },
      0.64,
    );
  }, [playArrival]);

  const setupPhone = useCallback((gsap: typeof import("gsap").default) => {
    const opening = root.current;
    const media = plate.current;
    const shade = veil.current;
    const copy = title.current;
    if (!opening || !media || !copy) return;

    playArrival(gsap);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: opening,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.85,
      },
    });

    timeline.fromTo(media, { scale: 1.08, yPercent: -6 }, { scale: 1.18, yPercent: 10, ease: "none", duration: 1 }, 0);
    if (shade) timeline.fromTo(shade, { opacity: 0 }, { opacity: 0.28, ease: "none", duration: 1 }, 0);
    timeline.to(copy, { y: -36, ease: "none", duration: 1, immediateRender: false }, 0);
    const lines = [...copy.querySelectorAll<HTMLElement>("[data-hero-line]")];
    lines.forEach((line, index) => {
      timeline.to(line.parentElement ?? line, { y: -8 - index * 14, ease: "none", duration: 1, immediateRender: false }, 0);
    });
  }, [playArrival]);

  useCinematic(root, setupDesktop, DESKTOP_MOTION);
  useCinematic(root, setupPhone, PHONE_MOTION);

  return (
    <section ref={root} data-cinema="home-opening" className="relative h-[150svh] bg-ivory text-ivory motion-reduce:!h-auto md:h-[210svh]">
      <div data-opening-stage className="sticky top-0 h-[100svh] overflow-hidden bg-ivory motion-reduce:!static motion-reduce:!h-auto motion-reduce:min-h-[100svh]">
        <div ref={frame} className="absolute inset-0 overflow-hidden bg-mocha">
          <div ref={plate} className="absolute inset-[-18%] will-change-transform">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                priority
                className="object-cover object-[center_38%]"
                sizes="100vw"
              />
            ) : (
              <div className="coastal-field absolute inset-0" />
            )}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-mocha/55 via-transparent to-mocha/70" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-mocha/35 via-transparent to-transparent" aria-hidden="true" />
          <div ref={veil} className="pointer-events-none absolute inset-0 bg-mocha opacity-0" aria-hidden="true" />
        </div>

        {accentUrl ? (
          <div
            ref={card}
            data-hero-float
            className="absolute right-[5vw] top-[22%] z-20 hidden w-[min(18.5rem,26vw)] lg:block"
          >
            <div className="rounded-[1.6rem] border border-ivory/25 bg-ivory/10 p-2 shadow-[0_30px_80px_rgb(8_43_45_/_0.38)] backdrop-blur-md">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.2rem] bg-mocha">
                <div ref={cardMedia} className="absolute inset-[-12%] will-change-transform">
                  <Image src={accentUrl} alt={accentAlt ?? ""} fill className="object-cover" sizes="26vw" />
                </div>
                {previewLabel ? (
                  <p className="absolute left-3 top-3 rounded-full bg-ivory/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12rem] text-mocha/75">
                    {previewLabel}
                  </p>
                ) : null}
              </div>
              {accentLabel ? (
                <p className="px-3 py-3 text-[0.62rem] font-medium uppercase tracking-[0.2rem] text-ivory/90">{accentLabel}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div
          ref={title}
          className="opening-ink relative z-10 flex h-full flex-col justify-end px-[6vw] pb-24 pt-28 lg:max-w-[46rem] lg:px-[7vw]"
        >
          {children}
        </div>

        <div ref={cue} className="absolute bottom-8 left-[6vw] z-10 flex items-center gap-3 text-ivory/90 lg:left-[7vw]">
          <span className="relative block h-px w-14 overflow-hidden bg-ivory/35">
            <span ref={cueBar} className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-ivory motion-reduce:scale-x-100" />
          </span>
          <span className="text-[0.62rem] font-medium uppercase tracking-[0.22rem]">{scrollCue}</span>
        </div>
      </div>
    </section>
  );
}

export function OpeningCta({
  href,
  label,
  tone = "solid",
}: {
  href: string;
  label: string;
  tone?: "solid" | "line";
}) {
  const solid = tone === "solid";
  return (
    <Link
      href={href}
      className={
        solid
          ? "group inline-flex items-center gap-3 rounded-full bg-ivory py-2 pl-5 pr-2 text-xs font-medium uppercase tracking-wider text-mocha shadow-[0_12px_40px_rgb(8_43_45_/_0.28)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory"
          : "group inline-flex items-center gap-3 rounded-full border border-ivory/45 bg-mocha/20 py-2 pl-5 pr-2 text-xs font-medium uppercase tracking-wider text-ivory backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory"
      }
    >
      {label}
      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${solid ? "bg-mocha text-ivory" : "bg-ivory text-mocha"}`}>
        <svg viewBox="0 0 18 18" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
          <path d="M4 9 H14 M9 4 L14 9 L9 14" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </span>
    </Link>
  );
}
