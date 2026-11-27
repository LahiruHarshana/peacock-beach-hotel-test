import { getDb } from "@/lib/db/client";
import { COLLECTIONS } from "@/lib/db/collections";
import { deleteMediaSchema } from "@/lib/validation/schemas";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { requireAdminPermission } from "@/lib/auth/session";
import { destroyAsset } from "@/lib/media/cloudinary";
import { canDestroyAsset } from "@/lib/media/policy";
import { listMediaAssets } from "@/server/repositories/media";
import { writeAuditLog } from "@/server/audit/write-audit-log";

export async function GET() {
  const requestId = getRequestId();
  try {
    await requireAdminPermission("media:write");
    const items = await listMediaAssets();
    return jsonSuccess({ items }, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}

export async function DELETE(req: Request) {
  const requestId = getRequestId();
  try {
    const user = await requireAdminPermission("media:write", req);
    const parsed = deleteMediaSchema.safeParse(await req.json());
    if (!parsed.success) {
      return jsonError("VALIDATION_ERROR", "Invalid media deletion.", requestId, 422);
    }
    if (!canDestroyAsset(parsed.data.publicId)) {
      return jsonError("FORBIDDEN", "This asset is outside the active test namespace.", requestId, 403);
    }
    await destroyAsset(parsed.data.publicId, "image");
    const db = await getDb();
    await db.collection(COLLECTIONS.mediaAssets).deleteOne({ publicId: parsed.data.publicId });
    await db.collection(COLLECTIONS.rooms).updateMany(
      {},
      { $pull: { images: { publicId: parsed.data.publicId } } } as never,
    );
    await db.collection(COLLECTIONS.events).updateMany(
      { "heroMedia.publicId": parsed.data.publicId },
      { $set: { heroMedia: null } },
    );
    await writeAuditLog({
      actorId: user.id,
      action: "media.delete",
      targetType: "media",
      targetId: parsed.data.publicId,
      requestId,
      summary: `Deleted test media ${parsed.data.publicId}`,
    });
    return jsonSuccess({ deleted: parsed.data.publicId }, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
