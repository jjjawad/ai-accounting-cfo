import { NextRequest } from "next/server";
import { ok, badRequest } from "../../../../../../server/api/_utils/responses";
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

  const summary = {
    cash_balance: 100000,
    income_this_month: 25000,
    expenses_this_month: 17000,
    net_result_this_month: 8000,
    runway_days: 62,
    vat_due_current_period: 3200,
    insights: [
      "Marketing spend increased 18% vs last month.",
      "Net profit margin ~24% this month.",
    ],
  };

  return ok(summary);
}
