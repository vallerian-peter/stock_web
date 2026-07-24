"use client"

import { PlusIcon } from "lucide-react"

import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

type DashboardDebtPageFallbackProps = {
  addLabel: string
}

export function DashboardDebtPageFallback({
  addLabel,
}: DashboardDebtPageFallbackProps) {
  return (
    <DashboardPage
      actions={
        <Button disabled>
          <PlusIcon data-icon="inline-start" />
          {addLabel}
        </Button>
      }
    >
      <section className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Card
              key={index}
              className="h-32 animate-pulse rounded-2xl border-border/60 bg-muted/50 py-0"
            />
          ))}
        </div>

        <Card className="min-h-[auto_70vh] w-full rounded-lg border-border/60 bg-card/90 py-0 shadow-sm">
          <CardHeader className="border-b px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3 xl:flex-row xl:justify-between">
              <div className="h-10 w-full animate-pulse rounded-md bg-muted xl:max-w-xl" />
              <div className="flex gap-2">
                <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
                <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
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
