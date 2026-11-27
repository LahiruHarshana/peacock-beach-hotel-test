import "server-only";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db/client";
import { COLLECTIONS } from "@/lib/db/collections";
import { DomainError } from "@/lib/errors/api";

export type ReviewDoc = {
  _id: ObjectId;
  authorDisplayName: string;
  rating?: number;
  text: string;
  locale: "en" | "ru";
  moderationStatus: "PENDING" | "APPROVED" | "REJECTED";
  consentAcceptedAt: Date;
  createdAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  version: number;
};

export async function listApprovedReviews(limit = 20) {
  const db = await getDb();
  return db
    .collection<ReviewDoc>(COLLECTIONS.reviews)
    .find({ moderationStatus: "APPROVED" })
    .project({
      authorDisplayName: 1,
      rating: 1,
      text: 1,
      locale: 1,
      createdAt: 1,
    })
    .sort({ createdAt: -1 })
    .limit(Math.min(limit, 50))
    .toArray();
}

export async function createPendingReview(
  input: Omit<ReviewDoc, "_id" | "moderationStatus" | "createdAt" | "version">,
) {
  const db = await getDb();
  const doc = {
    ...input,
    moderationStatus: "PENDING" as const,
    createdAt: new Date(),
    version: 1,
  };
  const result = await db.collection(COLLECTIONS.reviews).insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function listReviewsForModeration(page = 1, pageSize = 20) {
  const db = await getDb();
  const skip = (Math.max(page, 1) - 1) * Math.min(pageSize, 50);
  const limit = Math.min(pageSize, 50);
  const items = await db
    .collection<ReviewDoc>(COLLECTIONS.reviews)
    .find({ moderationStatus: "PENDING" })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  const total = await db
    .collection(COLLECTIONS.reviews)
    .countDocuments({ moderationStatus: "PENDING" });
  return { items, total, page: Math.max(page, 1), pageSize: limit };
}

export async function moderateReview(
  id: string,
  action: "APPROVE" | "REJECT",
  reviewerId: string,
) {
  if (!ObjectId.isValid(id)) {
    throw new DomainError("VALIDATION_ERROR", "Invalid review id.", 400);
  }
  const db = await getDb();
  const status = action === "APPROVE" ? "APPROVED" : "REJECTED";
  const result = await db.collection<ReviewDoc>(COLLECTIONS.reviews).updateOne(
    { _id: new ObjectId(id), moderationStatus: "PENDING" },
    {
      $set: {
        moderationStatus: status,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
      $inc: { version: 1 },
    },
  );
  if (result.matchedCount === 0) {
    throw new DomainError("NOT_FOUND", "Review not found or already moderated.", 404);
  }
}
