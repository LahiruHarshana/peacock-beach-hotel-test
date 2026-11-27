import { getRequestId, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { requireAdminPermission } from "@/lib/auth/session";
import { listReviewsForModeration } from "@/server/repositories/reviews";

export async function GET(req: Request) {
  const requestId = getRequestId();
  try {
    await requireAdminPermission("reviews:read");
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const data = await listReviewsForModeration(page);
    return jsonSuccess(data, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
