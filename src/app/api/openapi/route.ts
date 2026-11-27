import { buildOpenApiDocument } from "@/lib/openapi/document";
import { getEnv } from "@/lib/env";

export function GET(req: Request) {
  const envBase = getEnv().APP_URL.replace(/\/$/, "");
  const requestBase = new URL(req.url).origin;
  const serverUrl = envBase.startsWith("http") ? envBase : requestBase;
  const document = buildOpenApiDocument(serverUrl);

  return Response.json(document, {
    headers: {
      "Cache-Control": "public, max-age=300",
    },
  });
}