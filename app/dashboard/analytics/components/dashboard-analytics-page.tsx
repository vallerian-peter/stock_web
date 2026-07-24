"use client"

import {
  BadgeDollarSignIcon,
  BoxesIcon,
  HandCoinsIcon,
  PackageCheckIcon,
  RefreshCwIcon,
} from "lucide-react"

import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { useLandingLocale } from "@/components/landing-locale-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { analyticsCopy } from "./analytics-copy"
import { AnalyticsReportCenter } from "./analytics-report-center"
import type { AnalyticsRange } from "./analytics-types"
import { DashboardAnalyticsCharts } from "./dashboard-analytics-charts"
import { DashboardAnalyticsPageFallback } from "./dashboard-analytics-page-fallback"
import { interpolate } from "./analytics-utils"
import { useDashboardAnalyticsState } from "./use-dashboard-analytics-state"

export function DashboardAnalyticsPage() {
  const { locale } = useLandingLocale()
  const copy = analyticsCopy[locale]
  const {
    data,
    isLoading,
    loadAnalytics,
    loadError,
    range,
    setRange,
    summary,
  } = useDashboardAnalyticsState(locale)
  const numberLocale = locale === "sw" ? "sw-TZ" : "en-TZ"

  if (isLoading && data.sales.length === 0 && data.parts.length === 0) {
    return <DashboardAnalyticsPageFallback />
  }

  if (loadError && data.sales.length === 0 && data.parts.length === 0) {
    return (
      <DashboardPage>
        <Card className="rounded-2xl border-border/60">
          <CardContent>
            <Empty className="min-h-[60vh]">
              <EmptyTitle>{copy.errorTitle}</EmptyTitle>
              <EmptyDescription>{loadError}</EmptyDescription>
              <Button
                className="mt-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                onClick={() => void loadAnalytics()}
              >
                <RefreshCwIcon data-icon="inline-start" />
                {copy.retry}
              </Button>
            </Empty>
          </CardContent>
        </Card>
      </DashboardPage>
    )
  }

  const kpis = [
    {
      label: copy.kpis.salesRevenue,
      value: `TZS ${summary.salesRevenue.toLocaleString(numberLocale)}`,
      detail: interpolate(copy.kpis.salesRevenueDetail, {
        count: summary.filteredSales.length.toLocaleString(numberLocale),
      }),
      context: copy.selectedPeriod,
      Icon: BadgeDollarSignIcon,
      tone: "orange",
    },
    {
      label: copy.kpis.unitsSold,
      value: summary.unitsSold.toLocaleString(numberLocale),
      detail: interpolate(copy.kpis.unitsSoldDetail, {
        count: summary.uniqueProductsSold.toLocaleString(numberLocale),
      }),
      context: copy.selectedPeriod,
      Icon: PackageCheckIcon,
      tone: "emerald",
    },
    {
      label: copy.kpis.inventoryValue,
      value: `TZS ${summary.inventoryValue.toLocaleString(numberLocale)}`,
      detail: interpolate(copy.kpis.inventoryValueDetail, {
        count: summary.partsInStock.toLocaleString(numberLocale),
      }),
      context: copy.currentSnapshot,
      Icon: BoxesIcon,
      tone: "zinc",
    },
    {
      label: copy.kpis.receivableBalance,
      value: `TZS ${summary.receivableBalance.toLocaleString(numberLocale)}`,
      detail: copy.kpis.receivableBalanceDetail,
      context: copy.currentSnapshot,
      Icon: HandCoinsIcon,
      tone: "amber",
    },
  ] as const

  const toneClasses = {
    orange:
      "border-orange-200/70 bg-orange-50 text-orange-600 dark:border-orange-900 dark:bg-orange-950/40",
    emerald:
      "border-emerald-200/70 bg-emerald-50 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950/40",
    zinc: "border-zinc-200/70 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900",
    amber:
      "border-amber-200/70 bg-amber-50 text-amber-600 dark:border-amber-900 dark:bg-amber-950/40",
  }

  return (
    <DashboardPage
      className="space-y-4"
      actions={
        <>
          <Select
            value={range}
            onValueChange={(value) => setRange(value as AnalyticsRange)}
          >
            <SelectTrigger
              className="h-9 min-w-40 rounded-xl bg-background"
              aria-label={copy.dateRange}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {(
                Object.entries(copy.ranges) as Array<[AnalyticsRange, string]>
              ).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="h-9 rounded-xl"
            disabled={isLoading}
            onClick={() => void loadAnalytics()}
          >
            <RefreshCwIcon
              data-icon="inline-start"
              className={isLoading ? "animate-spin" : undefined}
            />
            {copy.refresh}
          </Button>
        </>
      }
    >
      <section>
        <Badge
          variant="outline"
          className="rounded-full border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-[11px] font-medium text-orange-700 dark:text-orange-300"
        >
          <span className="size-1.5 rounded-full bg-orange-500" />
          {copy.dateRange}: {copy.ranges[range]}
        </Badge>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <Card
            key={item.label}
            className="justify-between gap-3 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm"
          >
            <CardHeader className="flex flex-row items-start justify-between px-5 pt-5 pb-0">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-1 text-[9px] tracking-wide text-muted-foreground/70 uppercase">
                  {item.context}
                </p>
              </div>
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-xl border ${toneClasses[item.tone]}`}
              >
                <item.Icon className="size-4" />
              </span>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="truncate font-heading text-xl font-semibold tracking-tight text-foreground">
                {item.value}
              </p>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {item.detail}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <DashboardAnalyticsCharts copy={copy} locale={locale} summary={summary} />

      <AnalyticsReportCenter
        copy={copy}
        data={data}
        locale={locale}
        summary={summary}
      />
    </DashboardPage>
  )
}
