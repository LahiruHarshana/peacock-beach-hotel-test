"use client";

import { useState } from "react";

const field = "h-11 w-full rounded-xl border border-stone bg-ivory px-3 text-sm";

export function DiningTableForm() {
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/dining/tables", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        seats: Number(data.get("seats")),
        sortOrder: Number(data.get("sortOrder") ?? 0),
        active: true,
      }),
    });
    const body = await response.json();
    setMessage(body.ok ? "Table saved." : body.error?.message ?? "Could not save.");
    if (body.ok) window.location.reload();
  }
  return (
    <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-stone p-4 sm:grid-cols-4">
      <input className={field} name="name" placeholder="Table name" required />
      <input className={field} name="seats" type="number" min={1} placeholder="Seats" required />
      <input className={field} name="sortOrder" type="number" min={0} placeholder="Order" defaultValue={0} />
      <button className="h-11 rounded-full bg-mocha text-xs uppercase tracking-[0.12rem] text-ivory" type="submit">Add table</button>
      {message ? <p className="text-sm sm:col-span-4">{message}</p> : null}
    </form>
  );
}

export function DiningHoursForm({ openTime, closeTime, slotMinutes, durationMinutes, maxPartySize }: { openTime: string; closeTime: string; slotMinutes: number; durationMinutes: number; maxPartySize: number }) {
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/dining/tables", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        openTime: data.get("openTime"),
        closeTime: data.get("closeTime"),
        slotMinutes: Number(data.get("slotMinutes")),
        durationMinutes: Number(data.get("durationMinutes")),
        maxPartySize: Number(data.get("maxPartySize")),
      }),
    });
    const body = await response.json();
    setMessage(body.ok ? "Hours saved." : body.error?.message ?? "Could not save.");
  }
  return (
    <form onSubmit={submit} className="grid gap-3 rounded-2xl bg-greige p-4 sm:grid-cols-5">
      <input className={field} name="openTime" defaultValue={openTime} required />
      <input className={field} name="closeTime" defaultValue={closeTime} required />
      <input className={field} name="slotMinutes" type="number" defaultValue={slotMinutes} required />
      <input className={field} name="durationMinutes" type="number" defaultValue={durationMinutes} required />
      <input className={field} name="maxPartySize" type="number" defaultValue={maxPartySize} required />
      <button className="h-11 rounded-full bg-mocha text-xs uppercase tracking-[0.12rem] text-ivory sm:col-span-5" type="submit">Save hours</button>
      {message ? <p className="text-sm sm:col-span-5">{message}</p> : null}
    </form>
  );
}

export function MenuItemForm() {
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/dining/menu", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: { en: data.get("nameEn"), ru: data.get("nameRu") || data.get("nameEn") },
        description: { en: data.get("descriptionEn"), ru: data.get("descriptionRu") || data.get("descriptionEn") },
        price: Number(data.get("price")),
        currency: "USD",
        category: data.get("category"),
        published: data.get("published") === "on",
        sortOrder: 0,
        optionGroups: [],
      }),
    });
    const body = await response.json();
    setMessage(body.ok ? "Dish saved." : body.error?.message ?? "Could not save.");
    if (body.ok) window.location.reload();
  }
  return (
    <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-stone p-4">
      <input className={field} name="nameEn" placeholder="Name (English)" required />
      <input className={field} name="nameRu" placeholder="Name (Russian)" />
      <input className={field} name="descriptionEn" placeholder="Description" required />
      <input className={field} name="descriptionRu" placeholder="Description (Russian)" />
      <div className="grid gap-3 sm:grid-cols-3">
        <input className={field} name="price" type="number" min={0} step="0.01" placeholder="Price" required />
        <select className={field} name="category" defaultValue="food"><option value="food">Food</option><option value="drink">Drink</option></select>
        <label className="flex items-center gap-2 text-sm"><input name="published" type="checkbox" /> Published</label>
      </div>
      <button className="h-11 rounded-full bg-mocha text-xs uppercase tracking-[0.12rem] text-ivory" type="submit">Add dish</button>
      {message ? <p className="text-sm">{message}</p> : null}
    </form>
  );
}

export function StatusControl({ id, version, status, kind, options }: { id: string; version: number; status: string; kind: "reservations" | "orders"; options: string[] }) {
  const [current, setCurrent] = useState(status);
  const [revision, setRevision] = useState(version);
  const [message, setMessage] = useState("");
  async function change(next: string) {
    const response = await fetch(`/api/admin/dining/${kind}/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: next, version: revision }),
    });
    const body = await response.json();
    if (!body.ok) {
      setMessage(body.error?.message ?? "Could not update.");
      return;
    }
    setCurrent(body.data.status);
    setRevision(body.data.version);
    setMessage("");
  }
  return (
    <label className="block text-xs">
      <select className="h-10 rounded-full border border-stone bg-ivory px-3" value={current} onChange={(event) => void change(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
      {message ? <span className="mt-1 block">{message}</span> : null}
    </label>
  );
}
