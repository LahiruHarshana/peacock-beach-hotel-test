import { z } from "zod";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { requireAdminPermission } from "@/lib/auth/session";
import { getRoomById, updateRoomIfVersionMatches } from "@/server/repositories/rooms";
import { listVerifiedPublicIds } from "@/server/repositories/media";
import { writeAuditLog } from "@/server/audit/write-audit-log";
import { hasFieldErrors, roomPublishFieldErrors } from "@/lib/validation/publish";

type Params = { params: Promise<{ id: string }> };

const publishSchema = z.object({ version: z.number().int().min(1) }).strict();

export async function POST(req: Request, { params }: Params) {
  const requestId = getRequestId();
  try {
    const user = await requireAdminPermission("rooms:write", req);
    const { id } = await params;
    const body = await req.json();
    const parsed = publishSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("VALIDATION_ERROR", "Version is required.", requestId, 422);
    }
    const room = await getRoomById(id);
    if (!room) return jsonError("NOT_FOUND", "Room not found.", requestId, 404);
    const verified = await listVerifiedPublicIds();
    const fieldErrors = roomPublishFieldErrors(room, verified);
    if (hasFieldErrors(fieldErrors)) {
      return jsonError(
        "VALIDATION_ERROR",
        "This room is not ready to publish.",
        requestId,
        422,
        fieldErrors,
      );
    }
    await updateRoomIfVersionMatches(id, parsed.data.version, { status: "PUBLISHED" });
    await writeAuditLog({
      actorId: user.id,
      action: "room.publish",
      targetType: "room",
      targetId: id,
      requestId,
      summary: `Published room ${room.slug}`,
    });
    return jsonSuccess({ status: "PUBLISHED" }, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
