"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { ABOUT_SCRUB } from "@/components/site/about/about-motion.config";
import { aboutRevealLines, aboutScrollTimeline } from "@/components/site/about/about-motion-utils";
import { AboutLine } from "@/components/site/about/about-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

type Tone = "ivory" | "surface" | "sand";

const toneStyles: Record<Tone, { section: string; label: string; title: string; body: string; link: string; border: string }> = {
  ivory: {
    section: "home-ivory-blue text-paper",
    label: "text-signal",
    title: "text-paper",
    body: "text-mist",
    link: "text-paper border-paper/20 hover:bg-paper hover:text-canvas",
    border: "border-line",
  },
  surface: {
    section: "bg-surface text-paper",
    label: "text-signal",
    title: "text-paper",
    body: "text-mist",
    link: "text-paper border-paper/20 hover:bg-paper hover:text-canvas",
    border: "border-line",
  },
  sand: {
    section: "bg-canvas text-paper",
    label: "text-signal",
    title: "text-paper",
    body: "text-mist",
    link: "text-paper border-paper/20 hover:bg-paper hover:text-canvas",
    border: "border-line",
  },
};

export function AboutEditorialChapter({
  sceneTag,
  index,
  label,
  title,
  body,
  href,
  image,
  alt,
  tone,
  imageRight = false,
}: {
  sceneTag: string;
  index: string;
  label: string;
  title: string;
  body: string;
  href: string;
  image: string;
  alt: string;
  tone: Tone;
  imageRight?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const style = toneStyles[tone];

  const setup = useCallback(
    (gsap: typeof import("gsap").default) => {
      const section = root.current;
      if (!section) return;
      const frame = section.querySelector<HTMLElement>("[data-about-chapter-frame]");
      const media = section.querySelector<HTMLElement>("[data-about-chapter-media]");
      const copy = section.querySelector<HTMLElement>("[data-about-chapter-copy]");

      const timeline = aboutScrollTimeline(gsap, section, ABOUT_SCRUB.chapter);

      if (frame) {
        timeline.fromTo(
          frame,
          { clipPath: imageRight ? "inset(10% 0% 10% 24% round 20px)" : "inset(10% 24% 10% 0% round 20px)" },
          { clipPath: "inset(0% 0% 0% 0% round 20px)", ease: "power2.inOut", duration: 0.45 },
          0,
        );
      }
      if (media) {
        timeline.fromTo(media, { scale: 1.16, yPercent: 4 }, { scale: 1, yPercent: -4, ease: "none", duration: 1 }, 0);
      }
      if (copy) {
        timeline.fromTo(copy, { y: 48, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: "power3.out", duration: 0.38 }, 0.08);
      }
      aboutRevealLines(gsap, section, "[data-about-line]", timeline, 0.12, 0.24);
    },
    [imageRight],
  );

  useCinematic(root, setup, MOTION);

  const figureColumn = imageRight ? "md:col-start-7 md:col-span-6" : "md:col-start-1 md:col-span-6";
  const copyColumn = imageRight ? "md:col-start-1 md:col-span-5" : "md:col-start-8 md:col-span-5";

  return (
    <section
      ref={root}
      data-cinema={`about-chapter-${index}`}
      className={`${style.section} relative h-[185svh] motion-reduce:h-auto`}
    >
      <div
        className={`sticky top-0 flex h-[100svh] flex-col justify-between gap-4 overflow-hidden border-t px-[5vw] pb-8 pt-20 md:grid md:grid-cols-12 md:items-center md:gap-[4vw] md:px-[7vw] md:py-[10vh] motion-reduce:relative motion-reduce:h-auto ${style.border}`}
      >
        <div className="flex items-center justify-between gap-4 md:hidden">
          <p className={`text-[0.54rem] uppercase tracking-[0.28em] ${style.label}`}>{sceneTag}</p>
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
          <span className="text-[0.52rem] uppercase tracking-[0.24em] text-mist">{index}</span>
        </div>

        <figure
          data-about-chapter-frame
          className={`relative z-10 aspect-[4/4.1] w-full flex-1 overflow-hidden rounded-[22px] shadow-[0_28px_80px_rgb(0_0_0_/_0.16)] will-change-[clip-path] md:aspect-[5/4] md:flex-none md:rounded-[20px] ${figureColumn} ${imageRight ? "md:row-start-1" : ""}`}
        >
          <div data-about-chapter-media className="relative h-full w-full will-change-transform">
            <Image src={image} alt={alt} fill className="object-cover object-[center_22%]" sizes="(min-width: 768px) 46vw, 90vw" />
          </div>
          <figcaption className="absolute bottom-3 left-3 rounded-full border border-paper/15 bg-surface/90 px-3 py-1 text-[0.48rem] uppercase tracking-[0.22em] text-paper backdrop-blur-md md:bottom-4 md:left-4 md:text-[0.52rem]">
            {index} · {label}
          </figcaption>
        </figure>

        <div
          data-about-chapter-copy
          className={`relative z-20 w-full rounded-2xl border border-paper/10 bg-surface/65 p-5 backdrop-blur-md md:rounded-none md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none ${copyColumn}`}
        >
          <p className={`mb-3 hidden text-[0.52rem] uppercase tracking-[0.28em] md:mb-5 md:block md:text-[0.56rem] ${style.label}`}>{sceneTag}</p>
          <h2 className={`max-w-[14ch] font-light tracking-[-0.045em] text-[clamp(2rem,5.5vw,5.4rem)] leading-[0.94] md:max-w-[11ch] ${style.title}`}>
            <AboutLine>{title}</AboutLine>
          </h2>
          <p className={`mt-3 max-w-[34rem] text-sm leading-relaxed md:mt-7 md:text-[clamp(0.95rem,1.1vw,1.05rem)] md:leading-[1.75] ${style.body}`}>{body}</p>
          <div className="mt-5 md:mt-9">
            <Link
              href={href}
              className={`group inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-[0.54rem] uppercase tracking-[0.22em] transition-colors duration-300 md:gap-3 md:px-6 md:py-3 md:text-[0.58rem] ${style.link}`}
            >
              <span>{label}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                ↗
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
