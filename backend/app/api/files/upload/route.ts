import { NextRequest } from "next/server";
import { ok, badRequest } from "../../../../server/api/_utils/responses";
import { requireUser } from "../../../../lib/auth/server-auth";

export async function POST(request: NextRequest) {
  await requireUser(request as unknown as Request);

  const formData = await request.formData();

  const file = formData.get("file");
  const companyId = formData.get("company_id");
  const type = formData.get("type");

  if (!file || !companyId || typeof companyId !== "string") {
    return badRequest("Missing or invalid file/company_id", {
      code: "INVALID_BODY",
      details: { hasFile: !!file, companyId },
    });
  }

  return ok({
    status: "stubbed",
    company_id: companyId,
    type: typeof type === "string" ? type : null,
  });
}
