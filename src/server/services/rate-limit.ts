import "server-only";
import { getDb } from "@/lib/db/client";
import { COLLECTIONS } from "@/lib/db/collections";
import { DomainError } from "@/lib/errors/api";
import { applySharedRateLimit } from "@/lib/db/indexes";

export async function consumeRateLimit(scope: string, limit: number, windowMs: number) {
  const db = await getDb();
  const result = await applySharedRateLimit(
    db.collection(COLLECTIONS.rateLimits),
    scope,
    limit,
    windowMs,
  );
  if (!result.allowed) {
    throw new DomainError("RATE_LIMITED", "Too many requests. Please try again later.", 429);
  }
}
