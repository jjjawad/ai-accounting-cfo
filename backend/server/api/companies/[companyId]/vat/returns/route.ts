import { NextRequest } from "next/server";
import { ok, badRequest } from "../../../../../_utils/responses";
import { requireUser } from "../../../../../../lib/auth/server-auth";

interface RouteContext {
  params: { companyId: string };
}

export async function POST(request: NextRequest, context: RouteContext) {
  await requireUser(request as unknown as Request);

  const companyId = context?.params?.companyId;
  if (!companyId || typeof companyId !== "string") {
    return badRequest("Missing or invalid companyId", {
      code: "INVALID_PARAMS",
      details: { companyId },
    });
  }

  let body: { period_start?: string; period_end?: string } | null = null;
  try {
    body = (await request.json()) as typeof body;
  } catch {
    // Invalid JSON
  }

  const period_start = body?.period_start;
  const period_end = body?.period_end;

  if (!period_start || !period_end) {
    return badRequest("period_start and period_end are required.", {
      code: "INVALID_BODY",
      details: { period_start, period_end },
    });
  }

  const now = new Date().toISOString();

  const vatReturn = {
    id: "stub-vat-return-id",
    company_id: companyId,
    period_start,
    period_end,
    total_output_vat: 12345.67,
    total_input_vat: 5432.1,
    net_vat_due: 12345.67 - 5432.1,
    status: "draft" as const,
    created_at: now,
    updated_at: now,
  };

  return ok({
    status: "stubbed",
    vat_return: vatReturn,
  });
}
