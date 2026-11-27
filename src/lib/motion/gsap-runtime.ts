import type { RefObject } from "react";

export type GsapEngine = typeof import("gsap").default;
export type ScrollTriggerEngine = typeof import("gsap/ScrollTrigger").ScrollTrigger;

export type FlipEngine = typeof import("gsap/Flip").Flip;

export async function loadGsap(): Promise<{ gsap: GsapEngine; ScrollTrigger: ScrollTriggerEngine }> {
  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}

export async function loadMotion(): Promise<{
  gsap: GsapEngine;
  ScrollTrigger: ScrollTriggerEngine;
  Flip: FlipEngine;
}> {
  const [{ default: gsap }, { ScrollTrigger }, { Flip }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("gsap/Flip"),
  ]);
  gsap.registerPlugin(ScrollTrigger, Flip);
  return { gsap, ScrollTrigger, Flip };
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function killContext(scope: RefObject<HTMLElement | null>, gsap?: GsapEngine) {
  const root = scope.current;
  if (!root || !gsap) return;
  gsap.killTweensOf(root.querySelectorAll("*"));
}
