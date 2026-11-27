import { menuItemSchema } from "@/lib/validation/dining";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { requireAdminPermission } from "@/lib/auth/session";
import { writeAuditLog } from "@/server/audit/write-audit-log";
import { createMenuItem, listMenu } from "@/server/repositories/dining";

export async function GET() {
  const requestId = getRequestId();
  try {
    await requireAdminPermission("dining:read");
    return jsonSuccess(await listMenu(false), requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}

export async function POST(req: Request) {
  const requestId = getRequestId();
  try {
    const user = await requireAdminPermission("dining:write", req);
    const parsed = menuItemSchema.safeParse(await req.json());
    if (!parsed.success) return jsonError("VALIDATION_ERROR", "Check the menu item.", requestId, 422);
    const id = await createMenuItem(parsed.data);
    await writeAuditLog({ actorId: user.id, action: "dining.menu.create", targetType: "menu_item", targetId: String(id), requestId, summary: parsed.data.name.en });
    return jsonSuccess({ id: String(id) }, requestId, 201);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
