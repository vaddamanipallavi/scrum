import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getStudentContext } from "@/lib/student-auth";

export async function GET() {
  const context = await getStudentContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payments = await prisma.payment.findMany({
    where: { studentId: context.student.id },
    orderBy: { paymentDate: "desc" },
  });

  return NextResponse.json({ payments });
}

export async function POST(request: Request) {
  const context = await getStudentContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.amount !== "number") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (body.amount <= 0) {
    return NextResponse.json({ error: "Amount must be positive" }, { status: 400 });
  }

  const payment = await prisma.payment.create({
    data: {
      studentId: context.student.id,
      amount: new Prisma.Decimal(body.amount),
      status: "PAID",
    },
  });

  return NextResponse.json({ payment }, { status: 201 });
}
