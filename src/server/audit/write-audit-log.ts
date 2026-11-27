import "server-only";
import { getDb } from "@/lib/db/client";
import { COLLECTIONS } from "@/lib/db/collections";

export async function writeAuditLog(input: {
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  requestId: string;
  summary: string;
}) {
  const db = await getDb();
  await db.collection(COLLECTIONS.auditLogs).insertOne({
    actorId: input.actorId,
    action: input.action,
    targetType: input.targetType,
    targetId: input.targetId,
    at: new Date(),
    requestId: input.requestId,
    summary: input.summary.slice(0, 500),
  });
}
