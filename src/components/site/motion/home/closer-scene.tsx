"use client";

import Image from "next/image";
import { useCallback, useRef, type ReactNode } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { DESKTOP_MOTION, MOTION } from "@/components/site/motion/home/constants";

export function CloserScene({
  plateUrl,
  plateAlt,
  previewLabel,
  children,
}: {
  plateUrl: string | null;
  plateAlt: string;
  previewLabel?: string | null;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const plate = useRef<HTMLDivElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const media = plate.current;
    if (!media || !root.current) return;
    gsap.fromTo(
      media,
      { yPercent: 8, scale: 1.08 },
      {
        yPercent: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: 0.8 },
      },
    );
  }, []);

  const setupMobile = useCallback((gsap: typeof import("gsap").default) => {
    const media = plate.current;
    if (!media || !root.current) return;
    gsap.fromTo(
      media,
      { yPercent: 4 },
      {
        yPercent: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true },
      },
    );
  }, []);

  useCinematic(root, setup, DESKTOP_MOTION);
  useCinematic(root, setupMobile, MOTION);

  return (
    <section ref={root} data-cinema="home-closer" className="mx-auto w-[91.5vw] pb-16 pt-6 lg:pb-24 lg:pt-10">
      <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-10">
        <div className="max-w-xl pb-2 lg:pb-8">{children}</div>
        {plateUrl ? (
          <div className="relative h-[58vw] min-h-[18rem] overflow-hidden rounded-[1.75rem] bg-mocha sm:h-[46vw] lg:h-[min(72vh,40rem)]">
            <div ref={plate} className="absolute inset-0 will-change-transform">
              <Image src={plateUrl} alt={plateAlt} fill className="object-cover object-[center_42%]" sizes="(min-width: 1024px) 54vw, 92vw" />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-mocha/25 via-transparent to-transparent" aria-hidden="true" />
            {previewLabel ? (
              <p className="absolute left-5 top-5 rounded-full bg-ivory/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12rem] text-mocha/75">
                {previewLabel}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
