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
    include: { students: true, block: true },
    orderBy: [{ roomNumber: "asc" }],
  });

  return NextResponse.json({ rooms });
}
