"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { DESKTOP_MOTION } from "@/components/site/motion/home/constants";

export type DepthLayer = {
  key: string;
  image: string;
  alt: string;
  label: string;
  value: string;
  preview?: boolean;
};

export function DepthStage({
  layers,
  previewLabel,
}: {
  layers: DepthLayer[];
  previewLabel?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const shown = layers.slice(0, 3);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section || shown.length === 0) return;

    const stage = section.querySelector<HTMLElement>("[data-depth-stage]");
    const frames = gsap.utils.toArray<HTMLElement>("[data-depth-frame]", stage ?? section);
    const captions = gsap.utils.toArray<HTMLElement>("[data-depth-caption]", stage ?? section);
    const progress = section.querySelector<HTMLElement>("[data-depth-progress]");
    if (!stage || frames.length === 0) return;

    const hold = 0.72;
    const swap = 0.28;
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=240%",
        pin: true,
        scrub: 0.85,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    frames.forEach((frame, index) => {
      const start = index * (hold + swap);
      const media = frame.querySelector<HTMLElement>("[data-depth-media]");
      const caption = captions[index];

      if (index === 0) {
        gsap.set(frame, { autoAlpha: 1, yPercent: 0, scale: 1 });
      }

      if (index > 0) {
        timeline.fromTo(
          frame,
          { yPercent: 16, scale: 0.94, autoAlpha: 0 },
          { yPercent: 0, scale: 1, autoAlpha: 1, duration: swap, ease: "power2.out" },
          start,
        );
      }

      if (media) {
        timeline.fromTo(
          media,
          { scale: 1.18, yPercent: -8 },
          { scale: 1.02, yPercent: 8, duration: hold, ease: "none" },
          start,
        );
      }

      if (caption && index > 0) {
        timeline.fromTo(
          caption,
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 1, y: 0, duration: swap, ease: "power2.out" },
          start,
        );
      }

      if (index < frames.length - 1) {
        timeline.to(
          frame,
          { yPercent: -12, scale: 0.96, autoAlpha: 0, duration: swap, ease: "power2.in" },
          start + hold,
        );
        if (caption) {
          timeline.to(caption, { autoAlpha: 0, y: -28, duration: swap, ease: "power2.in" }, start + hold);
        }
      }
    });

    if (progress) {
      gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });
      timeline.to(progress, { scaleX: 1, ease: "none", duration: timeline.duration() }, 0);
    }

    timeline.eventCallback("onUpdate", () => {
      const index = Math.min(frames.length - 1, Math.floor(timeline.progress() * frames.length));
      captions.forEach((caption, captionIndex) => {
        caption.setAttribute("aria-hidden", captionIndex === index ? "false" : "true");
      });
    });
  }, [shown.length]);

  const setupDrift = useCallback((gsap: typeof import("gsap").default) => {
    const cards = gsap.utils.toArray<HTMLElement>("[data-depth-card]", root.current);
    cards.forEach((card) => {
      const media = card.querySelector<HTMLElement>("[data-depth-media]");
      if (!media) return;
      gsap.fromTo(
        media,
        { yPercent: -6, scale: 1.08 },
        {
          yPercent: 6,
          scale: 1.08,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
  }, []);

  useCinematic(root, setup, DESKTOP_MOTION);
  useCinematic(root, setupDrift, "(prefers-reduced-motion: no-preference) and (max-width: 767px)");

  if (shown.length === 0) return null;

  return (
    <section ref={root} data-cinema="home-depth" className="relative bg-ivory text-mocha">
      <div
        data-depth-stage
        className="relative hidden h-[100svh] overflow-hidden md:block motion-reduce:!hidden"
      >
        <div className="mx-auto grid h-full w-[91.5vw] max-w-[96rem] grid-cols-[minmax(16rem,0.78fr)_minmax(0,1.22fr)] items-center gap-10 lg:gap-16">
          <div className="relative z-20 max-w-xl">
            <div className="relative min-h-[12rem]">
              {shown.map((layer, index) => (
                <div
                  key={`cap-${layer.key}`}
                  data-depth-caption
                  aria-hidden={index === 0 ? undefined : true}
                  className={index === 0 ? "relative" : "absolute inset-x-0 top-0 opacity-0"}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.22rem] text-walnut">
                    {String(index + 1).padStart(2, "0")} · {layer.value}
                  </p>
                  <h2 className="mt-5 text-[clamp(3.2rem,5vw,5.4rem)] font-medium leading-[0.9] tracking-[-0.06em]">
                    {layer.label}
                  </h2>
                </div>
              ))}
            </div>
            <div className="mt-10 h-px w-36 overflow-hidden bg-mocha/15">
              <div data-depth-progress className="h-px w-full origin-left scale-x-0 bg-mocha" />
            </div>
          </div>

          <div className="relative h-[78vh] min-h-[28rem]">
            {shown.map((layer, index) => (
              <figure
                key={layer.key}
                data-depth-frame
                className={`absolute inset-0 overflow-hidden rounded-[1.75rem] bg-greige shadow-[0_28px_70px_-28px_rgb(8_43_45_/_0.4)] ${index === 0 ? "" : "opacity-0"}`}
              >
                <div data-depth-media className="absolute inset-0 will-change-transform">
                  <Image
                    src={layer.image}
                    alt={layer.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 58vw, 92vw"
                  />
                </div>
                {layer.preview && previewLabel ? (
                  <figcaption className="absolute left-5 top-5 rounded-full bg-ivory/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12rem] text-mocha/75">
                    {previewLabel}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-[91.5vw] max-w-[96rem] gap-20 py-20 md:hidden motion-reduce:md:!grid motion-reduce:md:py-28">
        {shown.map((layer, index) => (
          <article key={`flow-${layer.key}`} data-depth-card className="grid items-end gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className={index % 2 === 1 ? "lg:order-2" : ""}>
              <p className="text-xs font-medium uppercase tracking-[0.2rem] text-walnut">
                {String(index + 1).padStart(2, "0")} · {layer.value}
              </p>
              <h2 className="mt-3 text-4xl font-medium leading-[0.92] tracking-[-0.05em] sm:text-6xl">{layer.label}</h2>
            </div>
            <div className={`relative aspect-[16/10] overflow-hidden rounded-[1.6rem] bg-greige ${index % 2 === 1 ? "lg:order-1" : ""}`}>
              <div data-depth-media className="absolute inset-0 will-change-transform">
                <Image src={layer.image} alt={layer.alt} fill className="object-cover" sizes="(min-width: 1024px) 56vw, 92vw" />
              </div>
              {layer.preview && previewLabel ? (
                <p className="absolute left-4 top-4 rounded-full bg-ivory/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12rem] text-mocha/75">
                  {previewLabel}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
