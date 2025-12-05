import { NextRequest } from "next/server";
import { ok, unauthorized, serverError } from "../../../_utils/responses";

const SECRET_HEADER = "x-n8n-secret";

function validateSecret(request: NextRequest) {
  const expected = process.env.N8N_WEBHOOK_SECRET;
  if (!expected) {
    console.error("N8N_WEBHOOK_SECRET not configured");
    return {
      ok: false as const,
      type: "config" as const,
    };
  }

  const provided = request.headers.get(SECRET_HEADER);
  if (!provided || provided !== expected) {
    return {
      ok: false as const,
      type: "auth" as const,
    };
  }

  return { ok: true as const };
}

export async function POST(request: NextRequest) {
  const validation = validateSecret(request);
  if (!validation.ok) {
    if (validation.type === "config") {
      return serverError("N8N_WEBHOOK_SECRET not configured", { code: "N8N_SECRET_MISSING" });
    }

    return unauthorized("Invalid n8n webhook secret", { code: "INVALID_WEBHOOK_SECRET" });
  }

  return ok({
    status: "stubbed",
    endpoint: "pipeline-status",
  });
}
