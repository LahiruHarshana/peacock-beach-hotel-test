import type { Metadata } from "next";
import { SwaggerUiPanel } from "@/app/api-docs/swagger-ui";

export const metadata: Metadata = {
  title: "API reference",
  description: "OpenAPI documentation for Peacock Beach Hotel route handlers.",
  robots: { index: false, follow: false },
};

export default function ApiDocsPage() {
  return (
  <main className="min-h-dvh bg-ivory">
    <div className="border-b border-mocha/10 bg-ivory px-6 py-5">
      <p className="text-xs font-medium uppercase tracking-[0.16rem] text-mocha/75">Peacock Beach Hotel</p>
      <h1 className="mt-1 text-2xl font-medium tracking-[-0.04em] text-mocha">API reference (OpenAPI 3)</h1>
      <p className="mt-2 text-sm text-mocha/75">
        Interactive Swagger UI. Machine-readable spec:{" "}
        <a className="underline underline-offset-4" href="/api/openapi">
          /api/openapi
        </a>
      </p>
    </div>
    <div className="swagger-shell px-2 pb-12 pt-2">
      <SwaggerUiPanel />
    </div>
  </main>
  );
}