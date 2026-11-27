"use client";

import { useCallback, useId, useRef, useState } from "react";
import { ReviewsBody, ReviewsSceneLabel } from "@/components/site/reviews/reviews-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

export function ReviewsTransparencyFaq({
  scene,
  question,
  answer,
  questionsEyebrow,
  transparencyHeading,
  transparencyNote,
}: {
  scene: string;
  question: string;
  answer: string;
  questionsEyebrow: string;
  transparencyHeading: string;
  transparencyNote: string;
}) {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(true);
  const answerId = useId();

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    gsap.fromTo(
      section.querySelector("[data-reviews-faq-copy]"),
      { y: 28, autoAlpha: 0.3 },
      {
        y: 0,
        autoAlpha: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 85%", end: "top 45%", scrub: 0.5 },
      },
    );
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      id="reviews-faq"
      data-cinema="reviews-faq"
      className="border-t border-line bg-canvas px-[5vw] py-20 md:px-[7vw] md:py-28"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <ReviewsSceneLabel className="text-signal">{scene}</ReviewsSceneLabel>
          <p className="mt-3 text-[0.58rem] uppercase tracking-[0.24em] text-mist">{questionsEyebrow}</p>
          <h2 className="mt-4 text-[clamp(2rem,3.4vw,3rem)] font-light leading-[1] tracking-[-0.045em] text-paper">
            {transparencyHeading}
          </h2>
          <ReviewsBody className="mt-4 md:mt-5">{transparencyNote}</ReviewsBody>
        </div>

        <div data-reviews-faq-copy className="rounded-[20px] border border-line bg-surface p-6 shadow-[0_20px_60px_rgb(8_43_45_/_0.06)] md:p-9">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 text-left"
            aria-expanded={open}
            aria-controls={answerId}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="text-lg font-light leading-7 tracking-[-0.03em] text-paper md:leading-8">{question}</span>
            <span
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-line bg-canvas text-xs text-signal"
              aria-hidden="true"
            >
              {open ? "−" : "+"}
            </span>
          </button>
          <div id={answerId} className={`mt-5 overflow-hidden transition-[max-height] duration-500 ${open ? "max-h-96" : "max-h-0"}`}>
            <ReviewsBody>{answer}</ReviewsBody>
          </div>
        </div>
      </div>
    </section>
  );
}
