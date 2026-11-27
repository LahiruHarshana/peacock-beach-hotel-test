"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { ReviewSubmitForm } from "@/components/site/review-submit-form";
import { ReviewsBody, ReviewsDisplayLine, ReviewsSceneLabel } from "@/components/site/reviews/reviews-ui";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

export function ReviewSubmissionSection({
  scene,
  submitTitle,
  submitLede,
  image,
  alt,
  locale,
}: {
  scene: string;
  submitTitle: string;
  submitLede: string;
  image: string;
  alt: string;
  locale: "en" | "ru";
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const mask = section.querySelector<HTMLElement>("[data-reviews-submit-photo]");
    const media = section.querySelector<HTMLElement>("[data-reviews-submit-media]");
    const copy = section.querySelector<HTMLElement>("[data-reviews-submit-copy]");
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top 82%", end: "top 30%", scrub: 0.75 },
    });
    if (mask) {
      tl.fromTo(mask, { clipPath: "inset(10% 8% 10% 8% round 20px)" }, { clipPath: "inset(0% 0% 0% 0% round 20px)", ease: "power2.out", duration: 0.6 }, 0);
    }
    if (media) tl.fromTo(media, { scale: 1.12 }, { scale: 1, ease: "none", duration: 0.8 }, 0);
    if (copy) tl.fromTo(copy, { y: 28, autoAlpha: 0.3 }, { y: 0, autoAlpha: 1, ease: "power3.out", duration: 0.45 }, 0.05);
  }, []);

  useCinematic(root, setup, MOTION);

  return (
    <section
      ref={root}
      id="submit-review"
      data-cinema="reviews-submit"
      className="border-t border-line bg-surface px-[5vw] py-20 md:px-[7vw] md:py-28"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
        <div className="min-w-0">
          <ReviewsSceneLabel className="text-signal">{scene}</ReviewsSceneLabel>
          <div data-reviews-submit-copy className="mt-4">
            <h2 className="text-[clamp(2.2rem,3.8vw,3.4rem)] font-light leading-[0.95] tracking-[-0.045em] text-paper">
              <ReviewsDisplayLine>{submitTitle}</ReviewsDisplayLine>
            </h2>
            <ReviewsBody className="mt-4 md:mt-5">{submitLede}</ReviewsBody>
          </div>
          <div
            data-reviews-submit-photo
            className="relative mt-7 aspect-[4/3] w-full overflow-hidden rounded-[20px] shadow-[0_24px_72px_rgb(8_43_45_/_0.12)] will-change-[clip-path] md:mt-9 md:max-w-md"
          >
            <div data-reviews-submit-media className="relative h-full w-full will-change-transform">
              <Image src={image} alt={alt} fill className="object-cover" sizes="(min-width:1024px) 40vw, 100vw" />
            </div>
          </div>
        </div>
        <div className="reviews-submit-form-wrap min-w-0 w-full rounded-[20px] border border-line bg-canvas p-5 shadow-[0_20px_60px_rgb(8_43_45_/_0.06)] md:p-8 lg:mt-8">
          <ReviewSubmitForm locale={locale} showHeading={false} variant="experience" />
        </div>
      </div>
    </section>
  );
}
