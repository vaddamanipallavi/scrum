import { NextResponse } from "next/server";
import { getStudentContext } from "@/lib/student-auth";

export async function GET() {
  const context = await getStudentContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const room = context.student.room;

  return NextResponse.json({
    room: room
      ? {
          id: room.id,
          roomNumber: room.roomNumber,
          capacity: room.capacity,
          occupied: room.occupied,
          block: room.block.name,
        }
      : null,
  });
}
