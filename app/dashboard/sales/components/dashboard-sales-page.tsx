"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { createSale, deleteSale } from "@/api/sales_api"
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
import type { SaleResponseDTO } from "@/api/sales_api"
import { landingContent } from "@/lib/landing-content"

import { DashboardSalesTable } from "./dashboard-sales-table"
import { DashboardSalesToolbar } from "./dashboard-sales-toolbar"
import { DashboardUsersPagination } from "@/app/dashboard/users/components/dashboard-users-pagination"
import { salesDialogCopy } from "./sales-dialog-copy"
import { SalesFormDialog } from "./sales-form-dialog"
import { SalesViewDialog } from "./sales-view-dialog"
import { useDashboardSalesState } from "./use-dashboard-sales-state"

export function DashboardSalesPage() {
  const { locale } = useLandingLocale()
  const confirm = useConfirmAlertDialog()
  const copy = landingContent[locale].dashboardProducts
  const userCopy = landingContent[locale].dashboardUsers
  const dialogCopy = salesDialogCopy[locale]

  const [activeDialog, setActiveDialog] = useState<{
    type: "add" | "view" | null
    sale?: SaleResponseDTO
  }>({ type: null })

  const {
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
  } = useDashboardSalesState(locale)

  async function handleDeleteSale(sale: SaleResponseDTO) {
    const confirmed = await confirm({
      title: dialogCopy.deleteTitle,
      description: dialogCopy.deleteDescription,
      confirmLabel: dialogCopy.confirmDelete,
      cancelLabel: dialogCopy.cancel,
      variant: "destructive",
    })

    if (!confirmed) return

    try {
      await deleteSale(sale.id)
      removeSale(sale.id)
      toast.success(dialogCopy.deleteSuccess)
    } catch (err) {
      toast.error(locale === "sw" ? "Imeshindikana kufuta mauzo." : "Failed to delete sale record.")
    }
  }

  async function handleCreateSale(values: any) {
    const res = await createSale(values)
    prependSale(res)
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
              <DashboardSalesToolbar
                copy={copy}
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
                  <EmptyTitle>{copy.showing}...</EmptyTitle>
                  <EmptyDescription>{copy.loading}</EmptyDescription>
                </Empty>
              ) : loadError ? (
                <Empty className="flex min-h-64 flex-col gap-3">
                  <EmptyTitle>{copy.loadErrorTitle}</EmptyTitle>
                  <EmptyDescription>{loadError}</EmptyDescription>
                </Empty>
              ) : tableSales.length === 0 ? (
                <Empty className="flex min-h-64 flex-col gap-3">
                  <EmptyTitle>
                    {locale === "sw" ? "Hakuna mauzo bado" : "No sales yet"}
                  </EmptyTitle>
                  <EmptyDescription>
                    {locale === "sw" ? "Sajili mauzo ya kwanza ya kaunta ili kuanza kufuatilia." : "Register the first counter sale to start tracking."}
                  </EmptyDescription>
                  <EmptyContent>
                    <Button onClick={() => setActiveDialog({ type: "add" })} className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
                      <PlusIcon data-icon="inline-start" />
                      {dialogCopy.addBtn}
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : filteredSales.length === 0 ? (
                <Empty className="flex min-h-64 flex-col gap-3">
                  <EmptyTitle>{copy.noResultsTitle}</EmptyTitle>
                  <EmptyDescription>{copy.noResultsDescription}</EmptyDescription>
                </Empty>
              ) : (
                <DashboardSalesTable
                  copy={dialogCopy}
                  formatSoldAt={formatSoldAt}
                  onDeleteSale={handleDeleteSale}
                  onViewSale={(sale) => setActiveDialog({ type: "view", sale })}
                  pageStartIndex={pageStartIndex}
                  visibleSales={visibleSales}
                />
              )}
            </CardContent>

            {filteredSales.length > 0 && !isLoading ? (
              <CardFooter className="flex flex-col items-center justify-between gap-4 border-t px-4 py-4 sm:flex-row sm:px-6">
                <DashboardUsersPagination
                  copy={userCopy}
                  currentPage={safeCurrentPage}
                  firstVisibleUser={firstVisibleSale}
                  lastVisibleUser={lastVisibleSale}
                  onPageChange={changePage}
                  totalItems={filteredSales.length}
                  totalPages={totalPages}
                />
              </CardFooter>
            ) : null}
          </Card>
        </section>
      </DashboardPage>

      {/* Forms and Details Dialogs */}
      {activeDialog.type === "add" && (
        <SalesFormDialog
          copy={dialogCopy}
          onClose={() => setActiveDialog({ type: null })}
          onSubmit={handleCreateSale}
        />
      )}

      {activeDialog.type === "view" && activeDialog.sale && (
        <SalesViewDialog
          copy={dialogCopy}
          sale={activeDialog.sale}
          onClose={() => setActiveDialog({ type: null })}
        />
      )}
    </>
  )
}
