import { Suspense } from "react"

import { DashboardUsersPage } from "@/app/dashboard/users/components/dashboard-users-page"
import { DashboardUsersPageFallback } from "@/app/dashboard/users/components/dashboard-users-page-fallback"

export default function UsersPage() {
  return (
    <Suspense fallback={<DashboardUsersPageFallback />}>
      <DashboardUsersPage />
    </Suspense>
  )
}
