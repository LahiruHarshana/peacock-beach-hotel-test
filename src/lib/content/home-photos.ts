/** Real hotel photographs in `public/images` and `public/new-img`. */
export const HOME_PHOTOS = {
  hero: "/p-images/DSC08350-HDR.webp",
  beach: "/images/ChatGPT Image Nov 27, 2026, 07_12_42 PM-2.webp",
  nightDining: "/images/ChatGPT Image Nov 27, 2026, 07_15_54 PM-1.webp",
  terrace: "/images/ChatGPT Image Nov 27, 2026, 07_12_40 PM-1.webp",
  balcony: "/new-img/DSC04385.webp",
  lounge: "/images/ChatGPT Image Nov 27, 2026, 07_15_56 PM-2.webp",
  bedroom: "/new-img/DSC08295-HDR.webp",
  seaRoom: "/new-img/DSC08285-Edit.webp",
  courtyard: "/images/ChatGPT Image Nov 27, 2026, 07_16_01 PM-5.webp",
  coast: "/images/ChatGPT Image Nov 27, 2026, 07_15_59 PM-4.webp",
  oceanSuiteBedroom: "/p-images/DSC08285-Edit-1.webp",
  sunsetBalcony: "/p-images/DSC08320-HDR-Edit-2.webp",
  oceanShowerTub: "/p-images/DSC08336-Edit.webp",
  balconyTub: "/p-images/DSC08350-HDR.webp",
} as const;

export type HomePhotoSlot = keyof typeof HOME_PHOTOS;

/** Every slot, stable order for carousels and placeholders. */
export const HOME_PHOTO_SLOTS: HomePhotoSlot[] = [
  "beach",
  "seaRoom",
  "coast",
  "bedroom",
  "terrace",
  "balcony",
  "lounge",
  "nightDining",
  "courtyard",
];

export function homePhoto(slot: HomePhotoSlot) {
  return HOME_PHOTOS[slot];
}

export function allHomePhotoPaths() {
  return HOME_PHOTO_SLOTS.map((slot) => HOME_PHOTOS[slot]);
}