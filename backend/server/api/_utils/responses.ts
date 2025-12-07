import { NextResponse } from "next/server";
import type { ApiResponseError } from "./types";

function jsonError(
  status: number,
  message: string,
  code?: string,
  details?: unknown
): NextResponse<ApiResponseError> {
  const body: ApiResponseError = {
    error: message,
    ...(code && { code }),
    ...(details !== undefined && { details }),
  };

  return NextResponse.json(body, { status });
}

export function ok<T>(data: T, init?: ResponseInit): NextResponse<T> {
  return NextResponse.json(data, { status: 200, ...init });
}

export function badRequest(
  message: string,
  options?: { code?: string; details?: unknown }
): NextResponse<ApiResponseError> {
  return jsonError(400, message, options?.code ?? "BAD_REQUEST", options?.details);
}

export function unauthorized(
  message = "Unauthorized",
  options?: { code?: string; details?: unknown }
): NextResponse<ApiResponseError> {
  return jsonError(401, message, options?.code ?? "UNAUTHORIZED", options?.details);
}

export function notFound(
  message = "Not found",
  options?: { code?: string; details?: unknown }
): NextResponse<ApiResponseError> {
  return jsonError(404, message, options?.code ?? "NOT_FOUND", options?.details);
}

export function forbidden(
  message = "Forbidden",
  options?: { code?: string; details?: unknown }
): NextResponse<ApiResponseError> {
  return jsonError(403, message, options?.code ?? "FORBIDDEN", options?.details);
}

export function serverError(
  message = "Internal server error",
  options?: { code?: string; details?: unknown }
): NextResponse<ApiResponseError> {
  return jsonError(500, message, options?.code ?? "SERVER_ERROR", options?.details);
}
