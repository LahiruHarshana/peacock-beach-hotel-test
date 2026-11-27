type Gsap = typeof import("gsap").default;

export const RESTAURANT_CLIP = {
  rect: "inset(12% 18% 22% 18% round 0px)",
  open: "inset(0% 0% 0% 0% round 0px)",
  wipeBottom: (p: number) => `inset(${(1 - p) * 100}% 0% 0% 0%)`,
} as const;

export function restaurantRevealLines(
  gsap: Gsap,
  section: HTMLElement,
  selector: string,
  timeline: gsap.core.Timeline,
  at: number,
  duration = 0.22,
) {
  const lines = gsap.utils.toArray<HTMLElement>(selector, section);
  lines.forEach((line, index) => {
    gsap.set(line, { yPercent: 108 });
    timeline.to(line, { yPercent: 0, ease: "power3.out", duration }, at + index * 0.08);
  });
}

export function restaurantScrollTimeline(gsap: Gsap, section: HTMLElement, scrub: number) {
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

export function restaurantEntrance(gsap: Gsap, section: HTMLElement, onComplete?: () => void) {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete });
  restaurantRevealLines(gsap, section, "[data-restaurant-line]", tl, 0.12, 0.32);
  const frame = section.querySelector<HTMLElement>("[data-restaurant-hero-clip]");
  if (frame) {
    gsap.set(frame, { clipPath: RESTAURANT_CLIP.rect });
    tl.to(frame, { clipPath: RESTAURANT_CLIP.open, duration: 0.9, ease: "power2.inOut" }, 0.2);
  }
  const support = section.querySelector<HTMLElement>("[data-restaurant-hero-support]");
  if (support) tl.fromTo(support, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.55);
  return tl;
}