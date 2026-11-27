import { lookupSchema } from "@/lib/validation/dining";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { formatMinutes } from "@/lib/dining/slots";
import { findReservationForGuest } from "@/server/repositories/dining";
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
    const doc = await findReservationForGuest(parsed.data.code, parsed.data.email, parsed.data.phone);
    return jsonSuccess(
      {
        kind: "reservation",
        code: doc.code,
        status: doc.status,
        date: doc.date,
        time: formatMinutes(doc.startMinutes),
        guests: doc.guests,
        tableName: doc.tableName,
        guestName: doc.guestName,
        canCancel: doc.status === "CONFIRMED",
      },
      requestId,
    );
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
