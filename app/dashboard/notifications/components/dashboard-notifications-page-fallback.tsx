import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardNotificationsPageFallback() {
  return (
    <DashboardPage>
      <Card className="min-h-[70vh] rounded-2xl">
        <CardHeader className="flex-row justify-between border-b">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-8 w-56" />
        </CardHeader>
        <CardContent className="space-y-3 pt-5">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-2xl" />
          ))}
        </CardContent>
      </Card>
    </DashboardPage>
  )
}
