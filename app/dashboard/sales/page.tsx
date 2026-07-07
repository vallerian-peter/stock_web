import { Suspense } from "react"

import { DashboardSalesPage } from "@/app/dashboard/sales/components/dashboard-sales-page"
import { DashboardSalesPageFallback } from "@/app/dashboard/sales/components/dashboard-sales-page-fallback"

export default function SalesPage() {
  return (
    <Suspense fallback={<DashboardSalesPageFallback />}>
      <DashboardSalesPage />
    </Suspense>
  )
}
