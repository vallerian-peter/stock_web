"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"

import {
  createIncomingStock,
  deleteIncomingStock,
  type IncomingStockRequestDTO,
} from "@/api/incoming_stocks_api"
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
import type { IncomingStockResponseDTO } from "@/api/incoming_stocks_api"
import { landingContent } from "@/lib/landing-content"

import { DashboardIncomeStockTable } from "./dashboard-income-stock-table"
import { DashboardIncomeStockToolbar } from "./dashboard-income-stock-toolbar"
import { DashboardUsersPagination } from "@/app/dashboard/users/components/dashboard-users-pagination"
import { incomeStockDialogCopy } from "./income-stock-dialog-copy"
import { IncomeStockFormDialog } from "./income-stock-form-dialog"
import { IncomeStockViewDialog } from "./income-stock-view-dialog"
import { useDashboardIncomeStockState } from "./use-dashboard-income-stock-state"

export function DashboardIncomeStockPage() {
  const { locale } = useLandingLocale()
  const confirm = useConfirmAlertDialog()
  const userCopy = landingContent[locale].dashboardUsers
  const dialogCopy = incomeStockDialogCopy[locale]
  
  const [activeDialog, setActiveDialog] = useState<{
    type: "add" | "view" | null
    intake?: IncomingStockResponseDTO
  }>({ type: null })

  const {
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
  } = useDashboardIncomeStockState(locale)

  async function handleDeleteIntake(intake: IncomingStockResponseDTO) {
    const confirmed = await confirm({
      title: dialogCopy.deleteTitle,
      description: dialogCopy.deleteDescription,
      confirmLabel: dialogCopy.confirmDelete,
      cancelLabel: dialogCopy.cancel,
      variant: "destructive",
    })

    if (!confirmed) return

    try {
      await deleteIncomingStock(intake.id)
      removeIntake(intake.id)
      toast.success(dialogCopy.deleteSuccess)
    } catch {
      toast.error(dialogCopy.deleteError)
    }
  }

  async function handleCreateIntake(values: IncomingStockRequestDTO) {
    const res = await createIncomingStock(values)
    prependIntake(res)
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
              <DashboardIncomeStockToolbar
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
              ) : tableIntakes.length === 0 ? (
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
              ) : filteredIntakes.length === 0 ? (
                <Empty className="flex min-h-64 flex-col gap-3">
                  <EmptyTitle>{dialogCopy.noResultsTitle}</EmptyTitle>
                  <EmptyDescription>{dialogCopy.noResultsDescription}</EmptyDescription>
                </Empty>
              ) : (
                <DashboardIncomeStockTable
                  copy={dialogCopy}
                  formatReceivedAt={formatReceivedAt}
                  onDeleteIntake={handleDeleteIntake}
                  onViewIntake={(intake) => setActiveDialog({ type: "view", intake })}
                  pageStartIndex={pageStartIndex}
                  visibleIntakes={visibleIntakes}
                />
              )}
            </CardContent>

            {filteredIntakes.length > 0 && !isLoading ? (
              <CardFooter className="flex flex-col items-center justify-between gap-4 border-t px-4 py-4 sm:flex-row sm:px-6">
                <DashboardUsersPagination
                  copy={userCopy}
                  currentPage={safeCurrentPage}
                  firstVisibleUser={firstVisibleIntake}
                  lastVisibleUser={lastVisibleIntake}
                  onPageChange={changePage}
                  totalItems={filteredIntakes.length}
                  totalPages={totalPages}
                />
              </CardFooter>
            ) : null}
          </Card>
        </section>
      </DashboardPage>

      {/* Forms and Details Dialogs */}
      {activeDialog.type === "add" && (
        <IncomeStockFormDialog
          copy={dialogCopy}
          onClose={() => setActiveDialog({ type: null })}
          onSubmit={handleCreateIntake}
        />
      )}

      {activeDialog.type === "view" && activeDialog.intake && (
        <IncomeStockViewDialog
          copy={dialogCopy}
          intake={activeDialog.intake}
          onClose={() => setActiveDialog({ type: null })}
        />
      )}
    </>
  )
}
