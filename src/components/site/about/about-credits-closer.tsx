"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { ABOUT_SCRUB } from "@/components/site/about/about-motion.config";
import { aboutRevealLines, aboutScrollTimeline } from "@/components/site/about/about-motion-utils";
import { AboutLine } from "@/components/site/about/about-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

/**
 * Full-bleed iris-expansion closer: identical layout and scroll animation on mobile and desktop.
 */
export function AboutCreditsCloser({
  sceneTag,
  title,
  address,
  roomsHref,
  roomsLabel,
  contactHref,
  contactLabel,
  plateUrl,
  plateAlt,
}: {
  sceneTag: string;
  title: string;
  address: string;
  roomsHref: string;
  roomsLabel: string;
  contactHref: string;
  contactLabel: string;
  plateUrl: string;
  plateAlt: string;
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const aperture = section.querySelector<HTMLElement>("[data-about-enquiry-aperture]");
    const media = section.querySelector<HTMLElement>("[data-about-enquiry-media]");
    const roll = section.querySelector<HTMLElement>("[data-about-enquiry-copy]");

    const timeline = aboutScrollTimeline(gsap, section, ABOUT_SCRUB.enquiry);

    if (aperture) {
      timeline.fromTo(
        aperture,
        { clipPath: "inset(14% 16% 14% 16% round 24px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 0.58 },
        0,
      );
    }
    if (media) timeline.fromTo(media, { scale: 1.14 }, { scale: 1, ease: "none", duration: 1 }, 0);
    if (roll) timeline.fromTo(roll, { y: 54, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: "power3.out", duration: 0.42 }, 0.2);
    aboutRevealLines(gsap, section, "[data-about-line]", timeline, 0.24, 0.24);
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section ref={root} data-cinema="about-enquiry" className="home-ivory-blue relative h-[180svh] text-paper motion-reduce:h-auto">
      <div className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:relative motion-reduce:min-h-[100svh]">
        <div data-about-enquiry-aperture className="absolute inset-0 will-change-[clip-path]">
          <div data-about-enquiry-media className="absolute inset-0 will-change-transform">
            <Image src={plateUrl} alt={plateAlt} fill className="object-cover object-center" sizes="100vw" />
          </div>
          <div className="home-scrim-ivory absolute inset-0" aria-hidden="true" />
          <div
            className="absolute inset-0 bg-gradient-to-b from-canvas/90 via-canvas/65 to-canvas/92"
            aria-hidden="true"
          />
        </div>

        <div
          data-about-enquiry-copy
          className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-[6vw] text-center text-paper"
        >
          <p className="mb-6 text-[0.58rem] uppercase tracking-[0.28em] text-signal">{sceneTag}</p>
          <h2 className="max-w-[12ch] font-light tracking-[-0.05em] text-[clamp(2.4rem,6.2vw,6.2rem)] leading-[0.94] text-paper">
            <AboutLine>{title}</AboutLine>
          </h2>
          <p className="mt-7 max-w-md text-center text-sm leading-relaxed text-paper/80 md:text-base">{address}</p>
          <div className="mt-10 flex flex-row flex-wrap items-center justify-center gap-3">
            <Link
              href={roomsHref}
              className="group inline-flex min-w-[10rem] items-center justify-center gap-2.5 rounded-full bg-paper px-6 py-3.5 text-[0.58rem] uppercase tracking-[0.22em] text-canvas transition-colors duration-300 hover:bg-paper/90 md:min-w-[11rem] md:px-7"
            >
              <span>{roomsLabel}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                ↗
              </span>
            </Link>
            <Link
              href={contactHref}
              className="group inline-flex min-w-[10rem] items-center justify-center gap-2.5 rounded-full border border-paper/25 bg-surface/85 px-6 py-3.5 text-[0.58rem] uppercase tracking-[0.22em] text-paper backdrop-blur-md transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-canvas md:min-w-[11rem] md:px-7"
            >
              <span>{contactLabel}</span>
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
