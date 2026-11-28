import { getTranslations, setRequestLocale } from "next-intl/server";
import { HomeHeroThemeSync } from "@/components/hero/HomeHeroThemeSync";
import { TypographyMaskHero } from "@/components/hero/TypographyMaskHero";
import { HomeBleedPlate } from "@/components/site/home/home-bleed-plate";
import { HomeExperienceStage } from "@/components/site/home/home-experience-stage";
import { HomePageShell } from "@/components/site/home/home-page-shell";
import { HomeReviewsCloser } from "@/components/site/home/home-reviews-closer";
import { HomeRoomsReel } from "@/components/site/home/home-rooms-reel";
import { HomeStatementPin } from "@/components/site/home/home-statement-pin";
import type { HomeExperienceLayer, HomeRoomCard } from "@/components/site/home/types";
import { resolveHomeHeroTheme } from "@/lib/content/home-hero";
import { girlPhoto } from "@/lib/content/girl-photos";
import { homePhoto } from "@/lib/content/home-photos";
import { siteImage } from "@/lib/content/site-images";
import { ROOM_HIGHLIGHT_IMAGES, roomHighlightImage } from "@/lib/content/room-highlight-photos";
import { isPlaceholderCopy, publicText } from "@/lib/content/public-copy";
import { cloudinaryImageUrl } from "@/lib/media/cloudinary";
import { getEnv } from "@/lib/env";
import { lodgingJsonLd } from "@/lib/seo/jsonld";
import { localeAbsoluteUrl } from "@/lib/seo/locale-url";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { listApprovedReviews } from "@/server/repositories/reviews";
import { formatRoomPrice, listPublishedRooms } from "@/server/repositories/rooms";
import { fallbackSiteSettings, getSiteSettings } from "@/server/repositories/site-settings";

import type { LocalePageProps } from "@/types/page-props";

function settingsImage(publicId: string | null, fallback: string, width: number) {
  if (!publicId) return fallback;
  try {
    return cloudinaryImageUrl(publicId, width);
  } catch {
    return fallback;
  }
}

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  const settings = await getSiteSettings().catch(() => fallbackSiteSettings);
  const lang = locale === "ru" ? "ru" : "en";
  const description = isPlaceholderCopy(settings.metaDescription[lang])
    ? undefined
    : settings.metaDescription[lang];
  let image: string | null = null;
  if (settings.socialImagePublicId) {
    try {
      image = cloudinaryImageUrl(settings.socialImagePublicId, 1200);
    } catch {
      image = null;
    }
  }
  return buildPageMetadata({ locale, path: "", titleKey: "Home.title", description, image });
}

