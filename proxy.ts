import { type NextRequest, NextResponse } from "next/server"

import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/auth-session"
import {
  canAccessDashboardPath,
  DASHBOARD_ROLE_COOKIE,
  normalizeDashboardRole,
} from "@/lib/auth/role-access"

export function proxy(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  const role = normalizeDashboardRole(
    request.cookies.get(DASHBOARD_ROLE_COOKIE)?.value
  )

  if (!canAccessDashboardPath(role, request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
