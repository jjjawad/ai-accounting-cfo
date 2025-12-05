import { NextRequest } from "next/server";
import { ok, serverError } from "../_utils/responses";
import { triggerWorkflow } from "../../../lib/pipeline/n8n-client";

export async function GET(_req: NextRequest) {
  try {
    const result = await triggerWorkflow("test", { ping: true });

    return ok({
      message: "debug-n8n call executed",
      result,
    });
  } catch (error) {
    return serverError("n8n_debug_error", {
      details: (error as Error).message ?? "Unknown error",
    });
  }
}
