import "server-only";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db/client";
import { COLLECTIONS } from "@/lib/db/collections";
import { DomainError } from "@/lib/errors/api";

export type EventDoc = {
  _id: ObjectId;
  slug: string;
  title: { en: string; ru: string };
  description: { en: string; ru: string };
  startAt: Date;
  endAt: Date;
  heroMedia?: { publicId: string; resourceType: "image" | "video" } | null;
  status: "DRAFT" | "PUBLISHED";
  version: number;
  createdAt: Date;
  updatedAt: Date;
};

const publicProjection = {
  slug: 1,
  title: 1,
  description: 1,
  startAt: 1,
  endAt: 1,
  heroMedia: 1,
} as const;

export async function listPublishedEvents(limit = 50) {
  const db = await getDb();
  return db
    .collection<EventDoc>(COLLECTIONS.events)
    .find({ status: "PUBLISHED" })
    .project(publicProjection)
    .sort({ startAt: 1 })
    .limit(Math.min(limit, 50))
    .toArray();
}

export async function getPublishedEventBySlug(slug: string) {
  const db = await getDb();
  return db
    .collection<EventDoc>(COLLECTIONS.events)
    .findOne({ slug, status: "PUBLISHED" }, { projection: publicProjection });
}

export async function listEventsForAdmin(page = 1, pageSize = 20) {
  const db = await getDb();
  const skip = (Math.max(page, 1) - 1) * Math.min(pageSize, 50);
  const limit = Math.min(pageSize, 50);
  const items = await db
    .collection<EventDoc>(COLLECTIONS.events)
    .find({})
    .sort({ startAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  const total = await db.collection(COLLECTIONS.events).countDocuments();
  return { items, total, page: Math.max(page, 1), pageSize: limit };
}

export async function getEventById(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new DomainError("VALIDATION_ERROR", "Invalid event id.", 400);
  }
  const db = await getDb();
  return db.collection<EventDoc>(COLLECTIONS.events).findOne({ _id: new ObjectId(id) });
}

export async function createEvent(
  input: Omit<EventDoc, "_id" | "version" | "createdAt" | "updatedAt">,
) {
  const db = await getDb();
  const now = new Date();
  const doc = { ...input, version: 1, createdAt: now, updatedAt: now };
  const result = await db.collection(COLLECTIONS.events).insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function updateEventIfVersionMatches(
  id: string,
  version: number,
  update: Partial<EventDoc>,
) {
  if (!ObjectId.isValid(id)) {
    throw new DomainError("VALIDATION_ERROR", "Invalid event id.", 400);
  }
  const db = await getDb();
  const result = await db.collection<EventDoc>(COLLECTIONS.events).updateOne(
    { _id: new ObjectId(id), version },
    { $set: { ...update, updatedAt: new Date() }, $inc: { version: 1 } },
  );
  if (result.matchedCount === 0) {
    throw new DomainError("CONFLICT", "Event was updated elsewhere. Refresh and try again.", 409);
  }
}

export async function deleteEventIfVersionMatches(id: string, version: number) {
  if (!ObjectId.isValid(id)) {
    throw new DomainError("VALIDATION_ERROR", "Invalid event id.", 400);
  }
  const db = await getDb();
  const result = await db.collection(COLLECTIONS.events).deleteOne({ _id: new ObjectId(id), version });
  if (result.deletedCount === 0) {
    throw new DomainError("CONFLICT", "Event was updated elsewhere. Refresh and try again.", 409);
  }
}

export function eventHasRequiredPublishFields(event: EventDoc): boolean {
  return (
    event.title.en.trim().length > 0 &&
    event.title.ru.trim().length > 0 &&
    event.description.en.trim().length > 0 &&
    event.description.ru.trim().length > 0
  );
}
