"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { deleteUser, registerUser, updateUser } from "@/api/users_api"
import { useConfirmAlertDialog } from "@/components/confirm-alert-dialog-provider"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { useLandingLocale } from "@/components/landing-locale-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyTitle,
} from "@/components/ui/empty"
import type { UserResponseDTO } from "@/lib/dtos/user_dtos"
import { landingContent } from "@/lib/landing-content"
import type { ActiveUserDialog } from "@/lib/types"

import { DashboardUsersPagination } from "./dashboard-users-pagination"
import { DashboardUsersTable } from "./dashboard-users-table"
import { DashboardUsersToolbar } from "./dashboard-users-toolbar"
import { userDialogCopy } from "./user-dialog-copy"
import { UserFormDialog } from "./user-form-dialog"
import type { UserFormValues } from "./user-schema"
import { UserViewDialog } from "./user-view-dialog"
import { useDashboardUsersState } from "./use-dashboard-users-state"

function isProtectedUser(user: UserResponseDTO) {
  return user.role === "admin"
}

export function DashboardUsersPage() {
  const { locale } = useLandingLocale()
  const confirm = useConfirmAlertDialog()
  const copy = landingContent[locale].dashboardUsers
  const dialogCopy = userDialogCopy[locale]
  const [activeDialog, setActiveDialog] = useState<ActiveUserDialog>(null)

  const {
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
  } = useDashboardUsersState(locale)

  async function handleDeleteUser(userPendingDelete: UserResponseDTO) {
    if (isProtectedUser(userPendingDelete)) {
      toast.error(
        locale === "sw"
          ? "Admin anaweza kuhaririwa tu. Huwezi kumfuta."
          : "Admin users can only be edited. You cannot delete them."
      )
      return
    }

    const name = `${userPendingDelete.firstName} ${userPendingDelete.lastName}`
    const confirmed = await confirm({
      title: dialogCopy.deleteTitle,
      description: dialogCopy.deleteDescription(name),
      confirmLabel: dialogCopy.confirmDelete,
      cancelLabel: dialogCopy.cancel,
      variant: "destructive",
    })

    if (!confirmed) return

    await deleteUser(userPendingDelete.id)
    removeUser(userPendingDelete.id)
    toast.success(dialogCopy.deleteSuccess(name))
  }

  async function handleBulkDeleteUsers() {
    if (selectedUserCount === 0) return

    const deletableUsers = tableUsers.filter(
      (user) => selectedUserIds.has(user.id) && !isProtectedUser(user)
    )

    if (deletableUsers.length === 0) {
      toast.error(
        locale === "sw"
          ? "Watumiaji wa admin hawawezi kufutwa."
          : "Admin users cannot be deleted."
      )
      return
    }

    const confirmed = await confirm({
      title: dialogCopy.bulkDeleteTitle,
      description: dialogCopy.bulkDeleteDescription(deletableUsers.length),
      confirmLabel: dialogCopy.confirmDelete,
      cancelLabel: dialogCopy.cancel,
      variant: "destructive",
    })

    if (!confirmed) return

    await Promise.all(deletableUsers.map((user) => deleteUser(user.id)))
    removeUsers(deletableUsers.map((user) => user.id))
    toast.success(dialogCopy.bulkDeleteSuccess(deletableUsers.length))
  }

  async function handleCreateUser(values: UserFormValues) {
    const createdUser = await registerUser(values)

    prependUser(createdUser)
    setActiveDialog(null)
    toast.success(
      dialogCopy.createSuccess(`${values.firstName} ${values.lastName}`)
    )
  }

  async function handleUpdateUser(userId: number, values: UserFormValues) {
    const updatedUser = await updateUser(userId, {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password || undefined,
      phone: values.phone,
      role: values.role,
      status: values.status,
    })

    patchUser(userId, updatedUser)
    setActiveDialog(null)
    toast.success(
      dialogCopy.updateSuccess(`${values.firstName} ${values.lastName}`)
    )
  }

  return (
    <>
      <DashboardPage
        actions={
          <Button onClick={() => setActiveDialog({ type: "add" })}>
            <PlusIcon data-icon="inline-start" />
            {copy.addUser}
          </Button>
        }
      >
        <section>
          <Card className="min-h-[auto_70vh] w-full rounded-lg border-border/60 bg-card/90 py-0 shadow-sm">
            <CardHeader className="flex w-full flex-col gap-3 border-b px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
              <DashboardUsersToolbar
                copy={copy}
                onBulkDelete={handleBulkDeleteUsers}
                onPageSizeChange={updatePageSize}
                onSearchQueryChange={updateSearchQuery}
                onSortDirectionChange={updateSortDirection}
                onStatusFilterChange={updateStatusFilter}
                pageSize={pageSize}
                searchQuery={searchQuery}
                selectedUserCount={selectedUserCount}
                sortDirection={sortDirection}
                statusFilter={statusFilter}
              />
            </CardHeader>

            <CardContent className="pb-5">
              {isLoading ? (
                <Card>
                  <Empty className="flex min-h-64 flex-col gap-3">
                    <EmptyTitle>{copy.showing}...</EmptyTitle>
                    <EmptyDescription>{copy.loading}</EmptyDescription>
                  </Empty>
                </Card>
              ) : loadError ? (
                <Card>
                  <Empty className="flex min-h-64 flex-col gap-3">
                    <EmptyTitle>{copy.loadErrorTitle}</EmptyTitle>
                    <EmptyDescription>{loadError}</EmptyDescription>
                    <EmptyContent>
                      <Button onClick={() => void loadUsers()}>
                        {copy.retry}
                      </Button>
                    </EmptyContent>
                  </Empty>
                </Card>
              ) : tableUsers.length === 0 ? (
                <Card>
                  <Empty className="flex flex-col gap-3">
                    <EmptyTitle>{copy.emptyTitle}</EmptyTitle>
                    <EmptyDescription>{copy.emptyDescription}</EmptyDescription>
                    <EmptyContent>
                      <Button onClick={() => setActiveDialog({ type: "add" })}>
                        + {copy.addUser}
                      </Button>
                    </EmptyContent>
                  </Empty>
                </Card>
              ) : filteredUsers.length === 0 ? (
                <Empty className="min-h-64">
                  <EmptyTitle>{copy.noResultsTitle}</EmptyTitle>
                  <EmptyDescription>
                    {copy.noResultsDescription}
                  </EmptyDescription>
                </Empty>
              ) : (
                <DashboardUsersTable
                  allVisibleUsersSelected={allVisibleUsersSelected}
                  copy={copy}
                  formatCreatedAt={formatCreatedAt}
                  onDeleteUser={handleDeleteUser}
                  onEditUser={(user) => setActiveDialog({ type: "edit", user })}
                  onToggleUserSelection={toggleUserSelection}
                  onToggleVisibleUsers={toggleVisibleUsers}
                  onViewUser={(user) => setActiveDialog({ type: "view", user })}
                  pageStartIndex={pageStartIndex}
                  selectedUserIds={selectedUserIds}
                  someVisibleUsersSelected={someVisibleUsersSelected}
                  visibleUsers={visibleUsers}
                />
              )}
            </CardContent>

            {filteredUsers.length > 0 ? (
              <CardFooter className="mt-auto flex-col justify-between gap-3 border-t px-4 py-3 sm:flex-row sm:px-6">
                <DashboardUsersPagination
                  copy={copy}
                  currentPage={safeCurrentPage}
                  firstVisibleUser={firstVisibleUser}
                  lastVisibleUser={lastVisibleUser}
                  onPageChange={changePage}
                  totalItems={filteredUsers.length}
                  totalPages={totalPages}
                />
              </CardFooter>
            ) : null}
          </Card>
        </section>
      </DashboardPage>

      {activeDialog?.type === "add" ? (
        <UserFormDialog
          mode="add"
          copy={dialogCopy}
          onClose={() => setActiveDialog(null)}
          onSubmit={handleCreateUser}
        />
      ) : null}

      {activeDialog?.type === "edit" ? (
        <UserFormDialog
          mode="edit"
          copy={dialogCopy}
          user={activeDialog.user}
          onClose={() => setActiveDialog(null)}
          onSubmit={(values) => handleUpdateUser(activeDialog.user.id, values)}
        />
      ) : null}

      {activeDialog?.type === "view" ? (
        <UserViewDialog
          copy={dialogCopy}
          user={activeDialog.user}
          onClose={() => setActiveDialog(null)}
        />
      ) : null}
    </>
  )
}
