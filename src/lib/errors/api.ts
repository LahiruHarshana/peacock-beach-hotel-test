import { type NextRequest } from "next/server";
import { createRequestId } from "@/lib/utils";
import { AuthError } from "@/lib/auth/errors";

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export function jsonSuccess<T>(data: T, requestId: string, status = 200) {
  return Response.json({ ok: true as const, data, requestId }, { status });
}

export function jsonError(
  code: ApiErrorCode,
  message: string,
  requestId: string,
  status: number,
  fieldErrors?: Record<string, string[]>,
) {
  return Response.json(
    {
      ok: false as const,
      error: { code, message, fieldErrors },
      requestId,
    },
    { status },
  );
}

export function getRequestId(req?: NextRequest): string {
  return req?.headers.get("x-request-id") ?? createRequestId();
}

export function mapThrownError(error: unknown, requestId: string): Response {
  if (error instanceof AuthError) {
    return jsonError(
      error.code === "UNAUTHORIZED" ? "UNAUTHORIZED" : "FORBIDDEN",
      error.message,
      requestId,
      error.code === "UNAUTHORIZED" ? 401 : 403,
    );
  }
  if (error instanceof DomainError) {
    return jsonError(error.code, error.message, requestId, error.status, error.fieldErrors);
  }
  console.error(JSON.stringify({ requestId, message: "Unhandled error" }));
  return jsonError("INTERNAL_ERROR", "Something went wrong.", requestId, 500);
}

export class DomainError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public status: number,
    public fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "DomainError";
  }
}
