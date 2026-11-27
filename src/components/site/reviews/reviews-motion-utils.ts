type Gsap = typeof import("gsap").default;

export function reviewsScrollTimeline(gsap: Gsap, section: HTMLElement, scrub: number) {
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

export function reviewsRevealLines(
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

export function reviewsEntrance(gsap: Gsap, section: HTMLElement) {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  const label = section.querySelector<HTMLElement>("[data-reviews-hero-label]");
  const frames = gsap.utils.toArray<HTMLElement>("[data-reviews-spatial-frame]", section);
  if (label) tl.fromTo(label, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.08);
  frames.forEach((frame, i) => {
    tl.fromTo(
      frame,
      { z: -180, autoAlpha: 0, scale: 0.88 },
      { z: Number(frame.dataset.depth ?? 0), autoAlpha: 1, scale: 1, duration: 0.75, ease: "power2.out" },
      0.14 + i * 0.08,
    );
  });
  reviewsRevealLines(gsap, section, "[data-reviews-line]", tl, 0.32, 0.28);
  const lede = section.querySelector<HTMLElement>("[data-reviews-hero-lede]");
  if (lede) tl.fromTo(lede, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.55);
  return tl;
}