import "@/app/globals.css";
import { Cormorant_Garamond, Instrument_Serif, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toaster } from "sonner";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SmoothScroll } from "@/components/site/motion/smooth-scroll";
import type { ChildrenProps, LocalePageProps } from "@/types/page-props";

const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
});

const cyrillic = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-cyrillic",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocalePageProps & ChildrenProps) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "ru")) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${serif.variable} ${cyrillic.variable} ${inter.variable} h-full`}>
      <body className="halden-type min-h-full bg-canvas font-sans text-paper antialiased">
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll />
          <SiteHeader />
          <main id="main-content" className="flex-1 pt-16">
            {children}
          </main>
          <SiteFooter />
          <Toaster richColors position="top-center" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
