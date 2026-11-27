export type Localized = { en: string; ru: string };

export type RoomPublishInput = {
  slug: string;
  name: Localized;
  description: Localized;
  capacity: number;
  images: Array<{ publicId: string; alt: Localized }>;
  priceDisplay?: number | null;
  currency?: string | null;
};

export type EventPublishInput = {
  slug: string;
  title: Localized;
  description: Localized;
  startAt: Date | string;
  endAt: Date | string;
  heroPublicId?: string | null;
};

const slugOk = (slug: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

function rejectPlaceholder(value: string | undefined, key: string, errors: Record<string, string[]>) {
  if (value?.includes("CONTENT REQUIRED")) {
    errors[key] = ["Placeholder copy cannot be published."];
  }
}

function requireLocalized(value: Localized | undefined, prefix: string, errors: Record<string, string[]>) {
  if (!value?.en?.trim()) errors[`${prefix}.en`] = ["English text is required to publish."];
  if (!value?.ru?.trim()) errors[`${prefix}.ru`] = ["Russian text is required to publish."];
  rejectPlaceholder(value?.en, `${prefix}.en`, errors);
  rejectPlaceholder(value?.ru, `${prefix}.ru`, errors);
}

export function roomPublishFieldErrors(
  room: RoomPublishInput,
  verifiedPublicIds: ReadonlySet<string>,
): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  if (!slugOk(room.slug ?? "")) errors.slug = ["A valid slug is required."];
  requireLocalized(room.name, "name", errors);
  requireLocalized(room.description, "description", errors);
  if (!Number.isInteger(room.capacity) || room.capacity < 1 || room.capacity > 20) {
    errors.capacity = ["Occupancy must be a whole number from 1 to 20."];
  }
  if (room.priceDisplay != null && (room.priceDisplay < 0 || room.priceDisplay > 1_000_000)) {
    errors.priceDisplay = ["Displayed rate must be a non-negative number within the allowed cap."];
  }
  if (room.priceDisplay != null && room.currency && !/^[A-Z]{3}$/.test(room.currency)) {
    errors.currency = ["Currency must be a 3-letter code."];
  }
  if (!room.images?.length) {
    errors.images = ["At least one approved room image is required to publish."];
  } else {
    room.images.forEach((image, index) => {
      if (!verifiedPublicIds.has(image.publicId)) {
        errors[`images.${index}.publicId`] = ["Image is not a verified library asset."];
      }
      if (!image.alt?.en?.trim() || !image.alt?.ru?.trim()) {
        errors[`images.${index}.alt`] = ["English and Russian alt text are required."];
      }
      rejectPlaceholder(image.alt?.en, `images.${index}.alt`, errors);
      rejectPlaceholder(image.alt?.ru, `images.${index}.alt`, errors);
    });
  }
  return errors;
}

export function eventPublishFieldErrors(
  event: EventPublishInput,
  verifiedPublicIds: ReadonlySet<string>,
): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  if (!slugOk(event.slug ?? "")) errors.slug = ["A valid slug is required."];
  requireLocalized(event.title, "title", errors);
  requireLocalized(event.description, "description", errors);
  const start = new Date(event.startAt);
  const end = new Date(event.endAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    errors.endAt = ["End must be on or after the start."];
  }
  if (!event.heroPublicId || !verifiedPublicIds.has(event.heroPublicId)) {
    errors.heroMedia = ["A verified event image is required to publish."];
  }
  return errors;
}

export function hasFieldErrors(errors: Record<string, string[]>): boolean {
  return Object.keys(errors).length > 0;
}
