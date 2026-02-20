import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentContext } from "@/lib/student-auth";

export async function GET() {
  const context = await getStudentContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leaveRequests = await prisma.leaveRequest.findMany({
    where: { studentId: context.student.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ leaveRequests });
}

export async function POST(request: Request) {
  const context = await getStudentContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.fromDate !== "string" || typeof body.toDate !== "string" || typeof body.reason !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const fromDate = new Date(body.fromDate);
  const toDate = new Date(body.toDate);
  const reason = body.reason.trim();

  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime()) || !reason) {
    return NextResponse.json({ error: "Invalid date range or reason" }, { status: 400 });
  }

  const leaveRequest = await prisma.leaveRequest.create({
    data: {
      studentId: context.student.id,
      fromDate,
      toDate,
      reason,
    },
  });

  return NextResponse.json({ leaveRequest }, { status: 201 });
}
