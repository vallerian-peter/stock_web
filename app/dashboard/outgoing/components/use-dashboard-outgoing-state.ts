"use client"

import { useEffect, useEffectEvent, useMemo, useState } from "react"
import { toast } from "sonner"

import { getOutgoingStocks } from "@/api/outgoing_stocks_api"
import { getApiErrorMessage } from "@/lib/api/request"
import type { OutgoingStockResponseDTO } from "@/api/outgoing_stocks_api"
import { toHumanForm } from "@/lib/formatters"
import type { LandingLocale } from "@/lib/landing-content"
import type { UsersSortDirection } from "@/lib/types"

function getCreatedAtTimestamp(createdAt: string) {
  const timestamp = new Date(createdAt).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

export function useDashboardOutgoingState(locale: LandingLocale) {
  const [tableDispatches, setTableDispatches] = useState<OutgoingStockResponseDTO[]>([])
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortDirection, setSortDirection] = useState<UsersSortDirection>("desc")
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  function formatDispatchedAt(dispatchedAt: string) {
    return toHumanForm(dispatchedAt, locale)
  }

  async function fetchAllDispatches() {
    const firstPageResponse = await getOutgoingStocks({
      page: 1,
      perPage: 100,
    })

    const allDispatches = [...firstPageResponse.data]
    const lastPage = firstPageResponse.meta?.last_page ?? 1

    if (lastPage <= 1) {
      return allDispatches
    }

    const remainingResponses = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, index) =>
        getOutgoingStocks({
          page: index + 2,
          perPage: 100,
        })
      )
    )

    remainingResponses.forEach((response) => {
      allDispatches.push(...response.data)
    })

    return allDispatches
  }

  const loadDispatches = useEffectEvent(async () => {
    try {
      setIsLoading(true)
      setLoadError(null)

      const allDispatches = await fetchAllDispatches()
      setTableDispatches(allDispatches)
    } catch (error) {
      const errorMessage = getApiErrorMessage(error)
      setLoadError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  })

  useEffect(() => {
    void loadDispatches()
  }, [])

  const filteredDispatches = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase(locale)

    return tableDispatches
      .filter((dispatch) => {
        const matchesSearch =
          normalizedQuery.length === 0 ||
          [
            dispatch.dispatchNumber ?? "",
            dispatch.recipientName ?? "",
            dispatch.purpose,
            dispatch.dispatchedByName ?? "",
            dispatch.notes ?? "",
          ].some((value) =>
            value.toLocaleLowerCase(locale).includes(normalizedQuery)
          )

        return matchesSearch
      })
      .sort((first, second) => {
        const comparison =
          getCreatedAtTimestamp(first.dispatchedAt) -
          getCreatedAtTimestamp(second.dispatchedAt)

        return sortDirection === "asc" ? comparison : -comparison
      })
  }, [locale, searchQuery, sortDirection, tableDispatches])

  const totalPages = Math.max(1, Math.ceil(filteredDispatches.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pageStartIndex = (safeCurrentPage - 1) * pageSize
  const visibleDispatches = filteredDispatches.slice(
    pageStartIndex,
    pageStartIndex + pageSize
  )
  const firstVisibleDispatch = filteredDispatches.length === 0 ? 0 : pageStartIndex + 1
  const lastVisibleDispatch = Math.min(
    pageStartIndex + pageSize,
    filteredDispatches.length
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

  function prependDispatch(dispatch: OutgoingStockResponseDTO) {
    setTableDispatches((current) => [dispatch, ...current])
  }

  function removeDispatch(id: number) {
    setTableDispatches((current) => current.filter((item) => item.id !== id))
  }

  return {
    changePage,
    filteredDispatches,
    firstVisibleDispatch,
    formatDispatchedAt,
    isLoading,
    lastVisibleDispatch,
    loadError,
    loadDispatches,
    pageSize,
    pageStartIndex,
    prependDispatch,
    removeDispatch,
    safeCurrentPage,
    searchQuery,
    sortDirection,
    tableDispatches,
    totalPages,
    updatePageSize,
    updateSearchQuery,
    updateSortDirection,
    visibleDispatches,
  }
}
