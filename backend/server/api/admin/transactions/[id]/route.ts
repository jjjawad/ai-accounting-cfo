import { NextRequest } from "next/server";
import { ok, badRequest } from "../../../_utils/responses";
import { requireUser } from "../../../../lib/auth/server-auth";

interface RouteContext {
  params: { id: string };
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  await requireUser(request as unknown as Request);

  const id = context?.params?.id;
  if (!id || typeof id !== "string") {
    return badRequest("Missing or invalid transaction id", {
      code: "INVALID_PARAMS",
      details: { id },
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

  const { category_id, vat_code_id } = (body ?? {}) as {
    category_id?: unknown;
    vat_code_id?: unknown;
  };

  const hasCategory = typeof category_id === "string" && category_id.trim().length > 0;
  const hasVatCode = typeof vat_code_id === "string" && vat_code_id.trim().length > 0;

  if (!hasCategory && !hasVatCode) {
    return badRequest("At least one of category_id or vat_code_id must be provided", {
      code: "INVALID_BODY",
      details: { category_id, vat_code_id },
    });
  }

  // TODO: Enforce admin role and persist updates once roles and storage are available.

  return ok({
    status: "stubbed",
  });
}
