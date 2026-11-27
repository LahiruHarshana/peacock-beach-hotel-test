import "server-only";
import { getDb } from "@/lib/db/client";
import { COLLECTIONS } from "@/lib/db/collections";
import { canDisplayPublicId } from "@/lib/media/policy";

export async function listVerifiedPublicIds(): Promise<Set<string>> {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTIONS.mediaAssets)
    .find({}, { projection: { publicId: 1 } })
    .limit(500)
    .toArray();
  return new Set(docs.map((doc) => String(doc.publicId)).filter((publicId) => canDisplayPublicId(publicId)));
}

export async function listMediaAssets(limit = 50) {
  const db = await getDb();
  return db
    .collection(COLLECTIONS.mediaAssets)
    .find({})
    .project({ publicId: 1, secureUrl: 1, format: 1, bytes: 1, width: 1, height: 1, usage: 1 })
    .sort({ createdAt: -1 })
    .limit(Math.min(limit, 50))
    .toArray()
    .then((assets) => assets.filter((asset) => canDisplayPublicId(String(asset.publicId))));
}
