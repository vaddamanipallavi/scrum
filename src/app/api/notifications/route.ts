import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getTokenFromCookieString, verifyAuthToken } from "@/lib/auth";

async function getNotifications(userId: string, role: Role) {
  if (role === Role.STUDENT) {
    const student = await prisma.student.findUnique({
      where: { userId },
    });

    if (!student) return [];

    const leaveUpdates = await prisma.leaveRequest.findMany({
      where: {
        studentId: student.id,
        status: { in: ["APPROVED", "REJECTED"] },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return leaveUpdates.map((req) => ({
      id: req.id,
      type: "LEAVE_UPDATE",
      message: `Your leave request has been ${req.status.toLowerCase()}`,
      timestamp: req.createdAt,
    }));
  }

  if (role === Role.WARDEN) {
    const warden = await prisma.warden.findUnique({
      where: { userId },
    });

    if (!warden) return [];

    const pendingLeaves = await prisma.leaveRequest.findMany({
      where: {
        status: "PENDING",
        student: { room: { block: { id: warden.blockId } } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return pendingLeaves.map((req) => ({
      id: req.id,
      type: "PENDING_LEAVE",
      message: "New leave request pending approval",
      timestamp: req.createdAt,
    }));
  }

  return [];
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const token = getTokenFromCookieString(cookieHeader);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notifications = await getNotifications(payload.sub, payload.role);

  return NextResponse.json({ notifications });
}
