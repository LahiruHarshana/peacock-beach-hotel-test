export const EVENTS_SCRUB = {
  hero: 1.3,
  intro: 1.15,
  process: 0.9,
  showcase: 1.1,
  closing: 1.15,
  footer: 0.9,
} as const;

export const EVENTS_PIN = {
  heroDesktop: "240svh",
  introDesktop: "175svh",
  closingDesktop: "165svh",
} as const;

export const EVENTS_HERO_CLIP = {
  start: "inset(15svh 5.5vw 12svh 44vw round 20px)",
  full: "inset(0svh 0vw 0svh 0vw round 0px)",
} as const;
