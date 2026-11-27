export type PublicEventCard = {
  slug: string;
  title: string;
  description: string;
  dateLabel: string;
  imageSrc: string | null;
};

export type AtmospherePhoto = {
  src: string;
  alt: string;
  depth: number;
  rotateY: number;
  x: string;
  y: string;
  width: string;
  focal?: boolean;
};
