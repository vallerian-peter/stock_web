"use client"

import { useEffect, useEffectEvent, useMemo, useState } from "react"
import { toast } from "sonner"

import { getSales } from "@/api/sales_api"
import { getApiErrorMessage } from "@/lib/api/request"
import type { SaleResponseDTO } from "@/api/sales_api"
import { toHumanForm } from "@/lib/formatters"
import type { LandingLocale } from "@/lib/landing-content"
import type { UsersSortDirection } from "@/lib/types"

function getCreatedAtTimestamp(createdAt: string) {
  const timestamp = new Date(createdAt).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

export function useDashboardSalesState(locale: LandingLocale) {
  const [tableSales, setTableSales] = useState<SaleResponseDTO[]>([])
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortDirection, setSortDirection] = useState<UsersSortDirection>("desc")
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  function formatSoldAt(soldAt: string) {
    return toHumanForm(soldAt, locale)
  }

  async function fetchAllSales() {
    const firstPageResponse = await getSales({
      page: 1,
      perPage: 100,
    })

    const allSales = [...firstPageResponse.data]
    const lastPage = firstPageResponse.meta?.last_page ?? 1

    if (lastPage <= 1) {
      return allSales
    }

    const remainingResponses = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, index) =>
        getSales({
          page: index + 2,
          perPage: 100,
        })
      )
    )

    remainingResponses.forEach((response) => {
      allSales.push(...response.data)
    })

    return allSales
  }

  const loadSales = useEffectEvent(async () => {
    try {
      setIsLoading(true)
      setLoadError(null)

      const allSales = await fetchAllSales()
      setTableSales(allSales)
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
      void loadSales()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  const filteredSales = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase(locale)

    return tableSales
      .filter((sale) => {
        const matchesSearch =
          normalizedQuery.length === 0 ||
          [
            sale.saleNumber ?? "",
            sale.customerName ?? "",
            sale.paymentStatus,
            sale.paymentMethod ?? "",
            sale.soldByName ?? "",
            sale.notes ?? "",
          ].some((value) =>
            value.toLocaleLowerCase(locale).includes(normalizedQuery)
          )

        return matchesSearch
      })
      .sort((first, second) => {
        const comparison =
          getCreatedAtTimestamp(first.soldAt) -
          getCreatedAtTimestamp(second.soldAt)

        return sortDirection === "asc" ? comparison : -comparison
      })
  }, [locale, searchQuery, sortDirection, tableSales])

  const totalPages = Math.max(1, Math.ceil(filteredSales.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pageStartIndex = (safeCurrentPage - 1) * pageSize
  const visibleSales = filteredSales.slice(
    pageStartIndex,
    pageStartIndex + pageSize
  )
  const firstVisibleSale = filteredSales.length === 0 ? 0 : pageStartIndex + 1
  const lastVisibleSale = Math.min(
    pageStartIndex + pageSize,
    filteredSales.length
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

  function prependSale(sale: SaleResponseDTO) {
    setTableSales((current) => [sale, ...current])
  }

  function removeSale(id: number) {
    setTableSales((current) => current.filter((item) => item.id !== id))
  }

  return {
    changePage,
    filteredSales,
    firstVisibleSale,
    formatSoldAt,
    isLoading,
    lastVisibleSale,
    loadError,
    pageSize,
    pageStartIndex,
    prependSale,
    removeSale,
    safeCurrentPage,
    searchQuery,
    sortDirection,
    tableSales,
    totalPages,
    updatePageSize,
    updateSearchQuery,
    updateSortDirection,
    visibleSales,
  }
}
