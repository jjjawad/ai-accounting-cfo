import { unauthorized } from "../../server/api/_utils/responses";
import { getSupabaseServerClient } from "../supabase/server-client";

export interface AuthenticatedUser {
  userId: string;
  email: string | null;
  rawToken?: string;
}

export interface MembershipContext {
  membershipId: string;
  role: string | null;
}

// Dev flag – used by both auth bypass and membership bypass
const DEV_BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === "true";

function getAccessTokenFromRequest(request: Request): string | null {
  const authHeader =
    request.headers.get("authorization") ?? request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  const cookieHeader = request.headers.get("cookie") ?? request.headers.get("Cookie");
  if (!cookieHeader) {
    return null;
  }

  const tokenCookieNames = ["sb-access-token", "access_token"];
  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());

  for (const cookie of cookies) {
    const [name, ...valueParts] = cookie.split("=");
    if (tokenCookieNames.includes(name)) {
      return valueParts.join("=").trim();
    }
  }

  return null;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const payload = Buffer.from(parts[1], "base64url").toString("utf8");
    return JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function getAuthenticatedUser(
  request: Request
): Promise<AuthenticatedUser | null> {
  const token = getAccessTokenFromRequest(request);
  if (!token) {
    return null;
  }

  const payload = decodeJwtPayload(token);
  if (!payload) {
    return null;
  }

  const userId =
    (typeof payload.sub === "string" && payload.sub) ||
    (typeof payload.user_id === "string" && payload.user_id) ||
    (typeof payload.userId === "string" && payload.userId) ||
    null;

  if (!userId) {
    return null;
  }

  const email = typeof payload.email === "string" ? payload.email : null;

  return {
    userId,
    email,
    rawToken: token,
  };
}

export async function requireUser(request: Request): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    throw unauthorized("User must be logged in", { code: "UNAUTHENTICATED" });
  }

  return user;
}

// DEV-ONLY AUTH BYPASS HELPER
// ----------------------------
// Temporary wrapper so file upload/processing can work in dev before frontend auth is wired.
// Behavior:
// 1) Try normal requireUser(request).
// 2) If that fails AND NODE_ENV !== "production" AND DEV_BYPASS_AUTH === "true" AND DEV_USER_ID is set,
//    return a fake dev user.
// 3) Otherwise rethrow so the route returns 401 as before.
// TODO: Remove getUserOrDevBypass and use requireUser directly once real auth is implemented.
export async function getUserOrDevBypass(request: Request): Promise<AuthenticatedUser> {
  try {
    return await requireUser(request);
  } catch (err) {
    const isDev = process.env.NODE_ENV !== "production";
    const devUserId = process.env.DEV_USER_ID;

    if (isDev && DEV_BYPASS_AUTH && devUserId) {
      return {
        userId: devUserId,
        email: "dev-bypass@example.com",
        rawToken: undefined,
      };
    }

    throw err;
  }
}

export async function assertUserBelongsToCompany(params: {
  userId: string;
  companyId: string;
}): Promise<MembershipContext> {
  const { userId, companyId } = params;

  // 🛠 DEV MODE: when DEV_BYPASS_AUTH=true, skip the Supabase membership check.
  // This is ONLY for local development with the fake dev user.
  if (DEV_BYPASS_AUTH && process.env.NODE_ENV !== "production") {
    console.warn(
      "[assertUserBelongsToCompany] DEV_BYPASS_AUTH=true - skipping membership check",
      { userId, companyId }
    );
    return {
      membershipId: "dev-bypass-membership",
      role: "owner",
    };
  }

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("memberships")
    .select("id, role")
    .eq("user_id", userId)
    .eq("company_id", companyId)
    .maybeSingle();

  if (error) {
    throw new Error("MEMBERSHIP_LOOKUP_FAILED");
  }

  if (!data) {
    throw new Error("NOT_COMPANY_MEMBER");
  }

  return {
    membershipId: data.id,
    role: data.role ?? null,
  };
}
