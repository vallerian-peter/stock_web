import { Suspense } from "react"

import { DashboardCategoriesPage } from "@/app/dashboard/categories/components/dashboard-categories-page"
import { DashboardCategoriesPageFallback } from "@/app/dashboard/categories/components/dashboard-categories-page-fallback"

export default function CategoriesPage() {
  return (
    <Suspense fallback={<DashboardCategoriesPageFallback />}>
      <DashboardCategoriesPage />
    </Suspense>
  )
}
