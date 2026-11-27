"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react").then((mod) => mod.default), { ssr: false });

export function SwaggerUiPanel() {
  return (
    <SwaggerUI
      url="/api/openapi"
      docExpansion="list"
      defaultModelsExpandDepth={0}
      tryItOutEnabled
    />
  );
}