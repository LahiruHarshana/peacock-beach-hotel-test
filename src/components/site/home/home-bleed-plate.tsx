"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

const scroller = () => document.documentElement;

export function HomeBleedPlate({ kicker, title, image, alt }: { kicker: string; title: string; image: string; alt: string }) {
  const root = useRef<HTMLElement>(null);
  const titleParts = useMemo(() => title.split(/\s+/).filter(Boolean), [title]);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;

    const matte = section.querySelector<HTMLElement>("[data-dining-matte]");
    const frame = section.querySelector<HTMLElement>("[data-dining-frame]");
    const media = section.querySelector<HTMLElement>("[data-dining-media]");
    const scrim = section.querySelector<HTMLElement>("[data-dining-scrim]");
    const panel = section.querySelector<HTMLElement>("[data-dining-panel]");
    const lines = gsap.utils.toArray<HTMLElement>("[data-dining-line]", section);
    const rule = section.querySelector<HTMLElement>("[data-dining-rule]");
    const grain = section.querySelector<HTMLElement>("[data-dining-grain]");
    if (!matte || !frame || !media) return;

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

    /* Hold — framed print on ivory */
    timeline.fromTo(
      frame,
      { clipPath: "inset(10% 9% 10% 9% round 1.75rem)" },
      { clipPath: "inset(10% 9% 10% 9% round 1.75rem)", ease: "none", duration: 0.42 },
      0,
    );
    timeline.fromTo(media, { scale: 1.14, yPercent: 2.5 }, { scale: 1.06, yPercent: 0, ease: "none", duration: 0.42 }, 0);
    if (scrim) timeline.fromTo(scrim, { opacity: 0.35 }, { opacity: 0.45, ease: "none", duration: 0.42 }, 0);
    if (panel) timeline.fromTo(panel, { autoAlpha: 0, y: 48, x: -24 }, { autoAlpha: 0, y: 48, x: -24, duration: 0.42 }, 0);
    lines.forEach((line) => gsap.set(line, { yPercent: 108 }));

    /* Open — matte breathes to full bleed */
    timeline.to(
      frame,
      { clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "power1.inOut", duration: 0.38 },
      0.42,
    );
    timeline.to(media, { scale: 1, yPercent: -2.5, ease: "none", duration: 0.58 }, 0.42);
    if (scrim) timeline.to(scrim, { opacity: 0.92, ease: "power1.inOut", duration: 0.35 }, 0.48);
    if (matte) timeline.to(matte, { padding: "0rem", ease: "power1.inOut", duration: 0.38 }, 0.42);

    /* Reveal — ivory glass panel + masked title */
    if (panel) {
      timeline.to(panel, { autoAlpha: 1, y: 0, x: 0, ease: "power1.out", duration: 0.32 }, 0.58);
    }
    lines.forEach((line, index) => {
      timeline.to(line, { yPercent: 0, ease: "sine.out", duration: 0.34 }, 0.62 + index * 0.08);
    });
    if (rule) timeline.fromTo(rule, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, ease: "power1.inOut", duration: 0.4 }, 0.7);

    /* Exit — calm drift before next scene */
    timeline.to(media, { scale: 1.03, yPercent: -5, ease: "none", duration: 0.22 }, 0.78);
    if (panel) timeline.to(panel, { y: -16, ease: "none", duration: 0.22 }, 0.78);
    if (grain) timeline.fromTo(grain, { opacity: 0.25 }, { opacity: 0.45, ease: "none", duration: 0.22 }, 0.78);
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      data-cinema="home-dining"
      className="home-ivory-blue relative h-[240svh] md:h-[300svh] motion-reduce:h-auto motion-reduce:min-h-[100svh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:relative motion-reduce:h-auto motion-reduce:min-h-[100svh]">
        <div
          data-dining-grain
          className="pointer-events-none absolute inset-0 opacity-[0.28] mix-blend-multiply"
          style={{
            backgroundImage:
              "linear-gradient(180deg, var(--canvas) 0%, var(--elevated) 52%, var(--canvas) 100%)",
          }}
          aria-hidden="true"
        />

        <div data-dining-matte className="absolute inset-0 p-[7vw] will-change-[padding] motion-reduce:p-0">
          <div
            data-dining-frame
            className="relative h-full w-full overflow-hidden shadow-[0_32px_100px_rgb(8_43_45_/_0.18)] will-change-[clip-path] motion-reduce:shadow-none"
            style={{ clipPath: "inset(10% 9% 10% 9% round 1.75rem)" }}
          >
            <div data-dining-media className="absolute inset-0 will-change-transform">
              <Image src={image} alt={alt} fill className="object-cover" sizes="100vw" priority={false} />
            </div>
            <div data-dining-scrim className="home-dining-scrim-calm absolute inset-0 opacity-[0.4]" aria-hidden="true" />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between px-[5vw] py-[8svh] md:px-[7vw] md:py-[9svh]">
          <p className="text-[0.58rem] uppercase tracking-[0.24em] text-paper/55">03 · {kicker}</p>
          <p className="hidden text-[0.58rem] uppercase tracking-[0.24em] text-paper/45 md:block">Unawatuna · Sri Lanka</p>
        </div>

        <div className="absolute inset-x-[5vw] bottom-[8svh] z-20 md:inset-x-auto md:bottom-auto md:left-[7vw] md:top-1/2 md:max-w-[min(34rem,42vw)] md:-translate-y-[12%]">
          <div
            data-dining-panel
            className="home-dining-glass pointer-events-auto rounded-[1.25rem] px-6 py-7 backdrop-blur-md md:rounded-[1.5rem] md:px-10 md:py-9"
          >
            <p className="text-[0.58rem] uppercase tracking-[0.24em] text-mist">{kicker} · Indian Ocean</p>
            <h2 className="mt-4 overflow-hidden text-paper">
              {titleParts.map((word, index) => (
                <span key={`${word}-${index}`} className="block overflow-hidden">
                  <span
                    data-dining-line
                    className="block text-[clamp(2.4rem,7.5vw,5.5rem)] font-light leading-[0.86] tracking-[-0.07em] will-change-transform"
                  >
                    {word}
                  </span>
                </span>
              ))}
            </h2>
            <div
              data-dining-rule
              className="mt-7 h-px w-24 origin-left bg-paper/25 motion-reduce:scale-x-100"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
