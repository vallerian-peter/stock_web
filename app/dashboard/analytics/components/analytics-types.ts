import type { IncomingStockResponseDTO } from "@/api/incoming_stocks_api"
import type { OutgoingStockResponseDTO } from "@/api/outgoing_stocks_api"
import type { PayableResponseDTO } from "@/api/payables_api"
import type { ReceivableResponseDTO } from "@/api/receivables_api"
import type { SaleResponseDTO } from "@/api/sales_api"
import type { PartResponseDTO } from "@/lib/dtos/part_dtos"

export type AnalyticsRange = "30" | "90" | "180" | "365" | "all"

export type AnalyticsSourceData = {
  incomingStocks: IncomingStockResponseDTO[]
  outgoingStocks: OutgoingStockResponseDTO[]
  parts: PartResponseDTO[]
  payables: PayableResponseDTO[]
  receivables: ReceivableResponseDTO[]
  sales: SaleResponseDTO[]
}

export type AnalyticsTrendPoint = {
  key: string
  label: string
  cost: number
  revenue: number
  stockIn: number
  stockOut: number
}

export type AnalyticsProductTrendPoint = {
  key: string
  label: string
  [seriesKey: string]: number | string
}

export type AnalyticsSummary = {
  debtPosition: Array<{
    key: "receivable" | "payable"
    paid: number
    outstanding: number
    total: number
  }>
  filteredIncomingStocks: IncomingStockResponseDTO[]
  filteredOutgoingStocks: OutgoingStockResponseDTO[]
  filteredPayables: PayableResponseDTO[]
  filteredReceivables: ReceivableResponseDTO[]
  filteredSales: SaleResponseDTO[]
  financialTrend: AnalyticsTrendPoint[]
  inventoryValue: number
  partsInStock: number
  paymentMethods: Array<{
    key: string
    value: number
  }>
  receivableBalance: number
  salesRevenue: number
  stockMovement: AnalyticsTrendPoint[]
  topProductTrend: AnalyticsProductTrendPoint[]
  topProducts: Array<{
    id: number
    name: string
    quantity: number
    revenue: number
  }>
  uniqueProductsSold: number
  unitsSold: number
}
