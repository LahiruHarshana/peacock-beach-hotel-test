"use client";

import { useCallback, useRef } from "react";
import { REVIEWS_SCRUB } from "@/components/site/reviews/reviews-motion.config";
import { ReviewsBody, ReviewsSceneLabel } from "@/components/site/reviews/reviews-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

export function ReviewsProcessScene({
  scene,
  title,
  body,
  steps,
}: {
  scene: string;
  title: string;
  body: string;
  steps: { index: string; text: string }[];
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const cards = gsap.utils.toArray<HTMLElement>("[data-reviews-step]", section);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        scroller: document.documentElement,
        start: "top 82%",
        end: "top 30%",
        scrub: REVIEWS_SCRUB.process,
      },
    });
    cards.forEach((card, i) => {
      tl.fromTo(card, { y: 32, autoAlpha: 0.25 }, { y: 0, autoAlpha: 1, ease: "power2.out", duration: 0.45 }, i * 0.08);
    });
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      data-cinema="reviews-process"
      className="border-t border-line bg-canvas px-[5vw] py-20 md:px-[7vw] md:py-28"
    >
      <div className="flex flex-col gap-4 pb-8 md:grid md:grid-cols-12 md:items-end md:gap-10 md:pb-14">
        <div className="w-full md:col-span-5">
          <ReviewsSceneLabel className="text-signal">{scene}</ReviewsSceneLabel>
          <h2 className="mt-3 text-[clamp(2rem,4vw,3.8rem)] font-light leading-[0.95] tracking-[-0.045em] text-paper md:mt-4">
            {title}
          </h2>
        </div>
        <div className="w-full md:col-span-6 md:col-start-7">
          <ReviewsBody className="text-sm leading-relaxed md:text-base">{body}</ReviewsBody>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3 md:gap-6">
        {steps.map((step) => (
          <article
            key={step.index}
            data-reviews-step
            className="flex items-start gap-4 rounded-[18px] border border-line bg-surface p-5 shadow-[0_20px_60px_rgb(8_43_45_/_0.06)] will-change-transform md:block md:rounded-[20px] md:p-8"
          >
            <p className="shrink-0 text-2xl font-light leading-none tracking-[-0.05em] text-signal md:text-[clamp(1.8rem,4.5vw,3.8rem)]">
              {step.index}
            </p>
            <p className="text-sm leading-relaxed text-mist md:mt-6 md:text-sm md:leading-7">{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
