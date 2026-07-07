import { Suspense } from "react"

import { DashboardIncomeStockPage } from "@/app/dashboard/income-stock/components/dashboard-income-stock-page"
import { DashboardIncomeStockPageFallback } from "@/app/dashboard/income-stock/components/dashboard-income-stock-page-fallback"

export default function IncomeStockPage() {
  return (
    <Suspense fallback={<DashboardIncomeStockPageFallback />}>
      <DashboardIncomeStockPage />
    </Suspense>
  )
}
