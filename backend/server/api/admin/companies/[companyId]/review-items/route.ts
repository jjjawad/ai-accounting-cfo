import { NextRequest } from "next/server";
import { ok, badRequest } from "../../../../_utils/responses";
import { requireUser } from "../../../../../../lib/auth/server-auth";

export async function GET(
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

  // TODO: Enforce admin role or company membership when roles are available.

  return ok({
    transactions: [],
    documents: [],
  });
}
