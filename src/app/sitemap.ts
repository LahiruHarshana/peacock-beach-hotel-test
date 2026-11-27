import type { MetadataRoute } from "next";
import { getEnv } from "@/lib/env";
import { localeAbsoluteUrl } from "@/lib/seo/locale-url";
import { listPublishedEvents } from "@/server/repositories/events";
import { listPublishedRooms } from "@/server/repositories/rooms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = getEnv().APP_URL;
  const staticPaths = ["", "/about", "/rooms", "/restaurant", "/reviews", "/events", "/contact"];
  const locales = ["en", "ru"] as const;
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: localeAbsoluteUrl(appUrl, locale, path),
        alternates: {
          languages: {
            en: localeAbsoluteUrl(appUrl, "en", path),
            ru: localeAbsoluteUrl(appUrl, "ru", path),
          },
        },
      });
    }
  }

  try {
    const [rooms, events] = await Promise.all([listPublishedRooms(), listPublishedEvents()]);
    for (const locale of locales) {
      for (const room of rooms) {
        entries.push({ url: localeAbsoluteUrl(appUrl, locale, `/rooms/${room.slug}`) });
      }
      for (const event of events) {
        entries.push({ url: localeAbsoluteUrl(appUrl, locale, `/events/${event.slug}`) });
      }
    }
  } catch {
    // Sitemap still returns static routes if database is unavailable during build.
  }

  return entries;
}
