import { diningConfigSchema, diningTableSchema } from "@/lib/validation/dining";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { requireAdminPermission } from "@/lib/auth/session";
import { writeAuditLog } from "@/server/audit/write-audit-log";
import { createTable, getDiningConfig, listTables, saveDiningConfig } from "@/server/repositories/dining";

export async function GET() {
  const requestId = getRequestId();
  try {
    await requireAdminPermission("dining:read");
    const [config, tables] = await Promise.all([getDiningConfig(), listTables(false)]);
    return jsonSuccess({ config, tables }, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}

export async function PUT(req: Request) {
  const requestId = getRequestId();
  try {
    const user = await requireAdminPermission("dining:write", req);
    const parsed = diningConfigSchema.safeParse(await req.json());
    if (!parsed.success) return jsonError("VALIDATION_ERROR", "Check the dining hours.", requestId, 422);
    const saved = await saveDiningConfig(parsed.data);
    await writeAuditLog({ actorId: user.id, action: "dining.config", targetType: "dining_config", targetId: "default", requestId, summary: "Updated dining hours" });
    return jsonSuccess(saved, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}

export async function POST(req: Request) {
  const requestId = getRequestId();
  try {
    const user = await requireAdminPermission("dining:write", req);
    const parsed = diningTableSchema.safeParse(await req.json());
    if (!parsed.success) return jsonError("VALIDATION_ERROR", "Check the table details.", requestId, 422);
    const id = await createTable(parsed.data);
    await writeAuditLog({ actorId: user.id, action: "dining.table.create", targetType: "dining_table", targetId: String(id), requestId, summary: parsed.data.name });
    return jsonSuccess({ id: String(id) }, requestId, 201);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
