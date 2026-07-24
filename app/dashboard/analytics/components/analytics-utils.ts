import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns"

import type { LandingLocale } from "@/lib/landing-content"

import type {
  AnalyticsProductTrendPoint,
  AnalyticsRange,
  AnalyticsSourceData,
  AnalyticsSummary,
  AnalyticsTrendPoint,
} from "./analytics-types"

type BucketGranularity = "day" | "week" | "month"

function toNumber(value: number | string | null | undefined) {
  const amount = Number(value ?? 0)
  return Number.isFinite(amount) ? amount : 0
}

function toDate(value: string | null | undefined) {
  if (!value) return null

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function getRangeStart(range: AnalyticsRange, now: Date) {
  switch (range) {
    case "30":
      return startOfDay(subDays(now, 29))
    case "90":
      return startOfDay(subDays(now, 89))
    case "180":
      return startOfMonth(subMonths(now, 5))
    case "365":
      return startOfMonth(subMonths(now, 11))
    case "all":
      return null
  }
}

function isWithinRange(
  value: string | null | undefined,
  range: AnalyticsRange,
  now: Date
) {
  const date = toDate(value)
  if (!date) return false

  const start = getRangeStart(range, now)
  return (!start || date >= start) && date <= now
}

function getGranularity(range: AnalyticsRange): BucketGranularity {
  if (range === "30") return "day"
  if (range === "90") return "week"
  return "month"
}

function bucketStart(date: Date, granularity: BucketGranularity) {
  if (granularity === "day") return startOfDay(date)
  if (granularity === "week") return startOfWeek(date, { weekStartsOn: 1 })
  return startOfMonth(date)
}

function bucketKey(date: Date, granularity: BucketGranularity) {
  const start = bucketStart(date, granularity)
  const month = String(start.getMonth() + 1).padStart(2, "0")
  const day = String(start.getDate()).padStart(2, "0")
  return `${start.getFullYear()}-${month}-${day}`
}

function getEarliestBusinessDate(data: AnalyticsSourceData, fallback: Date) {
  const dates = [
    ...data.sales.map((record) => toDate(record.soldAt)),
    ...data.incomingStocks.map((record) => toDate(record.receivedAt)),
    ...data.outgoingStocks.map((record) => toDate(record.dispatchedAt)),
  ].filter((date): date is Date => date !== null)

  if (dates.length === 0) return fallback

  return new Date(Math.min(...dates.map((date) => date.getTime())))
}

function createTrendBuckets(
  data: AnalyticsSourceData,
  range: AnalyticsRange,
  locale: LandingLocale,
  now: Date
) {
  const granularity = getGranularity(range)
  let dates: Date[]

  if (granularity === "day") {
    dates = eachDayOfInterval({ start: subDays(now, 29), end: now })
  } else if (granularity === "week") {
    dates = eachWeekOfInterval(
      { start: subDays(now, 89), end: now },
      { weekStartsOn: 1 }
    )
  } else {
    const start =
      range === "all"
        ? startOfMonth(getEarliestBusinessDate(data, now))
        : startOfMonth(subMonths(now, range === "180" ? 5 : 11))
    dates = eachMonthOfInterval({ start, end: now })
  }

  const dateLocale = locale === "sw" ? "sw-TZ" : "en-TZ"
  const includesYear =
    range === "all" &&
    dates.some((date) => date.getFullYear() !== now.getFullYear())

  return {
    granularity,
    points: dates.map<AnalyticsTrendPoint>((date) => ({
      key: bucketKey(date, granularity),
      label: new Intl.DateTimeFormat(dateLocale, {
        day: granularity === "month" ? undefined : "numeric",
        month: "short",
        year: includesYear ? "2-digit" : undefined,
      }).format(date),
      cost: 0,
      revenue: 0,
      stockIn: 0,
      stockOut: 0,
    })),
  }
}

function addToTrend(
  pointsByKey: Map<string, AnalyticsTrendPoint>,
  dateValue: string,
  granularity: BucketGranularity,
  values: Partial<
    Pick<AnalyticsTrendPoint, "cost" | "revenue" | "stockIn" | "stockOut">
  >
) {
  const date = toDate(dateValue)
  if (!date) return

  const point = pointsByKey.get(bucketKey(date, granularity))
  if (!point) return

  point.cost += values.cost ?? 0
  point.revenue += values.revenue ?? 0
  point.stockIn += values.stockIn ?? 0
  point.stockOut += values.stockOut ?? 0
}

export function buildAnalyticsSummary(
  data: AnalyticsSourceData,
  range: AnalyticsRange,
  locale: LandingLocale,
  now = new Date()
): AnalyticsSummary {
  const filteredSales = data.sales.filter((record) =>
    isWithinRange(record.soldAt, range, now)
  )
  const filteredIncomingStocks = data.incomingStocks.filter((record) =>
    isWithinRange(record.receivedAt, range, now)
  )
  const filteredOutgoingStocks = data.outgoingStocks.filter((record) =>
    isWithinRange(record.dispatchedAt, range, now)
  )
  const filteredPayables = data.payables.filter((record) =>
    isWithinRange(record.debtDate ?? record.createdAt, range, now)
  )
  const filteredReceivables = data.receivables.filter((record) =>
    isWithinRange(record.debtDate ?? record.createdAt, range, now)
  )

  const { granularity, points } = createTrendBuckets(data, range, locale, now)
  const pointsByKey = new Map(points.map((point) => [point.key, point]))

  filteredSales.forEach((sale) => {
    addToTrend(pointsByKey, sale.soldAt, granularity, {
      revenue: toNumber(sale.totalAmount),
    })
  })

  filteredIncomingStocks.forEach((stock) => {
    addToTrend(pointsByKey, stock.receivedAt, granularity, {
      cost: toNumber(stock.totalAmount),
      stockIn: stock.items.reduce((total, item) => total + item.quantity, 0),
    })
  })

  filteredOutgoingStocks.forEach((stock) => {
    addToTrend(pointsByKey, stock.dispatchedAt, granularity, {
      stockOut: stock.items.reduce((total, item) => total + item.quantity, 0),
    })
  })

  const paymentTotals = new Map<string, number>()
  filteredSales.forEach((sale) => {
    const method = sale.paymentMethod?.trim().toUpperCase() || "UNKNOWN"
    paymentTotals.set(
      method,
      (paymentTotals.get(method) ?? 0) + toNumber(sale.totalAmount)
    )
  })

  const productTotals = new Map<
    number,
    { id: number; name: string; quantity: number; revenue: number }
  >()
  filteredSales.forEach((sale) => {
    sale.items.forEach((item) => {
      const current = productTotals.get(item.partId) ?? {
        id: item.partId,
        name: item.partName,
        quantity: 0,
        revenue: 0,
      }
      current.quantity += item.quantity
      current.revenue += toNumber(item.subtotal)
      productTotals.set(item.partId, current)
    })
  })

  const receivableTotal = data.receivables.reduce(
    (total, record) => total + toNumber(record.totalAmount),
    0
  )
  const receivableOutstanding = data.receivables.reduce(
    (total, record) => total + toNumber(record.balanceAmount),
    0
  )
  const payableTotal = data.payables.reduce(
    (total, record) => total + toNumber(record.totalAmount),
    0
  )
  const payableOutstanding = data.payables.reduce(
    (total, record) => total + toNumber(record.balanceAmount),
    0
  )
  const topProducts = Array.from(productTotals.values())
    .sort(
      (first, second) =>
        second.quantity - first.quantity || second.revenue - first.revenue
    )
    .slice(0, 10)
  const topProductIds = new Set(topProducts.map((product) => product.id))
  const topProductTrend = points.map<AnalyticsProductTrendPoint>((point) => {
    const productPoint: AnalyticsProductTrendPoint = {
      key: point.key,
      label: point.label,
    }

    topProducts.forEach((product) => {
      productPoint[`product_${product.id}`] = 0
    })

    return productPoint
  })
  const topProductTrendByKey = new Map(
    topProductTrend.map((point) => [point.key, point])
  )

  filteredSales.forEach((sale) => {
    const saleDate = toDate(sale.soldAt)
    if (!saleDate) return

    const trendPoint = topProductTrendByKey.get(
      bucketKey(saleDate, granularity)
    )
    if (!trendPoint) return

    sale.items.forEach((item) => {
      if (!topProductIds.has(item.partId)) return

      const seriesKey = `product_${item.partId}`
      trendPoint[seriesKey] = Number(trendPoint[seriesKey] ?? 0) + item.quantity
    })
  })

  return {
    debtPosition: [
      {
        key: "receivable",
        total: receivableTotal,
        paid: Math.max(0, receivableTotal - receivableOutstanding),
        outstanding: receivableOutstanding,
      },
      {
        key: "payable",
        total: payableTotal,
        paid: Math.max(0, payableTotal - payableOutstanding),
        outstanding: payableOutstanding,
      },
    ],
    filteredIncomingStocks,
    filteredOutgoingStocks,
    filteredPayables,
    filteredReceivables,
    filteredSales,
    financialTrend: points,
    inventoryValue: data.parts.reduce(
      (total, part) => total + part.quantity * toNumber(part.price),
      0
    ),
    partsInStock: data.parts.reduce(
      (total, part) => total + Math.max(0, part.quantity),
      0
    ),
    paymentMethods: Array.from(paymentTotals, ([key, value]) => ({
      key,
      value,
    })).sort((first, second) => second.value - first.value),
    receivableBalance: receivableOutstanding,
    salesRevenue: filteredSales.reduce(
      (total, sale) => total + toNumber(sale.totalAmount),
      0
    ),
    stockMovement: points,
    topProductTrend,
    topProducts,
    uniqueProductsSold: productTotals.size,
    unitsSold: filteredSales.reduce(
      (total, sale) =>
        total +
        sale.items.reduce((saleTotal, item) => saleTotal + item.quantity, 0),
      0
    ),
  }
}

function protectSpreadsheetCell(value: string) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value
}

function toCsvCell(value: number | string | null | undefined) {
  const normalized = protectSpreadsheetCell(String(value ?? ""))
  return `"${normalized.replaceAll('"', '""')}"`
}

export function downloadCsv(
  filename: string,
  headers: string[],
  rows: Array<Array<number | string | null | undefined>>
) {
  const csv = [headers, ...rows]
    .map((row) => row.map(toCsvCell).join(","))
    .join("\r\n")
  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = filename
  link.style.display = "none"
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function interpolate(
  template: string,
  values: Record<string, number | string>
) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template
  )
}
