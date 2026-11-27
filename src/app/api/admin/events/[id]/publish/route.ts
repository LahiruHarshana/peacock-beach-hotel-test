import { z } from "zod";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { requireAdminPermission } from "@/lib/auth/session";
import { getEventById, updateEventIfVersionMatches } from "@/server/repositories/events";
import { listVerifiedPublicIds } from "@/server/repositories/media";
import { writeAuditLog } from "@/server/audit/write-audit-log";
import { eventPublishFieldErrors, hasFieldErrors } from "@/lib/validation/publish";

type Params = { params: Promise<{ id: string }> };
const publishSchema = z.object({ version: z.number().int().min(1) }).strict();

export async function POST(req: Request, { params }: Params) {
  const requestId = getRequestId();
  try {
    const user = await requireAdminPermission("events:write", req);
    const { id } = await params;
    const parsed = publishSchema.safeParse(await req.json());
    if (!parsed.success) return jsonError("VALIDATION_ERROR", "Version is required.", requestId, 422);
    const event = await getEventById(id);
    if (!event) return jsonError("NOT_FOUND", "Event not found.", requestId, 404);
    const verified = await listVerifiedPublicIds();
    const fieldErrors = eventPublishFieldErrors(
      { ...event, heroPublicId: event.heroMedia?.publicId ?? null },
      verified,
    );
    if (hasFieldErrors(fieldErrors)) {
      return jsonError("VALIDATION_ERROR", "This event is not ready to publish.", requestId, 422, fieldErrors);
    }
    await updateEventIfVersionMatches(id, parsed.data.version, { status: "PUBLISHED" });
    await writeAuditLog({
      actorId: user.id,
      action: "event.publish",
      targetType: "event",
      targetId: id,
      requestId,
      summary: `Published event ${event.slug}`,
    });
    return jsonSuccess({ status: "PUBLISHED" }, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
