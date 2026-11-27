"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { loadGsap, prefersReducedMotion } from "@/lib/motion/gsap-runtime";

type Review = { id: string; text: string; author: string };

type HomeFinaleProps = {
  reviewsTitle: string;
  reviewsHref: string;
  reviewsLabel: string;
  emptyReviews: string;
  reviews: Review[];
  index: string;
  enquireTitle: string;
  address: string;
  disclaimer: string;
  contactHref: string;
  contactLabel: string;
  whatsappHref: string | null;
  whatsappLabel: string;
  telegramHref: string | null;
  telegramLabel: string;
};

export function HomeFinale(props: HomeFinaleProps) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section || prefersReducedMotion()) return;
    let revert = () => {};
    let cancelled = false;
    void (async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      const context = gsap.context(() => {
        const quotes = section.querySelectorAll("[data-quote]");
        const title = section.querySelector("[data-finale-title]");
        const close = section.querySelector("[data-finale-close]");
        const rule = section.querySelector("[data-finale-rule]");
        if (quotes.length) {
          gsap.fromTo(
            quotes,
            { y: 48, clipPath: "inset(12% 0 0 0)" },
            {
              y: 0,
              clipPath: "inset(0% 0 0 0)",
              stagger: 0.12,
              ease: "none",
              scrollTrigger: { trigger: quotes[0], start: "top 85%", end: "top 40%", scrub: 0.7 },
            },
          );
        }
        if (title) {
          gsap.fromTo(
            title,
            { yPercent: 80 },
            {
              yPercent: 0,
              ease: "none",
              scrollTrigger: { trigger: title, start: "top 95%", end: "top 55%", scrub: 0.6 },
            },
          );
        }
        if (close) {
          gsap.fromTo(
            close,
            { yPercent: 70 },
            {
              yPercent: 0,
              ease: "none",
              scrollTrigger: { trigger: close, start: "top 95%", end: "top 60%", scrub: 0.6 },
            },
          );
        }
        if (rule) {
          gsap.fromTo(
            rule,
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: "left center",
              ease: "none",
              scrollTrigger: { trigger: rule, start: "top 90%", end: "top 60%", scrub: 0.5 },
            },
          );
        }
      }, section);
      revert = () => context.revert();
    })();
    return () => {
      cancelled = true;
      revert();
    };
  }, [props.reviews.length]);

  return (
    <section ref={root}>
      <div className="border-t border-line px-[5vw] py-24">
        <div className="mb-12 flex items-end justify-between gap-6">
          <h2 className="overflow-hidden text-[clamp(2.4rem,5vw,4.6rem)] leading-none font-light tracking-[-0.05em]">
            <span data-finale-title className="block">{props.reviewsTitle}</span>
          </h2>
          <Link href={props.reviewsHref} className="text-[0.68rem] uppercase tracking-[0.18em] text-mist">
            {props.reviewsLabel}
          </Link>
        </div>
        {props.reviews.length === 0 ? (
          <p className="max-w-md text-sm leading-6 text-mist" role="status">{props.emptyReviews}</p>
        ) : (
          <div className="grid gap-10 md:grid-cols-3">
            {props.reviews.map((review) => (
              <blockquote key={review.id} data-quote className="border-t border-line pt-6">
                <p className="text-xl leading-8 font-light tracking-[-0.03em]">“{review.text}”</p>
                <footer className="mt-6 text-[0.68rem] uppercase tracking-[0.16em] text-mist">{review.author}</footer>
              </blockquote>
            ))}
          </div>
        )}
      </div>
      <div className="px-[5vw] pb-28">
        <div data-finale-rule className="h-px origin-left bg-line" />
        <div className="grid gap-10 pt-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-signal">{props.index}</p>
            <h2 className="mt-4 max-w-[12ch] overflow-hidden text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.9] font-light tracking-[-0.05em]">
              <span data-finale-close className="block">{props.enquireTitle}</span>
            </h2>
          </div>
          <div className="lg:pt-8">
            <p className="max-w-md text-sm leading-6 text-mist">{props.address}</p>
            <p className="mt-4 max-w-md text-sm leading-6 text-mist">{props.disclaimer}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={props.contactHref} className="rounded-full bg-signal px-5 py-3 text-[0.68rem] uppercase tracking-[0.16em] text-canvas">
                {props.contactLabel}
              </Link>
              {props.whatsappHref ? (
                <a className="rounded-full border border-line px-5 py-3 text-[0.68rem] uppercase tracking-[0.16em]" href={props.whatsappHref}>
                  {props.whatsappLabel}
                </a>
              ) : null}
              {props.telegramHref ? (
                <a className="rounded-full border border-line px-5 py-3 text-[0.68rem] uppercase tracking-[0.16em]" href={props.telegramHref}>
                  {props.telegramLabel}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
