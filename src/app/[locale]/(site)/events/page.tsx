import type { LocalePageProps } from "@/types/page-props";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EventEnquiryScene } from "@/components/site/events/event-enquiry-scene";
import { EventPublicationScene } from "@/components/site/events/event-publication-scene";
import { EventsClosingScene } from "@/components/site/events/events-closing-scene";
import { EventsFooterTransition } from "@/components/site/events/events-footer-transition";
import { EventsIntroduction } from "@/components/site/events/events-introduction";
import { EventsPageShell } from "@/components/site/events/events-page-shell";
import { EventsSpatialHero } from "@/components/site/events/events-spatial-hero";
import { PastEventsArchive } from "@/components/site/events/past-events-archive";
import type { AtmospherePhoto, PublicEventCard } from "@/components/site/events/types";
import { UpcomingEvents } from "@/components/site/events/upcoming-events";
import { homePhoto } from "@/lib/content/home-photos";
import { siteImage } from "@/lib/content/site-images";
import { cloudinaryImageUrl } from "@/lib/media/cloudinary";
import { listPublishedEvents } from "@/server/repositories/events";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/events", titleKey: "Events.title" });
}

function formatRange(locale: string, startAt: Date, endAt: Date) {
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-GB", {
    dateStyle: "medium",
    timeZone: "Asia/Colombo",
  }).formatRange(new Date(startAt), new Date(endAt));
}

export default async function EventsPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Events");
  const common = await getTranslations("Common");
  const home = await getTranslations("Home");
  const enquiry = await getTranslations("Enquiry");
  const now = new Date();
  const events = await listPublishedEvents().catch(() => []);
  const lang = locale as "en" | "ru";

  const toCard = (event: (typeof events)[number]): PublicEventCard => {
    let imageSrc: string | null = null;
    if (event.heroMedia?.resourceType === "image") {
      try {
        imageSrc = cloudinaryImageUrl(event.heroMedia.publicId, 1400);
      } catch {
        imageSrc = null;
      }
    }
    return {
      slug: event.slug,
      title: event.title[lang],
      description: event.description[lang],
      dateLabel: formatRange(locale, event.startAt, event.endAt),
      imageSrc,
    };
  };

  const upcoming = events.filter((event) => new Date(event.endAt) >= now).map(toCard);
  const past = events.filter((event) => new Date(event.endAt) < now).map(toCard);
  const alt = t("title");

  const photos: AtmospherePhoto[] = [
    { src: homePhoto("coast"), alt, depth: -400, rotateY: -4, x: "6%", y: "16%", width: "w-[22vw]" },
    { src: homePhoto("courtyard"), alt, depth: -200, rotateY: 6, x: "64%", y: "10%", width: "w-[20vw]" },
    { src: homePhoto("balcony"), alt, depth: -80, rotateY: -3, x: "18%", y: "46%", width: "w-[18vw]" },
    { src: homePhoto("nightDining"), alt, depth: 0, rotateY: 0, x: "30%", y: "22%", width: "w-[36vw]", focal: true },
    { src: homePhoto("beach"), alt, depth: 160, rotateY: 5, x: "58%", y: "48%", width: "w-[18vw]" },
  ];

  return (
    <EventsPageShell>
      <EventsSpatialHero
        scene="01"
        eyebrow={t("filmEyebrow")}
        location={home("eyebrow")}
        title={t("title")}
        lede={t("lede")}
        displayLine1={t("filmDisplayLine1")}
        displayLine2={t("filmDisplayLine2")}
        support={t("filmSupport")}
        scrollLabel={t("scrollLabel")}
        photos={photos}
      />
      <EventsIntroduction scene="02" lede={t("lede")} image={homePhoto("nightDining")} alt={alt} />
      <EventPublicationScene
        scene="03"
        kicker={home("eventsTitle")}
        title={t("publishTitle")}
        body={t("publishBody")}
        steps={[
          { index: "01", text: t("publishPointOne") },
          { index: "02", text: t("publishPointTwo") },
          { index: "03", text: t("publishPointThree") },
        ]}
      />
      <UpcomingEvents
        scene="04"
        heading={t("upcoming")}
        intro={t("upcomingIntro")}
        emptyPrimary={common("emptyEvents")}
        emptySecondary={t("emptyFollowUp")}
        emptyDisplay={t("emptyDisplay")}
        viewLabel={t("viewEvent")}
        locale={locale}
        events={upcoming}
        atmosphereSrc={homePhoto("terrace")}
        atmosphereAlt={alt}
      />
      <PastEventsArchive
        scene="06"
        heading={t("past")}
        intro={t("pastIntro")}
        display={t("pastDisplay")}
        viewLabel={t("viewEvent")}
        locale={locale}
        events={past}
      />
      <EventEnquiryScene
        scene="07"
        title={t("enquireTitle")}
        body={t("enquireBody")}
        contactHref={`/${locale}/contact`}
        contactCta={t("contactCta")}
        roomsHref={`/${locale}/rooms`}
        exploreRooms={home("exploreRooms")}
        disclaimer={enquiry("disclaimer")}
        image={siteImage("oceanTubBalcony")}
        alt={alt}
      />
      <EventsClosingScene
        scene="08"
        line1={t("filmClosingLine1")}
        line2={t("filmClosingLine2")}
        image={homePhoto("terrace")}
        alt={alt}
      />
      <EventsFooterTransition closingLabel={t("filmFooterLabel")} />
    </EventsPageShell>
  );
}
