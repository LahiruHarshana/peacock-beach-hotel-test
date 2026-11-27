"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { loadGsap, prefersReducedMotion } from "@/lib/motion/gsap-runtime";

type HotelIntroProps = {
  image: string;
  alt: string;
  index: string;
  label: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  caption: string;
};

export function HotelIntro({ image, alt, index, label, title, body, href, cta, caption }: HotelIntroProps) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section || prefersReducedMotion()) return;
    let revert = () => {};
    let cancelled = false;

    void (async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      const context = gsap.context(() => {
        const copy = section.querySelectorAll("[data-intro-line]");
        const frame = section.querySelector("[data-intro-media]");
        const photo = section.querySelector("[data-intro-photo]");
        const rule = section.querySelector("[data-intro-rule]");
        const line = (start: string, end: string) => ({
          ease: "none" as const,
          scrollTrigger: { trigger: section, start, end, scrub: 0.65 },
        });
        if (copy.length) {
          gsap.fromTo(copy, { yPercent: 110 }, { yPercent: 0, stagger: 0.08, ...line("top 80%", "top 30%") });
        }
        if (frame) {
          gsap.fromTo(
            frame,
            { clipPath: "inset(18% 12% 18% 12%)", borderRadius: "2px" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              borderRadius: "14px",
              ease: "none",
              scrollTrigger: { trigger: frame, start: "top 85%", end: "center 55%", scrub: 0.7 },
            },
          );
        }
        if (photo) {
          gsap.fromTo(
            photo,
            { scale: 1.18 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: frame, start: "top 80%", end: "bottom 70%", scrub: 0.8 },
            },
          );
        }
        if (rule) {
          gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center", ...line("top 70%", "top 40%") });
        }
      }, section);
      revert = () => context.revert();
    })();

    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  return (
    <section ref={root} id="story" className="bg-canvas px-[5vw] py-24 text-fog md:py-32">
      <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <p className="mb-6 overflow-hidden text-[0.68rem] uppercase tracking-[0.22em] text-signal">
            <span data-intro-line className="block">{index} — {label}</span>
          </p>
          <h2 className="max-w-[12ch] overflow-hidden text-[clamp(3rem,6vw,6.2rem)] leading-[0.88] font-light tracking-[-0.06em]">
            <span data-intro-line className="block">{title}</span>
          </h2>
        </div>
        <div className="max-w-md lg:justify-self-end lg:pb-3">
          <p className="overflow-hidden text-sm leading-6 text-mist">
            <span data-intro-line className="block">{body}</span>
          </p>
          <Link href={href} className="mt-6 inline-flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.18em] text-fog">
            <span data-intro-rule className="h-px w-8 origin-left bg-signal" />
            {cta}
          </Link>
        </div>
      </div>
      <figure data-intro-media className="relative mt-14 h-[68vh] min-h-[22rem] overflow-hidden bg-surface md:mt-20">
        <div data-intro-photo className="absolute inset-0 will-change-transform">
          <Image src={image} alt={alt} fill className="object-cover" sizes="90vw" />
        </div>
        <figcaption className="absolute bottom-4 left-4 text-[0.62rem] uppercase tracking-[0.2em] text-fog">
          {caption}
        </figcaption>
      </figure>
    </section>
  );
}
