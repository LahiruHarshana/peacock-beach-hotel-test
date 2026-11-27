import { updateMenuItemSchema } from "@/lib/validation/dining";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { requireAdminPermission } from "@/lib/auth/session";
import { writeAuditLog } from "@/server/audit/write-audit-log";
import { updateMenuItem } from "@/server/repositories/dining";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId();
  try {
    const user = await requireAdminPermission("dining:write", req);
    const { id } = await context.params;
    const parsed = updateMenuItemSchema.safeParse(await req.json());
    if (!parsed.success) return jsonError("VALIDATION_ERROR", "Check the menu item.", requestId, 422);
    const saved = await updateMenuItem(id, parsed.data);
    await writeAuditLog({ actorId: user.id, action: "dining.menu.update", targetType: "menu_item", targetId: id, requestId, summary: saved.name.en });
    return jsonSuccess({ id, version: saved.version, published: saved.published }, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
