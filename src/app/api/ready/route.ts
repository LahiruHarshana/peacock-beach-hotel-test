import { getMongoClient } from "@/lib/db/client";
import { getEnv } from "@/lib/env";
import { redactConnectionError } from "@/lib/security/database-target";

/** Readiness probe. This is separate from /api/health, which does not touch the database. */
export async function GET() {
  try {
    const env = getEnv();
    const client = await getMongoClient();
    await client.db(env.MONGODB_DB).command({ ping: 1 });
    return Response.json({ ok: true, database: "up" });
  } catch (error) {
    console.error(redactConnectionError(error));
    return Response.json({ ok: false, database: "down" }, { status: 503 });
  }
}
