import { NextResponse } from "next/server";
import { LeaveStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getWardenContext } from "@/lib/warden-auth";

const STATUS_VALUES = new Set(Object.values(LeaveStatus));

export async function GET() {
  const context = await getWardenContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const block = context.warden?.block ?? null;

  const leaveRequests = await prisma.leaveRequest.findMany({
    where: block ? { student: { room: { block } } } : undefined,
    include: {
      student: {
        include: { user: { select: { name: true, email: true } }, room: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ leaveRequests });
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

  if (!STATUS_VALUES.has(body.status as LeaveStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.leaveRequest.update({
    where: { id: body.id },
    data: { status: body.status as LeaveStatus },
  });

  return NextResponse.json({ leaveRequest: updated });
}
