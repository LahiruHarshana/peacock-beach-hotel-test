import { getDb } from "@/lib/db/client";
import { COLLECTIONS } from "@/lib/db/collections";
import { uploadCompleteSchema } from "@/lib/validation/schemas";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { requireAdminPermission } from "@/lib/auth/session";
import { destroyAsset, verifyUploadedAsset } from "@/lib/media/cloudinary";
import { canDestroyAsset, isAllowedImage, isUploadPublicId } from "@/lib/media/policy";
import { writeAuditLog } from "@/server/audit/write-audit-log";

export async function POST(req: Request) {
  const requestId = getRequestId();
  try {
    const user = await requireAdminPermission("media:write", req);
    const parsed = uploadCompleteSchema.safeParse(await req.json());
    if (!parsed.success) {
      return jsonError("VALIDATION_ERROR", "Invalid upload completion payload.", requestId, 422);
    }
    if (!isUploadPublicId(parsed.data.publicId, parsed.data.category)) {
      return jsonError("FORBIDDEN", "Upload folder mismatch.", requestId, 403);
    }
    const asset = await verifyUploadedAsset(parsed.data.publicId, parsed.data.resourceType);
    const returnedId = typeof asset.public_id === "string" ? asset.public_id : "";
    const returnedFolder = typeof asset.folder === "string" ? asset.folder : "";
    if (
      returnedId !== parsed.data.publicId ||
      !isUploadPublicId(returnedId, parsed.data.category) ||
      (returnedFolder && !parsed.data.publicId.startsWith(`${returnedFolder}/`))
    ) {
      return jsonError("FORBIDDEN", "Upload folder mismatch.", requestId, 403);
    }
    if (parsed.data.resourceType === "image" && !isAllowedImage(asset.format, asset.bytes)) {
      if (canDestroyAsset(asset.public_id)) {
        await destroyAsset(asset.public_id, "image").catch(() => undefined);
      }
      return jsonError(
        "VALIDATION_ERROR",
        "Image must be JPEG, PNG, WebP, or AVIF and at most 8 MB.",
        requestId,
        422,
      );
    }
    const db = await getDb();
    await db.collection(COLLECTIONS.mediaAssets).updateOne(
      { publicId: asset.public_id, resourceType: parsed.data.resourceType },
      {
        $set: {
          publicId: asset.public_id,
          resourceType: parsed.data.resourceType,
          secureUrl: asset.secure_url,
          bytes: asset.bytes,
          format: asset.format,
          width: asset.width,
          height: asset.height,
          usage: parsed.data.category,
          uploadedBy: user.id,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );
    await writeAuditLog({
      actorId: user.id,
      action: "media.verify",
      targetType: "media",
      targetId: asset.public_id,
      requestId,
      summary: `Verified upload ${asset.public_id}`,
    });
    return jsonSuccess(
      { publicId: asset.public_id, secureUrl: asset.secure_url, width: asset.width, height: asset.height },
      requestId,
    );
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
