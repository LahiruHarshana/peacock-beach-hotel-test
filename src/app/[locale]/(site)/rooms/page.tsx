import type { LocalePageProps } from "@/types/page-props";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EnquiryModule } from "@/components/site/enquiry-module";
import { RoomsEnquiryFinale } from "@/components/site/rooms/rooms-enquiry-finale";
import { RoomsFilmCollection } from "@/components/site/rooms/rooms-film-collection";
import { RoomsFilmHero } from "@/components/site/rooms/rooms-film-hero";
import { RoomsPageShell } from "@/components/site/rooms/rooms-page-shell";
import type { RoomsFilmCard } from "@/components/site/rooms/types";
import { girlPhoto } from "@/lib/content/girl-photos";
import { homePhoto } from "@/lib/content/home-photos";
import { roomHighlightImage } from "@/lib/content/room-highlight-photos";
import { cloudinaryImageUrl } from "@/lib/media/cloudinary";
import { listPublishedRooms, formatRoomPrice } from "@/server/repositories/rooms";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/rooms", titleKey: "Rooms.title" });
}

export default async function RoomsPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Rooms");
  const common = await getTranslations("Common");
  const enquiry = await getTranslations("Enquiry");
  const nav = await getTranslations("Nav");
  const lang = locale as "en" | "ru";
  const rooms = await listPublishedRooms().catch(() => []);

  const publishedCards: RoomsFilmCard[] = rooms.map((room, index) => {
    const sorted = [...(room.images ?? [])].sort((a, b) => a.order - b.order);
    const photo = sorted[0];
    let image: string = roomHighlightImage(index);
    let alt = room.name[lang];
    if (photo?.publicId) {
      try {
        image = cloudinaryImageUrl(photo.publicId, 1800);
        alt = photo.alt[lang] || room.name[lang];
      } catch {
        image = roomHighlightImage(index);
      }
    }
    return {
      key: room.slug,
      index: String(index + 1).padStart(2, "0"),
      title: room.name[lang],
      description: room.description[lang],
      meta: t("capacity", { count: room.capacity }),
      price: formatRoomPrice(room, lang),
      image,
      alt,
      href: `/${locale}/rooms/${room.slug}`,
      cta: t("viewRoom"),
    };
  });

  const atmosphereCards: RoomsFilmCard[] = [
    {
      key: "sea-morning",
      index: "01",
      title: t("filmSceneOneTitle"),
      description: t("filmSceneOneBody"),
      meta: t("filmSceneOneMeta"),
      image: girlPhoto("balconyCurtain"),
      alt: t("filmSceneOneTitle"),
    },
    {
      key: "quiet-interior",
      index: "02",
      title: t("filmSceneTwoTitle"),
      description: t("filmSceneTwoBody"),
      meta: t("filmSceneTwoMeta"),
      image: girlPhoto("suiteBed"),
      alt: t("filmSceneTwoTitle"),
    },
    {
      key: "coastal-rhythm",
      index: "03",
      title: t("filmSceneThreeTitle"),
      description: t("filmSceneThreeBody"),
      meta: t("filmSceneThreeMeta"),
      image: girlPhoto("oceanSuite"),
      alt: t("filmSceneThreeTitle"),
    },
  ];
  const cards = publishedCards.length > 0 ? publishedCards : atmosphereCards;

  return (
    <RoomsPageShell>
      <RoomsFilmHero
        scene={`01 · ${nav("rooms").toUpperCase()}`}
        eyebrow={t("filmEyebrow")}
        title={t("title")}
        intro={t("intro")}
        image={homePhoto("seaRoom")}
        alt={t("title")}
        scrollLabel={t("scrollLabel")}
      />

      <RoomsFilmCollection
        scene={`02 · ${nav("rooms").toUpperCase()}`}
        title={t("collectionTitle")}
        intro={t("collectionIntro")}
        cards={cards}
        emptyMessage={publishedCards.length === 0 ? common("emptyRooms") : undefined}
      />

      <RoomsEnquiryFinale
        scene={`03 · ${enquiry("title").toUpperCase()}`}
        title={enquiry("title")}
        lede={enquiry("disclaimer")}
        image={girlPhoto("soakingTub")}
        alt={enquiry("title")}
      >
        <EnquiryModule locale={lang} />
      </RoomsEnquiryFinale>
    </RoomsPageShell>
  );
}
