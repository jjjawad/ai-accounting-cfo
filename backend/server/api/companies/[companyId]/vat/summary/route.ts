import { NextRequest } from "next/server";
import { ok, badRequest } from "../../../../../_utils/responses";
import { requireUser } from "../../../../../../lib/auth/server-auth";

interface RouteContext {
  params: { companyId: string };
}

export async function GET(request: NextRequest, context: RouteContext) {
  await requireUser(request as unknown as Request);

  const companyId = context?.params?.companyId;
  const url = new URL(request.url);
  const period_start = url.searchParams.get("period_start");
  const period_end = url.searchParams.get("period_end");

  if (!companyId || typeof companyId !== "string") {
    return badRequest("Missing or invalid companyId", {
      code: "INVALID_PARAMS",
      details: { companyId },
    });
  }

  if (!period_start || !period_end) {
    return badRequest("period_start and period_end are required.", {
      code: "INVALID_PARAMS",
      details: { period_start, period_end },
    });
  }

  const summary = {
    company_id: companyId,
    period_start,
    period_end,
    total_output_vat: 12345.67,
    total_input_vat: 5432.1,
    net_vat_due: 12345.67 - 5432.1,
    breakdown: [
      { vat_code: "STANDARD_5", output_vat: 10000, input_vat: 4000 },
      { vat_code: "ZERO", output_vat: 2345.67, input_vat: 1432.1 },
    ],
  };

  return ok(summary);
}
