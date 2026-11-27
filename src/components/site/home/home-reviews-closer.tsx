"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";
import type { HomeReview } from "@/components/site/home/types";

const scroller = () => document.documentElement;

export function HomeReviewsCloser({
  reviewsTitle,
  reviewsHref,
  reviewsLabel,
  emptyReviews,
  reviews,
  enquireTitle,
  address,
  disclaimer,
  contactHref,
  contactLabel,
  whatsappHref,
  whatsappLabel,
  telegramHref,
  telegramLabel,
  plateUrl,
  plateAlt,
}: {
  reviewsTitle: string;
  reviewsHref: string;
  reviewsLabel: string;
  emptyReviews: string;
  reviews: HomeReview[];
  enquireTitle: string;
  address: string;
  disclaimer: string;
  contactHref: string;
  contactLabel: string;
  whatsappHref: string | null;
  whatsappLabel: string;
  telegramHref: string | null;
  telegramLabel: string;
  plateUrl: string;
  plateAlt: string;
}) {
  const root = useRef<HTMLElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const section = root.current;
    if (!section) return;
    const media = section.querySelector<HTMLElement>("[data-close-media]");
    const copy = section.querySelector<HTMLElement>("[data-close-copy]");
    if (media) {
      gsap.fromTo(
        media,
        { scale: 1.14, yPercent: -6 },
        {
          scale: 1.02,
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: section.querySelector("[data-close-scene]"),
            scroller: scroller(),
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );
    }
    if (copy) {
      gsap.fromTo(
        copy,
        { y: 70 },
        {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: section.querySelector("[data-close-scene]"),
            scroller: scroller(),
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );
    }
  }, []);

  useCinematic(root, setup, MOTION);

  const featured = reviews[0];
  const more = reviews.slice(1);

  return (
    <section ref={root} data-reviews-closer className="home-ivory-blue">
      <div className="mx-auto max-w-[110rem] px-[5vw] py-28 md:py-[14svh]">
        <div className="flex items-center justify-between text-[0.58rem] uppercase tracking-[0.24em] text-paper/55">
          <p>05 · {reviewsTitle}</p>
          <Link href={reviewsHref} className="transition-colors hover:text-paper">{reviewsLabel} ↗</Link>
        </div>

        {featured ? (
          <div className="mt-16 grid gap-16 lg:grid-cols-[1.35fr_0.65fr] lg:gap-24">
            <blockquote className="relative max-w-[22ch] text-[clamp(2.6rem,5.2vw,5.7rem)] font-light leading-[0.94] tracking-[-0.06em]">
              <span className="absolute -left-2 -top-10 text-[5rem] leading-none text-paper/12 md:-left-10 md:-top-12 md:text-[8rem]" aria-hidden="true">“</span>
              {featured.text}
              <footer className="mt-8 text-[0.6rem] uppercase tracking-[0.22em] text-paper/55">— {featured.author}</footer>
            </blockquote>
            <ul className="space-y-10 border-t border-paper/12 pt-8 lg:mt-24">
              {more.map((review) => (
                <li key={review.id} className="border-b border-paper/12 pb-10">
                  <blockquote className="text-lg font-light leading-8 text-paper/75">“{review.text}”</blockquote>
                  <p className="mt-5 text-[0.58rem] uppercase tracking-[0.2em] text-paper/45">{review.author}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-16 border-y border-paper/12 py-16 md:py-24">
            <p className="max-w-4xl text-[clamp(2.5rem,5vw,5.5rem)] font-light leading-[0.95] tracking-[-0.06em] text-paper/80">{emptyReviews}</p>
          </div>
        )}
      </div>

      <div data-close-scene className="relative min-h-[100svh] overflow-hidden">
        <div data-close-media className="absolute inset-0 will-change-transform">
          <Image src={plateUrl} alt={plateAlt} fill className="object-cover object-center" sizes="100vw" />
        </div>
        <div className="home-scrim-ivory absolute inset-0" aria-hidden="true" />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[110rem] items-end px-[5vw] py-[10svh]">
          <div data-close-copy className="max-w-[62rem] text-paper will-change-transform">
            <p className="text-[0.58rem] uppercase tracking-[0.24em] text-paper/70">06 · {enquireTitle}</p>
            <h2 className="mt-6 max-w-[11ch] text-[clamp(3.6rem,9vw,9.5rem)] font-light leading-[0.8] tracking-[-0.075em]">{enquireTitle}</h2>

            <div className="mt-10 grid max-w-3xl gap-8 border-t border-paper/20 pt-8 md:grid-cols-[1fr_1fr]">
              <p className="text-sm leading-7 text-paper/80">{address}</p>
              <p className="text-xs leading-6 text-paper/60">{disclaimer}</p>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={contactHref} className="inline-flex items-center gap-4 bg-paper px-6 py-4 text-[0.6rem] uppercase tracking-[0.2em] text-canvas">
                {contactLabel} <span aria-hidden="true">↗</span>
              </Link>
              {whatsappHref ? <a className="border border-paper/30 px-6 py-4 text-[0.6rem] uppercase tracking-[0.2em] text-paper" href={whatsappHref}>{whatsappLabel}</a> : null}
              {telegramHref ? <a className="border border-paper/30 px-6 py-4 text-[0.6rem] uppercase tracking-[0.2em] text-paper" href={telegramHref}>{telegramLabel}</a> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
