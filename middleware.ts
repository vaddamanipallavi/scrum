import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getTokenFromRequestCookies,
  verifyEdgeToken,
} from "@/lib/auth-edge";
import { RoleValue } from "@/lib/auth-constants";

type RoleRule = {
  prefix: string;
  roles: RoleValue[];
};

const ROLE_RULES: RoleRule[] = [
  { prefix: "/dashboard/admin", roles: ["ADMIN"] },
  { prefix: "/dashboard/warden", roles: ["WARDEN", "ADMIN"] },
  { prefix: "/dashboard/student", roles: ["STUDENT"] },
  { prefix: "/api/admin", roles: ["ADMIN"] },
  { prefix: "/api/warden", roles: ["WARDEN", "ADMIN"] },
  { prefix: "/api/student", roles: ["STUDENT"] },
];

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/");
}

function requiresAuth(pathname: string): boolean {
  if (pathname.startsWith("/api/auth")) {
    return false;
  }

  return pathname.startsWith("/dashboard") || pathname.startsWith("/api/");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!requiresAuth(pathname)) {
    return NextResponse.next();
  }

  const token = getTokenFromRequestCookies(request);
  if (!token) {
    if (isApiRoute(pathname)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyEdgeToken(token);
  if (!payload) {
    if (isApiRoute(pathname)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const matchedRule = ROLE_RULES.find((rule) => pathname.startsWith(rule.prefix));
  if (matchedRule && !matchedRule.roles.includes(payload.role)) {
    if (isApiRoute(pathname)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
