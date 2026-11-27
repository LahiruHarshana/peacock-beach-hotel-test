import Link from "next/link";
import type { ReactNode } from "react";

export function AboutSceneLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`about-scene-label ${className}`}>
      {children}
    </p>
  );
}

export function AboutDisplayTitle({
  as: Tag = "h2",
  className = "",
  children,
}: {
  as?: "h1" | "h2" | "h3";
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={`about-display ${className}`}>{children}</Tag>;
}

export function AboutLine({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`about-line-mask -mb-[0.14em] block overflow-hidden pb-[0.14em] ${className}`}>
      <span data-about-line className="about-line-inner block">
        {children}
      </span>
    </span>
  );
}

export function AboutBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`about-body ${className}`}>{children}</p>;
}

export function AboutTextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="about-text-link group inline-flex items-center gap-3">
      <span className="about-text-link-label">{children}</span>
      <span className="about-text-link-arrow transition-transform duration-500 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5" aria-hidden="true">
        ↗
      </span>
    </Link>
  );
}

export function AboutPrimaryCta({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="about-btn-primary group">
      <span>{children}</span>
      <span className="transition-transform duration-500 group-hover:translate-x-0.5" aria-hidden="true">
        ↗
      </span>
    </Link>
  );
}

export function AboutSecondaryCta({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="about-btn-secondary group">
      <span>{children}</span>
      <span className="transition-transform duration-500 group-hover:translate-x-0.5" aria-hidden="true">
        ↗
      </span>
    </Link>
  );
}