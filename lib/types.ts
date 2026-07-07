import { DashboardRole } from "./auth/role-access"
import type { CategoryResponseDTO } from "./dtos/category_dtos"
import type { PartResponseDTO } from "./dtos/part_dtos"
import type { UserResponseDTO } from "./dtos/user_dtos"
import { landingContent } from "./landing-content"

export type AppLocale = "en" | "sw"

export type DashboardUser = {
  name: string
  email: string
  role: DashboardRole
}

export type PaginatedApiResponse<TData> = {
  data: TData[]
  links?: {
    first?: string | null
    last?: string | null
    next?: string | null
    prev?: string | null
  }
  meta?: {
    current_page?: number
    from?: number | null
    last_page?: number
    path?: string
    per_page?: number
    to?: number | null
    total?: number
  }
}

export type DashboardUsersCopy =
  (typeof landingContent)[keyof typeof landingContent]["dashboardUsers"]
export type DashboardCategoriesCopy =
  (typeof landingContent)[keyof typeof landingContent]["dashboardCategories"]
export type DashboardPartsCopy =
  (typeof landingContent)[keyof typeof landingContent]["dashboardProducts"]

export type UsersSortDirection = "asc" | "desc"
export type UsersStatusFilter = "all" | UserResponseDTO["status"]
export type CategoriesSortDirection = "asc" | "desc"
export type PartsSortDirection = "asc" | "desc"
export type PartsStatusFilter = "all" | PartResponseDTO["status"]

export type ActiveUserDialog =
  | { type: "add" }
  | { type: "edit"; user: UserResponseDTO }
  | { type: "view"; user: UserResponseDTO }
  | null

export type ActiveCategoryDialog =
  | { type: "add" }
  | { type: "edit"; category: CategoryResponseDTO }
  | { type: "view"; category: CategoryResponseDTO }
  | null

export type ActivePartDialog =
  | { type: "add" }
  | { type: "bulk-add" }
  | { type: "edit"; part: PartResponseDTO }
  | { type: "view"; part: PartResponseDTO }
  | null
