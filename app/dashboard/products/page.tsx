import { Suspense } from "react"

import { DashboardPartsPage } from "@/app/dashboard/products/components/dashboard-products-page"
import { DashboardPartsPageFallback } from "@/app/dashboard/products/components/dashboard-products-page-fallback"

export default function ProductsPage() {
  return (
    <Suspense fallback={<DashboardPartsPageFallback />}>
      <DashboardPartsPage />
    </Suspense>
  )
}
