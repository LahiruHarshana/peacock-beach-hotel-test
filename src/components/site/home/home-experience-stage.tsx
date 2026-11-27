"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useRef } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";
import type { HomeExperienceLayer } from "@/components/site/home/types";

const scroller = () => document.documentElement;

const BEAT = 1;
const HOLD = 0.65;
const HANDOFF = 0.35;

type FramePose = { xPercent: number; yPercent: number; scale: number; zIndex: number };

/** Which photograph is forward: three layouts × three frames. */
const POSES: FramePose[][] = [
  [
    { xPercent: 0, yPercent: 0, scale: 1, zIndex: 30 },
    { xPercent: 48, yPercent: -22, scale: 0.52, zIndex: 20 },
    { xPercent: -6, yPercent: 34, scale: 0.52, zIndex: 12 },
  ],
  [
    { xPercent: -14, yPercent: 30, scale: 0.5, zIndex: 10 },
    { xPercent: 0, yPercent: 0, scale: 1, zIndex: 30 },
    { xPercent: 46, yPercent: -18, scale: 0.52, zIndex: 20 },
  ],
  [
    { xPercent: 44, yPercent: -16, scale: 0.5, zIndex: 14 },
    { xPercent: -10, yPercent: 28, scale: 0.5, zIndex: 10 },
    { xPercent: 0, yPercent: 0, scale: 1, zIndex: 30 },
  ],
];

function poseToTransform(pose: FramePose) {
  return {
    xPercent: -50 + pose.xPercent,
    yPercent: -50 + pose.yPercent,
    scale: pose.scale,
    zIndex: pose.zIndex,
  };
}

function applyFramePose(gsap: typeof import("gsap").default, frame: HTMLElement, pose: FramePose) {
  gsap.set(frame, { ...poseToTransform(pose), transformOrigin: "center center" });
}

