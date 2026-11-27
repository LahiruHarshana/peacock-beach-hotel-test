import type { ReactNode } from "react";
import { HaldenLightShell } from "@/components/site/halden/halden-light-shell";

type HaldenPageFrameProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
};

export function HaldenPageFrame({ eyebrow, title, intro, children }: HaldenPageFrameProps) {
  return (
    <HaldenLightShell className="-mt-16">
      <section className="border-b border-line px-[5vw] pt-28 pb-14 md:pt-32">
        <p className="halden-tag mb-2">{eyebrow}</p>
        <h1 className="max-w-[16ch] text-[clamp(2.5rem,6vw,5rem)] font-light tracking-[-0.05em]">{title}</h1>
        {intro ? <p className="mt-6 max-w-xl text-sm leading-6 text-mist">{intro}</p> : null}
      </section>
      <div className="px-[5vw] py-14 md:py-20">{children}</div>
    </HaldenLightShell>
  );
}