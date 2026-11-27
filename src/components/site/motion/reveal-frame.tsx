"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";

const DESKTOP_MOTION = "(prefers-reduced-motion: no-preference) and (min-width: 768px)";

export function RevealFrame({
  src,
  alt,
  label,
  className = "aspect-[4/5]",
}: {
  src: string | null;
  alt: string;
  label?: string | null;
  className?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const media = frame.current;
    if (!media) return;
    gsap.fromTo(
      media,
      { clipPath: "inset(12% 8% 12% 8%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top 85%",
          end: "center 55%",
          scrub: 0.6,
        },
      },
    );
  }, []);

  useCinematic(root, setup, DESKTOP_MOTION);

  return (
    <figure ref={root} className={`group hover-zoom relative overflow-hidden bg-stone ${className}`}>
      <div ref={frame} className="absolute inset-0">
        {src ? (
          <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 768px) 45vw, 100vw" />
        ) : (
          <div className="coastal-field absolute inset-0" />
        )}
      </div>
      {label ? (
        <figcaption className="absolute bottom-0 left-0 right-0 bg-ink/80 px-4 py-3 text-xs tracking-wide text-paper">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}
