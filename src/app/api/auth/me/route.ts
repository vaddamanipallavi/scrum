import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getTokenFromCookies,
  getTokenFromHeaders,
  verifyAuthToken,
} from "@/lib/auth";

export async function GET(request: Request) {
  const token =
    (await getTokenFromCookies()) ?? getTokenFromHeaders(request.headers);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}
