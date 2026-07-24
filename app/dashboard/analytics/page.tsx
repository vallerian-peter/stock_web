import { Suspense } from "react"

import { DashboardAnalyticsPage } from "./components/dashboard-analytics-page"
import { DashboardAnalyticsPageFallback } from "./components/dashboard-analytics-page-fallback"

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<DashboardAnalyticsPageFallback />}>
      <DashboardAnalyticsPage />
    </Suspense>
  )
}
