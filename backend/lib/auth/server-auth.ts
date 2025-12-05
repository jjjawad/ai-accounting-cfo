import { unauthorized } from "../../server/api/_utils/responses";

export interface AuthenticatedUser {
  userId: string;
  email: string | null;
  rawToken?: string;
}

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

export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
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
