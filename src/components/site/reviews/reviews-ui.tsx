import Link from "next/link";
import type { ReactNode } from "react";

export function ReviewsSceneLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`reviews-scene-label ${className}`}>{children}</p>;
}

export function ReviewsDisplayLine({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`reviews-line-mask -mb-[0.14em] block overflow-hidden pb-[0.14em] ${className}`}>
      <span data-reviews-line className="reviews-line-inner block">
        {children}
      </span>
    </span>
  );
}

export function ReviewsBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`reviews-body ${className}`}>{children}</p>;
}

export function ReviewsTextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-3 rounded-full border border-paper/20 px-6 py-3 text-[0.58rem] uppercase tracking-[0.22em] text-paper transition-colors duration-300 hover:bg-paper hover:text-canvas"
    >
      <span>{children}</span>
      <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
        ↗
      </span>
    </Link>
  );
}

export function ReviewsPrimaryCta({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex min-w-[11rem] items-center justify-center gap-2.5 rounded-full bg-paper px-7 py-3.5 text-[0.58rem] uppercase tracking-[0.22em] text-canvas transition-colors duration-300 hover:bg-paper/90"
    >
      <span>{children}</span>
      <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
        ↗
      </span>
    </Link>
  );
}
