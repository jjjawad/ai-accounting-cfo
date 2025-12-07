import { NextRequest } from "next/server";
import { ok, badRequest } from "../../../../../../server/api/_utils/responses";
import { requireUser } from "../../../../../../lib/auth/server-auth";

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

  const transactionIds =
    body && typeof body === "object" && "transaction_ids" in body
      ? (body as { transaction_ids?: unknown }).transaction_ids
      : undefined;

  if (!Array.isArray(transactionIds)) {
    return badRequest("transaction_ids must be an array", {
      code: "INVALID_BODY",
      details: { transaction_ids: transactionIds },
    });
  }

  const count = transactionIds.length;

  return ok({
    status: "stubbed",
    company_id: companyId,
    count,
  });
}
