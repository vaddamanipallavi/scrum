import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWardenContext } from "@/lib/warden-auth";

export async function POST(request: Request) {
  const context = await getWardenContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.studentId !== "string" || typeof body.roomId !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const room = await prisma.room.findUnique({ where: { id: body.roomId } });
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const block = context.warden?.block ?? null;
  if (block && room.block !== block) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (room.occupied >= room.capacity) {
    return NextResponse.json({ error: "Room is full" }, { status: 400 });
  }

  const student = await prisma.student.findUnique({ where: { id: body.studentId } });
  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const previousRoomId = student.roomId;

  await prisma.$transaction(async (tx) => {
    await tx.student.update({
      where: { id: student.id },
      data: { roomId: room.id },
    });

    const newCount = await tx.student.count({ where: { roomId: room.id } });
    await tx.room.update({
      where: { id: room.id },
      data: { occupied: newCount },
    });

    if (previousRoomId && previousRoomId !== room.id) {
      const prevCount = await tx.student.count({ where: { roomId: previousRoomId } });
      await tx.room.update({
        where: { id: previousRoomId },
        data: { occupied: prevCount },
      });
    }
  });

  return NextResponse.json({ success: true });
}
