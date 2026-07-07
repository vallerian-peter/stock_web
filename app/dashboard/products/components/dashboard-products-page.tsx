"use client"

import { useState } from "react"
import {
  CircleAlertIcon,
  Layers3Icon,
  Package2Icon,
  TriangleAlertIcon,
  MoreVerticalIcon,
} from "lucide-react"
import { toast } from "sonner"

import { createPart, deletePart, updatePart } from "@/api/parts_api"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { PartRequestDTO, PartResponseDTO } from "@/lib/dtos/part_dtos"
import { landingContent } from "@/lib/landing-content"
import type { ActivePartDialog } from "@/lib/types"

import { productDialogCopy } from "./product-dialog-copy"
import { DashboardProductsPagination } from "./dashboard-products-pagination"
import { DashboardProductsTable } from "./dashboard-products-table"
import { DashboardProductsToolbar } from "./dashboard-products-toolbar"
import { ProductFormDialog } from "./product-form-dialog"
import { ProductBulkFormDialog } from "./product-bulk-form-dialog"
import type { ProductFormValues } from "./product-schema"
import { ProductViewDialog } from "./product-view-dialog"
import { useDashboardPartsState } from "./use-dashboard-products-state"

function mapFormValuesToRequest(
  values: ProductFormValues,
  imageFile: File | null,
  currentPart?: PartResponseDTO
): PartRequestDTO {
  const nextImageLastModifiedAt = imageFile?.lastModified ?? null
  const shouldUploadImage =
    nextImageLastModifiedAt !== null &&
    currentPart?.imageLastModifiedAt !== nextImageLastModifiedAt

  return {
    partName: values.partName.trim(),
    partNumber: values.partNumber.trim(),
    quantity: Number(values.quantity),
    price: Number(values.price),
    image: shouldUploadImage ? imageFile : null,
    imageLastModifiedAt: shouldUploadImage ? nextImageLastModifiedAt : null,
    categoryId: values.categoryId === "none" ? null : Number(values.categoryId),
    status: values.status,
  }
}

