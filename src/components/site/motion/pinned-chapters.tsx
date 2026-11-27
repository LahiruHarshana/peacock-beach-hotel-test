"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";

const DESKTOP_MOTION = "(prefers-reduced-motion: no-preference) and (min-width: 768px)";

export function PinnedChapters({
  visual,
  visuals,
  children,
}: {
  visual?: ReactNode;
  visuals?: ReactNode[];
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const panels = visuals && visuals.length > 0 ? visuals : [visual];

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]", root.current);
    const frames = gsap.utils.toArray<HTMLElement>("[data-panel]", root.current);
    const marks = gsap.utils.toArray<HTMLElement>("[data-mark]", root.current);
    if (chapters.length < 2) return;
    const stack = chapters[0]?.parentElement;
    if (stack) {
      const height = Math.max(...chapters.map((chapter) => chapter.offsetHeight));
      stack.style.minHeight = `${height}px`;
      gsap.set(stack, { position: "relative" });
    }
    gsap.set(chapters, { position: "absolute", top: 0, left: 0, width: "100%" });
    gsap.set(chapters.slice(1), { opacity: 0 });
    if (frames.length > 1) gsap.set(frames.slice(1), { autoAlpha: 0 });
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: "+=120%",
        pin: true,
        scrub: 0.45,
      },
    });
    chapters.forEach((chapter, index) => {
      if (index === 0) return;
      timeline.to(chapters[index - 1], { opacity: 0, duration: 0.45 }, index);
      timeline.to(chapter, { opacity: 1, duration: 0.45 }, index);
      const previous = frames[index - 1];
      const next = frames[index] ?? frames[frames.length - 1];
      if (previous && next && previous !== next) {
        timeline.to(previous, { autoAlpha: 0, duration: 0.45 }, index);
        timeline.to(next, { autoAlpha: 1, duration: 0.45, immediateRender: false }, index);
      }
      if (marks[index] && marks[index - 1]) {
        timeline.to(marks[index - 1], { color: "#74765B", duration: 0.3 }, index);
        timeline.to(marks[index], { color: "#F1E3D2", duration: 0.3 }, index);
      }
    });
  }, []);

  useCinematic(root, setup, DESKTOP_MOTION);

  return (
    <section id="story" ref={root} className="relative scroll-mt-24 bg-ink text-paper">
      <div className="relative h-[28rem] overflow-hidden md:absolute md:inset-0 md:h-auto">
        {panels.map((panel, index) => (
          <div key={index} data-panel className={index === 0 ? "absolute inset-0" : "absolute inset-0 opacity-0"}>
            {panel ?? <div className="coastal-field absolute inset-0" />}
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/20 via-ink/20 to-ink/80" />
      </div>
      <div className="relative z-10 md:flex md:min-h-dvh md:items-end md:justify-end">
        <div className="bg-ink/85 px-5 py-12 md:m-10 md:w-[30rem] md:px-8 md:py-10">
          <ol className="mb-8 flex gap-5 text-xs tracking-[0.22em]" aria-hidden="true">
            {panels.map((_, index) => (
              <li key={index} data-mark className={index === 0 ? "text-ivory" : "text-sand"}>
                {String(index + 1).padStart(2, "0")}
              </li>
            ))}
          </ol>
          <div className="chapter-stack relative">{children}</div>
        </div>
      </div>
    </section>
  );
}
