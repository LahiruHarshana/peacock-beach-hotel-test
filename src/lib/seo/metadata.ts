import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getEnv } from "@/lib/env";
import { localeAbsoluteUrl } from "@/lib/seo/locale-url";

type BuildArgs = {
  locale: string;
  path: string;
  title?: string;
  titleKey?: string;
  description?: string;
  image?: string | null;
};

export async function buildPageMetadata({
  locale,
  path,
  title,
  titleKey,
  description,
  image,
}: BuildArgs): Promise<Metadata> {
  let resolvedTitle = title;
  if (titleKey) {
    const [ns, key] = titleKey.split(".");
    const t = await getTranslations(ns);
    resolvedTitle = t(key);
  }
  const appUrl = getEnv().APP_URL;
  const canonical = localeAbsoluteUrl(appUrl, locale, path);
  const languages: Record<string, string> = {
    en: localeAbsoluteUrl(appUrl, "en", path),
    ru: localeAbsoluteUrl(appUrl, "ru", path),
    "x-default": localeAbsoluteUrl(appUrl, "en", path),
  };

  const pageTitle =
    resolvedTitle && resolvedTitle !== "Peacock Beach Hotel"
      ? `${resolvedTitle} | Peacock Beach Hotel`
      : "Peacock Beach Hotel";
  const pageDescription =
    description ??
    (locale === "ru"
      ? "Прямые запросы о номерах в Peacock Beach Hotel, Unawatuna."
      : "Direct room enquiries at Peacock Beach Hotel, Unawatuna.");

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: { canonical, languages },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonical,
      locale: locale === "ru" ? "ru_RU" : "en_US",
      alternateLocale: locale === "ru" ? ["en_US"] : ["ru_RU"],
      type: "website",
      siteName: "Peacock Beach Hotel",
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}
