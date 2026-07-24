"use client"

import { useEffect, useEffectEvent, useState } from "react"

import {
  getDashboardSummary,
  type DashboardSummaryDTO,
} from "@/api/dashboard_api"
import { getApiErrorMessage } from "@/lib/api/request"

export function useDashboardOverview() {
  const [summary, setSummary] = useState<DashboardSummaryDTO | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    try {
      setIsLoading(true)
      setError(null)
      setSummary(await getDashboardSummary())
    } catch (loadError) {
      setError(getApiErrorMessage(loadError))
    } finally {
      setIsLoading(false)
    }
  }

  const refreshOnMount = useEffectEvent(refresh)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void refreshOnMount(), 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  return { error, isLoading, refresh, summary }
}
