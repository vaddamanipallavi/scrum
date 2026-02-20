import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  authCookieName,
  AUTH_COOKIE_MAX_AGE,
  normalizeEmail,
  signAuthToken,
  verifyPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = normalizeEmail(body.email);
  const password = body.password;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signAuthToken({ id: user.id, email: user.email, role: user.role });
  const response = NextResponse.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });

  response.cookies.set(authCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
