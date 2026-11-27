import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { MongoClient, ObjectId, type Db } from "mongodb";
import { COLLECTIONS } from "../src/lib/db/collections";
import { ensureDatabaseIndexes } from "../src/lib/db/indexes";
import { hashPassword } from "../src/lib/auth/password";
import { assertNamedEnvironment } from "../src/lib/security/database-target";
import { isAllowedImage } from "../src/lib/media/policy";
import {
  DEMO_DINING_CONFIG,
  DEMO_MEDIA,
  DEMO_MENU,
  DEMO_REVIEWS,
  DEMO_ROOMS,
  DEMO_SITE_SETTINGS,
  DEMO_STAFF,
  DEMO_TABLES,
  SEED_MARKER,
  demoEvents,
} from "./seed-demo-data/catalog";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");

function loadEnvFile() {
  const file = process.env.PEACOCK_ENV_FILE ?? ".env.local";
  const parsed = parse(readFileSync(resolve(repoRoot, file), "utf8"));
  for (const [key, value] of Object.entries(parsed)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }
  process.env.PEACOCK_ENV ??= parsed.PEACOCK_ENV ?? "development";
  return { file, parsed };
}

function configureCloudinary(parsed: Record<string, string>) {
  const cloudName = parsed.CLOUDINARY_CLOUD_NAME;
  const apiKey = parsed.CLOUDINARY_API_KEY;
  const apiSecret = parsed.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are required.");
  }
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
}

async function ensureUploadedMedia() {
  let uploaded = 0;
  let skipped = 0;
  for (const item of DEMO_MEDIA) {
    const localPath = resolve(repoRoot, item.file);
    try {
      await cloudinary.api.resource(item.publicId, { resource_type: "image" });
      skipped += 1;
    } catch {
      const result = await cloudinary.uploader.upload(localPath, {
        public_id: item.publicId,
        overwrite: true,
        resource_type: "image",
      });
      if (!isAllowedImage(result.format, result.bytes)) {
        throw new Error(`Uploaded asset failed policy check: ${item.publicId}`);
      }
      uploaded += 1;
    }
  }
  return { uploaded, skipped };
}

