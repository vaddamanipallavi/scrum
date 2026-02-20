import { NextResponse } from "next/server";
import { ComplaintStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getWardenContext } from "@/lib/warden-auth";

const STATUS_VALUES = new Set(Object.values(ComplaintStatus));

export async function GET() {
  const context = await getWardenContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const block = context.warden?.block ?? null;

  const complaints = await prisma.complaint.findMany({
    where: block ? { student: { room: { block } } } : undefined,
    include: {
      student: {
        include: { user: { select: { name: true, email: true } }, room: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ complaints });
}

export async function PATCH(request: Request) {
  const context = await getWardenContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string" || typeof body.status !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!STATUS_VALUES.has(body.status as ComplaintStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.complaint.update({
    where: { id: body.id },
    data: { status: body.status as ComplaintStatus },
  });

  return NextResponse.json({ complaint: updated });
}
