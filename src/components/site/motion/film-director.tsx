"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const MOTION = "(prefers-reduced-motion: no-preference)";
const DESKTOP = `${MOTION} and (min-width: 768px)`;

type Gsap = typeof import("gsap").default;

function isHomePath(pathname: string) {
  return /^\/(en|ru)\/?$/.test(pathname);
}

/** Scroll-scrubbed shots. Timelines are removed on navigation and when motion is reduced. */
export function FilmDirector() {
  const pathname = usePathname();

  useEffect(() => {
    if (isHomePath(pathname)) return;
    const main = document.querySelector("main");
    if (!main) return;
    let revert = () => {};
    let cancelled = false;

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();

      media.add(MOTION, () => {
        const context = gsap.context(() => {
          playOpening(gsap, main);
          playTitleCards(gsap, main);
          playCredits(gsap, main);
          playDrifts(gsap, main);
          playRises(gsap, main);
        }, main);
        return () => context.revert();
      });

      media.add(DESKTOP, () => {
        const reels = [...main.querySelectorAll<HTMLElement>("[data-cinema='reel']")];
        reels.forEach((reel) => {
          const track = reel.querySelector("[data-track]");
          if (track && track.children.length > 1) reel.classList.add("is-reel");
        });
        const context = gsap.context(() => playReels(gsap, main), main);
        return () => {
          reels.forEach((reel) => reel.classList.remove("is-reel"));
          context.revert();
        };
      });

      const refresh = () => ScrollTrigger.refresh();
      main.querySelectorAll("img").forEach((img) => {
        if (!img.complete) img.addEventListener("load", refresh, { once: true });
      });
      window.addEventListener("load", refresh);
      const later = window.setTimeout(refresh, 500);
      ScrollTrigger.refresh();
      revert = () => {
        window.clearTimeout(later);
        window.removeEventListener("load", refresh);
        media.revert();
      };
    })();

    return () => {
      cancelled = true;
      revert();
    };
  }, [pathname]);

  return null;
}

function playOpening(gsap: Gsap, main: Element) {
  main.querySelectorAll<HTMLElement>("[data-cinema='opening']").forEach((opening) => {
    const title = opening.querySelector<HTMLElement>("[data-title]");
    const plate = opening.querySelector<HTMLElement>("[data-plate]");
    if (title) {
      const lines = title.querySelectorAll(":scope > *");
      if (lines.length > 0) {
        gsap.from(lines, {
          y: 42,
          autoAlpha: 0,
          duration: 1.15,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
        });
      }
      gsap.to(title, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: { trigger: opening, start: "top top", end: "bottom top", scrub: 0.7 },
      });
    }
    if (plate) {
      gsap.fromTo(
        plate,
        { yPercent: 8, scale: 1.12 },
        {
          yPercent: -14,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: opening, start: "top top", end: "bottom top", scrub: 0.65 },
        },
      );
    }
  });
}

function playTitleCards(gsap: Gsap, main: Element) {
  main.querySelectorAll<HTMLElement>("[data-cinema='closer']").forEach((section) => {
    const copy = section.querySelector(":scope > div");
    if (!copy || copy.hasAttribute("data-drift")) return;
    gsap.from(copy, {
      y: 48,
      ease: "none",
      scrollTrigger: { trigger: section, start: "top 86%", end: "top 52%", scrub: 0.65 },
    });
  });

  main.querySelectorAll<HTMLElement>("[data-cinema='titlecard']").forEach((card) => {
    const line = card.firstElementChild;
    if (!line) return;
    gsap.fromTo(
      line,
      { y: 72, scale: 0.92 },
      {
        y: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: card, start: "top 80%", end: "center 52%", scrub: 0.7 },
      },
    );
  });
}

function playCredits(gsap: Gsap, main: Element) {
  const rows = [...main.querySelectorAll<HTMLElement>("[data-credit]")];
  if (rows.length === 0) return;
  gsap.from(rows, {
    x: (index) => (index % 2 === 0 ? -72 : 72),
    ease: "none",
    stagger: 0.05,
    scrollTrigger: {
      trigger: rows[0]?.parentElement ?? rows[0],
      start: "top 86%",
      end: "bottom 60%",
      scrub: 0.65,
    },
  });
}

function playDrifts(gsap: Gsap, main: Element) {
  main.querySelectorAll<HTMLElement>("[data-drift='media']").forEach((frame) => {
    const image = frame.querySelector("img");
    if (!image) return;
    gsap.fromTo(
      image,
      { yPercent: -8, scale: 1.14 },
      {
        yPercent: 8,
        scale: 1.14,
        ease: "none",
        scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });

  main.querySelectorAll<HTMLElement>("[data-drift='center']").forEach((frame) => {
    gsap.fromTo(
      frame,
      { xPercent: -50, yPercent: 8 },
      {
        xPercent: -50,
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: frame.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });
}

function playRises(gsap: Gsap, main: Element) {
  main.querySelectorAll<HTMLElement>("section").forEach((section) => {
    if (section.hasAttribute("data-cinema")) return;
    if (section.querySelector("[data-cinema], .sticky")) return;
    const parts = [...section.querySelectorAll<HTMLElement>(":scope > *")];
    gsap.from(parts.length > 0 ? parts : [section], {
      y: 64,
      ease: "none",
      stagger: 0.07,
      scrollTrigger: { trigger: section, start: "top 88%", end: "top 56%", scrub: 0.7 },
    });
  });

  main.querySelectorAll<HTMLElement>("[data-rise]").forEach((block) => {
    gsap.from(block, {
      y: 36,
      ease: "none",
      scrollTrigger: { trigger: block, start: "top 92%", end: "top 68%", scrub: 0.55 },
    });
  });
}

function playReels(gsap: Gsap, main: Element) {
  main.querySelectorAll<HTMLElement>("[data-cinema='reel'].is-reel").forEach((reel) => {
    const track = reel.querySelector<HTMLElement>("[data-track]");
    if (!track || track.children.length < 2) return;
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 48);
    gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: reel,
        start: "top 80px",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  });
}
