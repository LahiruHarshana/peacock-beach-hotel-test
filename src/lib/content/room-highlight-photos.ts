/** Home “Room highlights” reel only — files in `public/new-img`. */
export const ROOM_HIGHLIGHT_IMAGES = [
  "/new-img/DSC08295-HDR.webp",
  "/new-img/DSC04348.webp",
  "/new-img/DSC04309-Edit.webp",
  "/new-img/DSC04380-Edit.webp",
  "/new-img/DSC04385.webp",
  "/new-img/DSC04421.webp",
  "/new-img/DSC08285-Edit.webp",
] as const;

export function roomHighlightImage(index: number) {
  const path = ROOM_HIGHLIGHT_IMAGES[index % ROOM_HIGHLIGHT_IMAGES.length];
  return path ?? ROOM_HIGHLIGHT_IMAGES[0];
}