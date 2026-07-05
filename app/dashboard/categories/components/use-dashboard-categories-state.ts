"use client"

import { useEffect, useEffectEvent, useMemo, useState } from "react"
import { toast } from "sonner"

import { getCategories } from "@/api/categories_api"
import { getApiErrorMessage } from "@/lib/api/request"
import type { CategoryResponseDTO } from "@/lib/dtos/category_dtos"
import { toHumanForm } from "@/lib/formatters"
import type { LandingLocale } from "@/lib/landing-content"
import type { CategoriesSortDirection } from "@/lib/types"

function getCreatedAtTimestamp(createdAt: string) {
  const timestamp = new Date(createdAt).getTime()

  return Number.isNaN(timestamp) ? 0 : timestamp
}

export function useDashboardCategoriesState(locale: LandingLocale) {
  const [tableCategories, setTableCategories] = useState<CategoryResponseDTO[]>(
    []
  )
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<number>>(
    () => new Set()
  )
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortDirection, setSortDirection] =
    useState<CategoriesSortDirection>("asc")
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  function formatCreatedAt(createdAt: string) {
    return toHumanForm(createdAt, locale)
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

  const loadCategories = useEffectEvent(async () => {
    try {
      setIsLoading(true)
      setLoadError(null)

      const allCategories = await fetchAllCategories()
      setTableCategories(allCategories)
      setSelectedCategoryIds(new Set())
    } catch (error) {
      const errorMessage = getApiErrorMessage(error)
      setLoadError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  })

  useEffect(() => {
    void loadCategories()
  }, [])

  const filteredCategories = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase(locale)

    return tableCategories
      .filter((category) => {
        return (
          normalizedQuery.length === 0 ||
          category.name.toLocaleLowerCase(locale).includes(normalizedQuery)
        )
      })
      .sort((firstCategory, secondCategory) => {
        const comparison =
          getCreatedAtTimestamp(firstCategory.createdAt) -
          getCreatedAtTimestamp(secondCategory.createdAt)

        return sortDirection === "asc" ? comparison : -comparison
      })
  }, [locale, searchQuery, sortDirection, tableCategories])

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pageStartIndex = (safeCurrentPage - 1) * pageSize
  const visibleCategories = filteredCategories.slice(
    pageStartIndex,
    pageStartIndex + pageSize
  )
  const firstVisibleCategory =
    filteredCategories.length === 0 ? 0 : pageStartIndex + 1
  const lastVisibleCategory = Math.min(
    pageStartIndex + pageSize,
    filteredCategories.length
  )
  const visibleCategoryIds = visibleCategories.map((category) => category.id)
  const selectedVisibleCount = visibleCategoryIds.filter((id) =>
    selectedCategoryIds.has(id)
  ).length
  const allVisibleCategoriesSelected =
    visibleCategoryIds.length > 0 &&
    selectedVisibleCount === visibleCategoryIds.length
  const someVisibleCategoriesSelected =
    selectedVisibleCount > 0 && !allVisibleCategoriesSelected
  const selectedCategoryCount = selectedCategoryIds.size

  function updateSearchQuery(value: string) {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  function updatePageSize(value: number) {
    setPageSize(value)
    setCurrentPage(1)
  }

  function updateSortDirection(value: CategoriesSortDirection) {
    setSortDirection(value)
    setCurrentPage(1)
  }

  function toggleCategorySelection(categoryId: number, checked: boolean) {
    setSelectedCategoryIds((currentIds) => {
      const nextIds = new Set(currentIds)

      if (checked) nextIds.add(categoryId)
      else nextIds.delete(categoryId)

      return nextIds
    })
  }

  function toggleVisibleCategories(checked: boolean) {
    setSelectedCategoryIds((currentIds) => {
      const nextIds = new Set(currentIds)

      visibleCategoryIds.forEach((categoryId) => {
        if (checked) nextIds.add(categoryId)
        else nextIds.delete(categoryId)
      })

      return nextIds
    })
  }

  function changePage(nextPage: number) {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages))
  }

  function prependCategory(category: CategoryResponseDTO) {
    setTableCategories((currentCategories) => [category, ...currentCategories])
  }

  function patchCategory(
    categoryId: number,
    nextCategory: Partial<CategoryResponseDTO>
  ) {
    setTableCategories((currentCategories) =>
      currentCategories.map((category) =>
        category.id === categoryId ? { ...category, ...nextCategory } : category
      )
    )
  }

  function removeCategory(categoryId: number) {
    setTableCategories((currentCategories) =>
      currentCategories.filter((category) => category.id !== categoryId)
    )
    setSelectedCategoryIds((currentIds) => {
      const nextIds = new Set(currentIds)
      nextIds.delete(categoryId)
      return nextIds
    })
  }

  function removeCategories(categoryIds: number[]) {
    const selectedIds = new Set(categoryIds)

    setTableCategories((currentCategories) =>
      currentCategories.filter((category) => !selectedIds.has(category.id))
    )
    setSelectedCategoryIds((currentIds) => {
      const nextIds = new Set(currentIds)

      categoryIds.forEach((categoryId) => nextIds.delete(categoryId))

      return nextIds
    })
  }

  return {
    allVisibleCategoriesSelected,
    changePage,
    filteredCategories,
    firstVisibleCategory,
    formatCreatedAt,
    isLoading,
    lastVisibleCategory,
    loadCategories,
    loadError,
    pageSize,
    pageStartIndex,
    patchCategory,
    prependCategory,
    removeCategories,
    removeCategory,
    safeCurrentPage,
    searchQuery,
    selectedCategoryCount,
    selectedCategoryIds,
    someVisibleCategoriesSelected,
    sortDirection,
    tableCategories,
    toggleCategorySelection,
    toggleVisibleCategories,
    totalPages,
    updatePageSize,
    updateSearchQuery,
    updateSortDirection,
    visibleCategories,
  }
}
