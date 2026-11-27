import "server-only";
import { getDb } from "@/lib/db/client";
import { COLLECTIONS } from "@/lib/db/collections";

export type SiteSettingsDoc = {
  _id: "main";
  brandName: { en: string; ru: string };
  whatsappE164: string | null;
  telegramUrl: string | null;
  address: { en: string; ru: string };
  mapUrl: string | null;
  metaDescription: { en: string; ru: string };
  aboutBody: { en: string; ru: string };
  restaurantIntro: { en: string; ru: string };
  heroImagePublicId: string | null;
  homeHeroTheme: "dark" | "light";
  storyImagePublicId: string | null;
  socialImagePublicId: string | null;
  restaurantImagePublicId: string | null;
  galleryRoomsImagePublicId: string | null;
  galleryRestaurantImagePublicId: string | null;
  galleryEventsImagePublicId: string | null;
  galleryAboutImagePublicId: string | null;
  reviewsImagePublicId: string | null;
  closerImagePublicId: string | null;
  lastUpdatedAt: Date;
};

export const fallbackSiteSettings: SiteSettingsDoc = {
  _id: "main",
  brandName: {
    en: "Peacock Beach Hotel",
    ru: "Peacock Beach Hotel",
  },
  whatsappE164: null,
  telegramUrl: null,
  address: {
    en: "CONTENT REQUIRED — Unawatuna address pending client approval",
    ru: "CONTENT REQUIRED — адрес Unawatuna ожидает подтверждения",
  },
  mapUrl: null,
  metaDescription: {
    en: "CONTENT REQUIRED — homepage description pending client approval.",
    ru: "CONTENT REQUIRED — описание главной страницы ожидает подтверждения.",
  },
  aboutBody: {
    en: "",
    ru: "",
  },
  restaurantIntro: {
    en: "",
    ru: "",
  },
  heroImagePublicId: null,
  homeHeroTheme: "light",
  storyImagePublicId: null,
  socialImagePublicId: null,
  restaurantImagePublicId: null,
  galleryRoomsImagePublicId: null,
  galleryRestaurantImagePublicId: null,
  galleryEventsImagePublicId: null,
  galleryAboutImagePublicId: null,
  reviewsImagePublicId: null,
  closerImagePublicId: null,
  lastUpdatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

export async function updateSiteSettings(
  input: Omit<SiteSettingsDoc, "_id" | "lastUpdatedAt">,
) {
  const db = await getDb();
  const current = await getSiteSettings();
  const next: SiteSettingsDoc = {
    ...current,
    ...input,
    _id: "main",
    lastUpdatedAt: new Date(),
  };
  const { _id, ...fields } = next;
  await db
    .collection<SiteSettingsDoc>(COLLECTIONS.siteSettings)
    .updateOne({ _id }, { $set: fields }, { upsert: true });
  return next;
}

export async function getSiteSettings(): Promise<SiteSettingsDoc> {
  const db = await getDb();
  const doc = await db
    .collection<SiteSettingsDoc>(COLLECTIONS.siteSettings)
    .findOne({ _id: "main" });
  if (!doc) return fallbackSiteSettings;
  return { ...fallbackSiteSettings, ...doc, _id: "main" };
}
