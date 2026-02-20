import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWardenContext } from "@/lib/warden-auth";

export async function GET() {
  const context = await getWardenContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const block = context.warden?.block ?? null;

  const rooms = await prisma.room.findMany({
    where: block ? { blockId: block.id } : undefined,
    include: { block: true },
  });

  const roomStatus = rooms.map((room) => ({
    id: room.id,
    roomNumber: room.roomNumber,
    blockName: room.block.name,
    capacity: room.capacity,
    occupied: room.occupied,
    available: room.capacity - room.occupied,
    status: room.occupied >= room.capacity ? "FULL" : "AVAILABLE",
  }));

  return NextResponse.json({ rooms: roomStatus });
}
