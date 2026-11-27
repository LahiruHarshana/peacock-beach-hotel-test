import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { fallbackSiteSettings, getSiteSettings } from "@/server/repositories/site-settings";

const primaryLinks = [
  { href: "", key: "home" },
  { href: "/about", key: "about" },
  { href: "/rooms", key: "rooms" },
  { href: "/restaurant", key: "restaurant" },
] as const;

const experienceLinks = [
  { href: "/reviews", key: "reviews" },
  { href: "/events", key: "events" },
  { href: "/contact", key: "contact" },
] as const;

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav");
  const common = await getTranslations("Common");
  const home = await getTranslations("Home");
  const enquiry = await getTranslations("Enquiry");
  const dining = await getTranslations("Dining");
  const locale = await getLocale();
  const settings = await getSiteSettings().catch(() => fallbackSiteSettings);
  const year = 2026;

  return (
    <footer className="halden-dark relative overflow-hidden border-t border-line px-[5vw] pt-14 text-paper md:px-[7vw] md:pt-24">
      <div
        className="pointer-events-none absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-sand/[0.06] blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[96rem]">
        <div className="grid gap-10 border-b border-line pb-10 lg:grid-cols-12 lg:gap-10 lg:pb-16">
          <div className="lg:col-span-5">
            <p className="text-[0.58rem] uppercase tracking-[0.28em] text-sand">{home("eyebrow")}</p>
            <p className="mt-3 max-w-[18ch] text-[clamp(1.65rem,2.6vw,2.35rem)] font-light leading-[1.15] tracking-[-0.035em] text-paper md:mt-4">
              {t("tagline")}
            </p>
            <div className="mt-6 md:mt-8">
              <Link
                href={`/${locale}/rooms#enquiry`}
                className="group inline-flex items-center gap-3 rounded-full border border-sand/30 bg-paper/10 px-6 py-3 text-[0.56rem] uppercase tracking-[0.22em] text-paper transition-colors duration-300 hover:bg-paper hover:text-canvas"
              >
                <span>{nav("enquire")}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 sm:gap-10 lg:col-span-7">
            <nav aria-label={t("explore")}>
              <p className="mb-4 text-[0.54rem] uppercase tracking-[0.26em] text-sand md:mb-5">{t("explore")}</p>
              <ul className="space-y-2.5 text-sm font-light text-mist md:space-y-3.5">
                {primaryLinks.map((link) => (
                  <li key={link.key}>
                    <Link href={`/${locale}${link.href}`} className="transition-colors duration-200 hover:text-paper">
                      {nav(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label={nav("restaurant")}>
              <p className="mb-4 text-[0.54rem] uppercase tracking-[0.26em] text-sand md:mb-5">{home("title")}</p>
              <ul className="space-y-2.5 text-sm font-light text-mist md:space-y-3.5">
                {experienceLinks.map((link) => (
                  <li key={link.key}>
                    <Link href={`/${locale}${link.href}`} className="transition-colors duration-200 hover:text-paper">
                      {nav(link.key)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={`/${locale}/restaurant/reserve`} className="transition-colors duration-200 hover:text-paper">
                    {dining("reserveTitle")}
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="col-span-2 rounded-2xl border border-line bg-paper/[0.03] p-4 sm:col-span-1 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0">
              <p className="mb-3 text-[0.54rem] uppercase tracking-[0.26em] text-sand sm:mb-5">{nav("contact")}</p>
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2.5 text-sm font-light text-mist sm:block sm:space-y-3.5">
                <p className="w-full text-paper/85 sm:text-mist">{home("heroPlace")}</p>
                {settings.whatsappE164 ? (
                  <a
                    className="inline-block transition-colors duration-200 hover:text-paper sm:block"
                    href={`https://wa.me/${settings.whatsappE164.replace(/\D/g, "")}`}
                  >
                    {enquiry("whatsapp")}
                  </a>
                ) : null}
                {settings.telegramUrl ? (
                  <a className="inline-block transition-colors duration-200 hover:text-paper sm:block" href={settings.telegramUrl}>
                    {enquiry("telegram")}
                  </a>
                ) : null}
                <Link href={`/${locale}/restaurant/menu`} className="inline-block transition-colors duration-200 hover:text-paper sm:block">
                  {dining("menuTitle")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-5 text-[0.56rem] uppercase tracking-[0.2em] text-mist md:py-6 md:text-[0.58rem]">
          <p>© {year} Peacock Beach Hotel. {t("rights")}</p>
          <div className="flex items-center gap-6 md:gap-8">
            <Link href={locale === "en" ? "/ru" : "/en"} className="transition-colors hover:text-paper">
              {locale === "en" ? common("languageRu") : common("languageEn")}
            </Link>
            <Link href="/admin/login" className="transition-colors hover:text-paper">
              {nav("admin")}
            </Link>
          </div>
        </div>

        <div className="overflow-hidden pb-[0.12em] pt-1 md:pt-2" aria-hidden="true">
          <p className="halden-spaced select-none text-center text-[15vw] font-light leading-[0.86] text-paper/[0.06] md:text-[14vw]">
            peacock
          </p>
        </div>
      </div>
    </footer>
  );
}
