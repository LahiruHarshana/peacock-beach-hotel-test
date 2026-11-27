import { lookupSchema } from "@/lib/validation/dining";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { cancelOrderForGuest } from "@/server/repositories/dining";
import { consumeRateLimit } from "@/server/services/rate-limit";
import { clientAddress } from "@/lib/security/client-address";
import { getEnv } from "@/lib/env";

export async function POST(req: Request) {
  const requestId = getRequestId();
  try {
    const caller = clientAddress(req.headers, getEnv().TRUSTED_PROXY_HOPS);
    await consumeRateLimit(`dining-cancel:${caller}`, 10, 60_000);
    const parsed = lookupSchema.safeParse(await req.json());
    if (!parsed.success) return jsonError("VALIDATION_ERROR", "Enter your code and email or phone.", requestId, 422);
    const doc = await cancelOrderForGuest(parsed.data.code, parsed.data.email, parsed.data.phone);
    return jsonSuccess({ code: doc.code, status: doc.status }, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
