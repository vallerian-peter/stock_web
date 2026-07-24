import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <>
      <DashboardPageHeader />
      <div className="min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-5">
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/80">
          <div className="md:grid md:min-h-[640px] md:grid-cols-[210px_minmax(0,1fr)]">
            <div className="hidden space-y-3 border-r border-border/60 bg-muted/25 p-4 md:block">
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton key={index} className="h-10 rounded-xl" />
              ))}
            </div>
            <div className="space-y-4 p-5 sm:p-7">
              <Skeleton className="h-6 w-24" />
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="h-16 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
