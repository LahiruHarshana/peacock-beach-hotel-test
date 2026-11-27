import "server-only";
import { randomBytes } from "node:crypto";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db/client";
import { COLLECTIONS } from "@/lib/db/collections";
import { buildSlots, minutesOf, partyFits, rangesOverlap } from "@/lib/dining/slots";
import { DomainError } from "@/lib/errors/api";

export type DiningConfigDoc = {
  _id: "default";
  timezone: "Asia/Colombo";
  openTime: string;
  closeTime: string;
  slotMinutes: number;
  durationMinutes: number;
  maxPartySize: number;
  updatedAt: Date;
};

export type DiningTableDoc = {
  _id: ObjectId;
  name: string;
  seats: number;
  active: boolean;
  sortOrder: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ReservationStatus = "CONFIRMED" | "SEATED" | "COMPLETED" | "NO_SHOW" | "CANCELLED";

export type ReservationDoc = {
  _id: ObjectId;
  code: string;
  guestName: string;
  email: string;
  phone: string;
  date: string;
  startMinutes: number;
  endMinutes: number;
  durationMinutes: number;
  guests: number;
  tableId: string;
  tableName: string;
  status: ReservationStatus;
  notes: string;
  locale: "en" | "ru";
  version: number;
  createdAt: Date;
  updatedAt: Date;
};

export type MenuChoice = { id: string; name: { en: string; ru: string }; priceDelta: number };
export type MenuGroup = { id: string; name: { en: string; ru: string }; required: boolean; choices: MenuChoice[] };

export type MenuItemDoc = {
  _id: ObjectId;
  name: { en: string; ru: string };
  description: { en: string; ru: string };
  price: number;
  currency: string;
  category: "food" | "drink";
  published: boolean;
  sortOrder: number;
  optionGroups: MenuGroup[];
  version: number;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderStatus = "RECEIVED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";

export type OrderLine = {
  menuItemId: string;
  name: { en: string; ru: string };
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  selections: Array<{ groupId: string; choiceId: string; label: { en: string; ru: string } }>;
};

export type OrderDoc = {
  _id: ObjectId;
  code: string;
  guestName: string;
  email: string;
  phone: string;
  notes: string;
  locale: "en" | "ru";
  reservationCode?: string;
  items: OrderLine[];
  total: number;
  currency: string;
  status: OrderStatus;
  version: number;
  createdAt: Date;
  updatedAt: Date;
};

const DEFAULT_CONFIG: Omit<DiningConfigDoc, "updatedAt"> = {
  _id: "default",
  timezone: "Asia/Colombo",
  openTime: "12:00",
  closeTime: "22:00",
  slotMinutes: 30,
  durationMinutes: 90,
  maxPartySize: 12,
};

function idOrThrow(id: string, label: string) {
  if (!ObjectId.isValid(id)) throw new DomainError("VALIDATION_ERROR", `Invalid ${label}.`, 400);
  return new ObjectId(id);
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function newCode() {
  return randomBytes(5).toString("hex").slice(0, 8).toUpperCase();
}

function contactMatches(doc: { email: string; phone: string }, email?: string, phone?: string) {
  const emailOk = email ? doc.email === normalizeEmail(email) : false;
  const phoneOk = phone ? doc.phone === normalizePhone(phone) : false;
  return emailOk || phoneOk;
}

export async function getDiningConfig(): Promise<DiningConfigDoc> {
  const db = await getDb();
  const existing = await db.collection<DiningConfigDoc>(COLLECTIONS.diningConfig).findOne({ _id: "default" });
  if (existing) return existing;
  const doc = { ...DEFAULT_CONFIG, updatedAt: new Date() };
  await db.collection<DiningConfigDoc>(COLLECTIONS.diningConfig).insertOne(doc);
  return doc;
}

export async function saveDiningConfig(input: Omit<DiningConfigDoc, "_id" | "timezone" | "updatedAt">) {
  const db = await getDb();
  const doc: DiningConfigDoc = { _id: "default", timezone: "Asia/Colombo", ...input, updatedAt: new Date() };
  await db.collection<DiningConfigDoc>(COLLECTIONS.diningConfig).replaceOne({ _id: "default" }, doc, { upsert: true });
  return doc;
}

export async function listTables(activeOnly = false) {
  const db = await getDb();
  return db
    .collection<DiningTableDoc>(COLLECTIONS.diningTables)
    .find(activeOnly ? { active: true } : {})
    .sort({ sortOrder: 1, name: 1 })
    .limit(100)
    .toArray();
}

export async function createTable(input: Pick<DiningTableDoc, "name" | "seats" | "active" | "sortOrder">) {
  const db = await getDb();
  const now = new Date();
  const result = await db.collection<DiningTableDoc>(COLLECTIONS.diningTables).insertOne({
    _id: new ObjectId(),
    ...input,
    version: 1,
    createdAt: now,
    updatedAt: now,
  });
  return result.insertedId;
}

export async function updateTable(id: string, input: Partial<Pick<DiningTableDoc, "name" | "seats" | "active" | "sortOrder">> & { version: number }) {
  const db = await getDb();
  const { version, ...rest } = input;
  const updated = await db.collection<DiningTableDoc>(COLLECTIONS.diningTables).findOneAndUpdate(
    { _id: idOrThrow(id, "table id"), version },
    { $set: { ...rest, updatedAt: new Date() }, $inc: { version: 1 } },
    { returnDocument: "after" },
  );
  if (!updated) throw new DomainError("CONFLICT", "Table was updated by someone else.", 409);
  return updated;
}

export async function availabilityFor(date: string, guests: number) {
  const config = await getDiningConfig();
  if (guests > config.maxPartySize) {
    throw new DomainError("VALIDATION_ERROR", "Party size is above the restaurant maximum.", 422);
  }
  const slots = buildSlots(config);
  const tables = (await listTables(true)).filter((table) => partyFits(table.seats, guests));
  const db = await getDb();
  const reservations = await db
    .collection<ReservationDoc>(COLLECTIONS.tableReservations)
    .find({ date, status: "CONFIRMED", tableId: { $in: tables.map((table) => String(table._id)) } })
    .project({ tableId: 1, startMinutes: 1, endMinutes: 1 })
    .toArray();

  return {
    timezone: config.timezone,
    durationMinutes: config.durationMinutes,
    slots: slots.map((time) => {
      const start = minutesOf(time)!;
      const end = start + config.durationMinutes;
      const free = tables.filter(
        (table) =>
          !reservations.some(
            (reservation) =>
              reservation.tableId === String(table._id) &&
              rangesOverlap(start, end, reservation.startMinutes, reservation.endMinutes),
          ),
      );
      return {
        time,
        tables: free.map((table) => ({ id: String(table._id), name: table.name, seats: table.seats })),
      };
    }),
  };
}

export async function createReservation(input: {
  guestName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tableId: string;
  notes?: string;
  locale: "en" | "ru";
}) {
  const config = await getDiningConfig();
  const start = minutesOf(input.time);
  const slots = buildSlots(config);
  if (start == null || !slots.includes(input.time) || input.guests > config.maxPartySize) {
    throw new DomainError("VALIDATION_ERROR", "Choose an open seating time.", 422);
  }
  const table = (await listTables(true)).find((item) => String(item._id) === input.tableId);
  if (!table || !partyFits(table.seats, input.guests)) {
    throw new DomainError("NOT_FOUND", "That table is not available for this party.", 404);
  }
  const end = start + config.durationMinutes;
  const db = await getDb();
  const collection = db.collection<ReservationDoc>(COLLECTIONS.tableReservations);
  const now = new Date();
  const doc: ReservationDoc = {
    _id: new ObjectId(),
    code: newCode(),
    guestName: input.guestName.trim(),
    email: normalizeEmail(input.email),
    phone: normalizePhone(input.phone),
    date: input.date,
    startMinutes: start,
    endMinutes: end,
    durationMinutes: config.durationMinutes,
    guests: input.guests,
    tableId: String(table._id),
    tableName: table.name,
    status: "CONFIRMED",
    notes: input.notes?.trim() ?? "",
    locale: input.locale,
    version: 1,
    createdAt: now,
    updatedAt: now,
  };
  await collection.insertOne(doc);
  const clash = await collection.findOne({
    _id: { $ne: doc._id },
    tableId: doc.tableId,
    date: doc.date,
    status: "CONFIRMED",
    startMinutes: { $lt: end },
    endMinutes: { $gt: start },
  });
  if (clash) {
    await collection.deleteOne({ _id: doc._id });
    throw new DomainError("CONFLICT", "That table was just reserved. Choose another time.", 409);
  }
  return doc;
}

export async function listReservations(page = 1) {
  const db = await getDb();
  const limit = 30;
  const skip = (Math.max(page, 1) - 1) * limit;
  const items = await db
    .collection<ReservationDoc>(COLLECTIONS.tableReservations)
    .find({})
    .sort({ date: -1, startMinutes: 1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  return { items, page: Math.max(page, 1) };
}

export async function findReservationForGuest(code: string, email?: string, phone?: string) {
  const db = await getDb();
  const doc = await db.collection<ReservationDoc>(COLLECTIONS.tableReservations).findOne({ code: code.trim().toUpperCase() });
  if (!doc || !contactMatches(doc, email, phone)) {
    throw new DomainError("NOT_FOUND", "Reservation not found.", 404);
  }
  return doc;
}

export async function cancelReservationForGuest(code: string, email?: string, phone?: string) {
  const doc = await findReservationForGuest(code, email, phone);
  if (doc.status !== "CONFIRMED") {
    throw new DomainError("CONFLICT", "This reservation can no longer be cancelled online.", 409);
  }
  return setReservationStatus(String(doc._id), "CANCELLED", doc.version);
}

export async function setReservationStatus(id: string, status: ReservationStatus, version: number) {
  const db = await getDb();
  const updated = await db.collection<ReservationDoc>(COLLECTIONS.tableReservations).findOneAndUpdate(
    { _id: idOrThrow(id, "reservation id"), version },
    { $set: { status, updatedAt: new Date() }, $inc: { version: 1 } },
    { returnDocument: "after" },
  );
  if (!updated) throw new DomainError("CONFLICT", "Reservation was updated by someone else.", 409);
  return updated;
}

export async function listMenu(publishedOnly = false) {
  const db = await getDb();
  return db
    .collection<MenuItemDoc>(COLLECTIONS.menuItems)
    .find(publishedOnly ? { published: true } : {})
    .sort({ category: 1, sortOrder: 1, "name.en": 1 })
    .limit(200)
    .toArray();
}

export async function createMenuItem(input: Omit<MenuItemDoc, "_id" | "version" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  const now = new Date();
  const result = await db.collection<MenuItemDoc>(COLLECTIONS.menuItems).insertOne({
    _id: new ObjectId(),
    ...input,
    version: 1,
    createdAt: now,
    updatedAt: now,
  });
  return result.insertedId;
}

export async function updateMenuItem(
  id: string,
  input: Partial<Omit<MenuItemDoc, "_id" | "version" | "createdAt" | "updatedAt">> & { version: number },
) {
  const db = await getDb();
  const { version, ...rest } = input;
  const updated = await db.collection<MenuItemDoc>(COLLECTIONS.menuItems).findOneAndUpdate(
    { _id: idOrThrow(id, "menu item id"), version },
    { $set: { ...rest, updatedAt: new Date() }, $inc: { version: 1 } },
    { returnDocument: "after" },
  );
  if (!updated) throw new DomainError("CONFLICT", "Menu item was updated by someone else.", 409);
  return updated;
}

export async function createOrder(input: {
  guestName: string;
  email: string;
  phone: string;
  notes?: string;
  locale: "en" | "ru";
  reservationCode?: string;
  items: Array<{ menuItemId: string; quantity: number; selections: Array<{ groupId: string; choiceId: string }> }>;
}) {
  const menu = await listMenu(true);
  const lines: OrderLine[] = [];
  let currency = "USD";
  for (const item of input.items) {
    const dish = menu.find((entry) => String(entry._id) === item.menuItemId);
    if (!dish) throw new DomainError("NOT_FOUND", "A menu item is no longer available.", 404);
    currency = dish.currency;
    let unit = dish.price;
    const selections: OrderLine["selections"] = [];
    for (const group of dish.optionGroups) {
      const chosen = item.selections.find((selection) => selection.groupId === group.id);
      if (group.required && !chosen) {
        throw new DomainError("VALIDATION_ERROR", "Choose the required options.", 422);
      }
      if (!chosen) continue;
      const choice = group.choices.find((option) => option.id === chosen.choiceId);
      if (!choice) throw new DomainError("VALIDATION_ERROR", "Choose a listed option.", 422);
      unit += choice.priceDelta;
      selections.push({ groupId: group.id, choiceId: choice.id, label: choice.name });
    }
    lines.push({
      menuItemId: String(dish._id),
      name: dish.name,
      quantity: item.quantity,
      unitPrice: unit,
      lineTotal: unit * item.quantity,
      selections,
    });
  }
  const now = new Date();
  const doc: OrderDoc = {
    _id: new ObjectId(),
    code: newCode(),
    guestName: input.guestName.trim(),
    email: normalizeEmail(input.email),
    phone: normalizePhone(input.phone),
    notes: input.notes?.trim() ?? "",
    locale: input.locale,
    reservationCode: input.reservationCode,
    items: lines,
    total: lines.reduce((sum, line) => sum + line.lineTotal, 0),
    currency,
    status: "RECEIVED",
    version: 1,
    createdAt: now,
    updatedAt: now,
  };
  const db = await getDb();
  await db.collection<OrderDoc>(COLLECTIONS.diningOrders).insertOne(doc);
  return doc;
}

export async function listOrders(page = 1) {
  const db = await getDb();
  const limit = 30;
  const skip = (Math.max(page, 1) - 1) * limit;
  const items = await db.collection<OrderDoc>(COLLECTIONS.diningOrders).find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray();
  return { items, page: Math.max(page, 1) };
}

export async function findOrderForGuest(code: string, email?: string, phone?: string) {
  const db = await getDb();
  const doc = await db.collection<OrderDoc>(COLLECTIONS.diningOrders).findOne({ code: code.trim().toUpperCase() });
  if (!doc || !contactMatches(doc, email, phone)) throw new DomainError("NOT_FOUND", "Order not found.", 404);
  return doc;
}

export async function cancelOrderForGuest(code: string, email?: string, phone?: string) {
  const doc = await findOrderForGuest(code, email, phone);
  if (doc.status !== "RECEIVED") {
    throw new DomainError("CONFLICT", "This order can no longer be cancelled online.", 409);
  }
  return setOrderStatus(String(doc._id), "CANCELLED", doc.version);
}

export async function setOrderStatus(id: string, status: OrderStatus, version: number) {
  const db = await getDb();
  const updated = await db.collection<OrderDoc>(COLLECTIONS.diningOrders).findOneAndUpdate(
    { _id: idOrThrow(id, "order id"), version },
    { $set: { status, updatedAt: new Date() }, $inc: { version: 1 } },
    { returnDocument: "after" },
  );
  if (!updated) throw new DomainError("CONFLICT", "Order was updated by someone else.", 409);
  return updated;
}
