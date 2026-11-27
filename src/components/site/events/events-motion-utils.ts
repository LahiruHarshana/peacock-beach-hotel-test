type Gsap = typeof import("gsap").default;

export function eventsScrollTimeline(gsap: Gsap, section: HTMLElement, scrub: number) {
  return gsap.timeline({
    scrollTrigger: {
      trigger: section,
      scroller: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub,
      invalidateOnRefresh: true,
    },
  });
}

export function eventsRevealLines(
  gsap: Gsap,
  section: HTMLElement,
  selector: string,
  timeline: ReturnType<Gsap["timeline"]>,
  at: number,
  duration = 0.24,
) {
  const lines = gsap.utils.toArray<HTMLElement>(selector, section);
  lines.forEach((line, index) => {
    gsap.set(line, { yPercent: 110 });
    timeline.to(line, { yPercent: 0, ease: "power3.out", duration }, at + index * 0.07);
  });
}

export function eventsEntrance(gsap: Gsap, section: HTMLElement) {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  const frames = gsap.utils.toArray<HTMLElement>("[data-events-spatial-frame]", section);
  frames.forEach((frame, i) => {
    tl.fromTo(
      frame,
      { z: -220, autoAlpha: 0, scale: 0.88 },
      { z: Number(frame.dataset.depth ?? 0), autoAlpha: 1, scale: 1, duration: 0.75, ease: "power2.out" },
      0.12 + i * 0.08,
    );
  });
  eventsRevealLines(gsap, section, "[data-events-line]", tl, 0.3, 0.28);
  const copy = section.querySelector<HTMLElement>("[data-events-hero-copy]");
  if (copy) tl.fromTo(copy, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.55);
  return tl;
}
