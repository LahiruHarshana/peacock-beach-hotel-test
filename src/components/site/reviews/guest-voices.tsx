"use client";

import { forwardRef, useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ReviewsBody, ReviewsPrimaryCta, ReviewsSceneLabel } from "@/components/site/reviews/reviews-ui";
import type { PublicReview } from "@/components/site/reviews/types";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

const SpatialReviewGallery = forwardRef<
  HTMLDivElement,
  {
    reviews: PublicReview[];
    active: number;
    setActive: (n: number) => void;
    prevLabel: string;
    nextLabel: string;
  }
>(function SpatialReviewGallery({ reviews, active, setActive, prevLabel, nextLabel }, ref) {
  const t = useTranslations("Reviews");
  const total = reviews.length;
  const current = reviews[active];
  const prev = reviews[(active - 1 + total) % total];
  const next = reviews[(active + 1) % total];
  const go = (direction: -1 | 1) => setActive((active + direction + total) % total);

  return (
    <div ref={ref} className="mt-14">
      <div className="grid grid-cols-12 items-stretch gap-3 md:gap-6">
        <blockquote
          className="col-span-3 flex flex-col justify-between rounded-[16px] border border-line bg-canvas/70 p-3 opacity-65 md:rounded-[20px] md:p-6"
          aria-hidden="true"
        >
          <p className="line-clamp-5 text-xs leading-relaxed text-mist md:text-sm md:leading-6">&ldquo;{prev.text}&rdquo;</p>
          <p className="mt-3 text-[0.48rem] uppercase tracking-[0.2em] text-mist md:mt-4 md:text-[0.54rem]">{prev.authorDisplayName}</p>
        </blockquote>

        <blockquote
          data-reviews-active-panel
          className="col-span-6 rounded-[16px] border border-line bg-canvas p-4 shadow-[0_24px_72px_rgb(8_43_45_/_0.08)] md:rounded-[20px] md:p-10"
        >
          <p className="text-[clamp(1rem,2.2vw,1.9rem)] font-light leading-[1.35] tracking-[-0.025em] text-paper">
            &ldquo;{current.text}&rdquo;
          </p>
          <footer className="mt-5 flex flex-wrap gap-3 text-[0.54rem] uppercase tracking-[0.2em] text-signal md:mt-8 md:gap-4 md:text-[0.6rem]">
            <span>{current.authorDisplayName}</span>
            {current.ratingLabel ? <span>· {current.ratingLabel}</span> : null}
          </footer>
        </blockquote>

        <blockquote
          className="col-span-3 flex flex-col justify-between rounded-[16px] border border-line bg-canvas/70 p-3 opacity-65 md:rounded-[20px] md:p-6"
          aria-hidden="true"
        >
          <p className="line-clamp-5 text-xs leading-relaxed text-mist md:text-sm md:leading-6">&ldquo;{next.text}&rdquo;</p>
          <p className="mt-3 text-[0.48rem] uppercase tracking-[0.2em] text-mist md:mt-4 md:text-[0.54rem]">{next.authorDisplayName}</p>
        </blockquote>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[0.56rem] uppercase tracking-[0.24em] text-mist">
          {t("reviewPosition", { current: active + 1, total })}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-paper/20 text-sm text-paper transition-colors hover:bg-paper hover:text-canvas"
            onClick={() => go(-1)}
            aria-label={prevLabel}
          >
            ←
          </button>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-paper/20 text-sm text-paper transition-colors hover:bg-paper hover:text-canvas"
            onClick={() => go(1)}
            aria-label={nextLabel}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
});

export function GuestVoices({
  scene,
  kicker,
  title,
  sideNote,
  emptyPrimary,
  emptySecondary,
  shareCta,
  submitHref,
  reviews,
  prevLabel,
  nextLabel,
}: {
  scene: string;
  kicker: string;
  title: string;
  sideNote: string;
  emptyPrimary: string;
  emptySecondary: string;
  shareCta: string;
  submitHref: string;
  reviews: PublicReview[];
  prevLabel: string;
  nextLabel: string;
}) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const count = reviews.length;
  const safeIndex = count > 0 ? Math.min(active, Math.min(count, 12) - 1) : 0;
  const current = reviews[safeIndex];

  const setupGallery = useCallback((gsap: typeof import("gsap").default) => {
    const wrap = galleryRef.current;
    if (!wrap || count < 2) return;
    const panel = wrap.querySelector<HTMLElement>("[data-reviews-active-panel]");
    if (!panel) return;
    gsap.fromTo(
      panel,
      { y: 28, autoAlpha: 0.3 },
      {
        y: 0,
        autoAlpha: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: wrap, start: "top 85%", end: "top 45%", scrub: 0.5 },
      },
    );
  }, [count]);

  useCinematic(galleryRef, setupGallery, MOTION);

  return (
    <section
      ref={root}
      id="guest-voices"
      data-cinema="reviews-guest-voices"
      className="border-t border-line bg-surface px-[5vw] py-20 text-paper md:px-[7vw] md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 border-b border-line pb-10 md:grid-cols-2 md:items-end">
          <div>
            <ReviewsSceneLabel className="text-signal">{scene}</ReviewsSceneLabel>
            <p className="mt-3 text-[0.58rem] uppercase tracking-[0.24em] text-mist">{kicker}</p>
            <h2 className="mt-4 text-[clamp(2.3rem,4.5vw,4rem)] font-light leading-[0.95] tracking-[-0.045em] text-paper">
              {title}
            </h2>
          </div>
          <ReviewsBody>{sideNote}</ReviewsBody>
        </div>

        {count === 0 ? (
          <div className="mt-14 grid gap-10 rounded-[20px] border border-line bg-canvas p-8 md:grid-cols-[0.4fr_1.6fr] md:items-center md:p-12">
            <div aria-hidden="true" className="text-[clamp(5rem,12vw,8rem)] font-light leading-none text-signal/35">
              &ldquo;
            </div>
            <div role="status" className="space-y-4">
              <p className="text-xl font-light leading-8 text-paper">{emptyPrimary}</p>
              <ReviewsBody>{emptySecondary}</ReviewsBody>
              <div className="pt-3">
                <ReviewsPrimaryCta href={submitHref}>{shareCta}</ReviewsPrimaryCta>
              </div>
            </div>
          </div>
        ) : null}

        {count === 1 && current ? (
          <blockquote className="mt-14 rounded-[20px] border border-line bg-canvas p-8 md:p-12">
            <p className="text-[clamp(1.6rem,3.4vw,2.8rem)] font-light leading-[1.25] tracking-[-0.03em] text-paper">
              &ldquo;{current.text}&rdquo;
            </p>
            <footer className="mt-8 flex flex-wrap gap-4 text-[0.62rem] uppercase tracking-[0.2em] text-signal">
              <span>{current.authorDisplayName}</span>
              {current.ratingLabel ? <span>· {current.ratingLabel}</span> : null}
            </footer>
          </blockquote>
        ) : null}

        {count >= 2 ? (
          <SpatialReviewGallery
            ref={galleryRef}
            reviews={reviews.slice(0, Math.min(reviews.length, 12))}
            active={safeIndex}
            setActive={setActive}
            prevLabel={prevLabel}
            nextLabel={nextLabel}
          />
        ) : null}

        {count > 12 ? (
          <ul className="mt-14 grid gap-6 border-t border-line pt-10 md:grid-cols-2">
            {reviews.slice(12).map((review) => (
              <li key={review.id} className="rounded-[16px] border border-line bg-canvas p-6">
                <p className="text-base font-light leading-7 text-paper">&ldquo;{review.text}&rdquo;</p>
                <p className="mt-4 text-[0.6rem] uppercase tracking-[0.18em] text-signal">
                  {review.authorDisplayName}
                  {review.ratingLabel ? ` · ${review.ratingLabel}` : ""}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
