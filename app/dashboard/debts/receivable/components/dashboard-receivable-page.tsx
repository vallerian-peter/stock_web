"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"

import {
  createReceivable,
  deleteReceivable,
  type ReceivableRequestDTO,
  type ReceivableResponseDTO,
} from "@/api/receivables_api"
import { DashboardUsersPagination } from "@/app/dashboard/users/components/dashboard-users-pagination"
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
import { landingContent } from "@/lib/landing-content"

import { DashboardReceivableTable } from "./dashboard-receivable-table"
import { DashboardReceivableToolbar } from "./dashboard-receivable-toolbar"
import { DashboardDebtStats } from "../../components/dashboard-debt-stats"
import { ReceivableFormDialog } from "./receivable-form-dialog"
import { receivableDialogCopy } from "./receivable-dialog-copy"
import { ReceivableViewDialog } from "./receivable-view-dialog"
import { useDashboardReceivableState } from "./use-dashboard-receivable-state"

export function DashboardReceivablePage() {
  const { locale } = useLandingLocale()
  const copy = receivableDialogCopy[locale]
  const paginationCopy = landingContent[locale].dashboardUsers
  const confirm = useConfirmAlertDialog()
  const numberLocale = locale === "sw" ? "sw-TZ" : "en-TZ"
  const [activeDialog, setActiveDialog] = useState<{
    type: "add" | "view" | null
    record?: ReceivableResponseDTO
  }>({ type: null })
  const state = useDashboardReceivableState(locale)

  async function handleCreate(values: ReceivableRequestDTO) {
    const record = await createReceivable(values)
    state.prependRecord(record)
    setActiveDialog({ type: null })
    toast.success(copy.createSuccess)
  }

  async function handleDelete(record: ReceivableResponseDTO) {
    const accepted = await confirm({
      title: copy.deleteTitle,
      description: copy.deleteDescription,
      confirmLabel: copy.confirmDelete,
      cancelLabel: copy.cancel,
      variant: "destructive",
    })
    if (!accepted) return

    try {
      await deleteReceivable(record.id)
      state.removeRecord(record.id)
      toast.success(copy.deleteSuccess)
    } catch {
      toast.error(copy.deleteError)
    }
  }

  function formatDate(value: string) {
    return new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString(
      numberLocale
    )
  }

  return (
    <>
      <DashboardPage
        actions={
          <Button
            onClick={() => setActiveDialog({ type: "add" })}
            className="rounded-xl bg-orange-500 text-white hover:bg-orange-600"
          >
            <PlusIcon data-icon="inline-start" />
            {copy.addBtn}
          </Button>
        }
      >
        <section className="flex flex-col gap-4">
          <DashboardDebtStats
            copy={copy}
            dueWindow={state.statsDueWindow}
            onDueWindowChange={state.updateStatsDueWindow}
            stats={state.stats}
          />

          <Card className="min-h-[auto_70vh] w-full rounded-lg border-border/60 bg-card/90 py-0 shadow-sm">
            <CardHeader className="flex flex-col gap-3 border-b px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
              <DashboardReceivableToolbar
                copy={copy}
                dueFilter={state.dueFilter}
                onDueFilterChange={state.updateDueFilter}
                onPageSizeChange={state.updatePageSize}
                onSearchQueryChange={state.updateSearchQuery}
                onSortDirectionChange={state.updateSortDirection}
                pageSize={state.pageSize}
                searchQuery={state.searchQuery}
                sortDirection={state.sortDirection}
              />
            </CardHeader>
            <CardContent className="pb-5">
              {state.isLoading ? (
                <Empty className="flex min-h-64 flex-col gap-3">
                  <EmptyTitle>{copy.loadingTitle}</EmptyTitle>
                  <EmptyDescription>{copy.loadingDescription}</EmptyDescription>
                </Empty>
              ) : state.loadError ? (
                <Empty className="flex min-h-64 flex-col gap-3">
                  <EmptyTitle>{copy.loadErrorTitle}</EmptyTitle>
                  <EmptyDescription>{state.loadError}</EmptyDescription>
                </Empty>
              ) : state.records.length === 0 ? (
                <Empty className="flex min-h-64 flex-col gap-3">
                  <EmptyTitle>{copy.emptyTitle}</EmptyTitle>
                  <EmptyDescription>{copy.emptyDescription}</EmptyDescription>
                  <EmptyContent>
                    <Button onClick={() => setActiveDialog({ type: "add" })}>
                      <PlusIcon />
                      {copy.addBtn}
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : state.filteredRecords.length === 0 ? (
                <Empty className="flex min-h-64 flex-col gap-3">
                  <EmptyTitle>{copy.noResultsTitle}</EmptyTitle>
                  <EmptyDescription>
                    {copy.noResultsDescription}
                  </EmptyDescription>
                </Empty>
              ) : (
                <DashboardReceivableTable
                  copy={copy}
                  formatDate={formatDate}
                  numberLocale={numberLocale}
                  onDelete={handleDelete}
                  onView={(record) => setActiveDialog({ type: "view", record })}
                  pageStartIndex={state.pageStartIndex}
                  visibleRecords={state.visibleRecords}
                />
              )}
            </CardContent>
            {state.filteredRecords.length > 0 && !state.isLoading ? (
              <CardFooter className="flex flex-col items-center justify-between gap-4 border-t px-4 py-4 sm:flex-row sm:px-6">
                <DashboardUsersPagination
                  copy={paginationCopy}
                  currentPage={state.safeCurrentPage}
                  firstVisibleUser={state.firstVisibleRecord}
                  lastVisibleUser={state.lastVisibleRecord}
                  onPageChange={state.changePage}
                  totalItems={state.filteredRecords.length}
                  totalPages={state.totalPages}
                />
              </CardFooter>
            ) : null}
          </Card>
        </section>
      </DashboardPage>

      {activeDialog.type === "add" ? (
        <ReceivableFormDialog
          copy={copy}
          onClose={() => setActiveDialog({ type: null })}
          onSubmit={handleCreate}
        />
      ) : null}
      {activeDialog.type === "view" && activeDialog.record ? (
        <ReceivableViewDialog
          copy={copy}
          numberLocale={numberLocale}
          onClose={() => setActiveDialog({ type: null })}
          record={activeDialog.record}
        />
      ) : null}
    </>
  )
}
