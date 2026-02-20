import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWardenContext } from "@/lib/warden-auth";
import { sendEmail, generateLeaveApprovalEmail } from "@/lib/email";
import { LeaveStatus } from "@prisma/client";

export async function PATCH(request: Request) {
  const context = await getWardenContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string" || typeof body.status !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const validStatuses: LeaveStatus[] = ["APPROVED", "REJECTED", "CANCELLED"];
  if (!validStatuses.includes(body.status as LeaveStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.leaveRequest.update({
    where: { id: body.id },
    data: { status: body.status as LeaveStatus },
    include: { student: { include: { user: true } } },
  });

  if (updated.student.user.email) {
    const emailHtml = generateLeaveApprovalEmail(
      updated.student.user.name ?? "Student",
      body.status as "APPROVED" | "REJECTED"
    );

    await sendEmail({
      to: updated.student.user.email,
      subject: `Leave Request ${body.status}`,
      html: emailHtml,
    });
  }

  return NextResponse.json({ leaveRequest: updated });
}
