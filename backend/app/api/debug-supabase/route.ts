import { NextRequest } from "next/server";
import { ok, serverError } from "../../../server/api/_utils/responses";
import { getSupabaseServerClient } from "../../../lib/supabase/server-client";

export async function GET(_request: NextRequest) {
  try {
    getSupabaseServerClient();
    return ok({ ok: true });
  } catch (error) {
    console.error("Supabase server client init failed", error);
    const message = error instanceof Error ? error.message : "Unknown error creating Supabase client";

    return serverError("Supabase server client init failed", {
      details: message,
    });
  }
}
