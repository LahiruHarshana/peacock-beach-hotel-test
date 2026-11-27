import { moderateReviewSchema } from "@/lib/validation/schemas";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { requireAdminPermission } from "@/lib/auth/session";
import { moderateReview } from "@/server/repositories/reviews";
import { writeAuditLog } from "@/server/audit/write-audit-log";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const requestId = getRequestId();
  try {
    const user = await requireAdminPermission("reviews:moderate", req);
    const { id } = await params;
    const parsed = moderateReviewSchema.safeParse(await req.json());
    if (!parsed.success) {
      return jsonError("VALIDATION_ERROR", "Invalid moderation payload.", requestId, 422);
    }
    await moderateReview(id, parsed.data.action, user.id);
    await writeAuditLog({
      actorId: user.id,
      action: `review.${parsed.data.action.toLowerCase()}`,
      targetType: "review",
      targetId: id,
      requestId,
      summary: `Moderated review ${id}`,
    });
    return jsonSuccess({ ok: true }, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
