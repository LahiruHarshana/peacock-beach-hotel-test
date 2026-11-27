import { getTranslations, setRequestLocale } from "next-intl/server";
import type { LocalePageProps } from "@/types/page-props";
import { EnquiryModule } from "@/components/site/enquiry-module";
import { ContactEnquiryChapter, ContactClose, ContactWordmark } from "@/components/site/contact/contact-chapters";
import { ContactDirections, ContactMethods } from "@/components/site/contact/contact-details";
import { ContactPageShell } from "@/components/site/contact/contact-page-shell";
import { ContactSpatialHero } from "@/components/site/contact/contact-spatial-hero";
import { girlPhoto } from "@/lib/content/girl-photos";
import { homePhoto } from "@/lib/content/home-photos";
import { publicText } from "@/lib/content/public-copy";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { fallbackSiteSettings, getSiteSettings } from "@/server/repositories/site-settings";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/contact", titleKey: "Contact.title" });
}

export default async function ContactPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");
  const enquiry = await getTranslations("Enquiry");
  const home = await getTranslations("Home");
  const nav = await getTranslations("Nav");
  const settings = await getSiteSettings().catch(() => fallbackSiteSettings);
  const lang = locale === "ru" ? "ru" : "en";
  const address = publicText(settings.address[lang], t("addressPending"));
  const mapIsEmbed = Boolean(settings.mapUrl && /google\.[^/]+\/maps|maps\.google\./.test(settings.mapUrl));

  const methods = [
    { index: "01", label: t("address"), value: address, href: settings.mapUrl ?? undefined },
    ...(settings.whatsappE164
      ? [{ index: "02", label: enquiry("whatsapp"), value: settings.whatsappE164, href: `https://wa.me/${settings.whatsappE164.replace(/\D/g, "")}` }]
      : []),
    ...(settings.telegramUrl ? [{ index: "03", label: enquiry("telegram"), value: enquiry("telegram"), href: settings.telegramUrl }] : []),
  ];

  return (
    <ContactPageShell>
      <ContactSpatialHero
        scene="01"
        eyebrow={t("filmEyebrow")}
        location={home("eyebrow")}
        title={t("title")}
        address={address}
        line1={t("filmDisplayLine1")}
        line2={t("filmDisplayLine2")}
        support={t("filmSupport")}
        scrollLabel={t("scrollLabel")}
        images={{ coast: homePhoto("coast"), lounge: girlPhoto("oceanSuite"), terrace: homePhoto("terrace") }}
      />
      <ContactDirections
        scene="02"
        title={t("directions")}
        address={address}
        directionsLabel={t("directions")}
        mapPending={t("mapPending")}
        mapUrl={settings.mapUrl}
        mapIsEmbed={mapIsEmbed}
        image={homePhoto("terrace")}
        alt={t("title")}
      />
      <ContactMethods scene="03" methods={methods} />
      <ContactEnquiryChapter scene="04" title={enquiry("title")} lede={enquiry("disclaimer")} image={girlPhoto("balconyCurtain")} alt={enquiry("title")}>
        <EnquiryModule locale={lang} />
      </ContactEnquiryChapter>
      <ContactClose
        scene="05"
        line1={t("filmClosingLine1")}
        line2={t("filmClosingLine2")}
        roomsHref={`/${locale}/rooms`}
        exploreRooms={home("exploreRooms")}
        disclaimer={`${nav("contact")} · ${enquiry("disclaimer")}`}
        image={homePhoto("beach")}
        alt={t("title")}
      />
      <ContactWordmark label={t("filmFooterLabel")} />
    </ContactPageShell>
  );
}
