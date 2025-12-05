import { ok } from "../../../server/api/_utils/responses";
import { requireUser } from "../../../lib/auth/server-auth";

export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    return ok({
      message: "Authenticated",
      email: user.email,
      userId: user.userId,
    });
  } catch (error) {
    throw error;
  }
}
