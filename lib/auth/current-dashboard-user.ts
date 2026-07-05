import "server-only"
import { cookies } from "next/headers"

import {
  DASHBOARD_ROLE_COOKIE,
  normalizeDashboardRole,
} from "@/lib/auth/role-access"
import {
  ACCESS_TOKEN_COOKIE,
  DASHBOARD_USER_EMAIL_COOKIE,
  DASHBOARD_USER_NAME_COOKIE,
} from "@/lib/auth/auth-session"
import { DashboardUser } from "../types"

export async function getHeaderDashboardUser(): Promise<DashboardUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (!token) {
    return null
  }

  const role = normalizeDashboardRole(
    cookieStore.get(DASHBOARD_ROLE_COOKIE)?.value
  )

  return {
    name:
      cookieStore.get(DASHBOARD_USER_NAME_COOKIE)?.value ??
      (role === "ADMIN" ? "Valler Admin" : "Valler User"),
    email:
      cookieStore.get(DASHBOARD_USER_EMAIL_COOKIE)?.value ??
      (role === "ADMIN"
        ? "admin@vallerparts.co.tz"
        : "user@vallerparts.co.tz"),
    role,
  }
}

export async function getCurrentDashboardUser(): Promise<DashboardUser> {
  const user = await getHeaderDashboardUser()

  return (
    user ?? {
      name: "Valler Admin",
      email: "admin@vallerparts.co.tz",
      role: "ADMIN",
    }
  )
}