export default async function HomePage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const common = await getTranslations("Common");
  const nav = await getTranslations("Nav");
  const enquiry = await getTranslations("Enquiry");
  const contact = await getTranslations("Contact");
  const roomsCopy = await getTranslations("Rooms");

  const settings = await getSiteSettings().catch(() => fallbackSiteSettings);
  const lang = locale === "ru" ? "ru" : "en";
  const jsonLd = lodgingJsonLd({
    name: settings.brandName[lang],
    url: localeAbsoluteUrl(getEnv().APP_URL, locale),
    description: settings.metaDescription[lang],
    address: settings.address[lang],
  });

  const [rooms, reviews] = await Promise.all([
    listPublishedRooms(8).catch(() => []),
    listApprovedReviews(3).catch(() => []),
  ]);

  const experienceLayers: HomeExperienceLayer[] = [
    {
      key: "rooms",
      index: "01",
      label: nav("rooms"),
      title: t("roomsTitle"),
      image: homePhoto("oceanSuiteBedroom"),
      alt: t("roomsTitle"),
      href: `/${locale}/rooms`,
      cta: common("viewAllRooms"),
    },
    {
      key: "restaurant",
      index: "02",
      label: nav("restaurant"),
      title: t("restaurantTitle"),
      image: siteImage("terraceSunset"),
      alt: t("restaurantTitle"),
      href: `/${locale}/restaurant`,
      cta: common("learnMoreRestaurant"),
    },
    {
      key: "events",
      index: "03",
      label: nav("events"),
      title: t("eventsTitle"),
      image: siteImage("beachPergola"),
      alt: t("eventsTitle"),
      href: `/${locale}/events`,
      cta: nav("events"),
    },
  ];

  const indexRows: HomeRoomCard[] = rooms.map((room, index) => {
    const image = roomHighlightImage(index);
    const alt = room.name[lang];
    const price = room.priceDisplay == null ? common("askForRates") : formatRoomPrice(room, lang);
    return {
      index: String(index + 1).padStart(2, "0"),
      title: room.name[lang],
      meta: price,
      href: `/${locale}/rooms/${room.slug}`,
      image,
      alt,
    };
  });

  const roomCards: HomeRoomCard[] =
    indexRows.length > 0
      ? indexRows
      : ROOM_HIGHLIGHT_IMAGES.map((image, index) => ({
          index: String(index + 1).padStart(2, "0"),
          title: t("roomsTitle"),
          meta: common("askForRates"),
          href: `/${locale}/rooms`,
          image,
          alt: t("roomsTitle"),
        }));

  const address = publicText(settings.address[lang], contact("addressPending"));
  const homeHeroTheme = resolveHomeHeroTheme(settings.homeHeroTheme);
  const storyPlate = settingsImage(settings.storyImagePublicId, siteImage("beachPavilion"), 1600);
  const closerPlate = settingsImage(settings.closerImagePublicId, siteImage("loungeCoffee"), 1400);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeHeroThemeSync theme={homeHeroTheme} />
      <TypographyMaskHero
        theme={homeHeroTheme}
        image={homePhoto("hero")}
        alt={settings.brandName[lang]}
        pageTitle={t("title")}
        wordmark="peacock"
        description={t("heroDescription")}
        columns={[
          { index: "01", label: t("heroColAccommodation"), href: `/${locale}/rooms` },
          { index: "02", label: t("heroColDining"), href: `/${locale}/restaurant` },
          { index: "03", label: t("heroColExperiences"), href: `/${locale}/events` },
        ]}
        exploreLabel={t("exploreRooms")}
        exploreHref={`/${locale}/rooms`}
        enquireLabel={t("heroEnquireShort")}
        enquireHref={`/${locale}/rooms#enquiry`}
      />
      <HomePageShell>
        <HomeStatementPin
          plateUrl={storyPlate}
          secondaryUrl={girlPhoto("balconyCurtain")}
          detailUrl={homePhoto("balconyTub")}
          plateAlt={settings.brandName[lang]}
          lineOne={`${t("sceneCoastLead")} ${t("sceneCoastEmphasis")}.`}
          lineTwo={`${t("sceneStayLead")} ${t("sceneStayEmphasis")}.`}
          body={t("subtitle")}
          cta={t("exploreRooms")}
          href={`/${locale}/rooms`}
        />
        <HomeExperienceStage tag={t("experienceLabel")} layers={experienceLayers} />
        <HomeBleedPlate
          kicker={t("experienceLabel")}
          title={`${t("sceneTasteLead")} ${t("sceneTasteEmphasis")}.`}
          image={siteImage("cafeBreakfast")}
          alt={t("restaurantTitle")}
        />
        <HomeRoomsReel
          tag={nav("rooms")}
          title={t("findStay")}
          lead={roomsCopy("intro")}
          allHref={`/${locale}/rooms`}
          allLabel={common("viewAllRooms")}
          cards={roomCards.slice(0, ROOM_HIGHLIGHT_IMAGES.length)}
        />
        <HomeReviewsCloser
          reviewsTitle={t("reviewsTitle")}
          reviewsHref={`/${locale}/reviews`}
          reviewsLabel={nav("reviews")}
          emptyReviews={common("emptyReviews")}
          reviews={reviews.map((review) => ({
            id: String(review._id),
            text: review.text,
            author: review.authorDisplayName,
          }))}
          enquireTitle={t("enquireStay")}
          address={address}
          disclaimer={enquiry("disclaimer")}
          contactHref={`/${locale}/contact`}
          contactLabel={contact("title")}
          whatsappHref={settings.whatsappE164 ? `https://wa.me/${settings.whatsappE164.replace(/\D/g, "")}` : null}
          whatsappLabel={enquiry("whatsapp")}
          telegramHref={settings.telegramUrl ?? null}
          telegramLabel={enquiry("telegram")}
          plateUrl={closerPlate}
          plateAlt={settings.brandName[lang]}
        />
      </HomePageShell>
    </>
  );
}
