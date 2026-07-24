import type { AuthResponseDTO } from "@/lib/dtos/auth_dtos"
import {
  DASHBOARD_ROLE_COOKIE,
  normalizeDashboardRole,
  type DashboardRole,
} from "@/lib/auth/role-access"
import type { DashboardUser } from "@/lib/types"

export const ACCESS_TOKEN_COOKIE = "stock_access_token"
export const DASHBOARD_USER_NAME_COOKIE = "stock_dashboard_user_name"
export const DASHBOARD_USER_EMAIL_COOKIE = "stock_dashboard_user_email"
export const AUTH_SESSION_CHANGE_EVENT = "stock-auth-session-change"

const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

function writeCookie(
  name: string,
  value: string,
  maxAge = AUTH_COOKIE_MAX_AGE
) {
  if (typeof window === "undefined") {
    return
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

function readCookie(name: string) {
  if (typeof window === "undefined") {
    return null
  }

  const cookieValue = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`))
    ?.split("=")
    .slice(1)
    .join("=")

  return cookieValue ? decodeURIComponent(cookieValue) : null
}

function clearCookie(name: string) {
  if (typeof window === "undefined") {
    return
  }

  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
}

export function mapApiRoleToDashboardRole(
  role: string | null | undefined
): DashboardRole {
  const normalizedRole = role?.trim().toUpperCase()

  if (normalizedRole === "USER") {
    return "USER"
  }

  return "ADMIN"
}

export function persistAuthSession(response: AuthResponseDTO) {
  if (!response.user) {
    return
  }

  const fullName =
    response.user.fullName?.trim() ||
    `${response.user.firstName} ${response.user.lastName}`.trim()

  writeCookie(ACCESS_TOKEN_COOKIE, response.token)
  writeCookie(
    DASHBOARD_ROLE_COOKIE,
    mapApiRoleToDashboardRole(response.user.role)
  )
  writeCookie(DASHBOARD_USER_NAME_COOKIE, fullName)
  writeCookie(DASHBOARD_USER_EMAIL_COOKIE, response.user.email)
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGE_EVENT))
}

export function updateAuthSessionUser(user: AuthResponseDTO["user"]) {
  const fullName =
    user.fullName?.trim() || `${user.firstName} ${user.lastName}`.trim()

  writeCookie(DASHBOARD_ROLE_COOKIE, mapApiRoleToDashboardRole(user.role))
  writeCookie(DASHBOARD_USER_NAME_COOKIE, fullName)
  writeCookie(DASHBOARD_USER_EMAIL_COOKIE, user.email)
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGE_EVENT))
}

export function clearAuthSession() {
  clearCookie(ACCESS_TOKEN_COOKIE)
  clearCookie(DASHBOARD_ROLE_COOKIE)
  clearCookie(DASHBOARD_USER_NAME_COOKIE)
  clearCookie(DASHBOARD_USER_EMAIL_COOKIE)
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGE_EVENT))
}

let cachedUser: DashboardUser | null = null
let lastToken: string | null = null
let lastRole: string | null = null
let lastName: string | null = null
let lastEmail: string | null = null

export function getClientDashboardUser(): DashboardUser | null {
  const token = readCookie(ACCESS_TOKEN_COOKIE)

  if (!token) {
    cachedUser = null
    lastToken = null
    lastRole = null
    lastName = null
    lastEmail = null
    return null
  }

  const role = normalizeDashboardRole(readCookie(DASHBOARD_ROLE_COOKIE))
  const name =
    readCookie(DASHBOARD_USER_NAME_COOKIE) ??
    (role === "ADMIN" ? "Valler Admin" : "Valler User")
  const email =
    readCookie(DASHBOARD_USER_EMAIL_COOKIE) ??
    (role === "ADMIN" ? "admin@vallerparts.co.tz" : "user@vallerparts.co.tz")

  if (
    cachedUser &&
    token === lastToken &&
    role === lastRole &&
    name === lastName &&
    email === lastEmail
  ) {
    return cachedUser
  }

  lastToken = token
  lastRole = role
  lastName = name
  lastEmail = email
  cachedUser = { name, email, role }

  return cachedUser
}

export function subscribeToAuthSession(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {}
  }

  const handleStorage = () => onStoreChange()
  const handleSessionChange = () => onStoreChange()

  window.addEventListener("storage", handleStorage)
  window.addEventListener(AUTH_SESSION_CHANGE_EVENT, handleSessionChange)

  return () => {
    window.removeEventListener("storage", handleStorage)
    window.removeEventListener(AUTH_SESSION_CHANGE_EVENT, handleSessionChange)
  }
}
