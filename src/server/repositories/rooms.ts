import "server-only";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db/client";
import { COLLECTIONS } from "@/lib/db/collections";
import { DomainError } from "@/lib/errors/api";
import type { Locale } from "@/lib/validation/schemas";

export type RoomDoc = {
  _id: ObjectId;
  slug: string;
  name: { en: string; ru: string };
  description: { en: string; ru: string };
  capacity: number;
  amenities: string[];
  images: Array<{ publicId: string; alt: { en: string; ru: string }; order: number }>;
  priceDisplay?: number | null;
  currency?: string;
  status: "DRAFT" | "PUBLISHED";
  sortOrder: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
};

const publicProjection = {
  slug: 1,
  name: 1,
  description: 1,
  capacity: 1,
  amenities: 1,
  images: 1,
  priceDisplay: 1,
  currency: 1,
  sortOrder: 1,
} as const;

export async function listPublishedRooms(limit = 50) {
  const db = await getDb();
  return db
    .collection<RoomDoc>(COLLECTIONS.rooms)
    .find({ status: "PUBLISHED" })
    .project(publicProjection)
    .sort({ sortOrder: 1, "name.en": 1 })
    .limit(Math.min(limit, 50))
    .toArray();
}

export async function getPublishedRoomBySlug(slug: string) {
  const db = await getDb();
  return db
    .collection<RoomDoc>(COLLECTIONS.rooms)
    .findOne({ slug, status: "PUBLISHED" }, { projection: publicProjection });
}

export async function listRoomsForAdmin(page = 1, pageSize = 20) {
  const db = await getDb();
  const skip = (Math.max(page, 1) - 1) * Math.min(pageSize, 50);
  const limit = Math.min(pageSize, 50);
  const items = await db
    .collection<RoomDoc>(COLLECTIONS.rooms)
    .find({})
    .sort({ sortOrder: 1, updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  const total = await db.collection(COLLECTIONS.rooms).countDocuments();
  return { items, total, page: Math.max(page, 1), pageSize: limit };
}

export async function getRoomById(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new DomainError("VALIDATION_ERROR", "Invalid room id.", 400);
  }
  const db = await getDb();
  return db.collection<RoomDoc>(COLLECTIONS.rooms).findOne({ _id: new ObjectId(id) });
}

export async function createRoom(input: Omit<RoomDoc, "_id" | "version" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  const now = new Date();
  const doc = {
    ...input,
    version: 1,
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection(COLLECTIONS.rooms).insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function updateRoomIfVersionMatches(
  id: string,
  version: number,
  update: Partial<RoomDoc>,
) {
  if (!ObjectId.isValid(id)) {
    throw new DomainError("VALIDATION_ERROR", "Invalid room id.", 400);
  }
  const db = await getDb();
  const result = await db.collection<RoomDoc>(COLLECTIONS.rooms).updateOne(
    { _id: new ObjectId(id), version },
    { $set: { ...update, updatedAt: new Date() }, $inc: { version: 1 } },
  );
  if (result.matchedCount === 0) {
    throw new DomainError("CONFLICT", "Room was updated elsewhere. Refresh and try again.", 409);
  }
}

export function roomHasRequiredPublishFields(room: RoomDoc): boolean {
  return (
    room.name.en.trim().length > 0 &&
    room.name.ru.trim().length > 0 &&
    room.description.en.trim().length > 0 &&
    room.description.ru.trim().length > 0 &&
    room.images.length > 0
  );
}

export function formatRoomPrice(room: Pick<RoomDoc, "priceDisplay" | "currency">, locale: Locale) {
  if (room.priceDisplay == null) {
    return locale === "ru" ? "Уточните цену" : "Ask for rates";
  }
  const currency = room.currency ?? "USD";
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(room.priceDisplay);
}
