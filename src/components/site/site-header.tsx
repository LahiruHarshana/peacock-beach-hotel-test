"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "", key: "home" },
  { href: "/about", key: "about" },
  { href: "/rooms", key: "rooms" },
  { href: "/restaurant", key: "restaurant" },
  { href: "/reviews", key: "reviews" },
  { href: "/events", key: "events" },
  { href: "/contact", key: "contact" },
] as const;

function isHomePath(pathname: string) {
  return /^\/(en|ru)\/?$/.test(pathname);
}

export function SiteHeader() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [homeHero, setHomeHero] = useState<"dark" | "light">("dark");
  const onHome = isHomePath(pathname);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setOpen(false));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = document.documentElement.scrollTop || window.scrollY;
      setAtTop(y < 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    const read = () => {
      const value = document.documentElement.dataset.homeHero;
      setHomeHero(value === "light" ? "light" : "dark");
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-home-hero"] });
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const overHero = onHome && atTop;
  const overDarkHero = overHero && homeHero !== "light";
  const overLightHero = overHero && homeHero === "light";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ease-halden",
        overDarkHero || overLightHero
          ? "border-b border-transparent bg-transparent"
          : "border-b border-line bg-canvas/95 backdrop-blur-sm",
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[90] focus:bg-paper focus:px-4 focus:py-2 focus:text-canvas"
      >
        {t("home")}
      </a>
      <div className="mx-auto flex h-14 w-full max-w-[96rem] items-center justify-between gap-6 px-[5vw]">
        <Link
          href={`/${locale}`}
          className={cn(
            "text-[0.78rem] font-normal tracking-[0.01em] lowercase",
            overDarkHero ? "text-ivory" : "text-paper",
          )}
          aria-label="Peacock Beach Hotel"
        >
          peacock
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((link) => {
            const href = `/${locale}${link.href}`;
            const active =
              link.href === ""
                ? pathname === href || pathname === `${href}/`
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={link.key}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "halden-nav transition-colors duration-300 ease-halden",
                  overDarkHero
                    ? active
                      ? "text-ivory"
                      : "text-sand hover:text-ivory"
                    : active
                      ? "text-paper"
                      : "text-mist hover:text-paper",
                )}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className={cn(
              "min-h-9 px-2 py-2 text-[0.62rem] uppercase tracking-[0.14em] lg:hidden",
              overDarkHero ? "text-ivory" : "text-paper",
            )}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? t("close") : t("menu")}
          </button>
          <LanguageSwitch overDarkHero={overDarkHero} />
          <Link
            href={`/${locale}/rooms#enquiry`}
            className={cn(
              "hidden items-center gap-2 text-[0.62rem] uppercase tracking-[0.14em] transition-colors duration-300 ease-halden sm:inline-flex",
              overDarkHero
                ? "text-sand hover:text-ivory"
                : "border border-line bg-paper px-3 py-2 text-canvas hover:opacity-90",
            )}
          >
            {t("enquire")}
          </Link>
        </div>
      </div>
      {open
        ? createPortal(
            <nav id="mobile-navigation" aria-label={t("menu")} className="fixed inset-0 z-40 bg-canvas text-paper lg:hidden">
              <ul className="flex h-full flex-col justify-end gap-2 px-[7vw] pb-16 pt-24">
                {links.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={`/${locale}${link.href}`}
                      onClick={() => setOpen(false)}
                      className="block py-1 text-3xl font-light tracking-[-0.04em]"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>,
            document.body,
          )
        : null}
    </header>
  );
}

function LanguageSwitch({ overDarkHero }: { overDarkHero: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "en" ? "ru" : "en";
  const stripped = pathname.replace(/^\/(en|ru)/, "") || "";
  const href = `/${other}${stripped}`;

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-9 items-center px-2 text-[0.62rem] uppercase tracking-[0.16em] transition-colors",
        overDarkHero ? "text-sand hover:text-ivory" : "text-mist hover:text-paper",
      )}
      aria-label={other === "en" ? "EN, switch to English" : "RU, переключить на русский"}
    >
      {other.toUpperCase()}
    </Link>
  );
}
