"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useCallback, useRef } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

const scroller = () => document.documentElement;

export function RoomsEnquiryFinale({
  scene,
  title,
  lede,
  image,
  alt,
  children,
}: {
  scene: string;
  title: string;
  lede: string;
  image: string;
  alt: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const frame = section.querySelector<HTMLElement>("[data-room-finale-frame]");
    const imageNode = section.querySelector<HTMLElement>("[data-room-finale-image]");
    const panel = section.querySelector<HTMLElement>("[data-room-finale-panel]");

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        scroller: scroller(),
        start: "top top",
        end: "bottom bottom",
        scrub: 1.15,
        invalidateOnRefresh: true,
      },
    });
    if (frame) {
      timeline.fromTo(
        frame,
        { clipPath: "inset(8% 6% 8% 6% round 20px)" },
        { clipPath: "inset(0% 0% 0% 0% round 20px)", duration: 0.55, ease: "power2.inOut" },
        0,
      );
    }
    if (imageNode) timeline.fromTo(imageNode, { scale: 1.14, yPercent: 3 }, { scale: 1.0, yPercent: -3, duration: 1, ease: "none" }, 0);
    if (panel) {
      gsap.fromTo(
        panel,
        { y: 28, autoAlpha: 0.2 },
        {
          y: 0,
          autoAlpha: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            scroller: scroller(),
            start: "top 82%",
            end: "top 22%",
            scrub: 0.95,
          },
        },
      );
    }
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      id="enquiry"
      data-cinema="rooms-enquiry-finale"
      className="relative scroll-mt-16 border-t border-line bg-canvas md:h-[165svh] motion-reduce:h-auto"
    >
      <div className="relative flex flex-col gap-6 px-[5vw] pb-16 pt-20 md:sticky md:top-0 md:grid md:h-[100svh] md:grid-cols-12 md:items-center md:gap-[4vw] md:overflow-hidden md:px-[7vw] md:py-16 motion-reduce:relative motion-reduce:h-auto">
        <div
          data-room-finale-frame
          className="relative h-[38svh] w-full overflow-hidden rounded-[22px] shadow-[0_28px_80px_rgb(8_43_45_/_0.14)] will-change-[clip-path] md:col-span-5 md:h-[78svh] md:rounded-[20px]"
        >
          <div data-room-finale-image className="absolute inset-[-6%] will-change-transform">
            <Image src={image} alt={alt} fill className="object-cover object-[center_28%]" sizes="(min-width: 768px) 42vw, 90vw" />
          </div>
          <div className="home-scrim-ivory-vertical absolute inset-0 opacity-60" aria-hidden="true" />
          <p className="absolute bottom-4 left-4 rounded-full border border-paper/15 bg-surface/90 px-3 py-1 text-[0.48rem] uppercase tracking-[0.24em] text-paper backdrop-blur-md md:bottom-5 md:left-5 md:px-3.5 md:text-[0.52rem]">
            {scene}
          </p>
        </div>

        <div data-room-finale-panel className="relative z-10 w-full min-w-0 will-change-[transform,opacity] md:col-span-7">
          <div className="w-full max-w-2xl">
            <p className="text-[0.52rem] uppercase tracking-[0.28em] text-signal md:text-[0.54rem]">{scene}</p>
            <h2 className="mt-3 max-w-[12ch] text-[clamp(1.75rem,4.6vw,4.8rem)] font-light leading-[0.9] tracking-[-0.055em] text-paper md:mt-4">
              {title}
            </h2>
            <p className="mt-3 max-w-lg text-xs leading-6 text-mist md:mt-5 md:text-sm md:leading-7">{lede}</p>
            <div className="mt-5 md:mt-7">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
