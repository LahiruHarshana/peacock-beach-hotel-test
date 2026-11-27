"use client";

import Link from "next/link";

export type HeroColumn = {
  index: string;
  label: string;
  sublabel?: string;
  href: string;
};

type HeroIntroContentProps = {
  chromeRef: React.RefObject<HTMLDivElement | null>;
  footerRef: React.RefObject<HTMLDivElement | null>;
  columns: HeroColumn[];
  description: string;
  exploreLabel: string;
  exploreHref: string;
  enquireLabel: string;
  enquireHref: string;
};

export function HeroIntroContent({
  chromeRef,
  footerRef,
  columns,
  description,
  exploreLabel,
  exploreHref,
  enquireLabel,
  enquireHref,
}: HeroIntroContentProps) {
  return (
    <>
      <div ref={chromeRef} className="will-change-transform">
        <div className="grid gap-0 border-y border-line md:grid-cols-3">
          {columns.map((col) => (
            <Link
              key={col.index}
              href={col.href}
              className="group border-b border-line py-4 transition-colors duration-300 ease-halden md:border-b-0 md:border-r md:px-5 md:py-5 md:last:border-r-0"
            >
                  <p className="halden-label text-mist transition-colors group-hover:text-paper">
                <span className="text-signal">{col.index}.</span> {col.label}
              </p>
              {col.sublabel ? (
                <p className="mt-1 text-[0.58rem] uppercase tracking-[0.16em] text-mist/80">{col.sublabel}</p>
              ) : null}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-1" aria-hidden="true" />

      <div ref={footerRef} className="will-change-transform">
        <div className="grid gap-8 border-t border-line pt-8 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-md text-sm leading-6 text-mist md:text-[0.95rem]">{description}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={exploreHref}
                  className="halden-label inline-flex items-center gap-3 border border-line bg-paper px-4 py-3 text-canvas transition-colors duration-300 ease-halden hover:bg-paper/90"
            >
              {exploreLabel}
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href={enquireHref}
                  className="halden-label text-mist transition-colors duration-300 ease-halden hover:text-paper"
            >
              {enquireLabel}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}