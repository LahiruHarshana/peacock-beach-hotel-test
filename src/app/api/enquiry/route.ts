import { enquirySchema } from "@/lib/validation/schemas";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { buildEnquiryHandoff } from "@/server/services/enquiry";
import { consumeRateLimit } from "@/server/services/rate-limit";
import { getEnv } from "@/lib/env";
import { clientAddress } from "@/lib/security/client-address";
import { getPublishedRoomBySlug } from "@/server/repositories/rooms";

export async function POST(req: Request) {
  const requestId = getRequestId();
  try {
    const caller = clientAddress(req.headers, getEnv().TRUSTED_PROXY_HOPS);
    await consumeRateLimit(`enquiry:${caller}`, 20, 60_000);
    const body = await req.json();
    const parsed = enquirySchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(
        "VALIDATION_ERROR",
        "Please review the highlighted fields.",
        requestId,
        422,
        parsed.error.flatten().fieldErrors as Record<string, string[]>,
      );
    }

    let roomTitle: string | undefined;
    if (parsed.data.roomSlug) {
      const room = await getPublishedRoomBySlug(parsed.data.roomSlug);
      if (!room) {
        return jsonError("NOT_FOUND", "Room not found.", requestId, 404);
      }
      if (parsed.data.guests > room.capacity) {
        return jsonError(
          "VALIDATION_ERROR",
          "Guest count exceeds published room capacity.",
          requestId,
          422,
        );
      }
      roomTitle = room.name[parsed.data.locale];
    }

    const handoff = await buildEnquiryHandoff({
      locale: parsed.data.locale,
      checkIn: parsed.data.checkIn,
      checkOut: parsed.data.checkOut,
      guests: parsed.data.guests,
      channel: parsed.data.channel,
      roomTitle,
    });

    return jsonSuccess(handoff, requestId);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
