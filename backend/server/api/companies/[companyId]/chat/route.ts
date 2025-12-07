import { NextRequest } from "next/server";
import { ok, badRequest } from "../../../_utils/responses";
import { requireUser } from "../../../../../lib/auth/server-auth";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ companyId: string }> }
) {
  await requireUser(request as unknown as Request);

  const { companyId } = await context.params;
  if (!companyId || typeof companyId !== "string") {
    return badRequest("Missing or invalid companyId", {
      code: "INVALID_PARAMS",
      details: { companyId },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body", {
      code: "INVALID_BODY",
    });
  }

  const { message, context_limit } = (body ?? {}) as {
    message?: unknown;
    context_limit?: unknown;
  };

  if (typeof message !== "string" || message.trim().length === 0) {
    return badRequest("message is required and must be a non-empty string", {
      code: "INVALID_BODY",
      details: { message },
    });
  }

  if (
    typeof context_limit !== "undefined" &&
    !(typeof context_limit === "number" && Number.isFinite(context_limit) && context_limit > 0)
  ) {
    return badRequest("context_limit must be a positive number if provided", {
      code: "INVALID_BODY",
      details: { context_limit },
    });
  }

  return ok({
    assistant_message: "Stubbed Chat CFO response",
    details: {},
  });
}
