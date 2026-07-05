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
  DashboardPartsCopy,
  PartsSortDirection,
  PartsStatusFilter,
} from "@/lib/types"

type DashboardProductsToolbarProps = {
  copy: DashboardPartsCopy
  onBulkDelete: () => void
  onPageSizeChange: (value: number) => void
  onSearchQueryChange: (value: string) => void
  onSortDirectionChange: (value: PartsSortDirection) => void
  onStatusFilterChange: (value: PartsStatusFilter) => void
  pageSize: number
  searchQuery: string
  selectedPartCount: number
  sortDirection: PartsSortDirection
  statusFilter: PartsStatusFilter
}

export function DashboardProductsToolbar({
  copy,
  onBulkDelete,
  onPageSizeChange,
  onSearchQueryChange,
  onSortDirectionChange,
  onStatusFilterChange,
  pageSize,
  searchQuery,
  selectedPartCount,
  sortDirection,
  statusFilter,
}: DashboardProductsToolbarProps) {
  return (
    <>
      <div className="left-block flex w-full flex-wrap items-center gap-2 xl:max-w-xl xl:flex-nowrap">
        <InputField
          id="products-search"
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
          hidden={selectedPartCount === 0}
          onClick={onBulkDelete}
        >
          <Trash2Icon data-icon="inline-start" />
          {copy.bulkDelete}
          {selectedPartCount > 0 ? ` (${selectedPartCount})` : null}
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
                {(value: PartsSortDirection) =>
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

        <div className="flex items-center gap-1.5">
          <span className="font-medium text-muted-foreground">
            {copy.status}:
          </span>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              if (
                value !== "all" &&
                value !== "in_stock" &&
                value !== "low_stock" &&
                value !== "out_of_stock"
              ) {
                return
              }

              onStatusFilterChange(value)
            }}
          >
            <SelectTrigger
              size="default"
              className="h-8 min-w-16 bg-background px-2.5 shadow-xs"
              aria-label={copy.status}
            >
              <SelectValue>
                {(value: PartsStatusFilter) => {
                  if (value === "in_stock") return copy.inStock
                  if (value === "low_stock") return copy.lowStock
                  if (value === "out_of_stock") return copy.outOfStock
                  return copy.allStatuses
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">{copy.allStatuses}</SelectItem>
              <SelectItem value="in_stock">{copy.inStock}</SelectItem>
              <SelectItem value="low_stock">{copy.lowStock}</SelectItem>
              <SelectItem value="out_of_stock">{copy.outOfStock}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )
}
