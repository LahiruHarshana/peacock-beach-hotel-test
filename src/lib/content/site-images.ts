/** Curated architectural and coastal lifestyle photographs in `public/images`. */
export const SITE_IMAGES = {
  terraceMorning: "/images/ChatGPT Image Nov 27, 2026, 07_12_40 PM-1.webp",
  beachPergola: "/images/ChatGPT Image Nov 27, 2026, 07_12_42 PM-2.webp",
  terraceSunset: "/images/ChatGPT Image Nov 27, 2026, 07_15_54 PM-1.webp",
  thatchedLounge: "/images/ChatGPT Image Nov 27, 2026, 07_15_56 PM-2.webp",
  oceanBedroom: "/images/ChatGPT Image Nov 27, 2026, 07_15_58 PM-3.webp",
  oceanTubBalcony: "/images/ChatGPT Image Nov 27, 2026, 07_15_59 PM-4.webp",
  beachPavilion: "/images/ChatGPT Image Nov 27, 2026, 07_16_01 PM-5.webp",
  cafeBreakfast: "/images/Tropical Café Breakfast by the Beach.webp",
  loungeCoffee: "/images/Tropical Resort Lounge with Coffee.webp",
} as const;

export type SiteImageSlot = keyof typeof SITE_IMAGES;

export function siteImage(slot: SiteImageSlot) {
  return SITE_IMAGES[slot];
}
