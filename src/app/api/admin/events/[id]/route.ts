import { updateEventSchema } from "@/lib/validation/schemas";
import { isSelectablePublicId } from "@/lib/media/policy";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { requireAdminPermission } from "@/lib/auth/session";
import { deleteEventIfVersionMatches, updateEventIfVersionMatches } from "@/server/repositories/events";
import { writeAuditLog } from "@/server/audit/write-audit-log";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const requestId = getRequestId();
  try {
    const user = await requireAdminPermission("events:write", req);
    const { id } = await params;
    const parsed = updateEventSchema.safeParse(await req.json());
    if (!parsed.success) {
      return jsonError("VALIDATION_ERROR", "Invalid event update.", requestId, 422);
    }
    const heroId = parsed.data.heroMedia?.publicId;
    if (heroId && !isSelectablePublicId(heroId, "events")) {
      return jsonError("FORBIDDEN", "Image is outside the active media namespace.", requestId, 403);
    }
    const { version, status, ...update } = parsed.data;
    void status;
    await updateEventIfVersionMatches(id, version, update);
    await writeAuditLog({
      actorId: user.id,
      action: "event.update",
      targetType: "event",
      targetId: id,
      requestId,
      summary: `Updated event ${id}`,
    });
    return jsonSuccess({ ok: true }, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const requestId = getRequestId();
  try {
    const user = await requireAdminPermission("events:write", req);
    const { id } = await params;
    const body = z.object({ version: z.number().int().min(1) }).strict().safeParse(await req.json());
    if (!body.success) return jsonError("VALIDATION_ERROR", "Version required.", requestId, 422);
    await deleteEventIfVersionMatches(id, body.data.version);
    await writeAuditLog({
      actorId: user.id,
      action: "event.delete",
      targetType: "event",
      targetId: id,
      requestId,
      summary: `Deleted event ${id}`,
    });
    return jsonSuccess({ ok: true }, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
