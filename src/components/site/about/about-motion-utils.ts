import { ABOUT_PHASE } from "@/components/site/about/about-motion.config";

type Gsap = typeof import("gsap").default;

export function aboutRevealLines(
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
    timeline.to(line, { yPercent: 0, ease: "power3.out", duration }, at + index * 0.06);
  });
}

export function aboutScrollTimeline(gsap: Gsap, section: HTMLElement, scrub: number) {
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

export function aboutInFlowTimeline(
  gsap: Gsap,
  scene: HTMLElement,
  scrub: number,
  start = "top 82%",
  end = "top 28%",
) {
  return gsap.timeline({
    scrollTrigger: {
      trigger: scene,
      scroller: document.documentElement,
      start,
      end,
      scrub,
    },
  });
}

/** Normalized beat markers for entrance → develop → resolve. */
export function aboutPhaseMarkers() {
  const { enter, develop } = ABOUT_PHASE;
  return {
    enterEnd: enter,
    developMid: enter + develop * 0.5,
    developEnd: enter + develop,
    resolveStart: enter + develop,
    end: 1,
  };
}