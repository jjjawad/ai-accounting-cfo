import { NextRequest } from "next/server";
import { ok, badRequest } from "../../../../../server/api/_utils/responses";
import { requireUser } from "../../../../../lib/auth/server-auth";

interface RouteContext {
  params: { id: string };
}

export async function POST(request: NextRequest, context: RouteContext) {
  await requireUser(request as unknown as Request);

  const id = context?.params?.id;

  if (!id || typeof id !== "string") {
    return badRequest("Missing or invalid file id", {
      code: "INVALID_PARAMS",
    });
  }

  try {
    await request.json();
  } catch {
    // Ignore body parse errors in stub
  }

  return ok({
    status: "stubbed",
    file_id: id,
  });
}
