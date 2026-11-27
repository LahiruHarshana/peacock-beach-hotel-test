import { orderStatusSchema } from "@/lib/validation/dining";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { requireAdminPermission } from "@/lib/auth/session";
import { writeAuditLog } from "@/server/audit/write-audit-log";
import { setOrderStatus } from "@/server/repositories/dining";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId();
  try {
    const user = await requireAdminPermission("dining:write", req);
    const { id } = await context.params;
    const parsed = orderStatusSchema.safeParse(await req.json());
    if (!parsed.success) return jsonError("VALIDATION_ERROR", "Choose a status.", requestId, 422);
    const saved = await setOrderStatus(id, parsed.data.status, parsed.data.version);
    await writeAuditLog({ actorId: user.id, action: "dining.order.status", targetType: "order", targetId: id, requestId, summary: saved.status });
    return jsonSuccess({ id, status: saved.status, version: saved.version }, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
