import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWardenContext } from "@/lib/warden-auth";

export async function GET() {
  const context = await getWardenContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { createdBy: { select: { name: true, email: true } } },
  });

  return NextResponse.json({ announcements });
}

export async function POST(request: Request) {
  const context = await getWardenContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string" || typeof body.message !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const title = body.title.trim();
  const message = body.message.trim();

  if (!title || !message) {
    return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
  }

  const announcement = await prisma.announcement.create({
    data: {
      title,
      message,
      createdById: context.payload.sub,
    },
  });

  return NextResponse.json({ announcement }, { status: 201 });
}
