"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"

import {
  createOutgoingStock,
  deleteOutgoingStock,
  type OutgoingStockRequestDTO,
} from "@/api/outgoing_stocks_api"
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
import type { OutgoingStockResponseDTO } from "@/api/outgoing_stocks_api"
import { landingContent } from "@/lib/landing-content"

import { DashboardOutgoingTable } from "./dashboard-outgoing-table"
import { DashboardOutgoingToolbar } from "./dashboard-outgoing-toolbar"
import { DashboardUsersPagination } from "@/app/dashboard/users/components/dashboard-users-pagination"
import { outgoingDialogCopy } from "./outgoing-dialog-copy"
import { OutgoingFormDialog } from "./outgoing-form-dialog"
import { OutgoingViewDialog } from "./outgoing-view-dialog"
import { useDashboardOutgoingState } from "./use-dashboard-outgoing-state"

export function DashboardOutgoingPage() {
  const { locale } = useLandingLocale()
  const confirm = useConfirmAlertDialog()
  const userCopy = landingContent[locale].dashboardUsers
  const dialogCopy = outgoingDialogCopy[locale]

  const [activeDialog, setActiveDialog] = useState<{
    type: "add" | "view" | null
    dispatch?: OutgoingStockResponseDTO
  }>({ type: null })

  const {
    changePage,
    filteredDispatches,
    firstVisibleDispatch,
    formatDispatchedAt,
    isLoading,
    lastVisibleDispatch,
    loadError,
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
  } = useDashboardOutgoingState(locale)

  async function handleDeleteDispatch(dispatch: OutgoingStockResponseDTO) {
    const confirmed = await confirm({
      title: dialogCopy.deleteTitle,
      description: dialogCopy.deleteDescription,
      confirmLabel: dialogCopy.confirmDelete,
      cancelLabel: dialogCopy.cancel,
      variant: "destructive",
    })

    if (!confirmed) return

    try {
      await deleteOutgoingStock(dispatch.id)
      removeDispatch(dispatch.id)
      toast.success(dialogCopy.deleteSuccess)
    } catch {
      toast.error(dialogCopy.deleteError)
    }
  }

  async function handleCreateDispatch(values: OutgoingStockRequestDTO) {
    const res = await createOutgoingStock(values)
    prependDispatch(res)
    setActiveDialog({ type: null })
    toast.success(dialogCopy.createSuccess)
  }

  return (
    <>
      <DashboardPage
        actions={
          <Button onClick={() => setActiveDialog({ type: "add" })} className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
            <PlusIcon data-icon="inline-start" />
            {dialogCopy.addBtn}
          </Button>
        }
      >
        <section>
          <Card className="min-h-[auto_70vh] w-full rounded-lg border-border/60 bg-card/90 py-0 shadow-sm">
            <CardHeader className="flex w-full flex-col gap-3 border-b px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
              <DashboardOutgoingToolbar
                copy={dialogCopy}
                onPageSizeChange={updatePageSize}
                onSearchQueryChange={updateSearchQuery}
                onSortDirectionChange={updateSortDirection}
                pageSize={pageSize}
                searchQuery={searchQuery}
                sortDirection={sortDirection}
              />
            </CardHeader>

            <CardContent className="pb-5">
              {isLoading ? (
                <Empty className="flex min-h-64 flex-col gap-3">
                  <EmptyTitle>{dialogCopy.loadingTitle}</EmptyTitle>
                  <EmptyDescription>{dialogCopy.loadingDescription}</EmptyDescription>
                </Empty>
              ) : loadError ? (
                <Empty className="flex min-h-64 flex-col gap-3">
                  <EmptyTitle>{dialogCopy.loadErrorTitle}</EmptyTitle>
                  <EmptyDescription>{loadError}</EmptyDescription>
                </Empty>
              ) : tableDispatches.length === 0 ? (
                <Empty className="flex min-h-64 flex-col gap-3">
                  <EmptyTitle>{dialogCopy.emptyTitle}</EmptyTitle>
                  <EmptyDescription>{dialogCopy.emptyDescription}</EmptyDescription>
                  <EmptyContent>
                    <Button onClick={() => setActiveDialog({ type: "add" })} className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
                      <PlusIcon data-icon="inline-start" />
                      {dialogCopy.addBtn}
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : filteredDispatches.length === 0 ? (
                <Empty className="flex min-h-64 flex-col gap-3">
                  <EmptyTitle>{dialogCopy.noResultsTitle}</EmptyTitle>
                  <EmptyDescription>{dialogCopy.noResultsDescription}</EmptyDescription>
                </Empty>
              ) : (
                <DashboardOutgoingTable
                  copy={dialogCopy}
                  formatDispatchedAt={formatDispatchedAt}
                  onDeleteDispatch={handleDeleteDispatch}
                  onViewDispatch={(dispatch) => setActiveDialog({ type: "view", dispatch })}
                  pageStartIndex={pageStartIndex}
                  visibleDispatches={visibleDispatches}
                />
              )}
            </CardContent>

            {filteredDispatches.length > 0 && !isLoading ? (
              <CardFooter className="flex flex-col items-center justify-between gap-4 border-t px-4 py-4 sm:flex-row sm:px-6">
                <DashboardUsersPagination
                  copy={userCopy}
                  currentPage={safeCurrentPage}
                  firstVisibleUser={firstVisibleDispatch}
                  lastVisibleUser={lastVisibleDispatch}
                  onPageChange={changePage}
                  totalItems={filteredDispatches.length}
                  totalPages={totalPages}
                />
              </CardFooter>
            ) : null}
          </Card>
        </section>
      </DashboardPage>

      {/* Forms and Details Dialogs */}
      {activeDialog.type === "add" && (
        <OutgoingFormDialog
          copy={dialogCopy}
          onClose={() => setActiveDialog({ type: null })}
          onSubmit={handleCreateDispatch}
        />
      )}

      {activeDialog.type === "view" && activeDialog.dispatch && (
        <OutgoingViewDialog
          copy={dialogCopy}
          dispatch={activeDialog.dispatch}
          onClose={() => setActiveDialog({ type: null })}
        />
      )}
    </>
  )
}
