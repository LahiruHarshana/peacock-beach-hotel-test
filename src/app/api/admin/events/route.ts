import { createEventSchema } from "@/lib/validation/schemas";
import { isSelectablePublicId } from "@/lib/media/policy";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { requireAdminPermission } from "@/lib/auth/session";
import { createEvent, listEventsForAdmin } from "@/server/repositories/events";
import { writeAuditLog } from "@/server/audit/write-audit-log";

export async function GET(req: Request) {
  const requestId = getRequestId();
  try {
    await requireAdminPermission("events:read");
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const data = await listEventsForAdmin(page);
    return jsonSuccess(data, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}

export async function POST(req: Request) {
  const requestId = getRequestId();
  try {
    const user = await requireAdminPermission("events:write", req);
    const parsed = createEventSchema.safeParse(await req.json());
    if (!parsed.success) {
      return jsonError(
        "VALIDATION_ERROR",
        "Please review the highlighted fields.",
        requestId,
        422,
        parsed.error.flatten().fieldErrors as Record<string, string[]>,
      );
    }
    const heroId = parsed.data.heroMedia?.publicId;
    if (heroId && !isSelectablePublicId(heroId, "events")) {
      return jsonError("FORBIDDEN", "Image is outside the active media namespace.", requestId, 403);
    }
    const event = await createEvent({ ...parsed.data, status: "DRAFT" });
    await writeAuditLog({
      actorId: user.id,
      action: "event.create",
      targetType: "event",
      targetId: String(event._id),
      requestId,
      summary: `Created event ${parsed.data.slug}`,
    });
    return jsonSuccess({ id: String(event._id), version: event.version }, requestId, 201);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
