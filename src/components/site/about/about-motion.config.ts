/** Scroll choreography for the About editorial film (scrub timelines use 0–1 progress). */
export const ABOUT_SCROLLER = () => document.documentElement;

export const ABOUT_SCRUB = {
  /** Higher = playhead follows scroll more slowly (silky with Lenis). */
  opening: 1.35,
  intro: 1.25,
  hospitality: 1.3,
  chapter: 1.15,
  enquiry: 1.2,
  footer: 0.9,
} as const;

export const ABOUT_HERO_CLIP = {
  start: "inset(15svh 5.5vw 12svh 44vw round 20px)",
  full: "inset(0svh 0vw 0svh 0vw round 0px)",
} as const;

export const ABOUT_PHASE = {
  enter: 0.22,
  develop: 0.56,
  resolve: 0.22,
} as const;

/** Horizontal shutter gate — inset clips (top right bottom left). */
export const ABOUT_SHUTTER = {
  open: "inset(6% 8% 6% 8% round 20px)",
  full: "inset(0% 0% 0% 0% round 0px)",
} as const;
