"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { getCategories } from "@/api/categories_api"
import { getParts } from "@/api/parts_api"
import { getApiErrorMessage } from "@/lib/api/request"
import type { CategoryResponseDTO } from "@/lib/dtos/category_dtos"
import type { PartResponseDTO } from "@/lib/dtos/part_dtos"
import { formatCurrencyTZS, toHumanForm } from "@/lib/formatters"
import type { LandingLocale } from "@/lib/landing-content"
import type {
  PartsSortDirection,
  PartsStatusFilter,
} from "@/lib/types"

function getCreatedAtTimestamp(createdAt: string) {
  const timestamp = new Date(createdAt).getTime()

  return Number.isNaN(timestamp) ? 0 : timestamp
}

async function fetchAllCategories() {
  const firstPageResponse = await getCategories({
    page: 1,
    perPage: 100,
  })

  const allCategories = [...firstPageResponse.data]
  const lastPage = firstPageResponse.meta?.last_page ?? 1

  if (lastPage <= 1) {
    return allCategories
  }

  const remainingResponses = await Promise.all(
    Array.from({ length: lastPage - 1 }, (_, index) =>
      getCategories({
        page: index + 2,
        perPage: 100,
      })
    )
  )

  remainingResponses.forEach((response) => {
    allCategories.push(...response.data)
  })

  return allCategories
}

