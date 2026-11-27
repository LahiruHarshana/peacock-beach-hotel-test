import { getRequestId, jsonSuccess, mapThrownError } from "@/lib/errors/api";
import { listMenu } from "@/server/repositories/dining";

export async function GET() {
  const requestId = getRequestId();
  try {
    const items = await listMenu(true);
    return jsonSuccess(
      items.map((item) => ({
        id: String(item._id),
        name: item.name,
        description: item.description,
        price: item.price,
        currency: item.currency,
        category: item.category,
        optionGroups: item.optionGroups,
      })),
      requestId,
    );
  } catch (error) {
    return mapThrownError(error, requestId);
  }
}
