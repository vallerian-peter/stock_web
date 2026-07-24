import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function HelpCenterLoading() {
  return (
    <>
      <DashboardPageHeader />
      <div className="min-w-0 flex-1 space-y-4 px-4 py-4 sm:px-6 sm:py-5">
        <Skeleton className="h-32 rounded-2xl" />
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-24 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <Skeleton className="h-[520px] rounded-2xl" />
          <Skeleton className="h-[360px] rounded-2xl" />
        </div>
      </div>
    </>
  )
}
