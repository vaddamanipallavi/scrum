import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  normalizeEmail,
  signAuthToken,
  authCookieName,
  AUTH_COOKIE_MAX_AGE,
} from "@/lib/auth";

const ROLE_VALUES = Object.values(Role);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = normalizeEmail(body.email);
  const password = body.password.trim();
  const name = typeof body.name === "string" ? body.name.trim() : null;
  const requestedRole = typeof body.role === "string" ? body.role : null;

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const role = ROLE_VALUES.includes(requestedRole as Role)
    ? (requestedRole as Role)
    : Role.STUDENT;

  const passwordHash = await hashPassword(password);

  // Create user and related records in a transaction
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        name: name || undefined,
        passwordHash,
        role,
      },
    });

    // Create Student record if role is STUDENT
    if (role === Role.STUDENT) {
      await tx.student.create({
        data: {
          userId: newUser.id,
          rollNo: `STU${Date.now()}`, // Generate a temporary roll number
          parentContact: "",
        },
      });
    }

    return newUser;
  });

  const token = signAuthToken({ id: user.id, email: user.email, role: user.role });
  const response = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
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
