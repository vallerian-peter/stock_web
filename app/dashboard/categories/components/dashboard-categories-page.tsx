"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"

import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/api/categories_api"
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
import type { CategoryResponseDTO } from "@/lib/dtos/category_dtos"
import { landingContent } from "@/lib/landing-content"
import type { ActiveCategoryDialog } from "@/lib/types"

import { categoryDialogCopy } from "./category-dialog-copy"
import { CategoryFormDialog } from "./category-form-dialog"
import type { CategoryFormValues } from "./category-schema"
import { CategoryViewDialog } from "./category-view-dialog"
import { DashboardCategoriesPagination } from "./dashboard-categories-pagination"
import { DashboardCategoriesTable } from "./dashboard-categories-table"
import { DashboardCategoriesToolbar } from "./dashboard-categories-toolbar"
import { useDashboardCategoriesState } from "./use-dashboard-categories-state"

export function DashboardCategoriesPage() {
  const { locale } = useLandingLocale()
  const confirm = useConfirmAlertDialog()
  const copy = landingContent[locale].dashboardCategories
  const dialogCopy = categoryDialogCopy[locale]
  const [activeDialog, setActiveDialog] = useState<ActiveCategoryDialog>(null)

  const {
    allVisibleCategoriesSelected,
    changePage,
    filteredCategories,
    firstVisibleCategory,
    formatCreatedAt,
    isLoading,
    lastVisibleCategory,
    reloadCategories,
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
  } = useDashboardCategoriesState(locale)

  async function handleDeleteCategory(categoryPendingDelete: CategoryResponseDTO) {
    const confirmed = await confirm({
      title: dialogCopy.deleteTitle,
      description: dialogCopy.deleteDescription(categoryPendingDelete.name),
      confirmLabel: dialogCopy.confirmDelete,
      cancelLabel: dialogCopy.cancel,
      variant: "destructive",
    })

    if (!confirmed) return

    await deleteCategory(categoryPendingDelete.id)
    removeCategory(categoryPendingDelete.id)
    toast.success(dialogCopy.deleteSuccess(categoryPendingDelete.name))
  }

  async function handleBulkDeleteCategories() {
    if (selectedCategoryCount === 0) return

    const selectedCategories = tableCategories.filter((category) =>
      selectedCategoryIds.has(category.id)
    )

    const confirmed = await confirm({
      title: dialogCopy.bulkDeleteTitle,
      description: dialogCopy.bulkDeleteDescription(selectedCategories.length),
      confirmLabel: dialogCopy.confirmDelete,
      cancelLabel: dialogCopy.cancel,
      variant: "destructive",
    })

    if (!confirmed) return

    await Promise.all(
      selectedCategories.map((category) => deleteCategory(category.id))
    )
    removeCategories(selectedCategories.map((category) => category.id))
    toast.success(dialogCopy.bulkDeleteSuccess(selectedCategories.length))
  }

  async function handleCreateCategory(values: CategoryFormValues) {
    const createdCategory = await createCategory(values)

    prependCategory(createdCategory)
    setActiveDialog(null)
    toast.success(dialogCopy.createSuccess(values.name))
  }

  async function handleUpdateCategory(
    categoryId: number,
    values: CategoryFormValues
  ) {
    const updatedCategory = await updateCategory(categoryId, values)

    patchCategory(categoryId, updatedCategory)
    setActiveDialog(null)
    toast.success(dialogCopy.updateSuccess(values.name))
  }

  return (
    <>
      <DashboardPage
        actions={
          <Button onClick={() => setActiveDialog({ type: "add" })}>
            <PlusIcon data-icon="inline-start" />
            {copy.addCategory}
          </Button>
        }
      >
        <section>
          <Card className="min-h-[auto_70vh] w-full rounded-lg border-border/60 bg-card/90 py-0 shadow-sm">
            <CardHeader className="flex w-full flex-col gap-3 border-b px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
              <DashboardCategoriesToolbar
                copy={copy}
                onBulkDelete={handleBulkDeleteCategories}
                onPageSizeChange={updatePageSize}
                onSearchQueryChange={updateSearchQuery}
                onSortDirectionChange={updateSortDirection}
                pageSize={pageSize}
                searchQuery={searchQuery}
                selectedCategoryCount={selectedCategoryCount}
                sortDirection={sortDirection}
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
                      <Button onClick={reloadCategories}>
                        {copy.retry}
                      </Button>
                    </EmptyContent>
                  </Empty>
                </Card>
              ) : tableCategories.length === 0 ? (
                <Card>
                  <Empty className="flex flex-col gap-3">
                    <EmptyTitle>{copy.emptyTitle}</EmptyTitle>
                    <EmptyDescription>{copy.emptyDescription}</EmptyDescription>
                    <EmptyContent>
                      <Button onClick={() => setActiveDialog({ type: "add" })}>
                        + {copy.addCategory}
                      </Button>
                    </EmptyContent>
                  </Empty>
                </Card>
              ) : filteredCategories.length === 0 ? (
                <Empty className="min-h-64">
                  <EmptyTitle>{copy.noResultsTitle}</EmptyTitle>
                  <EmptyDescription>
                    {copy.noResultsDescription}
                  </EmptyDescription>
                </Empty>
              ) : (
                <DashboardCategoriesTable
                  allVisibleCategoriesSelected={allVisibleCategoriesSelected}
                  copy={copy}
                  formatCreatedAt={formatCreatedAt}
                  onDeleteCategory={handleDeleteCategory}
                  onEditCategory={(category) =>
                    setActiveDialog({ type: "edit", category })
                  }
                  onToggleCategorySelection={toggleCategorySelection}
                  onToggleVisibleCategories={toggleVisibleCategories}
                  onViewCategory={(category) =>
                    setActiveDialog({ type: "view", category })
                  }
                  pageStartIndex={pageStartIndex}
                  selectedCategoryIds={selectedCategoryIds}
                  someVisibleCategoriesSelected={someVisibleCategoriesSelected}
                  visibleCategories={visibleCategories}
                />
              )}
            </CardContent>

            {filteredCategories.length > 0 ? (
              <CardFooter className="mt-auto flex-col justify-between gap-3 border-t px-4 py-3 sm:flex-row sm:px-6">
                <DashboardCategoriesPagination
                  copy={copy}
                  currentPage={safeCurrentPage}
                  firstVisibleCategory={firstVisibleCategory}
                  lastVisibleCategory={lastVisibleCategory}
                  onPageChange={changePage}
                  totalItems={filteredCategories.length}
                  totalPages={totalPages}
                />
              </CardFooter>
            ) : null}
          </Card>
        </section>
      </DashboardPage>

      {activeDialog?.type === "add" ? (
        <CategoryFormDialog
          mode="add"
          copy={dialogCopy}
          onClose={() => setActiveDialog(null)}
          onSubmit={handleCreateCategory}
        />
      ) : null}

      {activeDialog?.type === "edit" ? (
        <CategoryFormDialog
          mode="edit"
          copy={dialogCopy}
          category={activeDialog.category}
          onClose={() => setActiveDialog(null)}
          onSubmit={(values) =>
            handleUpdateCategory(activeDialog.category.id, values)
          }
        />
      ) : null}

      {activeDialog?.type === "view" ? (
        <CategoryViewDialog
          copy={dialogCopy}
          category={activeDialog.category}
          onClose={() => setActiveDialog(null)}
        />
      ) : null}
    </>
  )
}
