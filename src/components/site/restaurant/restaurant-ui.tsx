import Link from "next/link";
import type { ReactNode } from "react";

export function RestaurantSceneLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`restaurant-scene-label ${className}`}>{children}</p>;
}

export function RestaurantDisplayTitle({
  as: Tag = "h2",
  className = "",
  children,
}: {
  as?: "h1" | "h2" | "h3";
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={`restaurant-display ${className}`}>{children}</Tag>;
}

export function RestaurantLine({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`restaurant-line-mask -mb-[0.14em] block overflow-hidden pb-[0.14em] ${className}`}>
      <span data-restaurant-line className="restaurant-line-inner block">
        {children}
      </span>
    </span>
  );
}

export function RestaurantBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`restaurant-body ${className}`}>{children}</p>;
}

export function RestaurantPrimaryCta({ href, children }: { href: string; children: ReactNode }) {
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

export function RestaurantSecondaryCta({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex min-w-[11rem] items-center justify-center gap-2.5 rounded-full border border-paper/25 bg-surface/85 px-7 py-3.5 text-[0.58rem] uppercase tracking-[0.22em] text-paper backdrop-blur-md transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-canvas"
    >
      <span>{children}</span>
      <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
        ↗
      </span>
    </Link>
  );
}

export function RestaurantTextLink({ href, children }: { href: string; children: ReactNode }) {
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
