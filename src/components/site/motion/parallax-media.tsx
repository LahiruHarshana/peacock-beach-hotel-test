"use client";

import Image from "next/image";
import { useCallback, useRef, type ReactNode } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";

export function ParallaxMedia({
  children,
  className,
  imageUrl,
  imageAlt = "",
}: {
  children: ReactNode;
  className?: string;
  imageUrl?: string | null;
  imageAlt?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    gsap.fromTo(
      root.current,
      { y: 20 },
      {
        y: -20,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  }, []);

  useCinematic(root, setup, "(prefers-reduced-motion: no-preference) and (min-width: 768px)");

  return (
    <div ref={root} className={`relative overflow-hidden ${className ?? ""}`}>
      {imageUrl ? <Image src={imageUrl} alt={imageAlt} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" /> : null}
      {imageUrl ? <div className="absolute inset-0 bg-ink/55" /> : null}
      <div className="relative">{children}</div>
    </div>
  );
}
