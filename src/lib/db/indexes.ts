import type { Collection, Db } from "mongodb";
import { COLLECTIONS } from "@/lib/db/collections";

export async function ensureDatabaseIndexes(db: Db) {
  await db.collection(COLLECTIONS.users).createIndex({ emailNormalized: 1 }, { unique: true });
  await db.collection(COLLECTIONS.rooms).createIndex({ slug: 1 }, { unique: true });
  await db.collection(COLLECTIONS.rooms).createIndex({ status: 1, sortOrder: 1 });
  await db.collection(COLLECTIONS.events).createIndex({ slug: 1 }, { unique: true });
  await db.collection(COLLECTIONS.events).createIndex({ status: 1, startAt: 1 });
  await db.collection(COLLECTIONS.reviews).createIndex({ moderationStatus: 1, createdAt: -1 });
  await db.collection(COLLECTIONS.mediaAssets).createIndex(
    { publicId: 1, resourceType: 1 },
    { unique: true },
  );
  await db.collection(COLLECTIONS.auditLogs).createIndex({ at: -1 });
  await db.collection(COLLECTIONS.auditLogs).createIndex({ actorId: 1, at: -1 });
  await db.collection(COLLECTIONS.rateLimits).createIndex({ bucket: 1 }, { unique: true });
  await db.collection(COLLECTIONS.rateLimits).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await db.collection(COLLECTIONS.diningTables).createIndex({ active: 1, sortOrder: 1 });
  await db.collection(COLLECTIONS.tableReservations).createIndex({ code: 1 }, { unique: true });
  await db.collection(COLLECTIONS.tableReservations).createIndex({ date: 1, tableId: 1, status: 1, startMinutes: 1 });
  await db.collection(COLLECTIONS.menuItems).createIndex({ published: 1, sortOrder: 1 });
  await db.collection(COLLECTIONS.diningOrders).createIndex({ code: 1 }, { unique: true });
  await db.collection(COLLECTIONS.diningOrders).createIndex({ status: 1, createdAt: -1 });
}

export async function applySharedRateLimit(
  collection: Collection,
  scope: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
) {
  const bucket = `${scope}:${Math.floor(now / windowMs)}`;
  const expiresAt = new Date(now + windowMs * 2);
  const update = async (upsert: boolean) =>
    collection.findOneAndUpdate(
      { bucket },
      { $inc: { count: 1 }, ...(upsert ? { $setOnInsert: { expiresAt, scope, bucket } } : {}) },
      { upsert, returnDocument: "after" },
    );

  let doc: { count?: number } | null;
  try {
    doc = (await update(true)) as { count?: number } | null;
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? error.code : undefined;
    if (code !== 11000) throw error;
    doc = (await update(false)) as { count?: number } | null;
  }
  const count = typeof doc?.count === "number" ? doc.count : 0;
  if (count <= 0) {
    throw new Error("Rate limit write did not return a counter.");
  }
  return { allowed: count <= limit, count, retryAt: expiresAt };
}
