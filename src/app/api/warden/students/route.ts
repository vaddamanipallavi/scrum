import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWardenContext } from "@/lib/warden-auth";

export async function GET() {
  const context = await getWardenContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const block = context.warden?.block ?? null;

  const students = await prisma.student.findMany({
    where: block
      ? {
          OR: [{ room: { block } }, { roomId: null }],
        }
      : undefined,
    include: {
      user: { select: { name: true, email: true } },
      room: true,
    },
    orderBy: { rollNo: "asc" },
  });

  return NextResponse.json({ students });
}
