export type PublicReview = {
  id: string;
  authorDisplayName: string;
  text: string;
  rating?: number;
  ratingLabel?: string;
};

export type ReviewPhotoSlot = {
  src: string;
  alt: string;
  depth: number;
  rotateY: number;
  x: string;
  y: string;
  width: string;
  focal?: boolean;
};