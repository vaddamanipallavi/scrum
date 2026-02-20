import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getTokenFromCookies, verifyAuthToken } from "@/lib/auth";

export async function getStudentContext() {
  const token = await getTokenFromCookies();
  if (!token) {
    return null;
  }

  const payload = verifyAuthToken(token);
  if (!payload || payload.role !== Role.STUDENT) {
    return null;
  }

  const student = await prisma.student.findUnique({
    where: { userId: payload.sub },
    include: { user: true, room: { include: { block: true } } },
  });

  if (!student) {
    return null;
  }

  return { payload, student };
}
