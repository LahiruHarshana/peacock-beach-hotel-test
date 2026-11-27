"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { DESKTOP_MOTION, MOTION } from "@/components/site/motion/home/constants";

export function CreditsScene({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const rows = [...(root.current?.querySelectorAll<HTMLElement>("[data-credit]") ?? [])];
    if (rows.length === 0) return;
    gsap.from(rows, {
      x: (index) => (index % 2 === 0 ? -80 : 80),
      autoAlpha: 0,
      ease: "none",
      stagger: 0.06,
      scrollTrigger: {
        trigger: root.current,
        start: "top 80%",
        end: "center 55%",
        scrub: 0.65,
      },
    });
  }, []);

  const setupMobile = useCallback((gsap: typeof import("gsap").default) => {
    const rows = [...(root.current?.querySelectorAll<HTMLElement>("[data-credit]") ?? [])];
    if (rows.length === 0) return;
    gsap.from(rows, {
      y: 24,
      ease: "none",
      stagger: 0.05,
      scrollTrigger: { trigger: root.current, start: "top 90%", end: "top 70%", scrub: 0.5 },
    });
  }, []);

  useCinematic(root, setup, DESKTOP_MOTION);
  useCinematic(root, setupMobile, MOTION);

  return (
    <section ref={root} data-cinema="home-credits" className="bg-mocha px-[8vw] py-24 text-ivory lg:py-32">
      {children}
    </section>
  );
}