export function DashboardPartsPage() {
  const { locale } = useLandingLocale()
  const confirm = useConfirmAlertDialog()
  const copy = landingContent[locale].dashboardProducts
  const dialogCopy = productDialogCopy[locale]
  const [activeDialog, setActiveDialog] = useState<ActivePartDialog>(null)

  const {
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
    stats,
  } = useDashboardPartsState(locale)

  async function handleDeletePart(partPendingDelete: PartResponseDTO) {
    const confirmed = await confirm({
      title: dialogCopy.deleteTitle,
      description: dialogCopy.deleteDescription(partPendingDelete.partName),
      confirmLabel: dialogCopy.confirmDelete,
      cancelLabel: dialogCopy.cancel,
      variant: "destructive",
    })

    if (!confirmed) return

    await deletePart(partPendingDelete.id)
    removePart(partPendingDelete.id)
    toast.success(dialogCopy.deleteSuccess(partPendingDelete.partName))
  }

  async function handleBulkDeleteParts() {
    if (selectedPartCount === 0) return

    const selectedParts = tableParts.filter((part) =>
      selectedPartIds.has(part.id)
    )

    const confirmed = await confirm({
      title: dialogCopy.bulkDeleteTitle,
      description: dialogCopy.bulkDeleteDescription(selectedParts.length),
      confirmLabel: dialogCopy.confirmDelete,
      cancelLabel: dialogCopy.cancel,
      variant: "destructive",
    })

    if (!confirmed) return

    await Promise.all(selectedParts.map((part) => deletePart(part.id)))
    removeParts(selectedParts.map((part) => part.id))
    toast.success(dialogCopy.bulkDeleteSuccess(selectedParts.length))
  }

  async function handleCreatePart(
    values: ProductFormValues,
    imageFile: File | null
  ) {
    const createdPart = await createPart(mapFormValuesToRequest(values, imageFile))

    prependPart(createdPart)
    setActiveDialog(null)
    toast.success(dialogCopy.createSuccess(values.partName))
  }

  async function handleBulkCreateParts(
    items: Array<{ values: ProductFormValues; imageFile: File | null }>
  ) {
    const createdParts = await Promise.all(
      items.map((item) =>
        createPart(mapFormValuesToRequest(item.values, item.imageFile))
      )
    )

    createdParts.forEach((part) => prependPart(part))
    setActiveDialog(null)
    toast.success(dialogCopy.bulkSuccess(items.length))
  }

  async function handleUpdatePart(
    partId: number,
    values: ProductFormValues,
    imageFile: File | null,
    currentPart: PartResponseDTO
  ) {
    const updatedPart = await updatePart(
      partId,
      mapFormValuesToRequest(values, imageFile, currentPart)
    )

    patchPart(partId, updatedPart)
    setActiveDialog(null)
    toast.success(dialogCopy.updateSuccess(values.partName))
  }

  return (
    <>
      <DashboardPage
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button type="button" aria-label={copy.addPart}>
                  <MoreVerticalIcon data-icon="inline-start" />
                  {copy.addPart}
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuItem
                onClick={() => setActiveDialog({ type: "add" })}
              >
                {locale === "sw" ? "Bidhaa Moja" : "Single Product"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setActiveDialog({ type: "bulk-add" })}
              >
                {locale === "sw" ? "Bidhaa kwa Pamoja" : "Bulk Products"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        <section className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: copy.totalParts,
                value: stats.totalParts,
                Icon: Package2Icon,
                colorClass: "border-zinc-200/70 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900",
              },
              {
                label: copy.inStock,
                value: stats.inStock,
                Icon: Layers3Icon,
                colorClass: "border-green-200/70 bg-green-50 text-green-600 dark:border-green-900 dark:bg-green-950/40",
              },
              {
                label: copy.lowStock,
                value: stats.lowStock,
                Icon: TriangleAlertIcon,
                colorClass: "border-amber-200/70 bg-amber-50 text-amber-600 dark:border-amber-900 dark:bg-amber-950/40",
              },
              {
                label: copy.outOfStock,
                value: stats.outOfStock,
                Icon: CircleAlertIcon,
                colorClass: "border-red-200/70 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/40",
              },
            ].map((item) => (
              <Card
                key={item.label}
                className="justify-between gap-3 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm"
              >
                <CardHeader className="flex flex-row items-start justify-between px-5 pt-5 pb-0">
                  <p className="text-[12px] font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl border ${item.colorClass}`}
                  >
                    <item.Icon className="size-4" />
                  </span>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <p className="text-xl font-semibold tracking-tight text-foreground">
                    {item.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="min-h-[auto_70vh] w-full rounded-lg border-border/60 bg-card/90 py-0 shadow-sm">
            <CardHeader className="flex w-full flex-col gap-3 border-b px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
              <DashboardProductsToolbar
                copy={copy}
                onBulkDelete={handleBulkDeleteParts}
                onPageSizeChange={updatePageSize}
                onSearchQueryChange={updateSearchQuery}
                onSortDirectionChange={updateSortDirection}
                onStatusFilterChange={updateStatusFilter}
                pageSize={pageSize}
                searchQuery={searchQuery}
                selectedPartCount={selectedPartCount}
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
                      <Button onClick={() => void loadParts()}>
                        {copy.retry}
                      </Button>
                    </EmptyContent>
                  </Empty>
                </Card>
              ) : tableParts.length === 0 ? (
                <Card>
                  <Empty className="flex flex-col gap-3">
                    <EmptyTitle>{copy.emptyTitle}</EmptyTitle>
                    <EmptyDescription>{copy.emptyDescription}</EmptyDescription>
                    <EmptyContent>
                      <Button onClick={() => setActiveDialog({ type: "add" })}>
                        + {copy.addPart}
                      </Button>
                    </EmptyContent>
                  </Empty>
                </Card>
              ) : filteredParts.length === 0 ? (
                <Empty className="min-h-64">
                  <EmptyTitle>{copy.noResultsTitle}</EmptyTitle>
                  <EmptyDescription>
                    {copy.noResultsDescription}
                  </EmptyDescription>
                </Empty>
              ) : (
                <DashboardProductsTable
                  allVisiblePartsSelected={allVisiblePartsSelected}
                  copy={copy}
                  formatCreatedAt={formatCreatedAt}
                  formatPrice={formatPrice}
                  onDeletePart={handleDeletePart}
                  onEditPart={(part) =>
                    setActiveDialog({ type: "edit", part })
                  }
                  onTogglePartSelection={togglePartSelection}
                  onToggleVisibleParts={toggleVisibleParts}
                  onViewPart={(part) =>
                    setActiveDialog({ type: "view", part })
                  }
                  pageStartIndex={pageStartIndex}
                  selectedPartIds={selectedPartIds}
                  someVisiblePartsSelected={someVisiblePartsSelected}
                  visibleParts={visibleParts}
                />
              )}
            </CardContent>

            {filteredParts.length > 0 ? (
              <CardFooter className="mt-auto flex-col justify-between gap-3 border-t px-4 py-3 sm:flex-row sm:px-6">
                <DashboardProductsPagination
                  copy={copy}
                  currentPage={safeCurrentPage}
                  firstVisiblePart={firstVisiblePart}
                  lastVisiblePart={lastVisiblePart}
                  onPageChange={changePage}
                  totalItems={filteredParts.length}
                  totalPages={totalPages}
                />
              </CardFooter>
            ) : null}
          </Card>
        </section>
      </DashboardPage>

      {activeDialog?.type === "add" ? (
        <ProductFormDialog
          mode="add"
          copy={dialogCopy}
          categories={categories}
          onClose={() => setActiveDialog(null)}
          onSubmit={handleCreatePart}
        />
      ) : null}

      {activeDialog?.type === "bulk-add" ? (
        <ProductBulkFormDialog
          copy={dialogCopy}
          categories={categories}
          onClose={() => setActiveDialog(null)}
          onSubmit={handleBulkCreateParts}
        />
      ) : null}

      {activeDialog?.type === "edit" ? (
        <ProductFormDialog
          mode="edit"
          copy={dialogCopy}
          categories={categories}
          part={activeDialog.part}
          onClose={() => setActiveDialog(null)}
          onSubmit={(values, imageFile) =>
            handleUpdatePart(activeDialog.part.id, values, imageFile, activeDialog.part)
          }
        />
      ) : null}

      {activeDialog?.type === "view" ? (
        <ProductViewDialog
          copy={dialogCopy}
          locale={locale}
          part={activeDialog.part}
          onClose={() => setActiveDialog(null)}
        />
      ) : null}
    </>
  )
}