function colomboDate(offsetDays: number) {
  const instant = new Date(Date.now() + offsetDays * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

async function seedDining(db: Db, now: Date) {
  const filter = { seedSource: SEED_MARKER };
  await Promise.all([
    db.collection(COLLECTIONS.diningTables).deleteMany(filter),
    db.collection(COLLECTIONS.menuItems).deleteMany(filter),
    db.collection(COLLECTIONS.tableReservations).deleteMany(filter),
    db.collection(COLLECTIONS.diningOrders).deleteMany(filter),
  ]);
  await db.collection(COLLECTIONS.diningTables).deleteMany({ name: "Terrace 1", seedSource: { $exists: false } });
  await db.collection(COLLECTIONS.menuItems).deleteMany({ "name.en": "Garden salad", seedSource: { $exists: false } });
  await db.collection(COLLECTIONS.tableReservations).deleteMany({ email: "ada@example.com", seedSource: { $exists: false } });
  await db.collection(COLLECTIONS.diningOrders).deleteMany({ email: "ada@example.com", seedSource: { $exists: false } });

  await db.collection<{ _id: string }>(COLLECTIONS.diningConfig).replaceOne(
    { _id: "default" },
    { ...DEMO_DINING_CONFIG, updatedAt: now, seedSource: SEED_MARKER },
    { upsert: true },
  );

  const tableIds = new Map<string, ObjectId>();
  for (const table of DEMO_TABLES) {
    const _id = new ObjectId();
    tableIds.set(table.key, _id);
    await db.collection(COLLECTIONS.diningTables).insertOne({
      _id,
      name: table.name,
      seats: table.seats,
      active: "active" in table ? table.active : true,
      sortOrder: table.sortOrder,
      version: 1,
      seedSource: SEED_MARKER,
      createdAt: now,
      updatedAt: now,
    });
  }

  const menuIds = new Map<string, ObjectId>();
  for (const item of DEMO_MENU) {
    const _id = new ObjectId();
    menuIds.set(item.key, _id);
    await db.collection(COLLECTIONS.menuItems).insertOne({
      _id,
      name: item.name,
      description: item.description,
      price: item.price,
      currency: "USD",
      category: item.category,
      published: "published" in item ? item.published : true,
      sortOrder: item.sortOrder,
      optionGroups: item.optionGroups,
      version: 1,
      seedSource: SEED_MARKER,
      createdAt: now,
      updatedAt: now,
    });
  }

  const duration = DEMO_DINING_CONFIG.durationMinutes;
  const reservations = [
    { code: "SEEDR001", guestName: "Nimal Perera", email: "nimal@example.com", phone: "94771234001", date: colomboDate(1), start: 19 * 60, guests: 2, table: "terrace-2", status: "CONFIRMED", notes: "Window if possible.", locale: "en" },
    { code: "SEEDR002", guestName: "Anna Sokolova", email: "anna@example.com", phone: "94771234002", date: colomboDate(0), start: 12 * 60 + 30, guests: 4, table: "beach-1", status: "SEATED", notes: "", locale: "ru" },
    { code: "SEEDR003", guestName: "James Hart", email: "james@example.com", phone: "94771234003", date: colomboDate(-1), start: 19 * 60 + 30, guests: 2, table: "garden", status: "COMPLETED", notes: "", locale: "en" },
    { code: "SEEDR004", guestName: "The Fernando family", email: "fernando@example.com", phone: "94771234004", date: colomboDate(2), start: 18 * 60, guests: 6, table: "family", status: "CONFIRMED", notes: "Birthday cake after mains.", locale: "en" },
  ] as const;

  for (const reservation of reservations) {
    const tableId = tableIds.get(reservation.table);
    const table = DEMO_TABLES.find((entry) => entry.key === reservation.table);
    if (!tableId || !table) throw new Error(`Missing seed table ${reservation.table}`);
    await db.collection(COLLECTIONS.tableReservations).insertOne({
      _id: new ObjectId(),
      code: reservation.code,
      guestName: reservation.guestName,
      email: reservation.email,
      phone: reservation.phone,
      date: reservation.date,
      startMinutes: reservation.start,
      endMinutes: reservation.start + duration,
      durationMinutes: duration,
      guests: reservation.guests,
      tableId: String(tableId),
      tableName: table.name,
      status: reservation.status,
      notes: reservation.notes,
      locale: reservation.locale,
      version: 1,
      seedSource: SEED_MARKER,
      createdAt: now,
      updatedAt: now,
    });
  }

  const line = (key: string, quantity: number, choice?: { groupId: string; choiceId: string }) => {
    const item = DEMO_MENU.find((entry) => entry.key === key);
    const id = menuIds.get(key);
    if (!item || !id) throw new Error(`Missing seed dish ${key}`);
    const selected = choice
      ? item.optionGroups.flatMap((group) => group.choices.filter((option) => option.id === choice.choiceId).map((option) => ({ groupId: group.id, choiceId: option.id, label: option.name, priceDelta: option.priceDelta })))
      : [];
    const unit = item.price + selected.reduce((sum, option) => sum + option.priceDelta, 0);
    return {
      menuItemId: String(id),
      name: item.name,
      quantity,
      unitPrice: unit,
      lineTotal: unit * quantity,
      selections: selected.map(({ priceDelta: _priceDelta, ...rest }) => rest),
    };
  };

  const orders = [
    { code: "SEEDO001", guestName: "Nimal Perera", email: "nimal@example.com", phone: "94771234001", status: "RECEIVED", reservationCode: "SEEDR001", notes: "No onion in the salad.", locale: "en" as const, items: [line("prawn", 1, { groupId: "spice", choiceId: "medium" }), line("coconut", 2), line("salad", 1)] },
    { code: "SEEDO002", guestName: "Anna Sokolova", email: "anna@example.com", phone: "94771234002", status: "PREPARING", notes: "", locale: "ru" as const, items: [line("kottu", 2, { groupId: "spice", choiceId: "mild" }), line("lime", 2, { groupId: "sweet", choiceId: "plain" })] },
    { code: "SEEDO003", guestName: "James Hart", email: "james@example.com", phone: "94771234003", status: "READY", notes: "", locale: "en" as const, items: [line("catch", 1, { groupId: "size", choiceId: "large" }), line("tea", 1)] },
    { code: "SEEDO004", guestName: "The Fernando family", email: "fernando@example.com", phone: "94771234004", status: "COMPLETED", notes: "", locale: "en" as const, items: [line("rice", 3), line("hoppers", 2, { groupId: "spice", choiceId: "hot" }), line("ginger", 4)] },
  ];

  for (const order of orders) {
    await db.collection(COLLECTIONS.diningOrders).insertOne({
      _id: new ObjectId(),
      code: order.code,
      guestName: order.guestName,
      email: order.email,
      phone: order.phone,
      notes: order.notes,
      locale: order.locale,
      reservationCode: "reservationCode" in order ? order.reservationCode : undefined,
      items: order.items,
      total: order.items.reduce((sum, item) => sum + item.lineTotal, 0),
      currency: "USD",
      status: order.status,
      version: 1,
      seedSource: SEED_MARKER,
      createdAt: now,
      updatedAt: now,
    });
  }
}

async function main() {
  const { parsed } = loadEnvFile();
  const environment = parsed.PEACOCK_ENV === "production" ? "production" : "development";
  const envFile = process.env.PEACOCK_ENV_FILE ?? ".env.local";
  if (parsed.PEACOCK_ENV === "staging" || envFile === ".env.staging.local") {
    throw new Error("Do not seed demo data on staging. Use an isolated development database.");
  }
  if (environment === "production" && process.env.PEACOCK_ALLOW_PRODUCTION !== "1") {
    throw new Error("Refusing production demo seed without PEACOCK_ALLOW_PRODUCTION=1.");
  }
  assertNamedEnvironment(environment, parsed.MONGODB_URI ?? "", parsed.MONGODB_DB ?? "");
  const uri = parsed.MONGODB_URI;
  const dbName = parsed.MONGODB_DB;
  if (!uri || !dbName) throw new Error("MONGODB_URI and MONGODB_DB are required.");

  const diningOnly = process.argv.includes("--dining-only");
  if (diningOnly) {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    await ensureDatabaseIndexes(db);
    await seedDining(db, new Date());
    const [tables, menu, reservations, orders] = await Promise.all([
      db.collection(COLLECTIONS.diningTables).countDocuments({ seedSource: SEED_MARKER }),
      db.collection(COLLECTIONS.menuItems).countDocuments({ seedSource: SEED_MARKER, published: true }),
      db.collection(COLLECTIONS.tableReservations).countDocuments({ seedSource: SEED_MARKER }),
      db.collection(COLLECTIONS.diningOrders).countDocuments({ seedSource: SEED_MARKER }),
    ]);
    await client.close();
    console.log(`Restaurant seed complete on ${dbName}: ${tables} tables, ${menu} published dishes, ${reservations} reservations, ${orders} orders.`);
    return;
  }

  configureCloudinary(parsed);
  console.log("Uploading demo images to Cloudinary (skips assets that already exist)…");
  const mediaStats = await ensureUploadedMedia();
  console.log(`Cloudinary: ${mediaStats.uploaded} uploaded, ${mediaStats.skipped} already present.`);

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  await ensureDatabaseIndexes(db);

  const now = new Date();
  const ownerEmail = (parsed.BOOTSTRAP_ADMIN_EMAIL ?? "admin@peacockbeach.local").trim().toLowerCase();

  await db.collection(COLLECTIONS.rooms).deleteMany({ seedSource: SEED_MARKER });
  await db.collection(COLLECTIONS.events).deleteMany({ seedSource: SEED_MARKER });
  await db.collection(COLLECTIONS.reviews).deleteMany({ seedSource: SEED_MARKER });

  for (const item of DEMO_MEDIA) {
    const asset = await cloudinary.api.resource(item.publicId, { resource_type: "image" });
    await db.collection(COLLECTIONS.mediaAssets).updateOne(
      { publicId: item.publicId },
      {
        $set: {
          publicId: item.publicId,
          resourceType: "image",
          secureUrl: asset.secure_url,
          bytes: asset.bytes,
          format: asset.format,
          width: asset.width,
          height: asset.height,
          usage: item.usage,
          uploadedBy: "seed-demo",
          seedSource: SEED_MARKER,
          createdAt: now,
        },
      },
      { upsert: true },
    );
  }

  await db.collection<{ _id: string }>(COLLECTIONS.siteSettings).updateOne(
    { _id: "main" },
    {
      $set: {
        ...DEMO_SITE_SETTINGS,
        lastUpdatedAt: now,
        seedSource: SEED_MARKER,
      },
    },
    { upsert: true },
  );

  for (const room of DEMO_ROOMS) {
    await db.collection(COLLECTIONS.rooms).insertOne({
      slug: room.slug,
      name: room.name,
      description: room.description,
      capacity: room.capacity,
      amenities: [...room.amenities],
      images: [
        {
          publicId: room.imagePublicId,
          alt: { en: room.name.en, ru: room.name.ru },
          order: 0,
        },
      ],
      priceDisplay: room.priceDisplay,
      currency: room.currency,
      status: "PUBLISHED",
      sortOrder: room.sortOrder,
      version: 1,
      seedSource: SEED_MARKER,
      createdAt: now,
      updatedAt: now,
    });
  }

  for (const event of demoEvents(now)) {
    await db.collection(COLLECTIONS.events).insertOne({
      slug: event.slug,
      title: event.title,
      description: event.description,
      startAt: event.startAt,
      endAt: event.endAt,
      heroMedia: { publicId: event.heroPublicId, resourceType: "image" as const },
      status: event.status,
      version: 1,
      seedSource: SEED_MARKER,
      createdAt: now,
      updatedAt: now,
    });
  }

  for (const review of DEMO_REVIEWS.approved) {
    await db.collection(COLLECTIONS.reviews).insertOne({
      authorDisplayName: review.authorDisplayName,
      rating: review.rating,
      text: review.text,
      locale: review.locale,
      moderationStatus: "APPROVED",
      consentAcceptedAt: now,
      reviewedBy: ownerEmail,
      reviewedAt: now,
      version: 1,
      seedSource: SEED_MARKER,
      createdAt: new Date(now.getTime() - 86400000 * 3),
    });
  }

  for (const review of DEMO_REVIEWS.pending) {
    await db.collection(COLLECTIONS.reviews).insertOne({
      authorDisplayName: review.authorDisplayName,
      rating: review.rating,
      text: review.text,
      locale: review.locale,
      moderationStatus: "PENDING",
      consentAcceptedAt: now,
      version: 1,
      seedSource: SEED_MARKER,
      createdAt: now,
    });
  }

  const staffPassword = process.env.SEED_DEMO_STAFF_PASSWORD?.trim() || "PeacockDemoStaff1!";
  if (staffPassword.length < 12) {
    throw new Error("SEED_DEMO_STAFF_PASSWORD must be at least 12 characters.");
  }
  const staffHash = await hashPassword(staffPassword);
  for (const staff of DEMO_STAFF) {
    const emailNormalized = staff.email.trim().toLowerCase();
    await db.collection(COLLECTIONS.users).updateOne(
      { emailNormalized },
      {
        $set: {
          emailNormalized,
          name: staff.name,
          role: staff.role,
          status: "ACTIVE",
          passwordHash: staffHash,
          seedSource: SEED_MARKER,
          updatedAt: now,
        },
        $setOnInsert: {
          tokenVersion: 0,
          createdAt: now,
        },
      },
      { upsert: true },
    );
  }

  await seedDining(db, now);

  await db.collection(COLLECTIONS.auditLogs).insertOne({
    actorId: ownerEmail,
    action: "seed.demo",
    targetType: "system",
    targetId: "demo-data",
    requestId: "seed-demo-data",
    summary: "Loaded development demo content (rooms, events, reviews, settings, media, restaurant).",
    seedSource: SEED_MARKER,
    at: now,
  });

  const [rooms, events, reviewsApproved, reviewsPending, media, tables, menu, reservations, orders] = await Promise.all([
    db.collection(COLLECTIONS.rooms).countDocuments({ seedSource: SEED_MARKER }),
    db.collection(COLLECTIONS.events).countDocuments({ seedSource: SEED_MARKER }),
    db.collection(COLLECTIONS.reviews).countDocuments({ seedSource: SEED_MARKER, moderationStatus: "APPROVED" }),
    db.collection(COLLECTIONS.reviews).countDocuments({ seedSource: SEED_MARKER, moderationStatus: "PENDING" }),
    db.collection(COLLECTIONS.mediaAssets).countDocuments({ seedSource: SEED_MARKER }),
    db.collection(COLLECTIONS.diningTables).countDocuments({ seedSource: SEED_MARKER }),
    db.collection(COLLECTIONS.menuItems).countDocuments({ seedSource: SEED_MARKER }),
    db.collection(COLLECTIONS.tableReservations).countDocuments({ seedSource: SEED_MARKER }),
    db.collection(COLLECTIONS.diningOrders).countDocuments({ seedSource: SEED_MARKER }),
  ]);

  await client.close();

  console.log("");
  console.log(`Demo seed complete on ${dbName}.`);
  console.log(`  Rooms (published): ${rooms}`);
  console.log(`  Events: ${events} (includes 1 draft)`);
  console.log(`  Reviews: ${reviewsApproved} approved, ${reviewsPending} pending moderation`);
  console.log(`  Media assets: ${media}`);
  console.log(`  Site settings: updated (_id main)`);
  console.log(`  Tables: ${tables}`);
  console.log(`  Menu items: ${menu}`);
  console.log(`  Reservations: ${reservations}`);
  console.log(`  Orders: ${orders}`);
  console.log("");
  console.log("Staff demo accounts (development only):");
  for (const staff of DEMO_STAFF) {
    console.log(`  ${staff.email} (${staff.role})`);
  }
  console.log(`  Password: ${staffPassword}`);
  console.log("");
  console.log("Refresh the public site and /admin to see the content.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