export function useDashboardPartsState(locale: LandingLocale) {
  const [tableParts, setTableParts] = useState<PartResponseDTO[]>([])
  const [categories, setCategories] = useState<CategoryResponseDTO[]>([])
  const [selectedPartIds, setSelectedPartIds] = useState<Set<number>>(
    () => new Set()
  )
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortDirection, setSortDirection] = useState<PartsSortDirection>("asc")
  const [statusFilter, setStatusFilter] = useState<PartsStatusFilter>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  function formatCreatedAt(createdAt: string) {
    return toHumanForm(createdAt, locale)
  }

  function formatPrice(price: string) {
    return formatCurrencyTZS(price, locale)
  }

  async function fetchAllParts() {
    const firstPageResponse = await getParts({
      page: 1,
      perPage: 100,
    })

    const allParts = [...firstPageResponse.data]
    const lastPage = firstPageResponse.meta?.last_page ?? 1

    if (lastPage <= 1) {
      return allParts
    }

    const remainingResponses = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, index) =>
        getParts({
          page: index + 2,
          perPage: 100,
        })
      )
    )

    remainingResponses.forEach((response) => {
      allParts.push(...response.data)
    })

    return allParts
  }

  async function fetchAndStoreParts() {
    const [allParts, allCategories] = await Promise.all([
      fetchAllParts(),
      fetchAllCategories(),
    ])

    setTableParts(allParts)
    setCategories(allCategories)
    setSelectedPartIds(new Set())
  }

  async function loadParts() {
    try {
      setIsLoading(true)
      setLoadError(null)
      await fetchAndStoreParts()
    } catch (error) {
      const errorMessage = getApiErrorMessage(error)
      setLoadError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isActive = true

    async function initializeParts() {
      try {
        const [allParts, allCategories] = await Promise.all([
          fetchAllParts(),
          fetchAllCategories(),
        ])

        if (!isActive) {
          return
        }

        setTableParts(allParts)
        setCategories(allCategories)
        setSelectedPartIds(new Set())
      } catch (error) {
        if (!isActive) {
          return
        }

        const errorMessage = getApiErrorMessage(error)
        setLoadError(errorMessage)
        toast.error(errorMessage)
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void initializeParts()

    return () => {
      isActive = false
    }
  }, [])

  const filteredParts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase(locale)

    return tableParts
      .filter((part) => {
        const matchesStatus =
          statusFilter === "all" || part.status === statusFilter
        const matchesSearch =
          normalizedQuery.length === 0 ||
          [
            part.partName,
            part.partNumber,
            part.categoryName ?? "",
            part.status,
          ].some((value) =>
            value.toLocaleLowerCase(locale).includes(normalizedQuery)
          )

        return matchesStatus && matchesSearch
      })
      .sort((firstPart, secondPart) => {
        const comparison =
          getCreatedAtTimestamp(firstPart.createdAt) -
          getCreatedAtTimestamp(secondPart.createdAt)

        return sortDirection === "asc" ? comparison : -comparison
      })
  }, [locale, searchQuery, sortDirection, statusFilter, tableParts])

  const totalPages = Math.max(1, Math.ceil(filteredParts.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pageStartIndex = (safeCurrentPage - 1) * pageSize
  const visibleParts = filteredParts.slice(
    pageStartIndex,
    pageStartIndex + pageSize
  )
  const firstVisiblePart =
    filteredParts.length === 0 ? 0 : pageStartIndex + 1
  const lastVisiblePart = Math.min(
    pageStartIndex + pageSize,
    filteredParts.length
  )
  const visiblePartIds = visibleParts.map((part) => part.id)
  const selectedVisibleCount = visiblePartIds.filter((id) =>
    selectedPartIds.has(id)
  ).length
  const allVisiblePartsSelected =
    visiblePartIds.length > 0 &&
    selectedVisibleCount === visiblePartIds.length
  const someVisiblePartsSelected =
    selectedVisibleCount > 0 && !allVisiblePartsSelected
  const selectedPartCount = selectedPartIds.size

  function updateSearchQuery(value: string) {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  function updatePageSize(value: number) {
    setPageSize(value)
    setCurrentPage(1)
  }

  function updateSortDirection(value: PartsSortDirection) {
    setSortDirection(value)
    setCurrentPage(1)
  }

  function updateStatusFilter(value: PartsStatusFilter) {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  function togglePartSelection(partId: number, checked: boolean) {
    setSelectedPartIds((currentIds) => {
      const nextIds = new Set(currentIds)

      if (checked) nextIds.add(partId)
      else nextIds.delete(partId)

      return nextIds
    })
  }

  function toggleVisibleParts(checked: boolean) {
    setSelectedPartIds((currentIds) => {
      const nextIds = new Set(currentIds)

      visiblePartIds.forEach((partId) => {
        if (checked) nextIds.add(partId)
        else nextIds.delete(partId)
      })

      return nextIds
    })
  }

  function changePage(nextPage: number) {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages))
  }

  function prependPart(part: PartResponseDTO) {
    setTableParts((currentParts) => [part, ...currentParts])
  }

  function patchPart(
    partId: number,
    nextPart: Partial<PartResponseDTO>
  ) {
    setTableParts((currentParts) =>
      currentParts.map((part) =>
        part.id === partId ? { ...part, ...nextPart } : part
      )
    )
  }

  function removePart(partId: number) {
    setTableParts((currentParts) =>
      currentParts.filter((part) => part.id !== partId)
    )
    setSelectedPartIds((currentIds) => {
      const nextIds = new Set(currentIds)
      nextIds.delete(partId)
      return nextIds
    })
  }

  function removeParts(partIds: number[]) {
    const selectedIds = new Set(partIds)

    setTableParts((currentParts) =>
      currentParts.filter((part) => !selectedIds.has(part.id))
    )
    setSelectedPartIds((currentIds) => {
      const nextIds = new Set(currentIds)

      partIds.forEach((partId) => nextIds.delete(partId))

      return nextIds
    })
  }

  return {
    allVisiblePartsSelected,
    categories,
    changePage,
    filteredParts,
    firstVisiblePart,
    formatCreatedAt,
    formatPrice,
    isLoading,
    lastVisiblePart,
    loadError,
    loadParts,
    pageSize,
    pageStartIndex,
    patchPart,
    prependPart,
    removePart,
    removeParts,
    safeCurrentPage,
    searchQuery,
    selectedPartCount,
    selectedPartIds,
    someVisiblePartsSelected,
    sortDirection,
    statusFilter,
    tableParts,
    togglePartSelection,
    toggleVisibleParts,
    totalPages,
    updatePageSize,
    updateSearchQuery,
    updateSortDirection,
    updateStatusFilter,
    visibleParts,
  }
}
