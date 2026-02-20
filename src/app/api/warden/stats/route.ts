import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWardenContext } from "@/lib/warden-auth";

export async function GET() {
  const context = await getWardenContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const block = context.warden?.block ?? null;

  const studentWhere = block
    ? {
        OR: [
          { room: { block } },
          { roomId: null },
        ],
      }
    : undefined;

  const complaintWhere = block
    ? { student: { room: { block } } }
    : undefined;

  const leaveWhere = block
    ? { student: { room: { block } } }
    : undefined;

  const [students, complaints, leaves] = await Promise.all([
    prisma.student.count({ where: studentWhere }),
    prisma.complaint.count({ where: complaintWhere }),
    prisma.leaveRequest.count({ where: leaveWhere }),
  ]);

  return NextResponse.json({
    stats: {
      students,
      complaints,
      leaves,
    },
  });
}
