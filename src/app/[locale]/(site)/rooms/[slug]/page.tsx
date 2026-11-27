import { notFound } from "next/navigation";
import type { LocaleSlugPageProps } from "@/types/page-props";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { EnquiryModule } from "@/components/site/enquiry-module";
import { PageIntro, PageShell } from "@/components/site/page-intro";
import { HOME_PHOTOS } from "@/lib/content/home-photos";
import { getPublishedRoomBySlug, formatRoomPrice } from "@/server/repositories/rooms";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: LocaleSlugPageProps) {
  const { locale, slug } = await params;
  const room = await getPublishedRoomBySlug(slug).catch(() => null);
  const title = room?.name[locale as "en" | "ru"] ?? "Room";
  return buildPageMetadata({ locale, path: `/rooms/${slug}`, title });
}

export default async function RoomDetailPage({ params }: LocaleSlugPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Rooms");
  const home = await getTranslations("Home");
  const room = await getPublishedRoomBySlug(slug).catch(() => null);
  if (!room) notFound();
  const lang = locale as "en" | "ru";
  const roomPhotos = [HOME_PHOTOS.seaRoom, HOME_PHOTOS.balcony, HOME_PHOTOS.bedroom];
  const lead = slug.includes("garden") ? 1 : slug.includes("family") ? 2 : 0;
  const photos = [0, 1, 2].map((offset) => roomPhotos[(lead + offset) % roomPhotos.length]!);

  return (
    <PageShell>
      <PageIntro eyebrow={home("eyebrow")} title={room.name[lang]} lede={t("capacity", { count: room.capacity })} />

      <div className="grid gap-3 border-b border-line px-[5vw] pb-12 md:grid-cols-2">
        {photos.map((src, index) => (
          <div
            key={src}
            className={`relative overflow-hidden bg-surface ${index === 0 ? "min-h-[22rem] md:col-span-2 md:min-h-[32rem]" : "min-h-[16rem]"}`}
          >
            <Image
              src={src}
              alt={room.name[lang]}
              fill
              className="object-cover"
              sizes={index === 0 ? "92vw" : "(min-width: 768px) 45vw, 92vw"}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      <div className="grid gap-12 border-b border-line px-[5vw] pb-12 lg:grid-cols-[1.2fr_0.8fr]">
        <p className="text-base leading-7 tracking-[-0.02em] text-mist">{room.description[lang]}</p>
        <aside>
          <p className="text-xs font-medium uppercase tracking-[0.14rem] text-mist">{formatRoomPrice(room, lang)}</p>
          <h2 className="mt-6 text-xl font-medium tracking-[-0.03em]">{t("detailAmenities")}</h2>
          <ul className="mt-4 border-t border-line text-sm text-paper">
            {room.amenities.map((item) => (
              <li key={item} className="border-b border-line py-3">
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div id="enquiry" className="scroll-mt-28 px-[5vw] pb-20 pt-10">
        <EnquiryModule locale={lang} roomSlug={room.slug} roomTitle={room.name[lang]} maxGuests={room.capacity} />
      </div>
    </PageShell>
  );
}
