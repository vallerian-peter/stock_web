"use client"

import { SearchIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { InputField } from "@/components/ui/input-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type {
  CategoriesSortDirection,
  DashboardCategoriesCopy,
} from "@/lib/types"

type DashboardCategoriesToolbarProps = {
  copy: DashboardCategoriesCopy
  onBulkDelete: () => void
  onPageSizeChange: (value: number) => void
  onSearchQueryChange: (value: string) => void
  onSortDirectionChange: (value: CategoriesSortDirection) => void
  pageSize: number
  searchQuery: string
  selectedCategoryCount: number
  sortDirection: CategoriesSortDirection
}

export function DashboardCategoriesToolbar({
  copy,
  onBulkDelete,
  onPageSizeChange,
  onSearchQueryChange,
  onSortDirectionChange,
  pageSize,
  searchQuery,
  selectedCategoryCount,
  sortDirection,
}: DashboardCategoriesToolbarProps) {
  return (
    <>
      <div className="left-block flex w-full flex-wrap items-center gap-2 xl:max-w-xl xl:flex-nowrap">
        <InputField
          id="categories-search"
          type="text"
          name="search"
          placeholder={copy.searchPlaceholder}
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          containerClassName="min-w-52 flex-1"
          prefixIcon={<SearchIcon className="size-4 text-muted-foreground" />}
        />
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="shrink-0 py-[13.1px]"
          hidden={selectedCategoryCount === 0}
          onClick={onBulkDelete}
        >
          <Trash2Icon data-icon="inline-start" />
          {copy.bulkDelete}
          {selectedCategoryCount > 0 ? ` (${selectedCategoryCount})` : null}
        </Button>
      </div>

      <div className="right-block flex w-full flex-wrap items-center gap-2 xl:w-auto xl:justify-end">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-muted-foreground">
            {copy.showing}:
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              if (!value) return
              onPageSizeChange(Number(value))
            }}
          >
            <SelectTrigger
              size="default"
              className="h-8 min-w-16 bg-background px-2.5 shadow-xs"
              aria-label={copy.showing}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {[10, 25, 50].map((count) => (
                <SelectItem key={count} value={String(count)}>
                  {count}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-medium text-muted-foreground">
            {copy.sort}:
          </span>
          <Select
            value={sortDirection}
            onValueChange={(value) => {
              if (value !== "asc" && value !== "desc") return
              onSortDirectionChange(value)
            }}
          >
            <SelectTrigger
              size="default"
              className="h-8 min-w-16 bg-background px-2.5 shadow-xs"
              aria-label={copy.sort}
            >
              <SelectValue>
                {(value: CategoriesSortDirection) =>
                  value === "asc" ? copy.ascending : copy.descending
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="asc">{copy.ascending}</SelectItem>
              <SelectItem value="desc">{copy.descending}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )
}
