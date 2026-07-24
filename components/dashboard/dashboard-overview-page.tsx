"use client"

import Link from "next/link"
import {
  ArrowDownToLineIcon,
  ArrowUpFromLineIcon,
  BadgeDollarSignIcon,
  BoxesIcon,
  CircleAlertIcon,
  Clock3Icon,
  Layers3Icon,
  Package2Icon,
  RefreshCwIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { useLandingLocale } from "@/components/landing-locale-provider"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { toHumanForm } from "@/lib/formatters"

import { dashboardOverviewCopy } from "./dashboard-overview-copy"
import { useDashboardOverview } from "./use-dashboard-overview"

function interpolate(
  template: string,
  values: Record<string, number | string>
) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template
  )
}

function formatCompact(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(value)
}

export function DashboardOverviewPage() {
  const { locale } = useLandingLocale()
  const copy = dashboardOverviewCopy[locale]
  const numberLocale = locale === "sw" ? "sw-TZ" : "en-TZ"
  const { error, isLoading, refresh, summary } = useDashboardOverview()

  if (isLoading && !summary) {
    return (
      <DashboardPage className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.65fr_0.95fr]">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </DashboardPage>
    )
  }

  if (error && !summary) {
    return (
      <DashboardPage>
        <Empty className="min-h-[65vh] rounded-2xl border border-border/60 bg-card">
          <EmptyTitle>{copy.loadError}</EmptyTitle>
          <EmptyDescription>{error}</EmptyDescription>
          <Button variant="outline" onClick={() => void refresh()}>
            <RefreshCwIcon data-icon="inline-start" />
            {copy.retry}
          </Button>
        </Empty>
      </DashboardPage>
    )
  }

  if (!summary) return null

  const kpis = [
    {
      label: copy.kpis.products,
      value: summary.inventory.productCount.toLocaleString(numberLocale),
      detail: copy.kpis.productsDetail,
      Icon: Package2Icon,
    },
    {
      label: copy.kpis.quantity,
      value: summary.inventory.quantity.toLocaleString(numberLocale),
      detail: copy.kpis.quantityDetail,
      Icon: Layers3Icon,
    },
    {
      label: copy.kpis.value,
      value: `TZS ${Number(summary.inventory.value).toLocaleString(numberLocale)}`,
      detail: copy.kpis.valueDetail,
      Icon: BoxesIcon,
    },
    {
      label: copy.kpis.alerts,
      value: (
        summary.inventory.lowStockCount + summary.inventory.outOfStockCount
      ).toLocaleString(numberLocale),
      detail: interpolate(copy.kpis.alertsDetail, {
        low: summary.inventory.lowStockCount.toLocaleString(numberLocale),
        out: summary.inventory.outOfStockCount.toLocaleString(numberLocale),
      }),
      Icon: TriangleAlertIcon,
    },
  ]

  const trendData = summary.monthlyTrends.map((item) => {
    const [year, month] = item.month.split("-").map(Number)

    return {
      ...item,
      label: new Intl.DateTimeFormat(numberLocale, {
        month: "short",
      }).format(new Date(year, month - 1, 1)),
    }
  })
  const trendConfig = {
    stockIn: {
      label: copy.stockIn,
      color: "var(--color-emerald-500)",
    },
    stockOut: {
      label: copy.stockOut,
      color: "var(--color-orange-500)",
    },
  } satisfies ChartConfig

  return (
    <DashboardPage
      className="space-y-4"
      actions={
        <Button
          variant="outline"
          className="rounded-xl"
          disabled={isLoading}
          onClick={() => void refresh()}
        >
          <RefreshCwIcon
            data-icon="inline-start"
            className={isLoading ? "animate-spin" : undefined}
          />
          {copy.refresh}
        </Button>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <Card
            key={item.label}
            className="justify-between gap-3 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm"
          >
            <CardHeader className="flex flex-row items-start justify-between px-5 pt-5 pb-0">
              <p className="text-[11px] font-medium text-muted-foreground">
                {item.label}
              </p>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-orange-200/70 bg-orange-50 text-orange-600 dark:border-orange-900 dark:bg-orange-950/40">
                <item.Icon className="size-4" />
              </span>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="truncate font-heading text-xl font-semibold tracking-tight">
                {item.value}
              </p>
              <p className="mt-2 text-[10px] text-muted-foreground">
                {item.detail}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.65fr_0.95fr]">
        <Card className="gap-0 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm">
          <CardHeader className="border-b border-border/50 px-5 py-4">
            <CardTitle>{copy.inventoryTrend}</CardTitle>
            <CardDescription>{copy.inventoryTrendDescription}</CardDescription>
          </CardHeader>
          <CardContent className="px-3 pt-5 pb-4 sm:px-5">
            <ChartContainer config={trendConfig} className="h-[300px] w-full">
              <BarChart
                accessibilityLayer
                data={trendData}
                margin={{ left: 4, right: 12, top: 8 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis axisLine={false} dataKey="label" tickLine={false} />
                <YAxis axisLine={false} tickLine={false} width={42} />
                <ChartTooltip
                  cursor={{ fill: "var(--color-muted)", opacity: 0.45 }}
                  content={<ChartTooltipContent />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="stockIn"
                  fill="var(--color-stockIn)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="stockOut"
                  fill="var(--color-stockOut)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm">
          <CardHeader className="border-b border-border/50 px-5 py-4">
            <CardTitle>{copy.salesOverview}</CardTitle>
            <CardDescription>{copy.thisMonth}</CardDescription>
          </CardHeader>
          <CardContent className="flex h-full flex-col justify-between px-5 pt-6 pb-5">
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
                  strokeDasharray={`${Math.min(100, summary.salesOverview.collectionRate)} 100`}
                  className="text-orange-500"
                />
              </svg>
              <div className="absolute inset-x-0 bottom-0 text-center">
                <p className="text-3xl font-semibold tracking-tight">
                  {summary.salesOverview.collectionRate.toLocaleString(
                    numberLocale
                  )}
                  %
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {copy.collectionRate}
                </p>
              </div>
            </div>
            <p className="mt-4 text-center text-[10px] text-muted-foreground">
              {copy.collectionRateDetail}
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border/60 pt-4">
              <div>
                <p className="text-[9px] text-muted-foreground">
                  {copy.numberOfSales}
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {summary.salesOverview.saleCount.toLocaleString(numberLocale)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-muted-foreground">
                  {copy.totalSales}
                </p>
                <p className="mt-1 text-sm font-semibold">
                  TZS{" "}
                  {formatCompact(
                    Number(summary.salesOverview.totalSales),
                    numberLocale
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-muted-foreground">
                  {copy.amountReceived}
                </p>
                <p className="mt-1 text-sm font-semibold">
                  TZS{" "}
                  {formatCompact(
                    Number(summary.salesOverview.amountPaid),
                    numberLocale
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="gap-0 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm">
          <CardHeader className="border-b border-border/50 px-5 py-4">
            <CardTitle>{copy.recentActivities}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-4">
            {summary.recentActivities.length === 0 ? (
              <p className="py-8 text-center text-[11px] text-muted-foreground">
                {copy.noActivities}
              </p>
            ) : (
              summary.recentActivities.slice(0, 4).map((activity, index) => {
                const ActivityIcon =
                  activity.type === "INCOMING"
                    ? ArrowDownToLineIcon
                    : activity.type === "SALE"
                      ? BadgeDollarSignIcon
                      : ArrowUpFromLineIcon

                return (
                  <div
                    key={`${activity.type}-${activity.occurredAt}-${index}`}
                    className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/25 p-3"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-orange-600 ring-1 ring-border/60">
                      <ActivityIcon className="size-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-medium">
                        {copy.activity[activity.type]}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                        {interpolate(copy.activity.detail, {
                          quantity:
                            activity.quantity.toLocaleString(numberLocale),
                          reference:
                            activity.referenceNumber ??
                            copy.activity.noReference,
                        })}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[9px] text-muted-foreground">
                        <Clock3Icon className="size-2.5" />
                        {toHumanForm(activity.occurredAt, locale)}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm">
          <CardHeader className="flex-row items-center justify-between border-b border-border/50 px-5 py-4">
            <CardTitle>{copy.alerts}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/dashboard/notifications" />}
              nativeButton={false}
            >
              {copy.viewNotifications}
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-4">
            {[
              {
                label: copy.dueSoon,
                value: summary.alertCounts.dueSoon,
                Icon: Clock3Icon,
              },
              {
                label: copy.lowStock,
                value: summary.alertCounts.lowStock,
                Icon: TriangleAlertIcon,
              },
              {
                label: copy.outOfStock,
                value: summary.alertCounts.outOfStock,
                Icon: CircleAlertIcon,
              },
            ].map((alert) => (
              <Link
                key={alert.label}
                href="/dashboard/notifications"
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/25 p-3 transition hover:bg-muted/60"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-orange-600 ring-1 ring-border/60">
                  <alert.Icon className="size-3.5" />
                </span>
                <p className="min-w-0 flex-1 truncate text-[11px] font-medium">
                  {alert.label}
                </p>
                <span className="font-mono text-sm font-semibold">
                  {alert.value.toLocaleString(numberLocale)}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm">
          <CardHeader className="border-b border-border/50 px-5 py-4">
            <CardTitle>{copy.topProducts}</CardTitle>
            <CardDescription>{copy.last30Days}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-4">
            {summary.topProducts.length === 0 ? (
              <p className="py-8 text-center text-[11px] text-muted-foreground">
                {copy.noTopProducts}
              </p>
            ) : (
              summary.topProducts.slice(0, 4).map((product, index) => (
                <div
                  key={`${product.partNumber}-${index}`}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/25 p-3"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-950 font-mono text-[10px] text-white dark:bg-zinc-100 dark:text-zinc-950">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-medium">
                      {product.partName}
                    </p>
                    <p className="mt-0.5 text-[9px] text-muted-foreground">
                      {product.quantity.toLocaleString(numberLocale)}{" "}
                      {copy.units}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-muted-foreground">
                      {copy.revenue}
                    </p>
                    <p className="font-mono text-[10px] font-semibold">
                      TZS {formatCompact(Number(product.revenue), numberLocale)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </DashboardPage>
  )
}
