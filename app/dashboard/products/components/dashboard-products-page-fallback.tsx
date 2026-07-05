import { PlusIcon } from "lucide-react"

import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardPartsPageFallback() {
  return (
    <DashboardPage
      actions={
        <Button disabled>
          <PlusIcon data-icon="inline-start" />
          Add part
        </Button>
      }
    >
      <section>
        <Card className="min-h-[auto_70vh] w-full rounded-lg border-border/60 bg-card/90 py-0 shadow-sm">
          <CardHeader className="border-b px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="h-10 w-full animate-pulse rounded-md bg-muted xl:max-w-xl" />
              <div className="flex gap-2">
                <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
                <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
                <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-72 animate-pulse rounded-xl bg-muted" />
          </CardContent>
        </Card>
      </section>
    </DashboardPage>
  )
}
