import type { NextRequest, NextResponse } from "next/server";

export interface ApiResponseError {
  error: string;
  code?: string;
  details?: unknown;
}

export type ApiHandlerResult<T = unknown> = NextResponse<T | ApiResponseError>;

export type ApiHandler<T = unknown> = (
  request: NextRequest,
  context: { params: Record<string, string | string[]> }
) => Promise<ApiHandlerResult<T>>;
