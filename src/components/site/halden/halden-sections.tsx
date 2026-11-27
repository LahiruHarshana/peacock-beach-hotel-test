"use client";

import Image from "next/image";
import Link from "next/link";

export type OfferRow = {
  index: string;
  label: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  image?: string;
  alt?: string;
};

export type IndexRow = {
  index: string;
  title: string;
  meta: string;
  href: string;
  image: string;
  alt: string;
};

function ScrollLine({ text, className }: { text: string; className?: string }) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return (
    <span className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <span data-word className="inline-block">
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </span>
  );
}

type HaldenStatementProps = {
  kicker: string;
  lead: string;
  emphasis: string;
  body: string;
  cta: string;
  href: string;
};

export function HaldenManifesto({
  lineOne,
  lineTwo,
  body,
  cta,
  href,
}: {
  lineOne: string;
  lineTwo: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <section className="border-t border-line px-[5vw] py-20 md:py-32">
      <MotionRule />
      <h2 className="text-[clamp(2rem,5.5vw,4.5rem)] font-light leading-[1.05] tracking-[-0.04em]">
        <ScrollLine text={lineOne} className="halden-spaced block text-paper" />
        <ScrollLine text={lineTwo} className="halden-spaced mt-3 block text-mist" />
      </h2>
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <p data-reveal className="max-w-lg text-sm leading-6 text-mist md:text-[0.95rem]">
          {body}
        </p>
        <Link
          data-reveal
          href={href}
          className="inline-flex w-fit items-center gap-3 border border-line bg-paper px-5 py-3 text-[0.65rem] uppercase tracking-[0.16em] text-canvas transition-colors duration-300 ease-halden hover:opacity-90"
        >
          {cta}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

function MotionRule() {
  return <div data-rule-grow className="mb-12 h-px w-full origin-left bg-line" aria-hidden="true" />;
}

function GridIntro({
  tag,
  title,
  body,
  className,
}: {
  tag: string;
  title: string;
  body?: string;
  className?: string;
}) {
  return (
    <div className={`max-w-3xl ${className ?? "mb-12"}`}>
      <p data-fade className="halden-tag mb-6">
        {tag}
      </p>
      <h2 className="text-[clamp(2.2rem,5vw,4.25rem)] font-light leading-[0.92] tracking-[-0.05em]">
        <ScrollLine text={title} />
      </h2>
      {body ? (
        <p data-fade className="mt-5 max-w-xl text-sm leading-6 text-mist">
          {body}
        </p>
      ) : null}
    </div>
  );
}

export function HaldenDisciplines({
  tag,
  title,
  intro,
  rows,
}: {
  tag: string;
  title: string;
  intro: string;
  rows: OfferRow[];
}) {
  return (
    <section className="border-t border-line px-[5vw] py-20 md:py-28">
      <MotionRule />
      <GridIntro tag={tag} title={title} body={intro} />
      <ul data-scroll-rows className="divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <li key={row.index} data-row>
            <Link
              href={row.href}
              className="group grid gap-6 py-10 transition-colors duration-300 ease-halden hover:bg-surface/35 md:grid-cols-[5rem_1fr_12rem] md:items-center"
            >
              <span className="text-[0.62rem] uppercase tracking-[0.2em] text-signal">{row.index}.</span>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.14em] text-mist">{row.label}</p>
                <h3 className="mt-2 text-[clamp(1.35rem,2.4vw,2rem)] font-light tracking-[-0.03em]">{row.title}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-mist">{row.body}</p>
              </div>
              {row.image ? (
                <figure data-mask-in className="relative hidden h-28 overflow-hidden bg-surface md:block">
                  <div data-parallax className="absolute inset-0">
                    <Image
                      src={row.image}
                      alt={row.alt ?? row.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-halden group-hover:scale-105"
                      sizes="12rem"
                    />
                  </div>
                </figure>
              ) : (
                <span className="hidden text-[0.65rem] uppercase tracking-[0.16em] text-mist transition-colors group-hover:text-paper md:block">
                  {row.cta} →
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export type ProcessStep = { index: string; title: string; body: string };

export function HaldenProcess({
  tag,
  title,
  intro,
  steps,
}: {
  tag: string;
  title: string;
  intro: string;
  steps: ProcessStep[];
}) {
  return (
    <section className="border-t border-line px-[5vw] py-20 md:py-28">
      <MotionRule />
      <GridIntro tag={tag} title={title} body={intro} />
      <ol data-scroll-rows className="grid gap-0 border-y border-line md:grid-cols-2">
        {steps.map((step) => (
          <li key={step.index} data-row className="border-b border-line p-8 md:border-r md:last:border-r-0">
            <p data-reveal className="text-[0.62rem] uppercase tracking-[0.2em] text-signal">
              {step.index}.
            </p>
            <h3 data-reveal className="mt-4 text-xl font-light tracking-[-0.03em]">
              {step.title}
            </h3>
            <p data-reveal className="mt-3 text-sm leading-6 text-mist">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function HaldenStatement({ kicker, lead, emphasis, body, cta, href }: HaldenStatementProps) {
  return (
    <section className="border-t border-line px-[5vw] py-20 md:py-28">
      <MotionRule />
      <p className="mb-8 text-[0.62rem] uppercase tracking-[0.22em] text-mist">{kicker}</p>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <h2 className="max-w-[14ch] text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.9] font-light tracking-[-0.05em]">
          <ScrollLine text={lead} className="block" />
          <ScrollLine text={emphasis} className="mt-2 block text-mist" />
        </h2>
        <div>
          <p data-reveal className="max-w-md text-sm leading-6 text-mist">
            {body}
          </p>
          <Link
            data-reveal
            href={href}
            className="mt-8 inline-flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.18em] text-paper transition-colors duration-300 ease-halden hover:text-signal"
          >
            {cta}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HaldenOffers({ label, title, rows }: { label: string; title: string; rows: OfferRow[] }) {
  return (
    <section className="border-t border-line px-[5vw] py-20 md:py-24">
      <MotionRule />
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <p className="text-[0.62rem] uppercase tracking-[0.22em] text-signal">{label}</p>
        <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-light tracking-[-0.04em]">
          <ScrollLine text={title} />
        </h2>
      </div>
      <ul data-scroll-rows className="divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <li key={row.index} data-row>
            <Link
              href={row.href}
              className="group grid gap-4 py-8 transition-colors duration-300 ease-halden hover:bg-surface/40 md:grid-cols-[6rem_1fr_auto] md:items-center md:gap-8 md:py-10"
            >
              <span className="text-[0.62rem] uppercase tracking-[0.2em] text-signal">{row.index}</span>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.16em] text-mist">{row.label}</p>
                <h3 className="mt-2 text-2xl font-light tracking-[-0.03em] md:text-3xl">{row.title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-mist">{row.body}</p>
              </div>
              <span className="text-[0.65rem] uppercase tracking-[0.16em] text-mist transition-colors group-hover:text-paper">
                {row.cta} →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function HaldenPhotoPanel({
  label,
  title,
  body,
  image,
  alt,
  href,
  cta,
}: {
  label: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  href: string;
  cta: string;
}) {
  return (
    <section className="border-t border-line px-[5vw] py-20 md:py-24">
      <MotionRule />
      <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch">
        <figure data-mask-in className="relative min-h-[18rem] overflow-hidden bg-surface lg:min-h-[24rem]">
          <div data-parallax className="absolute inset-0">
            <Image src={image} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 46vw, 100vw" />
          </div>
        </figure>
        <div className="flex flex-col justify-end pb-2">
          <p className="text-[0.62rem] uppercase tracking-[0.22em] text-signal">{label}</p>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-light tracking-[-0.04em]">
            <ScrollLine text={title} />
          </h2>
          <p data-reveal className="mt-4 max-w-md text-sm leading-6 text-mist">
            {body}
          </p>
          <Link
            data-reveal
            href={href}
            className="mt-8 inline-flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.18em] text-paper transition-colors duration-300 ease-halden hover:text-signal"
          >
            {cta}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HaldenRoomIndex({
  tag,
  title,
  lead,
  colRoom,
  colMeta,
  rows,
  empty,
  allHref,
  allLabel,
}: {
  tag: string;
  title: string;
  lead: string;
  colRoom: string;
  colMeta: string;
  rows: IndexRow[];
  empty: string | null;
  allHref: string;
  allLabel: string;
}) {
  return (
    <section className="border-t border-line px-[5vw] py-20 md:py-28">
      <MotionRule />
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <GridIntro tag={tag} title={title} body={lead} className="mb-0" />
        </div>
        <Link data-fade href={allHref} className="text-[0.68rem] uppercase tracking-[0.18em] text-mist hover:text-paper">
          {allLabel} →
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-mist" role="status">
          {empty}
        </p>
      ) : (
        <>
          <div className="hidden border-y border-line py-4 text-[0.62rem] uppercase tracking-[0.18em] text-mist md:grid md:grid-cols-[5rem_1fr_10rem_12rem] md:gap-6">
            <span>№</span>
            <span>{colRoom}</span>
            <span>{colMeta}</span>
            <span className="text-right">—</span>
          </div>
          <ul data-scroll-rows className="divide-y divide-line border-b border-line">
            {rows.map((row) => (
              <li key={row.index + row.href} data-row>
                <Link href={row.href} className="group grid gap-6 py-8 md:grid-cols-[5rem_1fr_10rem_12rem] md:items-center md:gap-6">
                  <p className="text-[0.62rem] uppercase tracking-[0.2em] text-signal">{row.index}.</p>
                  <h3 className="text-xl font-light tracking-[-0.03em] md:text-2xl">{row.title}</h3>
                  <p className="text-sm text-mist">{row.meta}</p>
                  <figure data-mask-in className="relative h-24 overflow-hidden bg-surface md:h-28 md:justify-self-end">
                    <div data-parallax className="absolute inset-0">
                      <Image
                        src={row.image}
                        alt={row.alt}
                        fill
                        className="object-cover transition-transform duration-500 ease-halden group-hover:scale-105"
                        sizes="12rem"
                      />
                    </div>
                  </figure>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export function HaldenFinale(props: {
  reviewsTitle: string;
  reviewsHref: string;
  reviewsLabel: string;
  emptyReviews: string;
  reviews: Array<{ id: string; text: string; author: string }>;
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
}) {
  return (
    <section className="border-t border-line px-[5vw] py-20 md:pb-28">
      <MotionRule />
      <div className="mb-12 flex items-end justify-between gap-6">
        <h2 className="text-[clamp(2rem,5vw,4rem)] font-light tracking-[-0.05em]">
          <ScrollLine text={props.reviewsTitle} className="block" />
        </h2>
        <Link href={props.reviewsHref} className="text-[0.68rem] uppercase tracking-[0.18em] text-mist hover:text-paper">
          {props.reviewsLabel}
        </Link>
      </div>
      {props.reviews.length === 0 ? (
        <p className="max-w-md text-sm text-mist" role="status">
          {props.emptyReviews}
        </p>
      ) : (
        <div data-scroll-rows className="grid gap-10 md:grid-cols-3">
          {props.reviews.map((review) => (
            <blockquote key={review.id} data-row data-reveal className="border-t border-line pt-6">
              <p className="text-lg font-light leading-8 tracking-[-0.03em]">“{review.text}”</p>
              <footer className="mt-6 text-[0.68rem] uppercase tracking-[0.16em] text-mist">{review.author}</footer>
            </blockquote>
          ))}
        </div>
      )}
      <div className="mt-20 border-t border-line pt-16">
        <p className="text-[0.62rem] uppercase tracking-[0.2em] text-signal">{props.index}</p>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <h2 className="max-w-[12ch] text-[clamp(2.5rem,6vw,5rem)] font-light tracking-[-0.05em]">
            <ScrollLine text={props.enquireTitle} className="block" />
          </h2>
          <div>
            <p data-reveal className="max-w-md text-sm leading-6 text-mist">
              {props.address}
            </p>
            <p data-reveal className="mt-4 max-w-md text-sm leading-6 text-mist">
              {props.disclaimer}
            </p>
            <div data-reveal className="mt-8 flex flex-wrap gap-3">
              <Link
                href={props.contactHref}
                className="border border-line bg-paper px-5 py-3 text-[0.68rem] uppercase tracking-[0.16em] text-canvas transition-colors duration-300 ease-halden hover:opacity-90"
              >
                {props.contactLabel}
              </Link>
              {props.whatsappHref ? (
                <a className="border border-line px-5 py-3 text-[0.68rem] uppercase tracking-[0.16em]" href={props.whatsappHref}>
                  {props.whatsappLabel}
                </a>
              ) : null}
              {props.telegramHref ? (
                <a className="border border-line px-5 py-3 text-[0.68rem] uppercase tracking-[0.16em]" href={props.telegramHref}>
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