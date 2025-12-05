import { NextRequest } from "next/server";
import { ok, badRequest } from "../../../../../server/api/_utils/responses";
import { requireUser } from "../../../../../lib/auth/server-auth";

interface RouteContext {
  params: { companyId: string };
}

export async function GET(request: NextRequest, context: RouteContext) {
  await requireUser(request as unknown as Request);

  const companyId = context?.params?.companyId;
  if (!companyId || typeof companyId !== "string") {
    return badRequest("Missing or invalid companyId", {
      code: "INVALID_PARAMS",
      details: { companyId },
    });
  }

  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams.entries());

  return ok({
    company_id: companyId,
    transactions: [],
    query: searchParams,
  });
}
