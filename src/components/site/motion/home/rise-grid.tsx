"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { DESKTOP_MOTION, MOTION } from "@/components/site/motion/home/constants";

export function RiseGrid({
  children,
  className = "",
  revealMedia = false,
}: {
  children: ReactNode;
  className?: string;
  revealMedia?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const grid = root.current;
    if (!grid) return;
    const items = [...grid.children] as HTMLElement[];
    gsap.from(items, {
      y: 72,
      autoAlpha: 0,
      ease: "none",
      stagger: 0.08,
      scrollTrigger: { trigger: grid, start: "top 85%", end: "top 45%", scrub: 0.65 },
    });

    if (!revealMedia) return;
    items.forEach((item) => {
      const frame = item.querySelector<HTMLElement>("[data-frame]");
      const image = item.querySelector("img");
      if (frame) {
        gsap.fromTo(
          frame,
          { clipPath: "inset(10% 8% 10% 8%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: item, start: "top 88%", end: "center 60%", scrub: 0.6 },
          },
        );
      }
      if (image) {
        gsap.fromTo(
          image,
          { scale: 1.14, yPercent: -6 },
          {
            scale: 1.08,
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }
    });
  }, [revealMedia]);

  const setupMobile = useCallback((gsap: typeof import("gsap").default) => {
    const grid = root.current;
    if (!grid) return;
    gsap.from([...grid.children], {
      y: 32,
      ease: "none",
      stagger: 0.06,
      scrollTrigger: { trigger: grid, start: "top 92%", end: "top 70%", scrub: 0.5 },
    });
  }, []);

  useCinematic(root, setup, DESKTOP_MOTION);
  useCinematic(root, setupMobile, MOTION);

  return (
    <div ref={root} data-cinema="home-rise" className={className}>
      {children}
    </div>
  );
}
