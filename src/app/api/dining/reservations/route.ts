import { createReservationSchema } from "@/lib/validation/dining";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { formatMinutes } from "@/lib/dining/slots";
import { createReservation } from "@/server/repositories/dining";
import { consumeRateLimit } from "@/server/services/rate-limit";
import { clientAddress } from "@/lib/security/client-address";
import { getEnv } from "@/lib/env";

export async function POST(req: Request) {
  const requestId = getRequestId();
  try {
    const caller = clientAddress(req.headers, getEnv().TRUSTED_PROXY_HOPS);
    await consumeRateLimit(`dining-reserve:${caller}`, 15, 60_000);
    const parsed = createReservationSchema.safeParse(await req.json());
    if (!parsed.success) {
      return jsonError("VALIDATION_ERROR", "Please review the reservation details.", requestId, 422, parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }
    const saved = await createReservation(parsed.data);
    return jsonSuccess(
      {
        code: saved.code,
        date: saved.date,
        time: formatMinutes(saved.startMinutes),
        guests: saved.guests,
        tableName: saved.tableName,
        status: saved.status,
      },
      requestId,
      201,
    );
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
