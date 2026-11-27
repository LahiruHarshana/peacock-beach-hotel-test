"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

const scroller = () => document.documentElement;

const ARRIVE = 0.14;

export function HomeStatementPin({
  plateUrl,
  secondaryUrl,
  detailUrl,
  plateAlt,
  lineOne,
  lineTwo,
  body,
  cta,
  href,
}: {
  plateUrl: string;
  secondaryUrl: string;
  detailUrl: string;
  plateAlt: string;
  lineOne: string;
  lineTwo: string;
  body: string;
  cta: string;
  href: string;
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;

    const stage = section.querySelector<HTMLElement>("[data-arrival-stage]");
    const mainFrame = section.querySelector<HTMLElement>("[data-arrival-main-frame]");
    const mainMedia = section.querySelector<HTMLElement>("[data-arrival-main-media]");
    const secondary = section.querySelector<HTMLElement>("[data-arrival-secondary]");
    const secondaryMedia = section.querySelector<HTMLElement>("[data-arrival-secondary-media]");
    const detail = section.querySelector<HTMLElement>("[data-arrival-detail]");
    const detailMedia = section.querySelector<HTMLElement>("[data-arrival-detail-media]");
    const copy = section.querySelector<HTMLElement>("[data-arrival-copy]");
    const bodyNode = section.querySelector<HTMLElement>("[data-arrival-body]");
    const horizon = section.querySelector<HTMLElement>("[data-arrival-horizon]");
    const lineOneEl = section.querySelector<HTMLElement>("[data-arrival-line-one]");
    const lineTwoEl = section.querySelector<HTMLElement>("[data-arrival-line-two]");

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        scroller: scroller(),
        start: "top top",
        end: "bottom bottom",
        scrub: 1.4,
        invalidateOnRefresh: true,
      },
    });

    if (stage) gsap.set(stage, { transformPerspective: 1400, transformStyle: "preserve-3d" });

    if (lineOneEl) timeline.fromTo(lineOneEl, { yPercent: 115 }, { yPercent: 0, ease: "sine.out", duration: ARRIVE }, 0);
    if (lineTwoEl) timeline.fromTo(lineTwoEl, { yPercent: 115 }, { yPercent: 0, ease: "sine.out", duration: ARRIVE }, 0.045);
    if (bodyNode) timeline.fromTo(bodyNode, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, ease: "sine.out", duration: ARRIVE + 0.06 }, 0.05);
    if (horizon) timeline.fromTo(horizon, { scaleX: 0.15, opacity: 0.35 }, { scaleX: 1, opacity: 1, ease: "sine.out", duration: ARRIVE }, 0.02);

    if (mainFrame) {
      timeline.fromTo(
        mainFrame,
        { yPercent: 6, z: -70, rotateX: 2.5, scale: 0.96, autoAlpha: 0.85 },
        { yPercent: -8, z: 35, rotateX: -1.2, scale: 1, autoAlpha: 1, ease: "none", duration: 1 },
        0,
      );
    }
    if (mainMedia) {
      timeline.fromTo(
        mainMedia,
        { yPercent: 12, scale: 1.16 },
        { yPercent: -14, scale: 1.03, ease: "none", duration: 1 },
        0,
      );
    }
    if (secondary) {
      timeline.fromTo(
        secondary,
        { yPercent: 28, xPercent: -4, z: 55, rotateY: -5 },
        { yPercent: -34, xPercent: 3, z: -90, rotateY: 4, ease: "none", duration: 1 },
        0,
      );
    }
    if (secondaryMedia) {
      timeline.fromTo(secondaryMedia, { yPercent: 6, scale: 1.08 }, { yPercent: -8, scale: 1, ease: "none", duration: 1 }, 0);
    }
    if (detail) {
      timeline.fromTo(
        detail,
        { yPercent: 42, xPercent: 5, z: 110, rotateY: 7 },
        { yPercent: -48, xPercent: -4, z: -130, rotateY: -6, ease: "none", duration: 1 },
        0,
      );
    }
    if (detailMedia) {
      timeline.fromTo(detailMedia, { yPercent: 8, scale: 1.1 }, { yPercent: -10, scale: 1, ease: "none", duration: 1 }, 0);
    }
    if (copy) timeline.fromTo(copy, { y: 44 }, { y: -22, ease: "none", duration: 1 }, 0);
    if (stage) timeline.fromTo(stage, { rotateY: -1.2 }, { rotateY: 1.4, ease: "none", duration: 1 }, 0);
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      data-cinema="home-arrival"
      className="home-ivory-blue relative h-[220svh] md:h-[265svh] motion-reduce:h-auto"
    >
      <div className="sticky top-0 mx-auto grid h-[100svh] max-w-[110rem] grid-cols-1 items-center gap-6 overflow-hidden px-[5vw] pb-8 pt-20 md:grid-cols-[0.82fr_1.18fr] md:gap-10 md:py-0 lg:gap-14 lg:px-[6vw] motion-reduce:relative motion-reduce:h-auto">
        <div data-arrival-copy className="relative z-20 max-w-[36rem] will-change-transform md:pr-4">
          <div className="mb-4 flex items-center gap-4 text-[0.58rem] uppercase tracking-[0.24em] text-mist md:mb-8 lg:mb-10">
            <span>01</span>
            <span className="h-px w-10 bg-mist/40" />
            <span>Unawatuna · Sri Lanka</span>
          </div>
          <h2 className="text-[clamp(2.2rem,6.2vw,6.5rem)] font-light leading-[0.86] tracking-[-0.07em]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-arrival-line-one className="block will-change-transform">{lineOne}</span>
            </span>
            <span className="mt-1.5 block overflow-hidden pb-[0.06em] text-mist md:mt-4">
              <span data-arrival-line-two className="ml-[0.5ch] block will-change-transform">{lineTwo}</span>
            </span>
          </h2>
          <div
            data-arrival-horizon
            className="mt-4 block h-px w-full max-w-[14rem] origin-left bg-paper/20 md:mt-8"
            aria-hidden="true"
          />
          <div className="mt-4 max-w-sm border-l border-paper/18 pl-4 md:mt-10 md:pl-6">
            <p data-arrival-body className="text-xs leading-6 text-paper/72 will-change-transform md:text-[0.95rem] md:leading-7">
              {body}
            </p>
            <Link href={href} className="group mt-4 inline-flex items-center gap-4 text-[0.62rem] uppercase tracking-[0.2em] md:mt-8">
              {cta}
              <span
                className="grid size-8 place-items-center rounded-full border border-paper/22 transition-colors group-hover:bg-paper group-hover:text-canvas md:size-9"
                aria-hidden="true"
              >
                ↗
              </span>
            </Link>
          </div>
        </div>

        <div
          data-arrival-stage
          className="relative h-[40svh] w-full [perspective:1400px] [transform-style:preserve-3d] md:h-[78svh]"
        >
          <figure
            data-arrival-main-frame
            className="absolute inset-x-[4%] inset-y-[4%] overflow-hidden rounded-[1.25rem] border border-paper/[0.06] bg-elevated shadow-[0_28px_90px_rgb(8_43_45_/_0.12)] will-change-transform md:inset-y-[6%]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div data-arrival-main-media className="absolute inset-[-10%] will-change-transform">
              <Image src={plateUrl} alt={plateAlt} fill className="object-cover" sizes="(min-width: 768px) 48vw, 90vw" priority />
            </div>
          </figure>

          <figure
            data-arrival-secondary
            className="absolute bottom-[2%] left-0 z-20 aspect-[3/4] w-[24%] overflow-hidden rounded-[0.75rem] border-[0.35rem] border-canvas shadow-[0_22px_65px_rgb(8_43_45_/_0.18)] will-change-transform md:bottom-[4%] md:w-[26%] md:rounded-[0.85rem] md:border-[0.5rem]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div data-arrival-secondary-media className="absolute inset-[-6%] will-change-transform">
              <Image src={secondaryUrl} alt="" fill className="object-cover" sizes="(min-width: 768px) 16vw, 28vw" />
            </div>
          </figure>

          <figure
            data-arrival-detail
            className="absolute bottom-[6%] right-0 z-30 aspect-square w-[19%] overflow-hidden rounded-[0.75rem] border-[0.35rem] border-canvas shadow-[0_22px_65px_rgb(8_43_45_/_0.18)] will-change-transform md:right-[-1%] md:w-[20%] md:rounded-[0.85rem] md:border-[0.5rem]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div data-arrival-detail-media className="absolute inset-[-8%] will-change-transform">
              <Image src={detailUrl} alt="" fill className="object-cover" sizes="(min-width: 768px) 12vw, 24vw" />
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
