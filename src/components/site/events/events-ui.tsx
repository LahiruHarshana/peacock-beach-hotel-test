import Link from "next/link";
import type { ReactNode } from "react";

export function EventsSceneLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`events-scene-label ${className}`}>{children}</p>;
}

export function EventsDisplayLine({ children }: { children: ReactNode }) {
  return (
    <span className="events-line-mask -mb-[0.14em] block overflow-hidden pb-[0.14em]">
      <span data-events-line className="block">
        {children}
      </span>
    </span>
  );
}

export function EventsBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`events-body ${className}`}>{children}</p>;
}

export function EventsTextLink({ href, children }: { href: string; children: ReactNode }) {
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
