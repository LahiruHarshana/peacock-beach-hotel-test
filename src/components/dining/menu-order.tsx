"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { MOTION } from "@/components/site/motion/home/constants";

type Group = {
  id: string;
  name: { en: string; ru: string };
  required: boolean;
  choices: Array<{ id: string; name: { en: string; ru: string }; priceDelta: number }>;
};

type Item = {
  id: string;
  name: { en: string; ru: string };
  description: { en: string; ru: string };
  price: number;
  currency: string;
  category: string;
  optionGroups: Group[];
};

type CartLine = {
  key: string;
  item: Item;
  quantity: number;
  selections: Array<{ groupId: string; choiceId: string }>;
};

const underlineField =
  "mt-2 h-11 w-full rounded-none border-0 border-b border-line bg-transparent px-0 text-sm text-paper placeholder:text-mist/60 transition-colors focus:border-signal focus:outline-none";

const selectField =
  "mt-2 h-11 w-full rounded-xl border border-line bg-canvas/60 px-3.5 text-sm text-paper transition-colors focus:border-signal focus:outline-none";

export function MenuOrder() {
  const t = useTranslations("Dining");
  const locale = useLocale() === "ru" ? "ru" : "en";
  const root = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [empty, setEmpty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void fetch("/api/dining/menu")
      .then(async (response) => {
        const body = await response.json();
        if (body.ok) {
          setItems(body.data);
          setEmpty(body.data.length === 0);
        }
      })
      .catch(() => {
        setEmpty(true);
      });
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category).filter(Boolean))),
    [items],
  );

  const visibleItems = useMemo(
    () => (activeCategory === "all" ? items : items.filter((item) => item.category === activeCategory)),
    [activeCategory, items],
  );

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, line) => {
      const delta = line.selections.reduce((acc, sel) => {
        const group = line.item.optionGroups.find((g) => g.id === sel.groupId);
        const choice = group?.choices.find((c) => c.id === sel.choiceId);
        return acc + (choice?.priceDelta ?? 0);
      }, 0);
      return sum + (line.item.price + delta) * line.quantity;
    }, 0);
  }, [cart]);

  const currency = cart[0]?.item.currency ?? items[0]?.currency ?? "";

  const animateCards = useCallback(
    (gsap: typeof import("gsap").default) => {
      const container = root.current;
      if (!container) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-menu-card]", container);
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
            delay: Math.min(index * 0.04, 0.2),
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
    },
    [],
  );

  useCinematic(root, animateCards, MOTION);

  function add(item: Item, form: HTMLFormElement) {
    const data = new FormData(form);
    const selections = item.optionGroups.flatMap((group) => {
      const choiceId = String(data.get(group.id) ?? "");
      return choiceId ? [{ groupId: group.id, choiceId }] : [];
    });
    setCart((current) => [...current, { key: crypto.randomUUID(), item, quantity: 1, selections }]);
    form.reset();
  }

  function updateQuantity(key: string, delta: number) {
    setCart((current) =>
      current
        .map((line) => (line.key === key ? { ...line, quantity: line.quantity + delta } : line))
        .filter((line) => line.quantity > 0),
    );
  }

  async function place(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/dining/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          guestName,
          email,
          phone,
          notes,
          locale,
          items: cart.map((line) => ({ menuItemId: line.item.id, quantity: line.quantity, selections: line.selections })),
        }),
      });
      const body = await response.json();
      if (!body.ok) {
        setMessage(body.error?.message ?? t("error"));
        return;
      }
      setCode(body.data.code);
      setTotal(body.data.total);
    } catch {
      setMessage(t("error"));
    } finally {
      setSubmitting(false);
    }
  }

  if (code) {
    return (
      <div className="mx-auto max-w-2xl rounded-[20px] border border-line bg-surface p-10 text-center shadow-[0_24px_72px_rgb(8_43_45_/_0.08)] md:p-14">
        <p className="text-[0.56rem] uppercase tracking-[0.28em] text-signal">{t("orderReceived")}</p>
        <p className="mt-5 font-light tracking-[-0.04em] text-paper text-[clamp(2.6rem,5vw,4.2rem)]">{code}</p>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-mist">
          {t("payAtRestaurant", { total: total ?? 0 })}
        </p>
      </div>
    );
  }

  return (
    <div ref={root} className="space-y-10">
      {categories.length > 1 ? (
        <div className="flex flex-wrap items-center gap-2.5 border-b border-line pb-6">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-5 py-2 text-[0.56rem] uppercase tracking-[0.22em] transition-colors ${
              activeCategory === "all"
                ? "bg-paper text-canvas"
                : "border border-line bg-surface text-mist hover:text-paper"
            }`}
          >
            {t("menuTitle")}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-5 py-2 text-[0.56rem] uppercase tracking-[0.22em] transition-colors ${
                activeCategory === category
                  ? "bg-paper text-canvas"
                  : "border border-line bg-surface text-mist hover:text-paper"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
        <div className="space-y-5">
          {empty ? (
            <div className="rounded-[20px] border border-line bg-surface p-8 text-sm leading-7 text-mist" role="status">
              {t("menuEmpty")}
            </div>
          ) : null}

          {visibleItems.map((item) => (
            <form
              key={item.id}
              data-menu-card
              className="rounded-[20px] border border-line bg-surface p-6 transition-shadow duration-300 hover:shadow-[0_20px_60px_rgb(8_43_45_/_0.08)] md:p-8"
              onSubmit={(event) => {
                event.preventDefault();
                add(item, event.currentTarget);
              }}
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-[0.54rem] uppercase tracking-[0.26em] text-signal">{item.category}</p>
                  <h2 className="mt-2 text-2xl font-light tracking-[-0.03em] text-paper md:text-[1.75rem]">
                    {item.name[locale]}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-mist">{item.description[locale]}</p>
                </div>
                <p className="shrink-0 text-base font-light tabular-nums text-paper">
                  {item.currency} {item.price}
                </p>
              </div>

              {item.optionGroups.length > 0 ? (
                <div className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
                  {item.optionGroups.map((group) => (
                    <label key={group.id} className="block text-[0.56rem] uppercase tracking-[0.22em] text-mist">
                      {group.name[locale]}
                      <select className={selectField} name={group.id} required={group.required} defaultValue="">
                        <option value="">{t("choose")}</option>
                        {group.choices.map((choice) => (
                          <option key={choice.id} value={choice.id}>
                            {choice.name[locale]}
                            {choice.priceDelta ? ` +${choice.priceDelta}` : ""}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              ) : null}

              <div className="mt-6 flex justify-end">
                <button
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-paper px-6 text-[0.56rem] uppercase tracking-[0.22em] text-canvas transition-colors hover:bg-paper/90"
                  type="submit"
                >
                  <span>+ {t("add")}</span>
                </button>
              </div>
            </form>
          ))}
        </div>

        <form
          onSubmit={place}
          className="rounded-[20px] border border-line bg-surface p-6 shadow-[0_24px_72px_rgb(8_43_45_/_0.08)] md:p-8 lg:sticky lg:top-24"
        >
          <div className="flex items-center justify-between border-b border-line pb-5">
            <div>
              <p className="text-[0.54rem] uppercase tracking-[0.26em] text-signal">{t("payLater")}</p>
              <h2 className="mt-2 text-2xl font-light tracking-[-0.03em] text-paper">
                {t("cart")} ({cart.reduce((sum, line) => sum + line.quantity, 0)})
              </h2>
            </div>
            {cart.length > 0 ? (
              <p className="text-base font-light tabular-nums text-paper">
                {currency} {cartSubtotal}
              </p>
            ) : null}
          </div>

          {cart.length > 0 ? (
            <ul className="mt-5 space-y-3 border-b border-line pb-5 text-sm">
              {cart.map((line) => (
                <li key={line.key} className="flex items-center justify-between gap-3 text-paper">
                  <span className="min-w-0 truncate">{line.item.name[locale]}</span>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(line.key, -1)}
                      className="grid size-7 place-items-center rounded-full border border-line text-xs text-mist transition-colors hover:border-paper hover:text-paper"
                      aria-label={t("remove")}
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-xs tabular-nums">{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(line.key, 1)}
                      className="grid size-7 place-items-center rounded-full border border-line text-xs text-mist transition-colors hover:border-paper hover:text-paper"
                      aria-label={t("add")}
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
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
            disabled={cart.length === 0 || submitting}
            type="submit"
          >
            {t("placeOrder")}
          </button>

          {message ? (
            <p className="mt-4 text-sm text-paper" role="status">
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
