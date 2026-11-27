"use client";

import { useCallback, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

type Slot = { time: string; tables: Array<{ id: string; name: string; seats: number }> };

const underlineField =
  "mt-2 h-11 w-full rounded-none border-0 border-b border-line bg-transparent px-0 text-sm text-paper placeholder:text-mist/60 transition-colors focus:border-signal focus:outline-none";

export function ReserveForm() {
  const t = useTranslations("Dining");
  const locale = useLocale();
  const root = useRef<HTMLDivElement>(null);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [choice, setChoice] = useState<{ time: string; tableId: string } | null>(null);
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const animateCards = useCallback((gsap: typeof import("gsap").default) => {
    const container = root.current;
    if (!container) return;
    const cards = gsap.utils.toArray<HTMLElement>("[data-reserve-card]", container);
    if (cards.length === 0) return;

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 28, autoAlpha: 0.25 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.5,
          ease: "power2.out",
          delay: index * 0.06,
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

  async function loadAvailability(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setCode(null);
    try {
      const response = await fetch(`/api/dining/availability?date=${date}&guests=${guests}`);
      const body = await response.json();
      if (!body.ok) {
        setSlots([]);
        setMessage(body.error?.message ?? t("error"));
        return;
      }
      setSlots(body.data.slots);
      if (body.data.slots.every((slot: Slot) => slot.tables.length === 0)) setMessage(t("noTables"));
    } catch {
      setMessage(t("error"));
    } finally {
      setPending(false);
    }
  }

  async function reserve(event: React.FormEvent) {
    event.preventDefault();
    if (!choice) return;
    setPending(true);
    setMessage("");
    try {
      const response = await fetch("/api/dining/reservations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          date,
          guests,
          time: choice.time,
          tableId: choice.tableId,
          guestName,
          email,
          phone,
          notes,
          locale,
        }),
      });
      const body = await response.json();
      if (!body.ok) {
        setMessage(body.error?.message ?? t("error"));
        return;
      }
      setCode(body.data.code);
    } catch {
      setMessage(t("error"));
    } finally {
      setPending(false);
    }
  }

  if (code) {
    return (
      <div className="mx-auto max-w-2xl rounded-[20px] border border-line bg-surface p-10 text-center shadow-[0_24px_72px_rgb(8_43_45_/_0.08)] md:p-14">
        <p className="text-[0.56rem] uppercase tracking-[0.28em] text-signal">{t("confirmed")}</p>
        <p className="mt-5 font-light tracking-[-0.04em] text-paper text-[clamp(2.6rem,5vw,4.2rem)]">{code}</p>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-mist">{t("saveCode")}</p>
      </div>
    );
  }

  return (
    <div ref={root} className="grid gap-10 lg:grid-cols-2 lg:items-start">
      <form
        data-reserve-card
        onSubmit={loadAvailability}
        className="rounded-[20px] border border-line bg-surface p-6 shadow-[0_24px_72px_rgb(8_43_45_/_0.08)] md:p-8"
      >
        <p className="text-[0.54rem] uppercase tracking-[0.26em] text-signal">01 · {t("findTables")}</p>
        <h2 className="mt-2 text-2xl font-light tracking-[-0.03em] text-paper">{t("reserveTitle")}</h2>

        <div className="mt-6 space-y-5">
          <label className="block text-[0.56rem] uppercase tracking-[0.22em] text-mist">
            {t("date")}
            <input
              className={underlineField}
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
          <label className="block text-[0.56rem] uppercase tracking-[0.22em] text-mist">
            {t("guests")}
            <input
              className={underlineField}
              type="number"
              min={1}
              max={30}
              required
              value={guests}
              onChange={(event) => setGuests(Number(event.target.value))}
            />
          </label>
        </div>

        <button
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-paper px-8 text-[0.58rem] uppercase tracking-[0.22em] text-canvas transition-colors hover:bg-paper/90 disabled:opacity-45"
          disabled={pending}
          type="submit"
        >
          {t("findTables")}
        </button>
      </form>

      <form
        data-reserve-card
        onSubmit={reserve}
        className="rounded-[20px] border border-line bg-surface p-6 shadow-[0_24px_72px_rgb(8_43_45_/_0.08)] md:p-8"
      >
        <p className="text-[0.54rem] uppercase tracking-[0.26em] text-signal">02 · {t("reservation")}</p>

        {slots.length > 0 ? (
          <div className="mt-5 space-y-4 border-b border-line pb-6">
            {slots.map((slot) => (
              <div key={slot.time}>
                <p className="text-[0.56rem] uppercase tracking-[0.22em] text-mist">{slot.time}</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {slot.tables.length === 0 ? (
                    <p className="text-sm text-mist">{t("full")}</p>
                  ) : (
                    slot.tables.map((table) => {
                      const selected = choice?.tableId === table.id && choice.time === slot.time;
                      return (
                        <button
                          key={table.id}
                          type="button"
                          className={`rounded-full border px-4 py-2 text-xs tracking-wide transition-colors ${
                            selected
                              ? "border-paper bg-paper text-canvas"
                              : "border-line bg-canvas/60 text-paper hover:border-paper/40"
                          }`}
                          onClick={() => setChoice({ time: slot.time, tableId: table.id })}
                        >
                          {table.name} · {table.seats}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-5 space-y-4">
          <input
            className={underlineField}
            placeholder={t("name")}
            required
            value={guestName}
            onChange={(event) => setGuestName(event.target.value)}
          />
          <input
            className={underlineField}
            type="email"
            placeholder={t("email")}
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className={underlineField}
            placeholder={t("phone")}
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <textarea
            className={`${underlineField} h-20 resize-none py-2.5`}
            placeholder={t("notes")}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>

        <button
          className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-full bg-paper text-[0.58rem] uppercase tracking-[0.22em] text-canvas transition-colors hover:bg-paper/90 disabled:opacity-45"
          disabled={pending || !choice}
          type="submit"
        >
          {t("reserve")}
        </button>

        {message ? (
          <p className="mt-4 text-sm text-paper" role="status">
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
