import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function HaldenSection({ children, id, className }: { children: ReactNode; id?: string; className?: string }) {
  return (
    <section id={id} className={className ?? "border-t border-line py-12 md:py-16"}>
      {children}
    </section>
  );
}

export function HaldenFeatureBand({
  image,
  alt,
  kicker,
  title,
  body,
  href,
  cta,
}: {
  image: string;
  alt: string;
  kicker: string;
  title: string;
  body: string;
  href?: string;
  cta?: string;
}) {
  return (
    <HaldenSection className="border-t border-line">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
        <figure className="relative min-h-[20rem] overflow-hidden bg-surface md:min-h-[28rem]">
          <Image src={image} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
        </figure>
        <div className="max-w-md pb-2">
          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-signal">{kicker}</p>
          <h2 className="mt-4 text-[clamp(1.75rem,3vw,2.75rem)] font-light tracking-[-0.04em]">{title}</h2>
          <p className="mt-4 text-sm leading-6 text-mist">{body}</p>
          {href && cta ? (
            <Link
              href={href}
              className="mt-8 inline-flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.18em] text-paper transition-colors duration-300 ease-halden hover:text-signal"
            >
              {cta}
              <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </div>
      </div>
    </HaldenSection>
  );
}

export function HaldenEnquirySection({ children, title, eyebrow, lede }: { children: ReactNode; title: string; eyebrow: string; lede?: string }) {
  return (
    <HaldenSection id="enquiry" className="scroll-mt-20 border-t border-line pt-16">
      <div className="mb-10 grid gap-6 lg:grid-cols-2 lg:items-end">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-signal">{eyebrow}</p>
          <h2 className="mt-3 text-[clamp(2rem,4vw,3.25rem)] font-light tracking-[-0.05em]">{title}</h2>
        </div>
        {lede ? <p className="max-w-sm text-sm leading-6 text-mist">{lede}</p> : null}
      </div>
      {children}
    </HaldenSection>
  );
}