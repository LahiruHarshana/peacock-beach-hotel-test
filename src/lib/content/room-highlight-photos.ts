/** Home “Room highlights” reel only — files in `public/new-img` and `public/p-images`. */
export const ROOM_HIGHLIGHT_IMAGES = [
  "/p-images/DSC08285-Edit-1.webp",
  "/p-images/DSC08320-HDR-Edit-2.webp",
  "/p-images/DSC08350-HDR.webp",
  "/p-images/DSC08336-Edit.webp",
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