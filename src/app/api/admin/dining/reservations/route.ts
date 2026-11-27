import { getRequestId, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { requireAdminPermission } from "@/lib/auth/session";
import { listReservations } from "@/server/repositories/dining";

export async function GET(req: Request) {
  const requestId = getRequestId();
  try {
    await requireAdminPermission("dining:read");
    const page = Number(new URL(req.url).searchParams.get("page") ?? "1");
    return jsonSuccess(await listReservations(page), requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
