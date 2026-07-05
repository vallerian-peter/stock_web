"use client"

import Link from "next/link"
import {
  ArrowDownToLineIcon,
  ArrowUpFromLineIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  Clock3Icon,
  Layers3Icon,
  MoreHorizontalIcon,
  Package2Icon,
  TriangleAlertIcon,
} from "lucide-react"

import { useLandingLocale } from "@/components/landing-locale-provider"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dashboardContent } from "@/lib/dashboard-content"

const inventorySeries = [
  { stockIn: 48, stockOut: 34, value: 62 },
  { stockIn: 62, stockOut: 44, value: 54 },
  { stockIn: 56, stockOut: 38, value: 68 },
  { stockIn: 32, stockOut: 45, value: 40 },
  { stockIn: 66, stockOut: 52, value: 74 },
  { stockIn: 78, stockOut: 58, value: 84 },
  { stockIn: 45, stockOut: 35, value: 60 },
  { stockIn: 63, stockOut: 47, value: 52 },
  { stockIn: 42, stockOut: 54, value: 64 },
]

const kpiIcons = [Package2Icon, Layers3Icon, TriangleAlertIcon]

function PanelHeader({
  title,
  actionLabel,
}: {
  title: string
  actionLabel: string
}) {
  return (
    <CardHeader className="flex-row items-center justify-between px-5 py-4">
      <CardTitle className="text-[14px] font-semibold">{title}</CardTitle>
      <button
        type="button"
        aria-label={`${actionLabel}: ${title}`}
        className="flex size-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <MoreHorizontalIcon className="size-4" />
      </button>
    </CardHeader>
  )
}

export function DashboardOverviewPage() {
  const { locale } = useLandingLocale()
  const copy = dashboardContent[locale].overview
  const labels = copy.labels

  return (
    <DashboardPage className="space-y-4">
      <section>
        <div className="grid gap-4 sm:grid-cols-3">
          {copy.kpis.map((item, index) => {
            const Icon = kpiIcons[index]

            return (
              <Card
                key={item.label}
                className="justify-between gap-3 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm"
              >
                <CardHeader className="flex flex-row items-start justify-between px-5 pt-5 pb-0">
                  <p className="text-[12px] font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-orange-200/70 bg-orange-50 text-orange-600 dark:border-orange-900 dark:bg-orange-950/40">
                    <Icon className="size-4" />
                  </span>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <p className="text-xl font-semibold tracking-tight text-foreground">
                    {item.value}
                  </p>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {item.detail}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.65fr_0.95fr]">
        <Card className="gap-0 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm">
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 border-b border-border/50 px-5 py-4">
            <CardTitle className="text-[14px] font-semibold">
              {labels.inventoryStatistics}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <i className="size-2 rounded-full bg-orange-500" />
                {labels.stockIn}
              </span>
              <span className="flex items-center gap-1.5">
                <i className="size-2 rounded-full bg-zinc-700 dark:bg-zinc-300" />
                {labels.stockOut}
              </span>
              <span className="flex items-center gap-1.5">
                <i className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                {labels.stockValue}
              </span>
              <span className="rounded-lg border border-border/70 px-2.5 py-1.5 text-foreground">
                {labels.monthly}
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-5 pt-5 pb-4">
            <div className="relative h-64 border-b border-border/70">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3].map((line) => (
                  <div
                    key={line}
                    className="border-t border-dashed border-border/50"
                  />
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 flex h-[92%] items-end justify-between gap-2 px-1">
                {inventorySeries.map((item, index) => (
                  <div
                    key={labels.months[index]}
                    className="flex h-full flex-1 items-end justify-center gap-0.5"
                  >
                    <span
                      className="w-1.5 rounded-t-sm bg-orange-500"
                      style={{ height: `${item.stockIn}%` }}
                    />
                    <span
                      className="w-1.5 rounded-t-sm bg-zinc-700 dark:bg-zinc-300"
                      style={{ height: `${item.stockOut}%` }}
                    />
                    <span
                      className="w-1.5 rounded-t-sm bg-zinc-300 dark:bg-zinc-600"
                      style={{ height: `${item.value}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex justify-between px-1">
              {labels.months.map((month) => (
                <span
                  key={month}
                  className="flex-1 text-center text-[10px] text-muted-foreground"
                >
                  {month}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm">
          <PanelHeader
            title={labels.salesOverview}
            actionLabel={labels.viewDetails}
          />
          <CardContent className="flex h-full flex-col justify-between border-t border-border/50 px-5 pt-5 pb-5">
            <div className="relative mx-auto w-full max-w-72">
              <svg viewBox="0 0 200 112" className="w-full" aria-hidden="true">
                <path
                  d="M 18 100 A 82 82 0 0 1 182 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="15"
                  pathLength="100"
                  className="text-muted/80"
                />
                <path
                  d="M 18 100 A 82 82 0 0 1 182 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="15"
                  pathLength="100"
                  strokeDasharray="71.3 100"
                  className="text-orange-500"
                />
              </svg>
              <div className="absolute inset-x-0 bottom-0 text-center">
                <p className="text-3xl font-semibold tracking-tight">71.3%</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {labels.salesGoal}
                </p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border/60 pt-4">
              <div>
                <p className="text-[11px] text-muted-foreground">
                  {labels.numberOfSales}
                </p>
                <p className="mt-1 text-base font-semibold">1,233</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-muted-foreground">
                  {labels.totalSales}
                </p>
                <p className="mt-1 text-base font-semibold">TZS 18.4M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="gap-0 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm">
          <PanelHeader
            title={labels.recentActivities}
            actionLabel={labels.viewDetails}
          />
          <CardContent className="space-y-2 border-t border-border/50 px-4 py-4">
            {copy.activity.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/25 p-3"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-orange-600 ring-1 ring-border/60">
                  <Clock3Icon className="size-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm">
          <PanelHeader title={labels.alerts} actionLabel={labels.viewDetails} />
          <CardContent className="space-y-2 border-t border-border/50 px-4 py-4">
            {copy.quickActions.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className="group flex items-center gap-3 rounded-xl border border-border/50 bg-muted/25 p-3 transition hover:bg-muted/60"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-orange-600 ring-1 ring-border/60">
                  {index === 0 ? (
                    <ArrowDownToLineIcon className="size-3.5" />
                  ) : index === 1 ? (
                    <ArrowUpFromLineIcon className="size-3.5" />
                  ) : (
                    <CircleAlertIcon className="size-3.5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 truncate text-[11px] text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
                <ChevronRightIcon className="size-3.5 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm">
          <PanelHeader
            title={labels.topProducts}
            actionLabel={labels.viewDetails}
          />
          <CardContent className="space-y-2 border-t border-border/50 px-4 py-4">
            {copy.watchlist.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/25 p-3"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground ring-1 ring-border/60">
                  <Package2Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium text-foreground">
                    {item.name}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {item.value}
                  </p>
                </div>
                <span className="max-w-24 text-right text-[10px] font-medium text-orange-600">
                  {item.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </DashboardPage>
  )
}
