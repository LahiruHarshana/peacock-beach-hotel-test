"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { applyReviewSubmitResult } from "@/lib/forms/review-submit";

export function ReviewSubmitForm({
  locale,
  showHeading = true,
  variant = "default",
}: {
  locale: "en" | "ru";
  showHeading?: boolean;
  variant?: "default" | "experience";
}) {
  const t = useTranslations("Reviews");
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const form = formRef.current;
    if (!form) return;
    setPending(true);
    setStatus("idle");
    setError(null);
    const data = new FormData(form);
    const payload = {
      authorDisplayName: String(data.get("authorDisplayName") ?? ""),
      rating: data.get("rating") ? Number(data.get("rating")) : undefined,
      text: String(data.get("text") ?? ""),
      locale,
      consentAccepted: data.get("consentAccepted") === "on",
      website: String(data.get("website") ?? ""),
    };
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: { message?: string };
      } | null;
      const outcome = applyReviewSubmitResult({ ok: Boolean(res.ok && json?.ok), form });
      if (outcome === "error") {
        const message = json?.error?.message ?? t("submitError");
        setStatus("error");
        setError(message);
        toast.error(message);
        return;
      }
      setStatus("success");
      toast.success(t("submitSuccess"));
    } catch {
      setStatus("error");
      setError(t("submitError"));
      toast.error(t("submitError"));
    } finally {
      setPending(false);
    }
  }

  const shellClass =
    variant === "experience"
      ? "overflow-hidden rounded-sm border border-[var(--reviews-border)] bg-[var(--reviews-white)] shadow-[0_20px_52px_rgb(5_42_46_/_0.08)]"
      : "overflow-hidden rounded-[1.75rem] bg-ivory shadow-[0_24px_80px_rgb(8_43_45_/_0.16)] ring-1 ring-mocha/[0.06]";

  return (
    <section className={shellClass} aria-labelledby={showHeading ? "review-form-title" : undefined}>
      {showHeading ? (
        <div className="border-b border-mocha/10 px-6 py-8 sm:px-10 sm:py-10">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-5 bg-walnut" />
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.16rem] text-mocha/75">01 · {t("submitTitle")}</p>
            </div>
            <h2 id="review-form-title" className="text-4xl font-medium leading-none tracking-[-0.055em] sm:text-5xl">
              {t("submitTitle")}
              <span className="font-serif font-normal italic">.</span>
            </h2>
          </div>
        </div>
      ) : (
        <h2 id="review-form-title" className="sr-only">
          {t("submitTitle")}
        </h2>
      )}

      <form
        ref={formRef}
        className={`grid gap-6 px-6 py-8 sm:px-10 sm:py-10 ${variant === "experience" ? "text-[var(--reviews-ink)]" : ""}`}
        onSubmit={onSubmit}
        aria-busy={pending}
      >
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Label htmlFor="authorDisplayName" className="mb-2.5 block text-[0.65rem] uppercase tracking-[0.14rem] text-mocha/75">
              {t("name")}
            </Label>
            <Input
              id="authorDisplayName"
              name="authorDisplayName"
              required
              maxLength={80}
              autoComplete="name"
              className="h-14 rounded-xl border-mocha/10 bg-greige px-4 text-sm text-mocha shadow-sm transition-colors hover:border-mocha/20 focus-visible:border-mocha/30 focus-visible:ring-1 focus-visible:ring-mocha/20"
            />
          </div>
          <fieldset>
            <legend className="mb-2.5 text-[0.65rem] font-medium uppercase tracking-[0.14rem] text-mocha/75">{t("rating")}</legend>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className="cursor-pointer">
                  <input type="radio" name="rating" value={value} className="peer sr-only" />
                  <span className="flex h-14 items-center justify-center rounded-xl border border-mocha/10 bg-greige font-serif text-lg italic transition-all hover:border-mocha/25 peer-checked:border-mocha peer-checked:bg-mocha peer-checked:text-ivory peer-focus-visible:ring-2 peer-focus-visible:ring-mocha/30">
                    {value}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div>
          <Label htmlFor="text" className="mb-2.5 block text-[0.65rem] uppercase tracking-[0.14rem] text-mocha/75">
            {t("message")}
          </Label>
          <Textarea
            id="text"
            name="text"
            required
            minLength={10}
            maxLength={2000}
            className="min-h-40 resize-y rounded-2xl border-mocha/10 bg-greige px-4 py-4 text-sm leading-6 text-mocha shadow-sm transition-colors hover:border-mocha/20 focus-visible:border-mocha/30 focus-visible:ring-1 focus-visible:ring-mocha/20"
          />
        </div>
        <label className="group flex cursor-pointer items-start gap-3 rounded-2xl border border-mocha/10 bg-greige p-4 text-sm leading-6 text-mocha/75 transition-colors hover:border-mocha/20">
          <input
            type="checkbox"
            name="consentAccepted"
            required
            className="peer sr-only"
          />
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-mocha/20 bg-ivory text-transparent transition-colors peer-checked:border-mocha peer-checked:bg-mocha peer-checked:text-ivory peer-focus-visible:ring-2 peer-focus-visible:ring-mocha/30">
            <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
              <path d="M3.5 8.5 L6.5 11.5 L12.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </span>
          <span>{t("consent")}</span>
        </label>
        <button
          type="submit"
          disabled={pending}
          aria-disabled={pending}
          className={`group inline-flex min-h-14 w-full items-center justify-between rounded-full py-2 pl-6 pr-2 text-xs font-medium uppercase tracking-[0.12rem] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50 sm:w-auto sm:min-w-64 ${
            variant === "experience"
              ? "bg-[var(--reviews-peacock)] text-[var(--reviews-ivory)]"
              : "bg-mocha text-ivory"
          }`}
        >
          <span>{pending ? t("submitting") : t("submit")}</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory text-mocha">
            <svg viewBox="0 0 18 18" className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" aria-hidden="true">
              <path d="M5 13 L13 5 M8 5 H13 V10" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
        </button>
      </form>
      {status === "success" ? (
        <p className="border-t border-mocha/10 bg-emerald-50 px-6 py-4 text-sm text-success sm:px-10" role="status">
          {t("submitSuccess")}
        </p>
      ) : null}
      {status === "error" && error ? (
        <p className="border-t border-sage/30 bg-sand/25 px-6 py-4 text-sm text-error sm:px-10" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
