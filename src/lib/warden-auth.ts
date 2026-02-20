import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getTokenFromCookies, verifyAuthToken } from "@/lib/auth";

export async function getWardenContext() {
  const token = await getTokenFromCookies();
  if (!token) {
    return null;
  }

  const payload = verifyAuthToken(token);
  if (!payload || (payload.role !== Role.WARDEN && payload.role !== Role.ADMIN)) {
    return null;
  }

  const warden = await prisma.warden.findUnique({
    where: { userId: payload.sub },
    include: { user: true, block: true },
  });

  if (payload.role === Role.WARDEN && !warden) {
    return null;
  }

  return { payload, warden };
}
