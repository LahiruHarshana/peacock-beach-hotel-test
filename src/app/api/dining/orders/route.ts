import { createOrderSchema } from "@/lib/validation/dining";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { createOrder } from "@/server/repositories/dining";
import { consumeRateLimit } from "@/server/services/rate-limit";
import { clientAddress } from "@/lib/security/client-address";
import { getEnv } from "@/lib/env";

export async function POST(req: Request) {
  const requestId = getRequestId();
  try {
    const caller = clientAddress(req.headers, getEnv().TRUSTED_PROXY_HOPS);
    await consumeRateLimit(`dining-order:${caller}`, 10, 60_000);
    const parsed = createOrderSchema.safeParse(await req.json());
    if (!parsed.success) {
      return jsonError("VALIDATION_ERROR", "Please review the order.", requestId, 422, parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }
    const saved = await createOrder(parsed.data);
    return jsonSuccess(
      { code: saved.code, status: saved.status, total: saved.total, currency: saved.currency, payAtRestaurant: true },
      requestId,
      201,
    );
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
