import { jwtVerify } from "jose";
import { AUTH_COOKIE_NAME, RoleValue } from "@/lib/auth-constants";

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: RoleValue;
};

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export function getTokenFromRequestCookies(
  request: { cookies: { get: (name: string) => { value: string } | undefined } }
): string | null {
  return request.cookies.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export async function verifyEdgeToken(
  token: string
): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (!payload.sub || !payload.email || !payload.role) {
      return null;
    }

    return {
      sub: String(payload.sub),
      email: String(payload.email),
      role: payload.role as RoleValue,
    };
  } catch {
    return null;
  }
}
