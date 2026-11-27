import { getTranslations, setRequestLocale } from "next-intl/server";
import type { LocalePageProps } from "@/types/page-props";
import { UnpublishedNotice } from "@/components/site/content-required-banner";
import { AboutCreditsCloser } from "@/components/site/about/about-credits-closer";
import { AboutEditorialChapter } from "@/components/site/about/about-editorial-chapter";
import { AboutFilmLeader } from "@/components/site/about/about-film-leader";
import { AboutFooterTransition } from "@/components/site/about/about-footer-transition";
import { AboutIntroScene } from "@/components/site/about/about-intro-scene";
import { AboutPageShell } from "@/components/site/about/about-page-shell";
import { AboutStoryStage } from "@/components/site/about/about-story-stage";
import { girlPhoto } from "@/lib/content/girl-photos";
import { homePhoto } from "@/lib/content/home-photos";
import { siteImage } from "@/lib/content/site-images";
import { publicText } from "@/lib/content/public-copy";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { fallbackSiteSettings, getSiteSettings } from "@/server/repositories/site-settings";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/about", titleKey: "About.title" });
}

export default async function AboutPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");
  const home = await getTranslations("Home");
  const common = await getTranslations("Common");
  const nav = await getTranslations("Nav");
  const restaurant = await getTranslations("Restaurant");
  const events = await getTranslations("Events");
  const contact = await getTranslations("Contact");
  const settings = await getSiteSettings().catch(() => fallbackSiteSettings);
  const lang = locale === "ru" ? "ru" : "en";
  const body = publicText(settings.aboutBody[lang], t("body"));
  const unpublished = body === t("body");
  const address = publicText(settings.address[lang], contact("addressPending"));

  const sceneOpening = `01 · ${nav("about").toUpperCase()}`;
  const sceneIntro = `02 · ${t("coastTitle").toUpperCase()}`;
  const sceneHospitality = "03";
  const sceneRooms = `04 · ${nav("rooms").toUpperCase()}`;
  const sceneDining = `05 · ${nav("restaurant").toUpperCase()}`;
  const sceneSeasonal = `06 · ${nav("events").toUpperCase()}`;
  const sceneEnquiry = `07 · ${contact("title").toUpperCase()}`;
  const sceneClosing = `08 · PEACOCK`;

  return (
    <AboutPageShell>
      <AboutFilmLeader
        sceneTag={sceneOpening}
        eyebrow={home("eyebrow")}
        kicker={t("hospitalityEyebrow")}
        title={t("title")}
        subtitle={home("heroSupport")}
        scrollLabel={home("scrollCue")}
        image={siteImage("beachPavilion")}
        secondaryImage={homePhoto("beach")}
        reelImageTwo={girlPhoto("oceanSuite")}
        reelImageThree={siteImage("terraceMorning")}
        alt={t("title")}
      />
      {unpublished ? (
        <div className="border-y border-line bg-canvas px-[5vw] py-4 md:px-[7vw]">
          <UnpublishedNotice label={common("unpublished")} />
        </div>
      ) : null}
        <AboutIntroScene
          sceneTag={sceneIntro}
          headline={t("coastTitle")}
          statement={home("heroDescription")}
          image={homePhoto("coast")}
          alt={t("coastTitle")}
        />
        <AboutStoryStage
          sceneTag={sceneHospitality}
          eyebrow={t("hospitalityEyebrow")}
          headline={home("trustTitle")}
          body={body}
          mainUrl={siteImage("thatchedLounge")}
          secondaryUrl={siteImage("loungeCoffee")}
          detailUrl={girlPhoto("soakingTub")}
          mainAlt={t("title")}
        />
        <AboutEditorialChapter
          sceneTag={sceneRooms}
          index="04"
          label={nav("rooms")}
          title={home("roomsTitle")}
          body={home("trustBody")}
          href={`/${locale}/rooms`}
          image={siteImage("oceanBedroom")}
          alt={home("roomsTitle")}
          tone="ivory"
        />
        <AboutEditorialChapter
          sceneTag={sceneDining}
          index="05"
          label={nav("restaurant")}
          title={home("restaurantTitle")}
          body={restaurant("intro")}
          href={`/${locale}/restaurant`}
          image={girlPhoto("pavilionLunch")}
          alt={home("restaurantTitle")}
          tone="surface"
          imageRight
        />
        <AboutEditorialChapter
          sceneTag={sceneSeasonal}
          index="06"
          label={nav("events")}
          title={home("eventsTitle")}
          body={events("title")}
          href={`/${locale}/events`}
          image={siteImage("beachPergola")}
          alt={home("eventsTitle")}
          tone="sand"
        />
        <AboutCreditsCloser
          sceneTag={sceneEnquiry}
          title={home("enquireStay")}
          address={address}
          roomsHref={`/${locale}/rooms`}
          roomsLabel={home("exploreRooms")}
          contactHref={`/${locale}/contact`}
          contactLabel={contact("title")}
          plateUrl={siteImage("terraceSunset")}
          plateAlt={t("title")}
        />
      <AboutFooterTransition closingLabel={sceneClosing} />
    </AboutPageShell>
  );
}