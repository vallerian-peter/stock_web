import { Suspense } from "react"

import { DashboardPayablePage } from "./components/dashboard-payable-page"
import { DashboardPayablePageFallback } from "./components/dashboard-payable-page-fallback"

export default function PayablePage() {
  return (
    <Suspense fallback={<DashboardPayablePageFallback />}>
      <DashboardPayablePage />
    </Suspense>
  )
}
