"use client"

import { useEffect, useEffectEvent, useMemo, useState } from "react"
import { toast } from "sonner"

import {
  getReceivables,
  type ReceivableResponseDTO,
} from "@/api/receivables_api"
import { getApiErrorMessage } from "@/lib/api/request"
import type { LandingLocale } from "@/lib/landing-content"
import type { UsersSortDirection } from "@/lib/types"
import {
  calculateDebtStats,
  matchesDebtDueFilter,
} from "../../components/debt-filter-utils"
import type {
  DebtDueFilter,
  DueWindowDays,
} from "../../components/debt-feature-types"

export function useDashboardReceivableState(locale: LandingLocale) {
  const [records, setRecords] = useState<ReceivableResponseDTO[]>([])
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortDirection, setSortDirection] = useState<UsersSortDirection>("desc")
  const [dueFilter, setDueFilter] = useState<DebtDueFilter>("all")
  const [statsDueWindow, setStatsDueWindow] = useState<DueWindowDays>(3)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const loadRecords = useEffectEvent(async () => {
    try {
      setIsLoading(true)
      setLoadError(null)
      const firstPage = await getReceivables(1, 100)
      const allRecords = [...firstPage.data]
      const lastPage = firstPage.meta?.last_page ?? 1
      const remaining = await Promise.all(
        Array.from({ length: Math.max(0, lastPage - 1) }, (_, index) =>
          getReceivables(index + 2, 100)
        )
      )
      remaining.forEach((response) => allRecords.push(...response.data))
      setRecords(allRecords)
    } catch (error) {
      const message = getApiErrorMessage(error)
      setLoadError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  })

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadRecords(), 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase(locale)
    return records
      .filter((record) => {
        const matchesSearch =
          query.length === 0 ||
          [
            record.customerName,
            record.customerPhone ?? "",
            record.referenceNumber ?? "",
            record.status,
            record.createdByName ?? "",
            record.notes ?? "",
          ].some((value) => value.toLocaleLowerCase(locale).includes(query))

        return matchesSearch && matchesDebtDueFilter(record, dueFilter)
      })
      .sort((first, second) => {
        const comparison =
          new Date(first.createdAt).getTime() -
          new Date(second.createdAt).getTime()
        return sortDirection === "asc" ? comparison : -comparison
      })
  }, [dueFilter, locale, records, searchQuery, sortDirection])

  const stats = useMemo(
    () => calculateDebtStats(records, statsDueWindow),
    [records, statsDueWindow]
  )

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pageStartIndex = (safeCurrentPage - 1) * pageSize
  const visibleRecords = filteredRecords.slice(
    pageStartIndex,
    pageStartIndex + pageSize
  )

  return {
    changePage: (page: number) =>
      setCurrentPage(Math.min(Math.max(page, 1), totalPages)),
    filteredRecords,
    dueFilter,
    firstVisibleRecord: filteredRecords.length ? pageStartIndex + 1 : 0,
    isLoading,
    lastVisibleRecord: Math.min(
      pageStartIndex + pageSize,
      filteredRecords.length
    ),
    loadError,
    pageSize,
    pageStartIndex,
    prependRecord: (record: ReceivableResponseDTO) =>
      setRecords((current) => [record, ...current]),
    records,
    removeRecord: (id: number) =>
      setRecords((current) => current.filter((record) => record.id !== id)),
    safeCurrentPage,
    searchQuery,
    sortDirection,
    stats,
    statsDueWindow,
    totalPages,
    updatePageSize: (value: number) => {
      setPageSize(value)
      setCurrentPage(1)
    },
    updateDueFilter: (value: DebtDueFilter) => {
      setDueFilter(value)
      setCurrentPage(1)
    },
    updateSearchQuery: (value: string) => {
      setSearchQuery(value)
      setCurrentPage(1)
    },
    updateSortDirection: (value: UsersSortDirection) => {
      setSortDirection(value)
      setCurrentPage(1)
    },
    updateStatsDueWindow: setStatsDueWindow,
    visibleRecords,
  }
}
