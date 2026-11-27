"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  locale: "en" | "ru";
  roomSlug?: string;
  roomTitle?: string;
  maxGuests?: number;
  variant?: "page" | "hero";
};

export function EnquiryModule({ locale, roomSlug, roomTitle, maxGuests = 4, variant = "page" }: Props) {
  const t = useTranslations("Enquiry");
  const common = useTranslations("Common");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [channel, setChannel] = useState<"whatsapp" | "telegram">("whatsapp");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const hero = variant === "hero";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCopied(false);
    setLoading(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkIn,
          checkOut,
          guests,
          channel,
          roomSlug,
          locale,
        }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Unable to prepare enquiry.");
        setUrl(null);
        setMessage(null);
        return;
      }
      setUrl(json.data.url);
      setMessage(json.data.message);
    } catch {
      setError("Unable to prepare enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyMessage() {
    if (!message) return;
    await navigator.clipboard.writeText(message);
    setCopied(true);
  }

  const fieldClass = hero
    ? "h-11 rounded-none border-0 border-b border-ocean/15 bg-transparent px-0 text-sm text-ocean shadow-none hover:border-ocean/30 focus-visible:border-gold focus-visible:ring-0"
    : "h-12 rounded-none border-0 border-b border-line bg-transparent px-0 text-sm text-paper shadow-none focus-visible:border-signal focus-visible:ring-0";

  return (
    <section
      className={
        hero
          ? "border border-sand/20 bg-ivory/95 text-ocean shadow-[0_24px_80px_rgb(8_43_45_/_0.3)]"
          : "overflow-hidden rounded-[22px] border border-line bg-surface text-paper shadow-[0_20px_60px_rgb(8_43_45_/_0.06)]"
      }
      aria-labelledby={hero ? "hero-enquiry-title" : "enquiry-title"}
    >
      {hero ? (
        <div className="flex items-end justify-between gap-4 px-4 pb-0 pt-3 sm:px-6">
          <p id="hero-enquiry-title" className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-ocean/70">
            {t("title")}
          </p>
          <p className="hidden max-w-sm text-right text-[0.65rem] leading-4 text-ocean/55 md:block">{t("disclaimer")}</p>
        </div>
      ) : (
        <div className="border-b border-line px-5 py-6 sm:px-10 sm:py-8">
          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-signal">01</p>
          <h2 id="enquiry-title" className="mt-2.5 text-2xl font-light leading-none tracking-[-0.05em] sm:mt-3 sm:text-4xl">
            {t("title")}
          </h2>
          {roomTitle ? <p className="mt-3 text-sm leading-6 text-mist sm:mt-4">{roomTitle}</p> : null}
        </div>
      )}

      <form
        className={cn(hero ? "grid gap-4 px-4 py-4 sm:px-6 md:grid-cols-12 md:items-end" : "grid grid-cols-2 gap-4 px-5 py-6 sm:gap-6 sm:px-10 sm:py-9")}
        onSubmit={onSubmit}
      >
        <div className={hero ? "md:col-span-2" : "group"}>
          <Label htmlFor={hero ? "hero-checkIn" : "checkIn"} className={cn("mb-2.5 block text-[0.65rem] uppercase tracking-[0.14rem]", hero ? "text-mocha/75" : "text-mist")}>
            {t("checkIn")}
          </Label>
          <Input
            id={hero ? "hero-checkIn" : "checkIn"}
            type="date"
            required
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className={hero ? "md:col-span-2" : "group"}>
          <Label htmlFor={hero ? "hero-checkOut" : "checkOut"} className={cn("mb-2.5 block text-[0.65rem] uppercase tracking-[0.14rem]", hero ? "text-mocha/75" : "text-mist")}>
            {t("checkOut")}
          </Label>
          <Input
            id={hero ? "hero-checkOut" : "checkOut"}
            type="date"
            required
            min={checkIn || undefined}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className={hero ? "md:col-span-2" : "col-span-2 group md:col-span-1"}>
          <Label htmlFor={hero ? "hero-guests" : "guests"} className={cn("mb-2.5 block text-[0.65rem] uppercase tracking-[0.14rem]", hero ? "text-mocha/75" : "text-mist")}>
            {t("guests")}
          </Label>
          <Input
            id={hero ? "hero-guests" : "guests"}
            type="number"
            min={1}
            max={maxGuests}
            required
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className={fieldClass}
          />
        </div>
        <fieldset className={hero ? "md:col-span-3" : "col-span-2 md:col-span-1"}>
          <legend className={cn("mb-2.5 text-[0.65rem] font-medium uppercase tracking-[0.14rem]", hero ? "text-mocha/75" : "text-mist")}>{t("channel")}</legend>
          <div className="grid grid-cols-2 gap-2.5">
            {(["whatsapp", "telegram"] as const).map((value) => (
              <label key={value} className="cursor-pointer">
                <input
                  type="radio"
                  name={hero ? "hero-channel" : "channel"}
                  value={value}
                  checked={channel === value}
                  onChange={() => setChannel(value)}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "flex items-center justify-center px-4 text-sm transition-all peer-focus-visible:ring-2",
                    hero
                      ? "h-11 justify-between border-b border-ocean/15 peer-checked:border-gold peer-checked:text-ocean"
                      : "h-11 rounded-xl border border-line bg-canvas/40 text-mist hover:border-paper/40 peer-checked:border-paper peer-checked:bg-paper peer-checked:text-canvas peer-focus-visible:ring-signal/40",
                  )}
                >
                  {t(value)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className={hero ? "md:col-span-3" : "col-span-2 pt-2"}>
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "group inline-flex items-center justify-between text-[0.65rem] font-medium uppercase tracking-[0.12rem] disabled:opacity-50",
              hero
                ? "h-11 w-full bg-ocean px-5 text-ivory"
                : "min-h-12 w-full rounded-full border border-line bg-paper px-6 py-3 text-canvas transition-colors duration-300 ease-halden hover:bg-paper/90 disabled:opacity-50 sm:w-auto sm:min-w-56",
            )}
          >
            <span>{loading ? common("loading") : t("continue")}</span>
            {hero ? <span aria-hidden="true">→</span> : <span aria-hidden="true">→</span>}
          </button>
        </div>
      </form>

      <div className={hero ? "px-4 pb-3 sm:px-6" : "border-t border-line px-6 py-6 sm:px-8"}>
        {hero ? <p className="mb-2 text-[0.65rem] leading-4 text-ocean/55 md:hidden">{t("disclaimer")}</p> : (
          <div className="grid gap-3 text-xs leading-5 text-mist md:grid-cols-2 md:gap-10">
            <p>{t("disclaimer")}</p>
            <p>{common("staffDisclaimer")}</p>
          </div>
        )}
        {error ? (
          <p className="mt-3 rounded-xl border border-sage/30 bg-sand/25 px-4 py-3 text-sm text-error" role="alert">
            {error}
          </p>
        ) : null}
        {!url && message ? (
          <p className="mt-3 border border-line bg-canvas px-4 py-3 text-sm text-mist" role="status">
            {t("contactNotConfigured")}
          </p>
        ) : null}
        {message ? (
          <div className="mt-3 border border-line bg-canvas p-4">
            <div className="flex flex-wrap gap-3">
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center bg-paper px-6 text-xs font-medium uppercase tracking-wider text-canvas"
                >
                  {t("continue")}
                </a>
              ) : null}
              <button
                type="button"
                onClick={copyMessage}
                className="inline-flex min-h-11 items-center border border-line px-6 text-xs font-medium uppercase tracking-wider text-paper"
              >
                {copied ? t("copied") : t("copyMessage")}
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-mist">{message}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
