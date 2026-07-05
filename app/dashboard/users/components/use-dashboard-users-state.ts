"use client"

import { useEffect, useEffectEvent, useMemo, useState } from "react"
import { toast } from "sonner"

import { getUsers } from "@/api/users_api"
import { getApiErrorMessage } from "@/lib/api/request"
import type { UserResponseDTO } from "@/lib/dtos/user_dtos"
import { toHumanForm } from "@/lib/formatters"
import type { LandingLocale } from "@/lib/landing-content"
import type { UsersSortDirection, UsersStatusFilter } from "@/lib/types"

function getCreatedAtTimestamp(createdAt: string) {
  const timestamp = new Date(createdAt).getTime()

  return Number.isNaN(timestamp) ? 0 : timestamp
}

function isProtectedUser(user: UserResponseDTO) {
  return user.role === "admin"
}

export function useDashboardUsersState(locale: LandingLocale) {
  const [tableUsers, setTableUsers] = useState<UserResponseDTO[]>([])
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(
    () => new Set()
  )
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortDirection, setSortDirection] =
    useState<UsersSortDirection>("asc")
  const [statusFilter, setStatusFilter] =
    useState<UsersStatusFilter>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  function formatCreatedAt(createdAt: string) {
    return toHumanForm(createdAt, locale)
  }

  async function fetchAllUsers() {
    const firstPageResponse = await getUsers({
      page: 1,
      perPage: 100,
    })

    const allUsers = [...firstPageResponse.data]
    const lastPage = firstPageResponse.meta?.last_page ?? 1

    if (lastPage <= 1) {
      return allUsers
    }

    const remainingResponses = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, index) =>
        getUsers({
          page: index + 2,
          perPage: 100,
        })
      )
    )

    remainingResponses.forEach((response) => {
      allUsers.push(...response.data)
    })

    return allUsers
  }

  const loadUsers = useEffectEvent(async () => {
    try {
      setIsLoading(true)
      setLoadError(null)

      const allUsers = await fetchAllUsers()
      setTableUsers(allUsers)
      setSelectedUserIds(new Set())
    } catch (error) {
      const errorMessage = getApiErrorMessage(error)
      setLoadError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  })

  useEffect(() => {
    void loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase(locale)

    return tableUsers
      .filter((user) => {
        const matchesStatus =
          statusFilter === "all" || user.status === statusFilter
        const matchesSearch =
          normalizedQuery.length === 0 ||
          [
            user.fullName ?? `${user.firstName} ${user.lastName}`,
            user.email,
            user.phone,
            user.role,
            user.status,
          ].some((value) =>
            value.toLocaleLowerCase(locale).includes(normalizedQuery)
          )

        return matchesStatus && matchesSearch
      })
      .sort((firstUser, secondUser) => {
        const comparison =
          getCreatedAtTimestamp(firstUser.createdAt) -
          getCreatedAtTimestamp(secondUser.createdAt)

        return sortDirection === "asc" ? comparison : -comparison
      })
  }, [locale, searchQuery, sortDirection, statusFilter, tableUsers])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pageStartIndex = (safeCurrentPage - 1) * pageSize
  const visibleUsers = filteredUsers.slice(
    pageStartIndex,
    pageStartIndex + pageSize
  )
  const firstVisibleUser = filteredUsers.length === 0 ? 0 : pageStartIndex + 1
  const lastVisibleUser = Math.min(
    pageStartIndex + pageSize,
    filteredUsers.length
  )
  const visibleUserIds = visibleUsers
    .filter((user) => !isProtectedUser(user))
    .map((user) => user.id)
  const selectedVisibleCount = visibleUserIds.filter((id) =>
    selectedUserIds.has(id)
  ).length
  const allVisibleUsersSelected =
    visibleUserIds.length > 0 && selectedVisibleCount === visibleUserIds.length
  const someVisibleUsersSelected =
    selectedVisibleCount > 0 && !allVisibleUsersSelected
  const selectedUserCount = selectedUserIds.size

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

  function updateStatusFilter(value: UsersStatusFilter) {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  function toggleUserSelection(userId: number, checked: boolean) {
    setSelectedUserIds((currentIds) => {
      const nextIds = new Set(currentIds)

      if (checked) nextIds.add(userId)
      else nextIds.delete(userId)

      return nextIds
    })
  }

  function toggleVisibleUsers(checked: boolean) {
    setSelectedUserIds((currentIds) => {
      const nextIds = new Set(currentIds)

      visibleUserIds.forEach((userId) => {
        if (checked) nextIds.add(userId)
        else nextIds.delete(userId)
      })

      return nextIds
    })
  }

  function changePage(nextPage: number) {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages))
  }

  function prependUser(user: UserResponseDTO) {
    setTableUsers((currentUsers) => [user, ...currentUsers])
  }

  function patchUser(userId: number, nextUser: Partial<UserResponseDTO>) {
    setTableUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId ? { ...user, ...nextUser } : user
      )
    )
  }

  function removeUser(userId: number) {
    setTableUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== userId)
    )
    setSelectedUserIds((currentIds) => {
      const nextIds = new Set(currentIds)
      nextIds.delete(userId)
      return nextIds
    })
  }

  function removeSelectedUsers() {
    setTableUsers((currentUsers) =>
      currentUsers.filter((user) => !selectedUserIds.has(user.id))
    )
    setSelectedUserIds(new Set())
  }

  function removeUsers(userIds: number[]) {
    const selectedIds = new Set(userIds)

    setTableUsers((currentUsers) =>
      currentUsers.filter((user) => !selectedIds.has(user.id))
    )
    setSelectedUserIds((currentIds) => {
      const nextIds = new Set(currentIds)

      userIds.forEach((userId) => nextIds.delete(userId))

      return nextIds
    })
  }

  return {
    allVisibleUsersSelected,
    changePage,
    filteredUsers,
    firstVisibleUser,
    formatCreatedAt,
    isLoading,
    lastVisibleUser,
    loadError,
    loadUsers,
    pageSize,
    pageStartIndex,
    patchUser,
    prependUser,
    removeSelectedUsers,
    removeUser,
    removeUsers,
    safeCurrentPage,
    searchQuery,
    selectedUserCount,
    selectedUserIds,
    someVisibleUsersSelected,
    sortDirection,
    statusFilter,
    tableUsers,
    toggleUserSelection,
    toggleVisibleUsers,
    totalPages,
    updatePageSize,
    updateSearchQuery,
    updateSortDirection,
    updateStatusFilter,
    visibleUsers,
  }
}
