"use client";

import { AnimatedWordMask, useHeroMaskId } from "./AnimatedWordMask";
import { HeroArchitectureGrid } from "./HeroArchitectureGrid";
import { HeroCursor } from "./HeroCursor";
import { HeroIntroContent, type HeroColumn } from "./HeroIntroContent";
import { HeroMedia } from "./HeroMedia";
import {
  HERO_INTRO,
  HERO_MASK_DESKTOP,
  HERO_MASK_MOBILE,
} from "./hero-motion.config";
import styles from "./typography-mask-hero.module.css";
import { useTypographyReveal } from "./useTypographyReveal";
import { useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/motion/gsap-runtime";
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
  const scrimRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const gridVerticalRef = useRef<HTMLDivElement>(null);
  const hasPlayedRef = useRef(false);
  const maskId = useHeroMaskId();
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const { layout, layoutReady } = useTypographyReveal(pinRef, textRef);

  useLayoutEffect(() => {
    const section = root.current;
    const text = textRef.current;
    const media = mediaRef.current;
    const scrim = scrimRef.current;
    const chrome = chromeRef.current;
    const footer = footerRef.current;
    if (!section || !text || !media || !scrim || !chrome || !footer) {
      return;
    }

    const setInteractive = (on: boolean) => {
      chrome.toggleAttribute("inert", !on);
      footer.toggleAttribute("inert", !on);
      chrome.classList.toggle(styles.chromeHidden, !on);
      footer.classList.toggle(styles.chromeHidden, !on);
    };

    const setMediaFull = (full: boolean) => {
      media.classList.toggle(styles.mediaFull, full);
    };

    // Reduced motion or already played (e.g. viewport resize): keep final stable state.
    if (reduced || hasPlayedRef.current) {
      setMediaFull(true);
      setInteractive(true);
      media.style.opacity = "1";
      media.style.transform = "none";
      scrim.style.opacity = "1";
      chrome.style.opacity = "1";
      chrome.style.transform = "none";
      footer.style.opacity = "1";
      footer.style.transform = "none";
      return;
    }

    if (!layoutReady || !layout) {
      return;
    }

    let revert = () => {};
    let cancelled = false;

    void (async () => {
      try {
        const { gsap } = await loadGsap();
        if (cancelled) return;

        const isMobile = layout.width < 768;
        const profile = isMobile ? HERO_MASK_MOBILE : HERO_MASK_DESKTOP;
        const endFontSize = Math.round(layout.fontSize * profile.scaleEnd);

        const context = gsap.context(() => {
          gsap.set(text, {
            attr: { "font-size": layout.fontSize, x: layout.cx, y: layout.cy },
            clearProps: "transform",
          });
          gsap.set(media, {
            opacity: 0,
            scale: HERO_INTRO.mediaScaleFrom,
            transformOrigin: "50% 50%",
          });
          gsap.set(scrim, { opacity: 0 });
          gsap.set(chrome, { opacity: 0, y: -12 });
          gsap.set(footer, { opacity: 0, y: 14 });
          setMediaFull(false);
          setInteractive(false);

          const tl = gsap.timeline({
            onComplete: () => {
              hasPlayedRef.current = true;
              setMediaFull(true);
              setInteractive(true);
            },
          });

          // 1. Fade in the masked "peacock" wordmark & gently settle the background image scale
          tl.to(
            media,
            {
              opacity: 1,
              duration: HERO_INTRO.maskFadeDuration,
              ease: "power2.out",
            },
            0,
          ).to(
            media,
            {
              scale: 1,
              duration: HERO_INTRO.mediaScaleDuration,
              ease: "power2.out",
            },
            0,
          );

          // 2. Smoothly zoom the "peacock" wordmark once on load to reveal the full image
          tl.to(
            text,
            {
              attr: { "font-size": endFontSize },
              duration: HERO_INTRO.zoomDuration,
              ease: "expo.inOut",
            },
            HERO_INTRO.zoomDelay,
          );

          // 3. Unmask cleanly once the zoomed letterforms fill the viewport and fade in scrim
          tl.call(() => setMediaFull(true), undefined, HERO_INTRO.unmaskAt).to(
            scrim,
            {
              opacity: 1,
              duration: HERO_INTRO.chromeRevealDuration,
              ease: "power2.out",
            },
            HERO_INTRO.chromeRevealAt,
          );

          // 4. Reveal hero chrome & CTAs and leave everything interactive and stable
          tl.to(
            chrome,
            {
              opacity: 1,
              y: 0,
              duration: HERO_INTRO.chromeRevealDuration,
              ease: "power3.out",
            },
            HERO_INTRO.chromeRevealAt,
          ).to(
            footer,
            {
              opacity: 1,
              y: 0,
              duration: HERO_INTRO.chromeRevealDuration,
              ease: "power3.out",
              onStart: () => setInteractive(true),
            },
            HERO_INTRO.chromeRevealAt + 0.08,
          );
        }, section);

        revert = () => context.revert();
      } catch {
        setMediaFull(true);
        setInteractive(true);
      }
    })();

    return () => {
      cancelled = true;
      revert();
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
          style={{ opacity: reduced ? 1 : 0 }}
        />

        <div
          ref={scrimRef}
          className={`${styles.scrim} ${theme === "light" ? styles.scrimLight : ""}`}
          style={{ opacity: reduced ? 1 : 0 }}
          aria-hidden="true"
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