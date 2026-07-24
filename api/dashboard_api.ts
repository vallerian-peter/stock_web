import { methodType } from "@/lib/api/method-type"
import { apiRequest } from "@/lib/api/request"

export type DashboardSummaryDTO = {
  inventory: {
    productCount: number
    quantity: number
    value: string
    lowStockCount: number
    outOfStockCount: number
  }
  monthlyTrends: Array<{
    month: string
    stockIn: number
    stockOut: number
    salesRevenue: string
  }>
  salesOverview: {
    saleCount: number
    totalSales: string
    amountPaid: string
    collectionRate: number
  }
  recentActivities: Array<{
    type: "INCOMING" | "OUTGOING" | "SALE" | "SALE_DISPATCH"
    occurredAt: string
    referenceNumber: string | null
    partyName: string | null
    amount: string | null
    quantity: number
  }>
  alertCounts: {
    dueSoon: number
    lowStock: number
    outOfStock: number
  }
  topProducts: Array<{
    partName: string | null
    partNumber: string | null
    quantity: number
    revenue: string
  }>
}

export async function getDashboardSummary() {
  const response = await apiRequest<{ data: DashboardSummaryDTO }>({
    endpoint: "/dashboard/summary",
    methodType: methodType.GET,
  })

  return response.data
}
