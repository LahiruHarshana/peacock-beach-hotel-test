import { publicReviewSchema } from "@/lib/validation/schemas";
import { getRequestId, jsonError, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { createPendingReview } from "@/server/repositories/reviews";
import { consumeRateLimit } from "@/server/services/rate-limit";
import { getEnv } from "@/lib/env";
import { clientAddress } from "@/lib/security/client-address";

export async function POST(req: Request) {
  const requestId = getRequestId();
  try {
    const caller = clientAddress(req.headers, getEnv().TRUSTED_PROXY_HOPS);
    await consumeRateLimit(`reviews:${caller}`, 5, 60_000);
    const body = await req.json();
    const parsed = publicReviewSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(
        "VALIDATION_ERROR",
        "Please review the highlighted fields.",
        requestId,
        422,
        parsed.error.flatten().fieldErrors as Record<string, string[]>,
      );
    }
    if (parsed.data.website) {
      return jsonSuccess({ accepted: true }, requestId);
    }

    await createPendingReview({
      authorDisplayName: parsed.data.authorDisplayName,
      rating: parsed.data.rating,
      text: parsed.data.text,
      locale: parsed.data.locale,
      consentAcceptedAt: new Date(),
    });

    return jsonSuccess({ status: "PENDING" }, requestId, 201);
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
