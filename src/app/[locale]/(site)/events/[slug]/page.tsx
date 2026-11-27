import { notFound } from "next/navigation";
import type { LocaleSlugPageProps } from "@/types/page-props";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EnquiryModule } from "@/components/site/enquiry-module";
import { PageIntro, PageShell } from "@/components/site/page-intro";
import { getPublishedEventBySlug } from "@/server/repositories/events";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: LocaleSlugPageProps) {
  const { locale, slug } = await params;
  const event = await getPublishedEventBySlug(slug).catch(() => null);
  return buildPageMetadata({
    locale,
    path: `/events/${slug}`,
    title: event?.title[locale as "en" | "ru"] ?? "Event",
  });
}

export default async function EventDetailPage({ params }: LocaleSlugPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const nav = await getTranslations("Nav");
  const event = await getPublishedEventBySlug(slug).catch(() => null);
  if (!event) notFound();
  const lang = locale as "en" | "ru";
  const dates = new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-GB", {
    dateStyle: "medium",
    timeZone: "Asia/Colombo",
  }).formatRange(new Date(event.startAt), new Date(event.endAt));

  return (
    <PageShell>
      <PageIntro eyebrow={nav("events")} title={event.title[lang]} lede={dates} />
      <div className="border-b border-line px-[5vw] pb-12">
        <p className="max-w-2xl text-base leading-7 text-mist">{event.description[lang]}</p>
      </div>
      <div className="px-[5vw] pb-20 pt-10">
        <EnquiryModule locale={lang} roomTitle={event.title[lang]} />
      </div>
    </PageShell>
  );
}
