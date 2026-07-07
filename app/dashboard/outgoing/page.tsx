import { Suspense } from "react"

import { DashboardOutgoingPage } from "@/app/dashboard/outgoing/components/dashboard-outgoing-page"
import { DashboardOutgoingPageFallback } from "@/app/dashboard/outgoing/components/dashboard-outgoing-page-fallback"

export default function OutgoingPage() {
  return (
    <Suspense fallback={<DashboardOutgoingPageFallback />}>
      <DashboardOutgoingPage />
    </Suspense>
  )
}
