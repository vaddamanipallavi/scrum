import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWardenContext } from "@/lib/warden-auth";

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET() {
  const context = await getWardenContext();
  if (!context || context.payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const blocks = await prisma.block.findMany({
    include: {
      rooms: { include: { students: true } },
    },
    orderBy: { name: "asc" },
  });

  const studentCountByBlock = blocks.map((block) => ({
    block: block.name,
    students: block.rooms.reduce((sum, room) => sum + room.students.length, 0),
  }));

  const payments = await prisma.payment.findMany({
    orderBy: { paymentDate: "asc" },
    take: 500,
  });

  const paymentByMonthMap = new Map<string, number>();
  for (const payment of payments) {
    const key = getMonthKey(payment.paymentDate);
    const amount = Number(payment.amount);
    paymentByMonthMap.set(key, (paymentByMonthMap.get(key) ?? 0) + amount);
  }

  const monthlyPayments = Array.from(paymentByMonthMap.entries()).map(
    ([month, total]) => ({ month, total })
  );

  const complaintStats = await prisma.complaint.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const complaintSummary = complaintStats.map((row) => ({
    status: row.status,
    count: row._count.status,
  }));

  const leaveRequests = await prisma.leaveRequest.findMany({
    orderBy: { createdAt: "asc" },
    take: 500,
  });

  const leaveByMonthMap = new Map<string, number>();
  for (const request of leaveRequests) {
    const key = getMonthKey(request.createdAt);
    leaveByMonthMap.set(key, (leaveByMonthMap.get(key) ?? 0) + 1);
  }

  const leaveTrends = Array.from(leaveByMonthMap.entries()).map(
    ([month, count]) => ({ month, count })
  );

  return NextResponse.json({
    studentCountByBlock,
    monthlyPayments,
    complaintSummary,
    leaveTrends,
  });
}
