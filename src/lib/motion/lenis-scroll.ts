import type Lenis from "lenis";
import type { GsapEngine } from "@/lib/motion/gsap-runtime";
import type { ScrollTriggerEngine } from "@/lib/motion/gsap-runtime";

type ScrollRuntime = {
  lenis: Lenis;
  gsap: GsapEngine;
  ScrollTrigger: ScrollTriggerEngine;
};

let runtime: ScrollRuntime | null = null;
const waiters: Array<(value: ScrollRuntime) => void> = [];

/** Waits until SmoothScroll has wired Lenis + ScrollTrigger (safe to call before mount). */
export function whenScrollReady(): Promise<ScrollRuntime> {
  if (runtime) return Promise.resolve(runtime);
  return new Promise((resolve) => waiters.push(resolve));
}

export function attachScrollRuntime(next: ScrollRuntime) {
  runtime = next;
  for (const resolve of waiters) resolve(next);
  waiters.length = 0;
}

export function detachScrollRuntime() {
  runtime = null;
}

export function refreshScrollTriggers() {
  runtime?.ScrollTrigger.refresh();
}