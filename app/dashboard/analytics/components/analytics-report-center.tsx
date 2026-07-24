"use client"

import {
  ArrowDownToLineIcon,
  ArrowUpDownIcon,
  BadgeDollarSignIcon,
  HandCoinsIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { LandingLocale } from "@/lib/landing-content"

import type { AnalyticsCopy } from "./analytics-copy"
import type { AnalyticsSourceData, AnalyticsSummary } from "./analytics-types"
import { downloadCsv, interpolate } from "./analytics-utils"

type AnalyticsReportCenterProps = {
  copy: AnalyticsCopy
  data: AnalyticsSourceData
  locale: LandingLocale
  summary: AnalyticsSummary
}

function reportDate(value: string | null | undefined) {
  if (!value) return ""

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return [
    String(date.getDate()).padStart(2, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    date.getFullYear(),
  ].join("/")
}

export function AnalyticsReportCenter({
  copy,
  data,
  locale,
  summary,
}: AnalyticsReportCenterProps) {
  const c = copy.csv
  const filenameDate = new Date().toISOString().slice(0, 10)
  const localizeValue = (value: string | null | undefined) => {
    if (!value) return ""

    return value in c.values ? c.values[value as keyof typeof c.values] : value
  }
  const localizePaymentMethod = (value: string | null | undefined) => {
    const key = value?.trim().toUpperCase() || "UNKNOWN"
    return key in copy.paymentMethods
      ? copy.paymentMethods[key as keyof typeof copy.paymentMethods]
      : copy.paymentMethods.OTHER
  }

  // IDs are used only to resolve relationships; exported cells stay human-readable.
  const salesById = new Map(data.sales.map((sale) => [sale.id, sale]))
  const salesByOutgoingStockId = new Map(
    data.sales
      .filter((sale) => sale.outgoingStockId !== null)
      .map((sale) => [sale.outgoingStockId, sale])
  )
  const incomingStocksById = new Map(
    data.incomingStocks.map((record) => [record.id, record])
  )
  const payableByIncomingStockId = new Map(
    data.payables
      .filter((record) => record.incomingStockId !== null)
      .map((record) => [record.incomingStockId, record])
  )

  const salesRows = summary.filteredSales.flatMap((sale) => {
    const items = sale.items.length > 0 ? sale.items : [null]

    return items.map((item) => [
      reportDate(sale.soldAt),
      sale.saleNumber,
      sale.customerName,
      localizeValue(sale.paymentStatus),
      localizePaymentMethod(sale.paymentMethod),
      item?.partNumber,
      item?.partName,
      item?.quantity,
      item?.unitPrice,
      item?.subtotal,
      sale.totalAmount,
      sale.amountPaid,
      sale.soldByName,
      sale.notes,
    ])
  })

  const incomingMovementRows = summary.filteredIncomingStocks.flatMap(
    (record) => {
      const items = record.items.length > 0 ? record.items : [null]
      const payable = payableByIncomingStockId.get(record.id)

      return items.map((item) => [
        reportDate(record.receivedAt),
        c.incoming,
        record.invoiceNumber,
        payable?.referenceNumber,
        record.supplierName,
        c.incoming,
        item?.partNumber,
        item?.partName,
        item?.quantity,
        item?.unitCost,
        "",
        item?.subtotal,
        record.totalAmount,
        record.receivedByName,
        record.notes,
      ])
    }
  )

  const outgoingMovementRows = summary.filteredOutgoingStocks.flatMap(
    (record) => {
      const linkedSale =
        (record.sale ? salesById.get(record.sale.id) : undefined) ??
        salesByOutgoingStockId.get(record.id)
      const items = record.items.length > 0 ? record.items : [null]

      return items.map((item) => {
        const saleItem = item
          ? linkedSale?.items.find(
              (candidate) => candidate.partId === item.partId
            )
          : undefined

        return [
          reportDate(record.dispatchedAt),
          c.outgoing,
          record.dispatchNumber,
          linkedSale?.saleNumber,
          linkedSale?.customerName ?? record.recipientName,
          localizeValue(record.purpose),
          item?.partNumber,
          item?.partName,
          item?.quantity,
          "",
          saleItem?.unitPrice,
          saleItem?.subtotal,
          linkedSale?.totalAmount ?? record.sale?.totalAmount,
          record.dispatchedByName,
          record.notes,
        ]
      })
    }
  )

  const debtRows = [
    ...summary.filteredReceivables.map((record) => {
      const linkedSale =
        record.saleId === null ? undefined : salesById.get(record.saleId)

      return [
        c.receivable,
        reportDate(record.debtDate ?? record.createdAt),
        record.referenceNumber,
        linkedSale?.saleNumber,
        record.customerName,
        "",
        record.customerPhone,
        record.totalAmount,
        record.amountPaid,
        record.balanceAmount,
        localizeValue(record.status),
        reportDate(record.dueDate),
        record.createdByName,
        record.notes,
      ]
    }),
    ...summary.filteredPayables.map((record) => {
      const linkedIncomingStock =
        record.incomingStockId === null
          ? undefined
          : incomingStocksById.get(record.incomingStockId)

      return [
        c.payable,
        reportDate(record.debtDate ?? record.createdAt),
        record.referenceNumber,
        linkedIncomingStock?.invoiceNumber,
        "",
        record.creditorName,
        record.creditorPhone,
        record.totalAmount,
        record.amountPaid,
        record.balanceAmount,
        localizeValue(record.status),
        reportDate(record.dueDate),
        record.createdByName,
        record.notes,
      ]
    }),
  ]

  const reports = [
    {
      key: "sales",
      title: copy.reports.sales.title,
      description: copy.reports.sales.description,
      note: copy.reports.periodNote,
      rows: salesRows.length,
      Icon: BadgeDollarSignIcon,
      download: () =>
        downloadCsv(
          `sales-report-${filenameDate}.csv`,
          [
            c.date,
            c.reference,
            c.customer,
            c.status,
            c.paymentMethod,
            c.partNumber,
            c.partName,
            c.quantity,
            c.unitPrice,
            c.lineTotal,
            c.totalAmount,
            c.amountPaid,
            c.handledBy,
            c.notes,
          ],
          salesRows
        ),
    },
    {
      key: "inventory",
      title: copy.reports.inventory.title,
      description: copy.reports.inventory.description,
      note: copy.reports.snapshotNote,
      rows: data.parts.length,
      Icon: ArrowDownToLineIcon,
      download: () =>
        downloadCsv(
          `inventory-report-${filenameDate}.csv`,
          [
            c.partNumber,
            c.partName,
            c.category,
            c.quantity,
            c.unitPrice,
            c.stockValue,
            c.status,
          ],
          data.parts.map((part) => [
            part.partNumber,
            part.partName,
            part.categoryName,
            part.quantity,
            part.price,
            part.quantity * Number(part.price),
            localizeValue(part.status),
          ])
        ),
    },
    {
      key: "movements",
      title: copy.reports.movements.title,
      description: copy.reports.movements.description,
      note: copy.reports.periodNote,
      rows: incomingMovementRows.length + outgoingMovementRows.length,
      Icon: ArrowUpDownIcon,
      download: () =>
        downloadCsv(
          `stock-movement-report-${filenameDate}.csv`,
          [
            c.date,
            c.direction,
            c.reference,
            c.relatedDocument,
            c.relatedParty,
            c.purpose,
            c.partNumber,
            c.partName,
            c.quantity,
            c.unitCost,
            c.unitPrice,
            c.lineTotal,
            c.totalAmount,
            c.handledBy,
            c.notes,
          ],
          [...incomingMovementRows, ...outgoingMovementRows]
        ),
    },
    {
      key: "debts",
      title: copy.reports.debts.title,
      description: copy.reports.debts.description,
      note: copy.reports.periodNote,
      rows: debtRows.length,
      Icon: HandCoinsIcon,
      download: () =>
        downloadCsv(
          `debt-report-${filenameDate}.csv`,
          [
            c.type,
            c.date,
            c.reference,
            c.relatedDocument,
            c.customer,
            c.creditor,
            c.contact,
            c.totalAmount,
            c.amountPaid,
            c.balance,
            c.status,
            c.dueDate,
            c.handledBy,
            c.notes,
          ],
          debtRows
        ),
    },
  ]

  function handleDownload(report: (typeof reports)[number]) {
    try {
      report.download()
      toast.success(
        interpolate(copy.reports.success, {
          name: report.title,
        })
      )
    } catch {
      toast.error(copy.reports.error)
    }
  }

  return (
    <section>
      <Card className="gap-0 overflow-hidden rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/20 px-5 py-5 sm:px-6">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-orange-600 uppercase">
            {copy.reports.eyebrow}
          </p>
          <CardTitle className="mt-1 text-lg font-semibold">
            {copy.reports.title}
          </CardTitle>
          <CardDescription className="max-w-2xl">
            {copy.reports.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4">
          {reports.map((report) => (
            <div
              key={report.key}
              className="flex min-h-56 flex-col rounded-2xl border border-border/60 bg-background p-4 transition-colors hover:border-orange-500/35"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950">
                  <report.Icon className="size-4" />
                </span>
                <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
                  {interpolate(copy.reports.rows, {
                    count: report.rows.toLocaleString(
                      locale === "sw" ? "sw-TZ" : "en-TZ"
                    ),
                  })}
                </span>
              </div>
              <h3 className="mt-4 text-[13px] font-semibold">{report.title}</h3>
              <p className="mt-1 flex-1 text-[11px] leading-5 text-muted-foreground">
                {report.description}
              </p>
              <p className="my-3 text-[10px] text-muted-foreground">
                {report.note}
              </p>
              <Button
                variant="outline"
                className="w-full justify-between rounded-xl"
                onClick={() => handleDownload(report)}
              >
                {copy.reports.download}
                <ArrowDownToLineIcon data-icon="inline-end" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
