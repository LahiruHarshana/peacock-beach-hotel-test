"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

const underlineField =
  "mt-2 h-11 w-full rounded-none border-0 border-b border-line bg-transparent px-0 text-sm text-paper placeholder:text-mist/60 transition-colors focus:border-signal focus:outline-none";

type Found = {
  kind: "reservation" | "order";
  code: string;
  status: string;
  canCancel: boolean;
  date?: string;
  time?: string;
  guests?: number;
  tableName?: string;
  total?: number;
  currency?: string;
  items?: Array<{ name: { en: string; ru: string }; quantity: number; lineTotal: number }>;
};

export function ManageBooking() {
  const t = useTranslations("Dining");
  const root = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState<"reservation" | "order">("reservation");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [found, setFound] = useState<Found | null>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const animateCards = useCallback((gsap: typeof import("gsap").default) => {
    const container = root.current;
    if (!container) return;
    const cards = gsap.utils.toArray<HTMLElement>("[data-manage-card]", container);
    if (cards.length === 0) return;

    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { y: 28, autoAlpha: 0.25 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            scroller: document.documentElement,
            start: "top 90%",
            end: "top 55%",
            scrub: 0.65,
          },
        },
      );
    });
  }, []);

  useCinematic(root, animateCards, MOTION);

  async function lookup(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setPending(true);
    try {
      const response = await fetch(`/api/dining/${kind === "reservation" ? "reservations" : "orders"}/lookup`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase(), email: email || undefined, phone: phone || undefined }),
      });
      const body = await response.json();
      if (!body.ok) {
        setFound(null);
        setMessage(body.error?.message ?? t("error"));
        return;
      }
      setFound(body.data);
    } catch {
      setMessage(t("error"));
    } finally {
      setPending(false);
    }
  }

  async function cancel() {
    if (!found) return;
    setPending(true);
    try {
      const response = await fetch(`/api/dining/${found.kind === "reservation" ? "reservations" : "orders"}/cancel`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: found.code, email: email || undefined, phone: phone || undefined }),
      });
      const body = await response.json();
      if (!body.ok) {
        setMessage(body.error?.message ?? t("error"));
        return;
      }
      setFound({ ...found, status: body.data.status, canCancel: false });
    } catch {
      setMessage(t("error"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div ref={root} className="grid gap-10 lg:grid-cols-2 lg:items-start">
      <form
        data-manage-card
        onSubmit={lookup}
        className="rounded-[20px] border border-line bg-surface p-6 shadow-[0_24px_72px_rgb(8_43_45_/_0.08)] md:p-8"
      >
        <div className="flex flex-wrap gap-2 border-b border-line pb-5">
          <button
            type="button"
            className={`rounded-full px-5 py-2 text-[0.56rem] uppercase tracking-[0.22em] transition-colors ${
              kind === "reservation" ? "bg-paper text-canvas" : "border border-line bg-canvas/60 text-mist hover:text-paper"
            }`}
            onClick={() => setKind("reservation")}
          >
            {t("reservation")}
          </button>
          <button
            type="button"
            className={`rounded-full px-5 py-2 text-[0.56rem] uppercase tracking-[0.22em] transition-colors ${
              kind === "order" ? "bg-paper text-canvas" : "border border-line bg-canvas/60 text-mist hover:text-paper"
            }`}
            onClick={() => setKind("order")}
          >
            {t("order")}
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <label className="block text-[0.56rem] uppercase tracking-[0.22em] text-mist">
            {t("code")}
            <input className={underlineField} required value={code} onChange={(event) => setCode(event.target.value)} />
          </label>
          <label className="block text-[0.56rem] uppercase tracking-[0.22em] text-mist">
            {t("email")}
            <input
              className={underlineField}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="block text-[0.56rem] uppercase tracking-[0.22em] text-mist">
            {t("phone")}
            <input className={underlineField} value={phone} onChange={(event) => setPhone(event.target.value)} />
          </label>
        </div>

        <button
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-paper px-8 text-[0.58rem] uppercase tracking-[0.22em] text-canvas transition-colors hover:bg-paper/90 disabled:opacity-45"
          disabled={pending}
          type="submit"
        >
          {t("lookup")}
        </button>

        {message ? (
          <p className="mt-4 text-sm text-paper" role="status">
            {message}
          </p>
        ) : null}
      </form>

      {found ? (
        <article
          data-manage-card
          className="rounded-[20px] border border-line bg-surface p-6 shadow-[0_24px_72px_rgb(8_43_45_/_0.08)] md:p-8"
        >
          <p className="text-[0.54rem] uppercase tracking-[0.26em] text-signal">{found.code}</p>
          <h2 className="mt-3 text-3xl font-light tracking-[-0.03em] text-paper">{found.status}</h2>
          {found.kind === "reservation" ? (
            <p className="mt-5 text-sm leading-7 text-mist">
              {found.date} · {found.time} · {found.guests} · {found.tableName}
            </p>
          ) : (
            <ul className="mt-5 space-y-2.5 text-sm text-paper">
              {found.items?.map((item, index) => (
                <li key={index} className="flex justify-between gap-4 border-b border-line pb-2">
                  <span>
                    {item.quantity} × {item.name.en}
                  </span>
                </li>
              ))}
              <li className="pt-2 text-mist">
                {found.currency} {found.total} · {t("payLater")}
              </li>
            </ul>
          )}
          {found.canCancel ? (
            <button
              className="mt-7 inline-flex h-11 items-center justify-center rounded-full border border-paper/25 px-6 text-[0.58rem] uppercase tracking-[0.22em] text-paper transition-colors hover:bg-paper hover:text-canvas disabled:opacity-45"
              disabled={pending}
              type="button"
              onClick={() => void cancel()}
            >
              {t("cancel")}
            </button>
          ) : null}
        </article>
      ) : null}
    </div>
  );
}
