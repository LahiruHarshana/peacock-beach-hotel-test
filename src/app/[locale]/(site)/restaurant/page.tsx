import { getTranslations, setRequestLocale } from "next-intl/server";
import type { LocalePageProps } from "@/types/page-props";
import { UnpublishedNotice } from "@/components/site/content-required-banner";
import { RestaurantBeachfrontScene } from "@/components/site/restaurant/restaurant-beachfront";
import { RestaurantClosingScene } from "@/components/site/restaurant/restaurant-closing";
import { RestaurantDayDuskScene } from "@/components/site/restaurant/restaurant-day-dusk";
import { RestaurantFlavoursScene } from "@/components/site/restaurant/restaurant-flavours";
import { RestaurantFooterTransition } from "@/components/site/restaurant/restaurant-footer-transition";
import { RestaurantGallery } from "@/components/site/restaurant/restaurant-gallery";
import { RestaurantHero } from "@/components/site/restaurant/restaurant-hero";
import { RestaurantIntro } from "@/components/site/restaurant/restaurant-intro";
import { RestaurantMaterialsScene } from "@/components/site/restaurant/restaurant-materials";
import { RestaurantMenuChapter } from "@/components/site/restaurant/restaurant-menu-chapter";
import { RestaurantPageShell } from "@/components/site/restaurant/restaurant-page-shell";
import { foodPhoto } from "@/lib/content/food-photos";
import { girlPhoto } from "@/lib/content/girl-photos";
import { homePhoto } from "@/lib/content/home-photos";
import { siteImage } from "@/lib/content/site-images";
import { publicText } from "@/lib/content/public-copy";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { fallbackSiteSettings, getSiteSettings } from "@/server/repositories/site-settings";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/restaurant", titleKey: "Restaurant.title" });
}

export default async function RestaurantPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Restaurant");
  const dining = await getTranslations("Dining");
  const common = await getTranslations("Common");
  const home = await getTranslations("Home");
  const nav = await getTranslations("Nav");
  const settings = await getSiteSettings().catch(() => fallbackSiteSettings);
  const lang = locale === "ru" ? "ru" : "en";
  const intro = publicText(settings.restaurantIntro[lang], t("intro"));
  const bodyForIntro = intro !== t("intro") ? intro : home("restaurantBody");
  const unpublished = intro === t("intro");

  const base = `/${locale}/restaurant`;
  const sceneDining = `01 · ${nav("restaurant").toUpperCase()}`;
  const sceneIntro = "02";
  const sceneMaterials = "03";
  const sceneFlavours = "04";
  const sceneBeach = "05";
  const sceneDayDusk = "06";
  const sceneMenu = "07";
  const sceneGallery = "08";
  const sceneClosing = "09";

  const menuLinks = [
    { index: "01", label: dining("menuTitle"), href: `${base}/menu`, lede: dining("menuLede") },
    { index: "02", label: dining("reserveTitle"), href: `${base}/reserve`, lede: dining("reserveLede") },
    { index: "03", label: dining("manageTitle"), href: `${base}/manage`, lede: dining("manageLede") },
  ];

  const galleryImages = [
    { src: foodPhoto("kitchenFlame"), alt: t("title"), wide: true },
    { src: foodPhoto("platedMedallion"), alt: t("title") },
    { src: foodPhoto("torchedCocktail"), alt: t("title"), wide: true },
    { src: foodPhoto("skilletToss"), alt: t("title") },
    { src: foodPhoto("searedSalmon"), alt: t("title") },
  ];

  const materialImages = [
    { src: foodPhoto("kitchenFlame"), alt: t("title") },
    { src: foodPhoto("searedCatch"), alt: t("title") },
    { src: siteImage("thatchedLounge"), alt: t("title") },
    { src: foodPhoto("searedSalmon"), alt: t("title") },
  ];

  return (
    <RestaurantPageShell>
      <RestaurantHero
        scene={sceneDining}
        eyebrow={t("filmEyebrow")}
        line1={t("filmHeroLine1")}
        line2={t("filmHeroLine2")}
        support={t("filmHeroSupport")}
        scrollLabel={t("scrollLabel")}
        menuHref={`${base}/menu`}
        menuCta={dining("menuTitle")}
        image={homePhoto("lounge")}
        alt={t("title")}
      />
      {unpublished ? (
        <div className="border-y border-line bg-canvas px-[5vw] py-4 md:px-[7vw]">
          <UnpublishedNotice label={common("unpublished")} />
        </div>
      ) : null}
        <RestaurantIntro
          scene={sceneIntro}
          line1={t("filmIntroLine1")}
          line2={t("filmIntroLine2")}
          body={bodyForIntro}
          heroImage={siteImage("terraceMorning")}
          detailImage={foodPhoto("platedMedallion")}
          alt={t("title")}
          detailAlt={t("title")}
        />
        <RestaurantMaterialsScene
          scene={sceneMaterials}
          line1={t("filmMaterialsLine1")}
          line2={t("filmMaterialsLine2")}
          body={t("filmMaterialsBody")}
          images={materialImages}
        />
        <RestaurantFlavoursScene
          scene={sceneFlavours}
          title={t("filmFlavoursTitle")}
          body={t("filmFlavoursBody")}
          menuHref={`${base}/menu`}
          menuCta={dining("menuTitle")}
          image={foodPhoto("searedCatch")}
          alt={t("title")}
        />
        <RestaurantBeachfrontScene
          scene={sceneBeach}
          line1={t("filmBeachLine1")}
          line2={t("filmBeachLine2")}
          caption={t("filmBeachCaption")}
          image={girlPhoto("beachfrontDining")}
          alt={t("title")}
        />
        <RestaurantDayDuskScene
          scene={sceneDayDusk}
          dayLabel={t("filmDayLabel")}
          duskLabel={t("filmDuskLabel")}
          line1={t("filmDuskLine1")}
          line2={t("filmDuskLine2")}
          dayImage={siteImage("cafeBreakfast")}
          duskImage={foodPhoto("torchedCocktail")}
          altDay={t("title")}
          altDusk={t("title")}
        />
        <RestaurantMenuChapter
          scene={sceneMenu}
          title={t("filmMenuTitle")}
          body={`${t("filmMenuBody")} ${t("noReservations")}`}
          links={menuLinks}
          navRestaurant={nav("restaurant")}
        />
        <RestaurantGallery scene={sceneGallery} title={t("filmGalleryTitle")} images={galleryImages} />
        <RestaurantClosingScene
          scene={sceneClosing}
          title={t("filmClosingTitle")}
          body={t("filmClosingBody")}
          menuHref={`${base}/menu`}
          reserveHref={`${base}/reserve`}
          menuCta={dining("menuTitle")}
          reserveCta={dining("reserveCta")}
          image={girlPhoto("pavilionLunch")}
          alt={t("title")}
        />
      <RestaurantFooterTransition closingLabel={t("filmFooterLabel")} />
    </RestaurantPageShell>
  );
}