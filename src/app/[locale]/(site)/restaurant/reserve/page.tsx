import { setRequestLocale, getTranslations } from "next-intl/server";
import { MenuHero, MenuPageShell } from "@/components/dining/menu-shell";
import { ReserveForm } from "@/components/dining/reserve-form";
import { foodPhoto } from "@/lib/content/food-photos";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { LocalePageProps } from "@/types/page-props";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/restaurant/reserve", titleKey: "Dining.reserveTitle" });
}

export default async function ReservePage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Dining");
  const restaurant = await getTranslations("Restaurant");

  return (
    <MenuPageShell>
      <MenuHero
        eyebrow={t("eyebrow")}
        title={t("reserveTitle")}
        intro={t("reserveLede")}
        image={foodPhoto("torchedCocktail")}
        alt={t("reserveTitle")}
        backHref={`/${locale}/restaurant`}
        backLabel={restaurant("title")}
        scrollLabel={restaurant("scrollLabel")}
      />
      <section className="border-t border-line bg-canvas px-[5vw] py-16 md:px-[7vw] md:py-24">
        <ReserveForm />
      </section>
    </MenuPageShell>
  );
}
