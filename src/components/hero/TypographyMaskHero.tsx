"use client";

import { AnimatedWordMask, useHeroMaskId } from "./AnimatedWordMask";
import { HeroArchitectureGrid } from "./HeroArchitectureGrid";
import { HeroCursor } from "./HeroCursor";
import { HeroIntroContent, type HeroColumn } from "./HeroIntroContent";
import { HeroMedia } from "./HeroMedia";
import {
  type HeroMaskProfile,
  HERO_MASK_DESKTOP,
  HERO_MASK_MOBILE,
  HERO_SCROLL,
  HERO_TIMELINE,
} from "./hero-motion.config";
import styles from "./typography-mask-hero.module.css";
import { useTypographyReveal } from "./useTypographyReveal";
import { useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { prefersReducedMotion } from "@/lib/motion/gsap-runtime";
import { whenScrollReady } from "@/lib/motion/lenis-scroll";
import type { HomeHeroTheme } from "@/lib/content/home-hero";

function subscribeReducedMotion(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotion() {
  return prefersReducedMotion();
}

export type { HeroColumn };

type TypographyMaskHeroProps = {
  image: string;
  alt: string;
  wordmark: string;
  pageTitle: string;
  description: string;
  columns: HeroColumn[];
  exploreLabel: string;
  exploreHref: string;
  enquireLabel: string;
  enquireHref: string;
  theme?: HomeHeroTheme;
};

export function TypographyMaskHero({
  image,
  alt,
  wordmark,
  pageTitle,
  description,
  columns,
  exploreLabel,
  exploreHref,
  enquireLabel,
  enquireHref,
  theme = "light",
}: TypographyMaskHeroProps) {
  const root = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const maskSvgRef = useRef<SVGSVGElement>(null);
  const maskGroupRef = useRef<SVGGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const gridVerticalRef = useRef<HTMLDivElement>(null);
  const maskId = useHeroMaskId();
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const { layout, layoutReady } = useTypographyReveal(pinRef, textRef);

  useLayoutEffect(() => {
    if (reduced) return;
    const section = root.current;
    const pin = pinRef.current;
    const text = textRef.current;
    const media = mediaRef.current;
    const chrome = chromeRef.current;
    const footer = footerRef.current;
    if (!section || !pin || !text || !media || !chrome || !footer || !layoutReady || !layout) {
      return;
    }

    let revert = () => {};
    let cancelled = false;

    const setInteractive = (on: boolean) => {
      chrome.toggleAttribute("inert", !on);
      footer.toggleAttribute("inert", !on);
      chrome.classList.toggle(styles.chromeHidden, !on);
      footer.classList.toggle(styles.chromeHidden, !on);
    };

    const setMediaFull = (full: boolean) => {
      media.classList.toggle(styles.mediaFull, full);
    };

    void (async () => {
      try {
        const { gsap } = await whenScrollReady();
        if (cancelled) return;

        const scroller = document.documentElement;

        const context = gsap.context(() => {
          const wire = (end: string, profile: HeroMaskProfile) => {
            const endFontSize = Math.round(layout.fontSize * profile.scaleEnd);

            gsap.set(text, {
              attr: { "font-size": layout.fontSize, x: layout.cx, y: layout.cy },
              clearProps: "transform",
            });
            setMediaFull(false);

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                scroller,
                start: "top top",
                end,
                scrub: HERO_SCROLL.scrub,
                pin,
                pinSpacing: true,
                anticipatePin: HERO_SCROLL.anticipatePin,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  setInteractive(self.progress < HERO_TIMELINE.chromeFadeEnd);
                  if (self.progress >= HERO_TIMELINE.unmaskStart) {
                    setMediaFull(true);
                  } else {
                    setMediaFull(false);
                  }
                },
              },
            });

            const { chromeFadeStart, chromeFadeEnd, maskExpandStart, maskExpandEnd, unmaskStart, unmaskEnd } =
              HERO_TIMELINE;

            const chromeDur = chromeFadeEnd - chromeFadeStart;

            tl.to(chrome, { opacity: 0, y: -18, ease: "none", duration: chromeDur }, chromeFadeStart).to(
              footer,
              { opacity: 0, y: 14, ease: "none", duration: chromeDur },
              chromeFadeStart,
            );

            tl.to(
              text,
              {
                attr: { "font-size": endFontSize },
                ease: "none",
                duration: maskExpandEnd - maskExpandStart,
              },
              maskExpandStart,
            );

            tl.to(
              media,
              {
                opacity: 1,
                ease: "none",
                duration: unmaskEnd - unmaskStart,
                onStart: () => setMediaFull(true),
                onReverseComplete: () => setMediaFull(false),
              },
              unmaskStart,
            );
          };

          const mediaQuery = gsap.matchMedia();
          mediaQuery.add("(min-width: 768px)", () => wire(HERO_SCROLL.desktop, HERO_MASK_DESKTOP));
          mediaQuery.add("(max-width: 767px)", () => wire(HERO_SCROLL.mobile, HERO_MASK_MOBILE));
        }, section);

        revert = () => context.revert();
        const refresh = () => {
          void whenScrollReady().then(({ ScrollTrigger }) => ScrollTrigger.refresh());
        };
        requestAnimationFrame(() => {
          requestAnimationFrame(refresh);
        });
      } catch {
        /* scroll runtime unavailable */
      }
    })();

    return () => {
      cancelled = true;
      revert();
      setInteractive(true);
      setMediaFull(false);
    };
  }, [layout, layoutReady, reduced]);

  return (
    <section
      ref={root}
      className={
        theme === "light" ? "halden-hero-light relative -mt-16" : "halden-dark relative -mt-16"
      }
      aria-label={pageTitle}
      data-hero-theme={theme}
    >
      <div ref={pinRef} className={`${styles.pin} ${theme === "light" ? styles.pinIvory : ""}`}>
        <div className={`${styles.canvas} ${theme === "light" ? styles.canvasIvory : ""}`} />
        <div className={`${styles.heroNoise} hero-noise`} aria-hidden="true" />

        <AnimatedWordMask
          ref={maskSvgRef}
          wordmark={wordmark}
          maskId={maskId}
          layout={layout}
          maskGroupRef={maskGroupRef}
          textRef={textRef}
        />

        <HeroMedia
          ref={mediaRef}
          src={image}
          alt={alt}
          maskId={maskId}
          className={styles.mediaLayer}
          style={{ opacity: layoutReady ? 1 : 0 }}
        />

        <HeroArchitectureGrid ref={gridRef} verticalRef={gridVerticalRef} />

        <div className={styles.ui}>
          <h1 className="sr-only">{pageTitle}</h1>
          <HeroIntroContent
            chromeRef={chromeRef}
            footerRef={footerRef}
            columns={columns}
            description={description}
            exploreLabel={exploreLabel}
            exploreHref={exploreHref}
            enquireLabel={enquireLabel}
            enquireHref={enquireHref}
          />
        </div>

        <HeroCursor active={!reduced} />
      </div>
    </section>
  );
}