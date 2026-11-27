import { createRoomSchema } from "@/lib/validation/schemas";
import { isSelectablePublicId } from "@/lib/media/policy";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { requireAdminPermission } from "@/lib/auth/session";
import { createRoom } from "@/server/repositories/rooms";
import { writeAuditLog } from "@/server/audit/write-audit-log";

export async function GET(req: Request) {
  const requestId = getRequestId();
  try {
    await requireAdminPermission("rooms:read");
    const { listRoomsForAdmin } = await import("@/server/repositories/rooms");
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const data = await listRoomsForAdmin(page);
    return jsonSuccess(data, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}

export async function POST(req: Request) {
  const requestId = getRequestId();
  try {
    const user = await requireAdminPermission("rooms:write", req);
    const body = await req.json();
    const parsed = createRoomSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(
        "VALIDATION_ERROR",
        "Please review the highlighted fields.",
        requestId,
        422,
        parsed.error.flatten().fieldErrors as Record<string, string[]>,
      );
    }
    if (parsed.data.images.some((image) => !isSelectablePublicId(image.publicId, "rooms"))) {
      return jsonError("FORBIDDEN", "Image is outside the active media namespace.", requestId, 403);
    }
    const room = await createRoom({
      ...parsed.data,
      status: "DRAFT",
      priceDisplay: parsed.data.priceDisplay ?? null,
      currency: parsed.data.currency ?? "USD",
    });
    await writeAuditLog({
      actorId: user.id,
      action: "room.create",
      targetType: "room",
      targetId: String(room._id),
      requestId,
      summary: `Created room ${parsed.data.slug}`,
    });
    return jsonSuccess({ id: String(room._id), version: room.version }, requestId, 201);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