export function HomeExperienceStage({ tag, layers }: { tag: string; layers: HomeExperienceLayer[] }) {
  const root = useRef<HTMLElement>(null);
  const shown = useMemo(() => layers.slice(0, 3), [layers]);

  const setup = useCallback(
    (gsap: typeof import("gsap").default) => {
      const section = root.current;
      if (!section || shown.length === 0) return;

      const frames = gsap.utils.toArray<HTMLElement>("[data-triptych-frame]", section);
      const captions = gsap.utils.toArray<HTMLElement>("[data-world-caption]", section);
      const numbers = gsap.utils.toArray<HTMLElement>("[data-world-number]", section);
      const progress = section.querySelector<HTMLElement>("[data-world-progress]");
      if (frames.length !== 3) return;

      frames.forEach((frame, index) => applyFramePose(gsap, frame, POSES[0]![index]!));
      captions.forEach((caption, index) => {
        gsap.set(caption, { autoAlpha: index === 0 ? 1 : 0, y: 0 });
        const line = caption.querySelector<HTMLElement>("[data-world-title-line]");
        if (line) gsap.set(line, { yPercent: index === 0 ? 0 : 22 });
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          scroller: scroller(),
          start: "top top",
          end: "bottom bottom",
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
      });

      const states = POSES.length;
      for (let state = 0; state < states; state++) {
        const start = state * BEAT;
        const lead = frames[state];
        const media = lead?.querySelector<HTMLElement>("[data-triptych-media]");
        const caption = captions[state];
        const titleLine = caption?.querySelector<HTMLElement>("[data-world-title-line]");

        if (media) {
          timeline.fromTo(media, { scale: 1.04 }, { scale: 1, ease: "none", duration: HOLD }, start);
        }

        if (state === 0 && titleLine) {
          timeline.fromTo(titleLine, { yPercent: 22 }, { yPercent: 0, ease: "sine.out", duration: 0.34 }, start + 0.06);
        }

        if (state < states - 1) {
          const at = start + HOLD;
          const nextPoses = POSES[state + 1]!;
          frames.forEach((frame, index) => {
            const pose = nextPoses[index]!;
            timeline.to(frame, { ...poseToTransform(pose), ease: "power1.inOut", duration: HANDOFF }, at);
          });

          const prevCaption = captions[state];
          const nextCaption = captions[state + 1];
          const nextLine = nextCaption?.querySelector<HTMLElement>("[data-world-title-line]");
          if (prevCaption) timeline.to(prevCaption, { autoAlpha: 0, y: -12, ease: "power1.in", duration: 0.22 }, at);
          if (nextCaption) timeline.to(nextCaption, { autoAlpha: 1, y: 0, ease: "power1.out", duration: 0.28 }, at + 0.12);
          if (nextLine) timeline.fromTo(nextLine, { yPercent: 22 }, { yPercent: 0, ease: "sine.out", duration: 0.34 }, at + 0.16);
        }
      }

      if (progress) {
        gsap.set(progress, { scaleY: 0, transformOrigin: "top center" });
        timeline.to(progress, { scaleY: 1, duration: timeline.duration(), ease: "none" }, 0);
      }

      timeline.eventCallback("onUpdate", () => {
        const active = Math.min(frames.length - 1, Math.floor(timeline.progress() * frames.length));
        captions.forEach((caption, index) => caption.setAttribute("aria-hidden", index === active ? "false" : "true"));
        numbers.forEach((number, index) => number.toggleAttribute("data-active", index === active));
      });
    },
    [shown],
  );

  useCinematic(root, setup, MOTION);

  if (shown.length === 0) return null;

  return (
    <section
      ref={root}
      data-cinema="home-worlds"
      className="home-ivory-blue relative h-[240svh] md:h-[280svh] motion-reduce:h-auto"
    >
      <div className="hidden space-y-14 px-[5vw] py-16 motion-reduce:block">
        {shown.map((layer) => (
          <article key={layer.key} className="mx-auto max-w-lg space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl border-[0.35rem] border-canvas shadow-[0_20px_60px_rgb(8_43_45_/_0.14)]">
              <Image src={layer.image} alt={layer.alt} fill className="object-cover" sizes="(max-width: 768px) 90vw, 28rem" />
            </div>
            <p className="text-[0.58rem] uppercase tracking-[0.24em] text-paper/60">
              {layer.index} · {layer.label}
            </p>
            <h2 className="max-w-[12ch] text-3xl font-light tracking-[-0.06em] text-paper">{layer.title}</h2>
            <Link href={layer.href} className="text-[0.62rem] uppercase tracking-[0.2em] text-paper">
              {layer.cta} ↗
            </Link>
          </article>
        ))}
      </div>

      <div className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:hidden">
        <div className="mx-auto grid h-full max-w-[110rem] grid-cols-1 items-center gap-6 px-[5vw] pb-8 pt-20 md:py-[8svh] lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:px-[6vw]">
          <div className="relative z-10 flex flex-col justify-between text-paper md:min-h-[22rem]">
            <div className="flex items-start justify-between gap-6">
              <p className="text-[0.58rem] uppercase tracking-[0.26em] text-paper/60">02 · {tag}</p>
              <div className="flex gap-4 text-[0.58rem] tracking-[0.2em] text-paper/45" aria-hidden="true">
                {shown.map((layer, index) => (
                  <span
                    key={layer.key}
                    data-world-number
                    data-active={index === 0 ? "" : undefined}
                    className="transition-colors data-[active]:text-paper"
                  >
                    {layer.index}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mt-4 min-h-[8rem] flex-1 md:mt-10 md:min-h-[14rem] lg:mt-0">
              {shown.map((layer, index) => (
                <div
                  key={layer.key}
                  data-world-caption
                  aria-hidden={index === 0 ? undefined : true}
                  className={index === 0 ? "relative" : "pointer-events-none absolute inset-0"}
                >
                  <p className="text-[0.58rem] uppercase tracking-[0.24em] text-mist">{layer.label}</p>
                  <h2 className="-mb-[0.14em] mt-2 max-w-[11ch] overflow-hidden pb-[0.14em] text-[clamp(2rem,5vw,5.5rem)] font-light leading-[0.86] tracking-[-0.06em]">
                    <span data-world-title-line className="block will-change-transform">
                      {layer.title}
                    </span>
                  </h2>
                  <Link
                    href={layer.href}
                    className="pointer-events-auto group mt-4 inline-flex items-center gap-4 text-[0.62rem] uppercase tracking-[0.2em] md:mt-8"
                  >
                    {layer.cta}
                    <span
                      className="grid size-8 place-items-center rounded-full border border-paper/20 transition-colors group-hover:bg-paper group-hover:text-canvas md:size-10"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </Link>
                </div>
              ))}
            </div>

            <div className="hidden h-28 w-px self-end bg-paper/15 lg:block">
              <div data-world-progress className="h-full w-px origin-top scale-y-0 bg-paper" />
            </div>
          </div>

          <div
            data-triptych-gallery
            className="relative mx-auto h-[44svh] w-full max-w-[52rem] will-change-transform md:h-[min(72vh,40rem)]"
          >
            {shown.map((layer, index) => (
              <figure
                key={layer.key}
                data-triptych-frame
                data-frame-index={index}
                className="absolute left-1/2 top-1/2 h-[36svh] w-[52vw] overflow-hidden rounded-[1.1rem] border-[0.35rem] border-canvas bg-elevated shadow-[0_28px_90px_rgb(8_43_45_/_0.16)] will-change-transform md:h-[min(68vh,36rem)] md:w-[min(46vw,26rem)] md:border-[0.45rem]"
                style={{ zIndex: index === 0 ? 30 : 12 - index }}
              >
                <div data-triptych-media className="relative h-full w-full will-change-transform">
                  <Image src={layer.image} alt={layer.alt} fill className="object-cover" sizes="(min-width: 1024px) 26rem, 52vw" />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
