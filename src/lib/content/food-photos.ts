/** Real culinary photographs in `public/foods`. */
export const FOOD_PHOTOS = {
  platedMedallion: "/foods/Pasted 2026-11-26 at 9.07.34 PM.webp",
  torchedCocktail: "/foods/food1.webp",
  searedCatch: "/foods/food2.webp",
  kitchenFlame: "/foods/food3.webp",
  skilletToss: "/foods/food4.webp",
  searedSalmon: "/foods/images.webp",
} as const;

export type FoodPhotoSlot = keyof typeof FOOD_PHOTOS;

export function foodPhoto(slot: FoodPhotoSlot) {
  return FOOD_PHOTOS[slot];
}
