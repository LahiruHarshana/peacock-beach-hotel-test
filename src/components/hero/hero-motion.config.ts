export const HERO_INTRO = {
  maskFadeDuration: 0.45,
  zoomDelay: 0.25,
  zoomDuration: 1.55,
  mediaScaleFrom: 1.06,
  mediaScaleDuration: 2.1,
  unmaskAt: 1.55,
  chromeRevealAt: 1.4,
  chromeRevealDuration: 0.7,
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
  scaleEnd: 18,
  burstCxRatio: 0.56,
  burstCyRatio: 0.5,
  burstRadiusRatio: 0.72,
};

export const HERO_MASK_MOBILE: HeroMaskProfile = {
  wordWidthRatio: 0.92,
  scaleEnd: 12,
  burstCxRatio: 0.52,
  burstCyRatio: 0.48,
  burstRadiusRatio: 0.78,
};