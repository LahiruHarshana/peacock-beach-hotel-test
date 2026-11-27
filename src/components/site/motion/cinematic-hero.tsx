"use client";

import Image from "next/image";
import { useCallback, useRef, type ReactNode } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";

const DESKTOP_MOTION = "(prefers-reduced-motion: no-preference) and (min-width: 768px)";

export function CinematicHero({
  children,
  imageUrl,
  imageAlt,
}: {
  children: ReactNode;
  imageUrl?: string | null;
  imageAlt?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const field = useRef<HTMLDivElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const media = field.current;
    if (!media) return;
    gsap.fromTo(media, { scale: 1.08 }, { scale: 1, duration: 1.15, ease: "power2.out" });
    gsap.to(media, {
      scale: 1.08,
      yPercent: 8,
      ease: "none",
      scrollTrigger: {
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  useCinematic(root, setup, DESKTOP_MOTION);

  return (
    <section ref={root} className="relative min-h-[calc(100dvh-5rem)] overflow-hidden bg-ink text-paper">
      <div className="absolute inset-0 overflow-hidden [perspective:1400px]">
        <div ref={field} className="absolute inset-0 origin-center [transform-style:preserve-3d]">
          {imageUrl ? (
            <Image src={imageUrl} alt={imageAlt || ""} fill priority className="object-cover" sizes="100vw" />
          ) : (
            <div className="coastal-field absolute inset-0" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/15" />
        </div>
      </div>
      <div className="relative flex min-h-[calc(100dvh-5rem)] items-end">{children}</div>
    </section>
  );
}
