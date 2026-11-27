import { updateRoomSchema } from "@/lib/validation/schemas";
import { isSelectablePublicId } from "@/lib/media/policy";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { requireAdminPermission } from "@/lib/auth/session";
import { getRoomById, updateRoomIfVersionMatches } from "@/server/repositories/rooms";
import { writeAuditLog } from "@/server/audit/write-audit-log";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const requestId = getRequestId();
  try {
    await requireAdminPermission("rooms:read");
    const { id } = await params;
    const room = await getRoomById(id);
    if (!room) return jsonError("NOT_FOUND", "Room not found.", requestId, 404);
    return jsonSuccess(room, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}

export async function PATCH(req: Request, { params }: Params) {
  const requestId = getRequestId();
  try {
    const user = await requireAdminPermission("rooms:write", req);
    const { id } = await params;
    const body = await req.json();
    const parsed = updateRoomSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(
        "VALIDATION_ERROR",
        "Please review the highlighted fields.",
        requestId,
        422,
        parsed.error.flatten().fieldErrors as Record<string, string[]>,
      );
    }
    if (parsed.data.images?.some((image) => !isSelectablePublicId(image.publicId, "rooms"))) {
      return jsonError("FORBIDDEN", "Image is outside the active media namespace.", requestId, 403);
    }
    const { version, status, ...update } = parsed.data;
    void status;
    await updateRoomIfVersionMatches(id, version, update);
    await writeAuditLog({
      actorId: user.id,
      action: "room.update",
      targetType: "room",
      targetId: id,
      requestId,
      summary: `Updated room ${id}`,
    });
    return jsonSuccess({ ok: true }, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
