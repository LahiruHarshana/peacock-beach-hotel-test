import { lookupSchema } from "@/lib/validation/dining";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { findOrderForGuest } from "@/server/repositories/dining";
import { consumeRateLimit } from "@/server/services/rate-limit";
import { clientAddress } from "@/lib/security/client-address";
import { getEnv } from "@/lib/env";

export async function POST(req: Request) {
  const requestId = getRequestId();
  try {
    const caller = clientAddress(req.headers, getEnv().TRUSTED_PROXY_HOPS);
    await consumeRateLimit(`dining-lookup:${caller}`, 20, 60_000);
    const parsed = lookupSchema.safeParse(await req.json());
    if (!parsed.success) return jsonError("VALIDATION_ERROR", "Enter your code and email or phone.", requestId, 422);
    const doc = await findOrderForGuest(parsed.data.code, parsed.data.email, parsed.data.phone);
    return jsonSuccess(
      {
        kind: "order",
        code: doc.code,
        status: doc.status,
        total: doc.total,
        currency: doc.currency,
        guestName: doc.guestName,
        items: doc.items,
        payAtRestaurant: true,
        canCancel: doc.status === "RECEIVED",
      },
      requestId,
    );
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
