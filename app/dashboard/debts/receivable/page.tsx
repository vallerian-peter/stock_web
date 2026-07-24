import { Suspense } from "react"

import { DashboardReceivablePage } from "./components/dashboard-receivable-page"
import { DashboardReceivablePageFallback } from "./components/dashboard-receivable-page-fallback"

export default function ReceivablePage() {
  return (
    <Suspense fallback={<DashboardReceivablePageFallback />}>
      <DashboardReceivablePage />
    </Suspense>
  )
}
