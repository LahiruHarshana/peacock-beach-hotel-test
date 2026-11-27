import { uploadSignSchema } from "@/lib/validation/schemas";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { requireAdminPermission } from "@/lib/auth/session";
import { createSignedUploadParams } from "@/lib/media/cloudinary";
import { MAX_IMAGE_BYTES } from "@/lib/media/policy";
import { consumeRateLimit } from "@/server/services/rate-limit";

export async function POST(req: Request) {
  const requestId = getRequestId();
  try {
    const user = await requireAdminPermission("media:write", req);
    await consumeRateLimit(`upload-sign:${user.id}`, 30, 60_000);
    const parsed = uploadSignSchema.safeParse(await req.json());
    if (!parsed.success) {
      return jsonError("VALIDATION_ERROR", "Invalid upload request.", requestId, 422);
    }
    const signed = createSignedUploadParams({
      category: parsed.data.category,
      uploadedBy: user.id,
    });
    return jsonSuccess({ ...signed, maxBytes: MAX_IMAGE_BYTES }, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
