import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentContext } from "@/lib/student-auth";

export async function GET() {
  const context = await getStudentContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      createdBy: {
        select: { name: true, email: true },
      },
    },
  });

  return NextResponse.json({ announcements });
}
