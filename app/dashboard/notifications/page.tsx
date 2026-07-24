import { Suspense } from "react"

import { DashboardNotificationsPage } from "./components/dashboard-notifications-page"
import { DashboardNotificationsPageFallback } from "./components/dashboard-notifications-page-fallback"

export default function NotificationsPage() {
  return (
    <Suspense fallback={<DashboardNotificationsPageFallback />}>
      <DashboardNotificationsPage />
    </Suspense>
  )
}
