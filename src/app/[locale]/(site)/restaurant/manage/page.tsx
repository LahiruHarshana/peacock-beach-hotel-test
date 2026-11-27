import { setRequestLocale, getTranslations } from "next-intl/server";
import { ManageBooking } from "@/components/dining/manage-booking";
import { MenuHero, MenuPageShell } from "@/components/dining/menu-shell";
import { foodPhoto } from "@/lib/content/food-photos";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { LocalePageProps } from "@/types/page-props";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/restaurant/manage", titleKey: "Dining.manageTitle" });
}

export default async function ManagePage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Dining");
  const restaurant = await getTranslations("Restaurant");

  return (
    <MenuPageShell>
      <MenuHero
        eyebrow={t("eyebrow")}
        title={t("manageTitle")}
        intro={t("manageLede")}
        image={foodPhoto("kitchenFlame")}
        alt={t("manageTitle")}
        backHref={`/${locale}/restaurant`}
        backLabel={restaurant("title")}
        scrollLabel={restaurant("scrollLabel")}
      />
      <section className="border-t border-line bg-canvas px-[5vw] py-16 md:px-[7vw] md:py-24">
        <ManageBooking />
      </section>
    </MenuPageShell>
  );
}
