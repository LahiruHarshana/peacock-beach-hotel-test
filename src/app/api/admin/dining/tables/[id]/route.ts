import { updateDiningTableSchema } from "@/lib/validation/dining";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { requireAdminPermission } from "@/lib/auth/session";
import { writeAuditLog } from "@/server/audit/write-audit-log";
import { updateTable } from "@/server/repositories/dining";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId();
  try {
    const user = await requireAdminPermission("dining:write", req);
    const { id } = await context.params;
    const parsed = updateDiningTableSchema.safeParse(await req.json());
    if (!parsed.success) return jsonError("VALIDATION_ERROR", "Check the table details.", requestId, 422);
    const saved = await updateTable(id, parsed.data);
    await writeAuditLog({ actorId: user.id, action: "dining.table.update", targetType: "dining_table", targetId: id, requestId, summary: saved.name });
    return jsonSuccess({ id, version: saved.version }, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
