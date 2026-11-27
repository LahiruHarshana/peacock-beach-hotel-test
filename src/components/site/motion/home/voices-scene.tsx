"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { DESKTOP_MOTION, MOTION } from "@/components/site/motion/home/constants";

export function VoicesScene({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const cards = [...(root.current?.querySelectorAll<HTMLElement>("[data-voice]") ?? [])];
    if (cards.length === 0) return;
    gsap.from(cards, {
      y: 56,
      rotateX: 8,
      transformPerspective: 900,
      ease: "none",
      stagger: 0.08,
      scrollTrigger: { trigger: root.current, start: "top 82%", end: "top 48%", scrub: 0.65 },
    });
  }, []);

  const setupMobile = useCallback((gsap: typeof import("gsap").default) => {
    const cards = [...(root.current?.querySelectorAll<HTMLElement>("[data-voice]") ?? [])];
    if (cards.length === 0) return;
    gsap.from(cards, {
      y: 28,
      ease: "none",
      stagger: 0.06,
      scrollTrigger: { trigger: root.current, start: "top 92%", end: "top 72%", scrub: 0.5 },
    });
  }, []);

  useCinematic(root, setup, DESKTOP_MOTION);
  useCinematic(root, setupMobile, MOTION);

  return (
    <section ref={root} data-cinema="home-voices" className="mx-auto w-[91.5vw] py-24 text-center lg:py-32">
      {children}
    </section>
  );
}
