import type { DashboardSectionKey } from "@/lib/dashboard-content"

export const DASHBOARD_ROLES = ["ADMIN", "USER"] as const
export const DASHBOARD_ROLE_COOKIE = "stock_dashboard_role"

export type DashboardRole = (typeof DASHBOARD_ROLES)[number]

const ALL_DASHBOARD_SECTIONS: DashboardSectionKey[] = [
  "dashboard",
  "users",
  "categories",
  "products",
  "incomeStock",
  "outgoing",
  "sales",
  "payable",
  "receivable",
  "analytics",
  "settings",
  "helpCenter",
  "account",
]

// Keep access changes here so navigation and route protection stay aligned.
export const ROLE_ACCESS = {
  ADMIN: ALL_DASHBOARD_SECTIONS,
  USER: [
    "dashboard",
    "products",
    "incomeStock",
    "outgoing",
    "sales",
    "helpCenter",
    "account",
  ],
} as const satisfies Record<DashboardRole, readonly DashboardSectionKey[]>

export function normalizeDashboardRole(
  role: string | null | undefined
): DashboardRole {
  return role?.toUpperCase() === "USER" ? "USER" : "ADMIN"
}

export function canAccessDashboardSection(
  role: DashboardRole,
  section: DashboardSectionKey
) {
  return (ROLE_ACCESS[role] as readonly DashboardSectionKey[]).includes(section)
}

export function getAccessibleDashboardSections(role: DashboardRole) {
  return ALL_DASHBOARD_SECTIONS.filter((section) =>
    canAccessDashboardSection(role, section)
  )
}

export function getDashboardSectionFromPath(
  pathname: string
): DashboardSectionKey {
  if (pathname.startsWith("/dashboard/users")) return "users"
  if (pathname.startsWith("/dashboard/categories")) return "categories"
  if (pathname.startsWith("/dashboard/products")) return "products"
  if (pathname.startsWith("/dashboard/income-stock")) return "incomeStock"
  if (pathname.startsWith("/dashboard/outgoing")) return "outgoing"
  if (pathname.startsWith("/dashboard/sales")) return "sales"
  if (pathname.startsWith("/dashboard/debts/payable")) return "payable"
  if (pathname.startsWith("/dashboard/debts/receivable")) return "receivable"
  if (pathname.startsWith("/dashboard/analytics")) return "analytics"
  if (pathname.startsWith("/dashboard/settings")) return "settings"
  if (pathname.startsWith("/dashboard/help-center")) return "helpCenter"
  if (pathname.startsWith("/dashboard/account")) return "account"

  return "dashboard"
}

export function canAccessDashboardPath(role: DashboardRole, pathname: string) {
  return canAccessDashboardSection(role, getDashboardSectionFromPath(pathname))
}
