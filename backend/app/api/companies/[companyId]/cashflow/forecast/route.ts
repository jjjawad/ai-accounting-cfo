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

  const url = new URL(request.url);
  const daysParam = url.searchParams.get("days");

  let days = 30;
  if (daysParam) {
    const parsed = Number(daysParam);
    if (Number.isFinite(parsed) && parsed > 0) {
      days = Math.min(parsed, 365);
    }
  }

  const today = new Date();
  const asOfDate = today.toISOString().slice(0, 10);

  const baseBalance = 100000;
  const dailyDelta = 1000;

  const series = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i + 1);
    const dateStr = d.toISOString().slice(0, 10);

    return {
      date: dateStr,
      projected_balance: baseBalance + (i + 1) * dailyDelta,
    };
  });

  const forecast = {
    as_of_date: asOfDate,
    series,
    burn_rate_monthly: 18000,
    runway_days: 75,
  };

  return ok(forecast);
}
