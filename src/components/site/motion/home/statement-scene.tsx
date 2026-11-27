"use client";

import Image from "next/image";
import { useCallback, useRef, type ReactNode } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { DESKTOP_MOTION, MOTION } from "@/components/site/motion/home/constants";

export function StatementScene({
  plateUrl,
  plateAlt,
  words,
  emphasis,
  children,
}: {
  plateUrl: string | null;
  plateAlt: string;
  words: string[];
  emphasis: string;
  children?: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);

  const setupPin = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    const plate = bg.current;
    if (!section) return;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=120%",
        pin: true,
        scrub: 0.55,
        anticipatePin: 1,
      },
    });

    if (plate) {
      timeline.fromTo(plate, { scale: 1.08, yPercent: 6 }, { scale: 1.14, yPercent: -8, ease: "none" }, 0);
    }

    const spans = gsap.utils.toArray<HTMLElement>("[data-word]", section);
    spans.forEach((span, index) => {
      timeline.fromTo(
        span,
        { opacity: 0.2 },
        { opacity: 1, ease: "none", duration: 0.35 },
        index * 0.08,
      );
    });
  }, []);

  const setupDrift = useCallback((gsap: typeof import("gsap").default) => {
    const plate = bg.current;
    if (!plate || !root.current) return;
    gsap.to(plate, {
      yPercent: -6,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
    });
  }, []);

  useCinematic(root, setupPin, DESKTOP_MOTION);
  useCinematic(root, setupDrift, MOTION);

  return (
    <section
      ref={root}
      data-cinema="home-statement"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ivory px-[7vw] py-28 text-center"
    >
      {plateUrl ? (
        <div ref={bg} className="pointer-events-none absolute inset-0 opacity-30 will-change-transform">
          <Image src={plateUrl} alt={plateAlt} fill className="object-cover object-center" sizes="100vw" />
          <div className="absolute inset-0 bg-ivory/55" />
        </div>
      ) : null}
      <div className="relative z-10 max-w-6xl">
        <p className="font-sans text-[clamp(1.85rem,3.35vw,3.4rem)] font-medium leading-[1.22] tracking-[-0.045em]">
          {words.map((word, index) => (
            <span key={`${word}-${index}`} data-word className="mr-[0.28em] inline-block opacity-100">
              {word}
            </span>
          ))}
          {emphasis ? (
            <>
              <br />
              <span data-word className="font-serif text-[1.05em] font-normal italic opacity-100">
                {emphasis}
              </span>
            </>
          ) : null}
        </p>
        {children}
      </div>
    </section>
  );
}
