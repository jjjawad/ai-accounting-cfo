import { NextRequest } from "next/server";
import { ok } from "../../../server/api/_utils/responses";

export async function GET(_request: NextRequest) {
  return ok({ message: "pong" });
}
