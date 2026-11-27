import { availabilityQuerySchema } from "@/lib/validation/dining";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { availabilityFor } from "@/server/repositories/dining";
import { consumeRateLimit } from "@/server/services/rate-limit";
import { clientAddress } from "@/lib/security/client-address";
import { getEnv } from "@/lib/env";

export async function GET(req: Request) {
  const requestId = getRequestId();
  try {
    const caller = clientAddress(req.headers, getEnv().TRUSTED_PROXY_HOPS);
    await consumeRateLimit(`dining-availability:${caller}`, 60, 60_000);
    const url = new URL(req.url);
    const parsed = availabilityQuerySchema.safeParse({
      date: url.searchParams.get("date"),
      guests: url.searchParams.get("guests"),
    });
    if (!parsed.success) {
      return jsonError("VALIDATION_ERROR", "Choose a date and party size.", requestId, 422);
    }
    const data = await availabilityFor(parsed.data.date, parsed.data.guests);
    return jsonSuccess(data, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
