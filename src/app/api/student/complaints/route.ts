import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentContext } from "@/lib/student-auth";

export async function GET() {
  const context = await getStudentContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const complaints = await prisma.complaint.findMany({
    where: { studentId: context.student.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ complaints });
}

export async function POST(request: Request) {
  const context = await getStudentContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string" || typeof body.description !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const title = body.title.trim();
  const description = body.description.trim();
  if (!title || !description) {
    return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
  }

  const complaint = await prisma.complaint.create({
    data: {
      studentId: context.student.id,
      title,
      description,
    },
  });

  return NextResponse.json({ complaint }, { status: 201 });
}
