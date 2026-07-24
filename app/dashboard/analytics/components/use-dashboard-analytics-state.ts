"use client"

import { useEffect, useEffectEvent, useMemo, useState } from "react"
import { toast } from "sonner"

import { getIncomingStocks } from "@/api/incoming_stocks_api"
import { getOutgoingStocks } from "@/api/outgoing_stocks_api"
import { getParts } from "@/api/parts_api"
import { getPayables } from "@/api/payables_api"
import { getReceivables } from "@/api/receivables_api"
import { getSales } from "@/api/sales_api"
import { getApiErrorMessage } from "@/lib/api/request"
import type { LandingLocale } from "@/lib/landing-content"
import type { PaginatedApiResponse } from "@/lib/types"

import type { AnalyticsRange, AnalyticsSourceData } from "./analytics-types"
import { buildAnalyticsSummary } from "./analytics-utils"

const EMPTY_DATA: AnalyticsSourceData = {
  incomingStocks: [],
  outgoingStocks: [],
  parts: [],
  payables: [],
  receivables: [],
  sales: [],
}

async function fetchAllPages<T>(
  fetchPage: (page: number) => Promise<PaginatedApiResponse<T>>
) {
  const firstResponse = await fetchPage(1)
  const records = [...firstResponse.data]
  const lastPage = firstResponse.meta?.last_page ?? 1

  if (lastPage > 1) {
    const remainingResponses = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, index) => fetchPage(index + 2))
    )
    remainingResponses.forEach((response) => records.push(...response.data))
  }

  return records
}

export function useDashboardAnalyticsState(locale: LandingLocale) {
  const [data, setData] = useState<AnalyticsSourceData>(EMPTY_DATA)
  const [range, setRange] = useState<AnalyticsRange>("30")
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  async function loadAnalytics() {
    try {
      setIsLoading(true)
      setLoadError(null)

      const [
        parts,
        sales,
        incomingStocks,
        outgoingStocks,
        payables,
        receivables,
      ] = await Promise.all([
        fetchAllPages((page) => getParts({ page, perPage: 100 })),
        fetchAllPages((page) => getSales({ page, perPage: 100 })),
        fetchAllPages((page) => getIncomingStocks({ page, perPage: 100 })),
        fetchAllPages((page) => getOutgoingStocks({ page, perPage: 100 })),
        fetchAllPages((page) => getPayables(page, 100)),
        fetchAllPages((page) => getReceivables(page, 100)),
      ])

      setData({
        incomingStocks,
        outgoingStocks,
        parts,
        payables,
        receivables,
        sales,
      })
    } catch (error) {
      const message = getApiErrorMessage(error)
      setLoadError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const loadAnalyticsOnMount = useEffectEvent(loadAnalytics)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadAnalyticsOnMount(), 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  const summary = useMemo(
    () => buildAnalyticsSummary(data, range, locale),
    [data, locale, range]
  )

  return {
    data,
    isLoading,
    loadAnalytics,
    loadError,
    range,
    setRange,
    summary,
  }
}
