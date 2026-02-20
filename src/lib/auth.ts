import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { cookies as getCookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth-constants";

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: Role;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAuthToken(user: {
  id: string;
  email: string;
  role: Role;
}): string {
  const payload: AuthTokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: TOKEN_TTL_SECONDS,
  });
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
  } catch {
    return null;
  }
}

export function getTokenFromHeaders(headers: Headers): string | null {
  const authHeader = headers.get("authorization");
  if (!authHeader) {
    return null;
  }

  const [scheme, value] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !value) {
    return null;
  }

  return value;
}

export async function getTokenFromCookies(): Promise<string | null> {
  try {
    const cookieStore = await getCookies();
    const cookie = cookieStore.get(AUTH_COOKIE_NAME);
    return cookie?.value ?? null;
  } catch {
    return null;
  }
}

export function getTokenFromCookieString(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(`${AUTH_COOKIE_NAME}=([^;]*)`);
  return match ? match[1] : null;
}

export function authCookieName(): string {
  return AUTH_COOKIE_NAME;
}

export const AUTH_COOKIE_MAX_AGE = TOKEN_TTL_SECONDS;
