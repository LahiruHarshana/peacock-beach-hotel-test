/** Real coastal guest lifestyle photographs in `public/girl`. */
export const GIRL_PHOTOS = {
  suiteBed: "/girl/girl1.webp",
  soakingTub: "/girl/girl2.webp",
  balconyCurtain: "/girl/girl3.webp",
  oceanSuite: "/girl/girl4.webp",
  beachfrontDining: "/girl/girl5.webp",
  pavilionLunch: "/girl/girl6.webp",
} as const;

export type GirlPhotoSlot = keyof typeof GIRL_PHOTOS;

export function girlPhoto(slot: GirlPhotoSlot) {
  return GIRL_PHOTOS[slot];
}
