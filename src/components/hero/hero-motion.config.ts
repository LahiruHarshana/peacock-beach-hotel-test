export const HERO_SCROLL = {
  scrub: 1,
  desktop: "+=220%",
  mobile: "+=180%",
  anticipatePin: 1,
} as const;

export const HERO_TIMELINE = {
  holdEnd: 0.12,
  chromeFadeStart: 0.12,
  chromeFadeEnd: 0.28,
  maskExpandStart: 0.12,
  maskExpandEnd: 0.9,
  unmaskStart: 0.86,
  unmaskEnd: 1,
  holdFullEnd: 1,
} as const;

export type HeroMaskProfile = {
  wordWidthRatio: number;
  scaleEnd: number;
  burstCxRatio: number;
  burstCyRatio: number;
  burstRadiusRatio: number;
};

export const HERO_MASK_DESKTOP: HeroMaskProfile = {
  wordWidthRatio: 0.94,
  scaleEnd: 14,
  burstCxRatio: 0.56,
  burstCyRatio: 0.5,
  burstRadiusRatio: 0.72,
};

export const HERO_MASK_MOBILE: HeroMaskProfile = {
  wordWidthRatio: 0.92,
  scaleEnd: 9,
  burstCxRatio: 0.52,
  burstCyRatio: 0.48,
  burstRadiusRatio: 0.78,
};