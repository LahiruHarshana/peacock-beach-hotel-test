import { z } from "zod";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { requireAdminPermission } from "@/lib/auth/session";
import { getRoomById, updateRoomIfVersionMatches } from "@/server/repositories/rooms";
import { writeAuditLog } from "@/server/audit/write-audit-log";

type Params = { params: Promise<{ id: string }> };

const unpublishSchema = z.object({ version: z.number().int().min(1) }).strict();

export async function POST(req: Request, { params }: Params) {
  const requestId = getRequestId();
  try {
    const user = await requireAdminPermission("rooms:write", req);
    const { id } = await params;
    const parsed = unpublishSchema.safeParse(await req.json());
    if (!parsed.success) {
      return jsonError("VALIDATION_ERROR", "Version is required.", requestId, 422);
    }
    const room = await getRoomById(id);
    if (!room) return jsonError("NOT_FOUND", "Room not found.", requestId, 404);
    await updateRoomIfVersionMatches(id, parsed.data.version, { status: "DRAFT" });
    await writeAuditLog({
      actorId: user.id,
      action: "room.unpublish",
      targetType: "room",
      targetId: id,
      requestId,
      summary: `Unpublished room ${room.slug}`,
    });
    return jsonSuccess({ status: "DRAFT" }, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
