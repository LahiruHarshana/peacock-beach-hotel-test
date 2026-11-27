import Link from "next/link";
import type { ReactNode } from "react";

export function splitTitleEmphasis(title: string) {
  const trimmed = title.trim();
  if (!trimmed.includes(" ")) {
    return { lead: trimmed, emphasis: null as string | null };
  }
  const parts = trimmed.split(/\s+/);
  const last = parts.pop()!;
  return { lead: parts.join(" "), emphasis: last };
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="halden-light home-ivory-blue -mt-16 text-paper">{children}</div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  lede,
  pill,
  centered,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  pill?: { href: string; label: string };
  centered?: boolean;
}) {
  return (
    <header
      data-rise
      className={`border-b border-line px-[5vw] pb-12 pt-28 md:pt-32 ${centered ? "text-center" : ""}`}
    >
      {eyebrow ? <p className="text-[0.62rem] uppercase tracking-[0.2em] text-mist">{eyebrow}</p> : null}
      <h1
        className={`mt-4 max-w-[18ch] text-[clamp(2.25rem,5vw,4.5rem)] font-light leading-[0.92] tracking-[-0.05em] ${centered ? "mx-auto" : ""}`}
      >
        {title}
      </h1>
      {lede ? (
        <p className={`mt-6 max-w-xl text-sm leading-6 text-mist ${centered ? "mx-auto" : ""}`}>{lede}</p>
      ) : null}
      {pill ? (
        <Link
          href={pill.href}
          className="mt-8 inline-flex items-center gap-3 border border-line bg-paper px-4 py-3 text-[0.65rem] uppercase tracking-[0.16em] text-canvas transition-colors duration-300 ease-halden hover:bg-paper/90"
        >
          {pill.label}
          <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </header>
  );
}