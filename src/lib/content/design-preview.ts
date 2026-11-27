import { HOME_PHOTOS } from "@/lib/content/home-photos";

/** Real hotel photographs for the public page slots. */
export const DESIGN_PREVIEW_IMAGES = {
  hero: HOME_PHOTOS.beach,
  story: HOME_PHOTOS.seaRoom,
  dining: HOME_PHOTOS.terrace,
  interior: HOME_PHOTOS.lounge,
  terrace: HOME_PHOTOS.balcony,
  cliff: HOME_PHOTOS.seaRoom,
  alpine: HOME_PHOTOS.bedroom,
  courtyard: HOME_PHOTOS.courtyard,
  house: HOME_PHOTOS.seaRoom,
  gallery1: HOME_PHOTOS.bedroom,
  gallery2: HOME_PHOTOS.nightDining,
  gallery3: HOME_PHOTOS.nightDining,
  gallery4: HOME_PHOTOS.lounge,
  closer: HOME_PHOTOS.beach,
} as const;

export type DesignPreviewSlot = keyof typeof DESIGN_PREVIEW_IMAGES;

export function isDesignPreview(): boolean {
  return process.env.PEACOCK_ENV !== "production";
}

export function designPreviewImage(slot: DesignPreviewSlot): string {
  return DESIGN_PREVIEW_IMAGES[slot];
}
