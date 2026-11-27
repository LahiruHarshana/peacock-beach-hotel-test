"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { EnquiryModule } from "@/components/site/enquiry-module";
import { Magnetic } from "@/components/site/motion/magnetic";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { loadGsap, prefersReducedMotion, type GsapEngine } from "@/lib/motion/gsap-runtime";
import { INTRO_DONE_EVENT, hasSeenIntro, signalHeroReady } from "@/lib/motion/intro-session";
import { MOTION } from "@/components/site/motion/home/constants";
import { cn } from "@/lib/utils";

export type HeroScene = {
  id: string;
  image: string;
  alt: string;
  kicker: string;
  title: string;
  lines: readonly [string, string];
  body: string;
  label: string;
};

const AUTO_MS = 8000;
const CIRCUMFERENCE = 2 * Math.PI * 46;

export function CoastalHero({
  locale,
  scenes,
  exploreHref,
  exploreLabel,
  enquireHref,
  enquireLabel,
  pauseLabel,
  playLabel,
  scrollCue,
}: {
  locale: "en" | "ru";
  scenes: HeroScene[];
  exploreHref: string;
  exploreLabel: string;
  enquireHref: string;
  enquireLabel: string;
  pauseLabel: string;
  playLabel: string;
  scrollCue: string;
}) {
  const root = useRef<HTMLElement>(null);
  const motion = useRef<{ kill: () => void } | null>(null);
  const ken = useRef<{ kill: () => void } | null>(null);
  const busy = useRef(false);
  const indexRef = useRef(0);
  const navLabel = useTranslations("Home")("sceneNav");
  const closeLabel = useTranslations("Nav")("close");
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [ready, setReady] = useState(() => !scenes[0]?.image);
  const [canReveal, setCanReveal] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const live = useId();
  const scene = scenes[index] ?? scenes[0];

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useLayoutEffect(() => {
    const stage = root.current;
    if (!stage || stage.hasAttribute("data-animating")) return;
    stage.querySelectorAll<HTMLElement>("[data-copy]").forEach((node) => {
      node.style.visibility = "";
      node.style.opacity = "";
    });
  }, [index]);

  useEffect(() => {
    if (scenes[0]?.image) return;
    signalHeroReady();
  }, [scenes]);

  const startKen = useCallback((gsap: GsapEngine, active: number) => {
    ken.current?.kill();
    const media = root.current?.querySelector<HTMLElement>(`[data-scene="${active}"] [data-scene-media]`);
    if (!media || prefersReducedMotion()) return;
    gsap.set(media, { scale: 1.06 });
    ken.current = gsap.to(media, { scale: 1.14, duration: 8, ease: "none" });
  }, []);

  const goTo = useCallback((next: number) => {
    const count = scenes.length;
    const target = (next + count) % count;
    if (target === indexRef.current || busy.current) return;
    if (prefersReducedMotion()) {
      indexRef.current = target;
      setIndex(target);
      return;
    }

    const stage = root.current;
    if (!stage) {
      indexRef.current = target;
      setIndex(target);
      return;
    }

    busy.current = true;
    const previous = indexRef.current;

    void (async () => {
      let gsap: GsapEngine;
      try {
        gsap = (await loadGsap()).gsap;
      } catch {
        busy.current = false;
        indexRef.current = target;
        setIndex(target);
        return;
      }
      if (!root.current) {
        busy.current = false;
        return;
      }

      motion.current?.kill();
      ken.current?.kill();
      stage.setAttribute("data-animating", "");
      const release = () => {
        stage.removeAttribute("data-animating");
        busy.current = false;
      };

      const outgoing = stage.querySelector<HTMLElement>(`[data-scene="${previous}"]`);
      const incoming = stage.querySelector<HTMLElement>(`[data-scene="${target}"]`);
      const outgoingMedia = outgoing?.querySelector<HTMLElement>("[data-scene-media]");
      const incomingMedia = incoming?.querySelector<HTMLElement>("[data-scene-media]");
      const outgoingCopy = stage.querySelector<HTMLElement>(`[data-copy="${previous}"]`);
      const incomingCopy = stage.querySelector<HTMLElement>(`[data-copy="${target}"]`);
      const outgoingLines = outgoingCopy?.querySelectorAll<HTMLElement>("[data-hero-line]");
      const incomingLines = incomingCopy?.querySelectorAll<HTMLElement>("[data-hero-line]");
      const outgoingBody = outgoingCopy?.querySelector<HTMLElement>("[data-hero-body]");
      const incomingBody = incomingCopy?.querySelector<HTMLElement>("[data-hero-body]");
      const rule = stage.querySelector<HTMLElement>("[data-hero-rule]");

      if (incoming) gsap.set(incoming, { clipPath: "inset(0% 100% 0% 0%)", zIndex: 3 });
      if (incomingMedia) gsap.set(incomingMedia, { scale: 1.22 });
      if (incomingCopy) gsap.set(incomingCopy, { autoAlpha: 1 });
      if (incomingLines?.length) gsap.set(incomingLines, { yPercent: 110 });
      if (incomingBody) gsap.set(incomingBody, { autoAlpha: 0, y: 16 });

      const timeline = gsap.timeline({
        defaults: { ease: "power4.inOut" },
        onComplete: () => {
          if (outgoing) gsap.set(outgoing, { zIndex: 1, clipPath: "inset(0% 0% 0% 100%)" });
          if (incoming) gsap.set(incoming, { zIndex: 2, clipPath: "inset(0% 0% 0% 0%)" });
          if (incomingLines?.length) gsap.set(incomingLines, { clearProps: "transform" });
          indexRef.current = target;
          setIndex(target);
          release();
          startKen(gsap, target);
        },
      });
      motion.current = timeline;

      if (outgoingLines?.length) timeline.to(outgoingLines, { yPercent: -110, duration: 0.55, stagger: 0.06 }, 0);
      if (outgoingBody) timeline.to(outgoingBody, { autoAlpha: 0, y: -12, duration: 0.35 }, 0);
      if (outgoing) timeline.to(outgoing, { clipPath: "inset(0% 0% 0% 100%)", duration: 1.15 }, 0.12);
      if (outgoingMedia) timeline.to(outgoingMedia, { scale: 1.2, duration: 1.15 }, 0.12);
      if (incoming) timeline.to(incoming, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15 }, 0.22);
      if (incomingMedia) timeline.to(incomingMedia, { scale: 1.06, duration: 1.25, ease: "power3.out" }, 0.22);
      if (incomingLines?.length) {
        timeline.to(incomingLines, { yPercent: 0, duration: 0.85, stagger: 0.08, ease: "power4.out" }, 0.55);
      }
      if (incomingBody) timeline.to(incomingBody, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0.72);
      if (rule) timeline.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power2.out" }, 0.7);
    })();
  }, [scenes.length, startKen]);

  useEffect(() => {
    if (!ready || !playing || enquiryOpen || prefersReducedMotion() || scenes.length < 2) return;
    const timer = window.setTimeout(() => {
      goTo(indexRef.current + 1);
    }, AUTO_MS);
    return () => window.clearTimeout(timer);
  }, [enquiryOpen, goTo, index, playing, ready, scenes.length]);

  useEffect(() => {
    if (hasSeenIntro() || prefersReducedMotion()) {
      const frame = window.requestAnimationFrame(() => setCanReveal(true));
      return () => window.cancelAnimationFrame(frame);
    }
    const onDone = () => setCanReveal(true);
    window.addEventListener(INTRO_DONE_EVENT, onDone);
    const fallback = window.setTimeout(() => setCanReveal(true), 3200);
    return () => {
      window.removeEventListener(INTRO_DONE_EVENT, onDone);
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!canReveal || prefersReducedMotion()) return;
    let cancelled = false;
    void (async () => {
      const { gsap } = await loadGsap();
      if (cancelled || !root.current || busy.current) return;
      const copy = root.current.querySelector<HTMLElement>('[data-copy="0"]');
      const lines = copy?.querySelectorAll<HTMLElement>("[data-hero-line]");
      const body = copy?.querySelector<HTMLElement>("[data-hero-body]");
      const cta = root.current.querySelector<HTMLElement>("[data-hero-cta]");
      const rule = root.current.querySelector<HTMLElement>("[data-hero-rule]");
      const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });
      motion.current = timeline;
      if (lines?.length) timeline.from(lines, { yPercent: 110, duration: 1.05, stagger: 0.08 }, 0);
      if (body) timeline.from(body, { autoAlpha: 0, y: 16, duration: 0.7 }, 0.28);
      if (rule) timeline.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.7 }, 0.2);
      if (cta) timeline.from(cta, { autoAlpha: 0, duration: 0.5 }, 0.42);
      timeline.add(() => {
        if (!busy.current) startKen(gsap, indexRef.current);
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [canReveal, startKen]);

  const setupParallax = useCallback((gsap: GsapEngine) => {
    const layers = root.current?.querySelectorAll("[data-scene-drift]");
    if (!layers) return;
    layers.forEach((layer) => {
      gsap.to(layer, {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  }, []);

  useCinematic(root, setupParallax, MOTION);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setEnquiryOpen(false);
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        goTo(indexRef.current + 1);
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(indexRef.current - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  useEffect(() => {
    return () => {
      motion.current?.kill();
      ken.current?.kill();
    };
  }, []);

  if (!scene) return null;

  const indexLabel = `${String(index + 1).padStart(2, "0")} — ${String(scenes.length).padStart(2, "0")}`;

  return (
    <section ref={root} data-cinema="coastal-hero" className="relative min-h-[100svh] overflow-hidden bg-ocean text-ivory">
      <div className="absolute inset-0">
        {scenes.map((item, sceneIndex) => (
          <div
            key={item.id}
            data-scene={sceneIndex}
            data-active={sceneIndex === index ? "true" : "false"}
            className="absolute inset-0"
            style={{ zIndex: sceneIndex === index ? 2 : 1 }}
            aria-hidden={sceneIndex !== index}
          >
            <div data-scene-drift className="absolute inset-[-10%] will-change-transform">
              <div data-scene-media className="absolute inset-0 will-change-transform">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    priority={sceneIndex === 0}
                    onLoad={() => {
                      if (sceneIndex === 0) {
                        setReady(true);
                        signalHeroReady();
                      }
                    }}
                    className="object-cover object-[center_40%]"
                    sizes="100vw"
                  />
                ) : (
                  <div className="coastal-field absolute inset-0" />
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="hero-mist absolute inset-0 z-[3]" data-mood={scene.id} aria-hidden="true" />
      </div>

      <div className={cn("relative z-10 flex min-h-[100svh] flex-col justify-end px-[6vw] pb-28 pt-32 lg:max-w-[52rem] lg:px-[7vw] lg:pb-24", !canReveal && "opacity-0")}>
        <p className="mb-4 text-[0.62rem] uppercase tracking-[0.28em] text-ivory/80">{indexLabel}</p>
        <span data-hero-rule className="mb-5 block h-px w-24 origin-left bg-gold" />
        <div className="relative min-h-[16rem] sm:min-h-[18rem]">
          {scenes.map((item, sceneIndex) => (
            <div
              key={item.id}
              data-copy={sceneIndex}
              aria-hidden={sceneIndex !== index}
              className={cn("absolute inset-x-0 bottom-0", sceneIndex === index ? "" : "invisible")}
            >
              <p data-hero-kicker className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-gold">
                {item.kicker}
              </p>
              <h1 className="mt-4 font-serif text-[clamp(3.4rem,8vw,7.4rem)] font-normal leading-[0.84] tracking-[-0.045em]">
                {item.lines.map((line, lineIndex) => (
                  <span key={line} className="block overflow-hidden pb-[0.06em]">
                    <span data-hero-line className={cn("block", lineIndex === item.lines.length - 1 && "italic")}>
                      {line}
                      {lineIndex === item.lines.length - 1 ? "." : ""}
                    </span>
                  </span>
                ))}
              </h1>
              <p data-hero-body className="mt-6 max-w-md text-base leading-7 text-ivory/85">
                {item.body}
              </p>
            </div>
          ))}
        </div>
        <div data-hero-cta className="mt-8 flex flex-wrap items-center gap-3">
          <Magnetic>
            <Link
              href={exploreHref}
              className="group inline-flex items-center gap-3 rounded-full bg-ivory py-2 pl-5 pr-2 text-[0.65rem] font-medium uppercase tracking-[0.14rem] text-ocean"
            >
              {exploreLabel}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ocean text-ivory">
                <Arrow />
              </span>
            </Link>
          </Magnetic>
          <button
            type="button"
            aria-expanded={enquiryOpen}
            aria-controls="hero-enquiry"
            onClick={() => setEnquiryOpen(true)}
            className="group inline-flex items-center gap-3 rounded-full border border-ivory/50 py-2 pl-5 pr-2 text-[0.65rem] font-medium uppercase tracking-[0.14rem] text-ivory"
          >
            {enquireLabel}
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory text-ocean">
              <Arrow />
            </span>
          </button>
        </div>
        <p id={live} className="sr-only" aria-live="polite">
          {scene.label}
        </p>
      </div>

      <SceneRail
        scenes={scenes}
        index={index}
        playing={playing}
        running={playing && !enquiryOpen}
        pauseLabel={pauseLabel}
        playLabel={playLabel}
        navLabel={navLabel}
        onSelect={goTo}
        onToggle={() => setPlaying((value) => !value)}
      />

      <div className="absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-3 px-4 lg:hidden">
        {scenes.map((item, sceneIndex) => (
          <button
            key={item.id}
            type="button"
            aria-label={item.label}
            aria-pressed={sceneIndex === index}
            onClick={() => goTo(sceneIndex)}
            className={cn(
              "relative overflow-hidden rounded-full border border-ivory/40",
              sceneIndex === index ? "h-14 w-14" : "h-11 w-11 opacity-75",
            )}
          >
            {item.image ? <Image src={item.image} alt="" fill className="object-cover" sizes="56px" /> : null}
          </button>
        ))}
        <button type="button" onClick={() => setPlaying((value) => !value)} className="text-[0.58rem] uppercase tracking-[0.18em]">
          {playing ? pauseLabel : playLabel}
        </button>
      </div>

      <div className="absolute bottom-8 left-[6vw] z-10 hidden items-center gap-3 text-ivory/75 lg:flex lg:left-[7vw]">
        <span className="h-px w-10 bg-gold/80" />
        <span className="text-[0.62rem] uppercase tracking-[0.22em]">{scrollCue}</span>
      </div>

      <div
        id="hero-enquiry"
        role="dialog"
        aria-modal="true"
        aria-hidden={!enquiryOpen}
        className={cn(
          "absolute inset-x-0 bottom-0 z-30 max-h-[78svh] overflow-y-auto bg-ivory text-ocean shadow-[0_-24px_80px_rgb(8_43_45_/_0.36)] transition-transform duration-500 ease-out",
          enquiryOpen ? "translate-y-0" : "pointer-events-none translate-y-full",
        )}
      >
        <div className="flex items-center justify-between px-5 pt-4 sm:px-8">
          <p className="text-[0.62rem] uppercase tracking-[0.22em] text-ocean/60">{enquireLabel}</p>
          <button type="button" onClick={() => setEnquiryOpen(false)} className="min-h-11 px-3 text-[0.65rem] uppercase tracking-[0.16em]">
            {closeLabel}
          </button>
        </div>
        <EnquiryModule locale={locale} variant="hero" />
        <p className="px-5 pb-5 sm:px-8">
          <Link href={enquireHref} className="text-[0.65rem] uppercase tracking-[0.16em] underline underline-offset-4">
            {enquireLabel}
          </Link>
        </p>
      </div>
    </section>
  );
}

function SceneRail({
  scenes,
  index,
  playing,
  running,
  pauseLabel,
  playLabel,
  navLabel,
  onSelect,
  onToggle,
}: {
  scenes: HeroScene[];
  index: number;
  playing: boolean;
  running: boolean;
  pauseLabel: string;
  playLabel: string;
  navLabel: string;
  onSelect: (index: number) => void;
  onToggle: () => void;
}) {
  return (
    <div className="absolute right-0 top-[18%] z-20 hidden flex-col items-center gap-5 pr-[4vw] lg:flex">
      <div role="tablist" aria-label={navLabel} className="flex flex-col items-center gap-5">
        {scenes.map((item, sceneIndex) => {
          const active = sceneIndex === index;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={item.label}
              onClick={() => onSelect(sceneIndex)}
              className={cn(
                "relative overflow-hidden rounded-full border border-ivory/40 transition-[width,height,opacity] duration-500",
                active ? "h-[5.75rem] w-[5.75rem] opacity-100" : "h-14 w-14 opacity-70 hover:opacity-100",
              )}
            >
              {item.image ? <Image src={item.image} alt="" fill className="object-cover" sizes="96px" /> : null}
              {active ? (
                <svg key={index} className="pointer-events-none absolute inset-[-8px] h-[calc(100%+16px)] w-[calc(100%+16px)]" viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="rgb(241 227 210 / 0.3)" strokeWidth="1.4" />
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="#d8bfa2"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    className={cn("origin-center -rotate-90", running && "animate-[hero-progress_8s_linear]")}
                    style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
                  />
                </svg>
              ) : null}
            </button>
          );
        })}
      </div>
      <button type="button" onClick={onToggle} className="text-[0.58rem] uppercase tracking-[0.22em] text-ivory/80 hover:text-ivory">
        {playing ? pauseLabel : playLabel}
      </button>
    </div>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 18 18" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
      <path d="M4 9 H14 M9 4 L14 9 L9 14" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
