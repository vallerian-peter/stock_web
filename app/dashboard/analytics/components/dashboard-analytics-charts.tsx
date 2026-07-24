"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

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
import type { LandingLocale } from "@/lib/landing-content"

import type { AnalyticsCopy } from "./analytics-copy"
import type { AnalyticsSummary } from "./analytics-types"

type DashboardAnalyticsChartsProps = {
  copy: AnalyticsCopy
  locale: LandingLocale
  summary: AnalyticsSummary
}

const paymentColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]

const topProductColors = [
  "#f97316",
  "#10b981",
  "#0ea5e9",
  "#ef4444",
  "#eab308",
  "#06b6d4",
  "#84cc16",
  "#ec4899",
  "#6366f1",
  "#71717a",
]

function AnalyticsCardHeader({
  description,
  title,
}: {
  description: string
  title: string
}) {
  return (
    <CardHeader className="border-b border-border/50 px-5 py-4">
      <CardTitle className="text-[14px] font-semibold">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  )
}

function formatCompact(value: number, locale: LandingLocale) {
  return new Intl.NumberFormat(locale === "sw" ? "sw-TZ" : "en-TZ", {
    compactDisplay: "short",
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(value)
}

function getPaymentLabel(copy: AnalyticsCopy, key: string) {
  const labels = copy.paymentMethods
  return key in labels
    ? labels[key as keyof typeof labels]
    : copy.paymentMethods.OTHER
}

export function DashboardAnalyticsCharts({
  copy,
  locale,
  summary,
}: DashboardAnalyticsChartsProps) {
  const numberLocale = locale === "sw" ? "sw-TZ" : "en-TZ"

  const financialConfig = {
    revenue: {
      label: copy.financialTrend.revenue,
      color: "var(--color-orange-500)",
    },
    cost: {
      label: copy.financialTrend.cost,
      color: "var(--color-zinc-600)",
    },
  } satisfies ChartConfig

  const movementConfig = {
    stockIn: {
      label: copy.stockMovement.stockIn,
      color: "var(--color-emerald-500)",
    },
    stockOut: {
      label: copy.stockMovement.stockOut,
      color: "var(--color-orange-500)",
    },
  } satisfies ChartConfig

  const debtConfig = {
    paid: {
      label: copy.debtPosition.paid,
      color: "var(--color-zinc-400)",
    },
    outstanding: {
      label: copy.debtPosition.outstanding,
      color: "var(--color-orange-500)",
    },
  } satisfies ChartConfig

  const topProductsConfig = Object.fromEntries(
    summary.topProducts.map((product, index) => [
      `product_${product.id}`,
      {
        label: product.name,
        color: topProductColors[index % topProductColors.length],
      },
    ])
  ) satisfies ChartConfig

  const paymentConfig = Object.fromEntries(
    summary.paymentMethods.map((item, index) => [
      item.key,
      {
        label: getPaymentLabel(copy, item.key),
        color: paymentColors[index % paymentColors.length],
      },
    ])
  ) satisfies ChartConfig

  const paymentData = summary.paymentMethods.map((item, index) => ({
    ...item,
    label: getPaymentLabel(copy, item.key),
    fill: paymentColors[index % paymentColors.length],
  }))

  const debtData = summary.debtPosition.map((item) => ({
    ...item,
    label:
      item.key === "receivable"
        ? copy.debtPosition.receivable
        : copy.debtPosition.payable,
  }))

  return (
    <section className="grid gap-4 xl:grid-cols-12">
      <Card className="gap-0 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm xl:col-span-8">
        <AnalyticsCardHeader
          title={copy.financialTrend.title}
          description={copy.financialTrend.description}
        />
        <CardContent className="px-3 pt-5 pb-4 sm:px-5">
          <ChartContainer config={financialConfig} className="h-[310px] w-full">
            <AreaChart
              accessibilityLayer
              data={summary.financialTrend}
              margin={{ left: 4, right: 12, top: 8 }}
            >
              <defs>
                <linearGradient
                  id="analytics-revenue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.32}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
                <linearGradient id="analytics-cost" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-cost)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-cost)"
                    stopOpacity={0.01}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                minTickGap={24}
              />
              <YAxis
                axisLine={false}
                tickFormatter={(value) => formatCompact(Number(value), locale)}
                tickLine={false}
                width={48}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <div className="flex min-w-44 items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          {financialConfig[name as keyof typeof financialConfig]
                            ?.label ?? String(name)}
                        </span>
                        <span className="font-mono font-medium tabular-nums">
                          TZS {Number(value).toLocaleString(numberLocale)}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                dataKey="cost"
                fill="url(#analytics-cost)"
                stroke="var(--color-cost)"
                strokeWidth={2}
                type="monotone"
              />
              <Area
                dataKey="revenue"
                fill="url(#analytics-revenue)"
                stroke="var(--color-revenue)"
                strokeWidth={2.5}
                type="monotone"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="gap-0 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm xl:col-span-4">
        <AnalyticsCardHeader
          title={copy.paymentMethods.title}
          description={copy.paymentMethods.description}
        />
        <CardContent className="flex min-h-[350px] items-center justify-center px-3 py-4 sm:px-5">
          {paymentData.length === 0 ? (
            <Empty className="min-h-64">
              <EmptyTitle>{copy.paymentMethods.title}</EmptyTitle>
              <EmptyDescription>{copy.noData}</EmptyDescription>
            </Empty>
          ) : (
            <ChartContainer config={paymentConfig} className="h-[300px] w-full">
              <PieChart accessibilityLayer>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideLabel
                      nameKey="key"
                      formatter={(value, _name, item) => (
                        <div className="flex min-w-44 items-center justify-between gap-4">
                          <span className="text-muted-foreground">
                            {getPaymentLabel(
                              copy,
                              String(item.payload?.key ?? "UNKNOWN")
                            )}
                          </span>
                          <span className="font-mono font-medium tabular-nums">
                            TZS {Number(value).toLocaleString(numberLocale)}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Pie
                  data={paymentData}
                  dataKey="value"
                  innerRadius={62}
                  nameKey="key"
                  outerRadius={94}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {paymentData.map((item) => (
                    <Cell key={item.key} fill={item.fill} />
                  ))}
                </Pie>
                <ChartLegend
                  content={
                    <ChartLegendContent
                      className="flex-wrap gap-x-4 gap-y-2"
                      nameKey="key"
                    />
                  }
                />
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card className="gap-0 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm xl:col-span-7">
        <AnalyticsCardHeader
          title={copy.stockMovement.title}
          description={copy.stockMovement.description}
        />
        <CardContent className="px-3 pt-5 pb-4 sm:px-5">
          <ChartContainer config={movementConfig} className="h-[300px] w-full">
            <BarChart
              accessibilityLayer
              data={summary.stockMovement}
              margin={{ left: 4, right: 12, top: 8 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                minTickGap={24}
              />
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

      <Card className="gap-0 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm xl:col-span-5">
        <AnalyticsCardHeader
          title={copy.debtPosition.title}
          description={copy.debtPosition.description}
        />
        <CardContent className="px-3 pt-5 pb-4 sm:px-5">
          <ChartContainer config={debtConfig} className="h-[300px] w-full">
            <BarChart
              accessibilityLayer
              data={debtData}
              layout="vertical"
              margin={{ left: 10, right: 16, top: 12 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis
                axisLine={false}
                tickFormatter={(value) => formatCompact(Number(value), locale)}
                tickLine={false}
                type="number"
              />
              <YAxis
                axisLine={false}
                dataKey="label"
                tickLine={false}
                type="category"
                width={76}
              />
              <ChartTooltip
                cursor={{ fill: "var(--color-muted)", opacity: 0.45 }}
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <div className="flex min-w-44 items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          {debtConfig[name as keyof typeof debtConfig]?.label ??
                            String(name)}
                        </span>
                        <span className="font-mono font-medium tabular-nums">
                          TZS {Number(value).toLocaleString(numberLocale)}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="paid"
                fill="var(--color-paid)"
                radius={[4, 0, 0, 4]}
                stackId="debt"
              />
              <Bar
                dataKey="outstanding"
                fill="var(--color-outstanding)"
                radius={[0, 4, 4, 0]}
                stackId="debt"
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="gap-0 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm xl:col-span-12">
        <AnalyticsCardHeader
          title={copy.topProducts.title}
          description={copy.topProducts.description}
        />
        <CardContent className="px-3 pt-5 pb-4 sm:px-5">
          {summary.topProducts.length === 0 ? (
            <Empty className="min-h-64">
              <EmptyTitle>{copy.topProducts.title}</EmptyTitle>
              <EmptyDescription>{copy.noData}</EmptyDescription>
            </Empty>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <ChartContainer
                config={topProductsConfig}
                className="h-[340px] w-full"
              >
                <LineChart
                  accessibilityLayer
                  data={summary.topProductTrend}
                  margin={{ left: 4, right: 12, top: 12 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    axisLine={false}
                    dataKey="label"
                    minTickGap={24}
                    tickLine={false}
                  />
                  <YAxis axisLine={false} tickLine={false} width={42} />
                  <ChartTooltip
                    cursor={{ stroke: "var(--color-border)" }}
                    content={<ChartTooltipContent />}
                  />
                  {summary.topProducts.map((product) => {
                    const seriesKey = `product_${product.id}`

                    return (
                      <Line
                        key={product.id}
                        dataKey={seriesKey}
                        dot={false}
                        stroke={`var(--color-${seriesKey})`}
                        strokeWidth={2}
                        type="monotone"
                      />
                    )
                  })}
                </LineChart>
              </ChartContainer>

              <div className="grid grid-cols-2 content-start gap-2">
                {summary.topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex min-w-0 items-center gap-2 rounded-lg border border-border/60 bg-muted/20 p-2"
                  >
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          topProductColors[index % topProductColors.length],
                      }}
                    />
                    <span className="shrink-0 font-mono text-[9px] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-medium">
                        {product.name}
                      </p>
                      <p className="text-[9px] text-muted-foreground">
                        {product.quantity.toLocaleString(numberLocale)}{" "}
                        {copy.topProducts.units}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[8px] text-muted-foreground">
                        {copy.topProducts.totalPrice}
                      </p>
                      <p className="font-mono text-[9px] font-semibold tabular-nums">
                        TZS {formatCompact(product.revenue, locale)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
