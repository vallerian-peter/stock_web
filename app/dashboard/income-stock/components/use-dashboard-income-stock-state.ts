"use client"

import { useEffect, useEffectEvent, useMemo, useState } from "react"
import { toast } from "sonner"

import { getIncomingStocks } from "@/api/incoming_stocks_api"
import { getApiErrorMessage } from "@/lib/api/request"
import type { IncomingStockResponseDTO } from "@/api/incoming_stocks_api"
import { toHumanForm } from "@/lib/formatters"
import type { LandingLocale } from "@/lib/landing-content"
import type { UsersSortDirection } from "@/lib/types"

function getCreatedAtTimestamp(createdAt: string) {
  const timestamp = new Date(createdAt).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

export function useDashboardIncomeStockState(locale: LandingLocale) {
  const [tableIntakes, setTableIntakes] = useState<IncomingStockResponseDTO[]>([])
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortDirection, setSortDirection] = useState<UsersSortDirection>("desc")
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  function formatReceivedAt(receivedAt: string) {
    return toHumanForm(receivedAt, locale)
  }

  async function fetchAllIntakes() {
    const firstPageResponse = await getIncomingStocks({
      page: 1,
      perPage: 100,
    })

    const allIntakes = [...firstPageResponse.data]
    const lastPage = firstPageResponse.meta?.last_page ?? 1

    if (lastPage <= 1) {
      return allIntakes
    }

    const remainingResponses = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, index) =>
        getIncomingStocks({
          page: index + 2,
          perPage: 100,
        })
      )
    )

    remainingResponses.forEach((response) => {
      allIntakes.push(...response.data)
    })

    return allIntakes
  }

  const loadIntakes = useEffectEvent(async () => {
    try {
      setIsLoading(true)
      setLoadError(null)

      const allIntakes = await fetchAllIntakes()
      setTableIntakes(allIntakes)
    } catch (error) {
      const errorMessage = getApiErrorMessage(error)
      setLoadError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  })

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadIntakes()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  const filteredIntakes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase(locale)

    return tableIntakes
      .filter((intake) => {
        const matchesSearch =
          normalizedQuery.length === 0 ||
          [
            intake.invoiceNumber ?? "",
            intake.supplierName ?? "",
            intake.receivedByName ?? "",
            intake.notes ?? "",
          ].some((value) =>
            value.toLocaleLowerCase(locale).includes(normalizedQuery)
          )

        return matchesSearch
      })
      .sort((firstIntake, secondIntake) => {
        const comparison =
          getCreatedAtTimestamp(firstIntake.receivedAt) -
          getCreatedAtTimestamp(secondIntake.receivedAt)

        return sortDirection === "asc" ? comparison : -comparison
      })
  }, [locale, searchQuery, sortDirection, tableIntakes])

  const totalPages = Math.max(1, Math.ceil(filteredIntakes.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pageStartIndex = (safeCurrentPage - 1) * pageSize
  const visibleIntakes = filteredIntakes.slice(
    pageStartIndex,
    pageStartIndex + pageSize
  )
  const firstVisibleIntake = filteredIntakes.length === 0 ? 0 : pageStartIndex + 1
  const lastVisibleIntake = Math.min(
    pageStartIndex + pageSize,
    filteredIntakes.length
  )

  function updateSearchQuery(value: string) {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  function updatePageSize(value: number) {
    setPageSize(value)
    setCurrentPage(1)
  }

  function updateSortDirection(value: UsersSortDirection) {
    setSortDirection(value)
    setCurrentPage(1)
  }

  function changePage(nextPage: number) {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages))
  }

  function prependIntake(intake: IncomingStockResponseDTO) {
    setTableIntakes((current) => [intake, ...current])
  }

  function removeIntake(id: number) {
    setTableIntakes((current) => current.filter((item) => item.id !== id))
  }

  return {
    changePage,
    filteredIntakes,
    firstVisibleIntake,
    formatReceivedAt,
    isLoading,
    lastVisibleIntake,
    loadError,
    pageSize,
    pageStartIndex,
    prependIntake,
    removeIntake,
    safeCurrentPage,
    searchQuery,
    sortDirection,
    tableIntakes,
    totalPages,
    updatePageSize,
    updateSearchQuery,
    updateSortDirection,
    visibleIntakes,
  }
}
