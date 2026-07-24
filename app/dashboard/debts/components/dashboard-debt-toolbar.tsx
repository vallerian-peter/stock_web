"use client"

import { SearchIcon } from "lucide-react"

import { InputField } from "@/components/ui/input-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { UsersSortDirection } from "@/lib/types"

import {
  DUE_WINDOW_OPTIONS,
  getDueWindowLabel,
  isDebtDueFilter,
} from "./debt-filter-copy"
import type { DebtDialogCopy, DebtDueFilter } from "./debt-feature-types"

type DashboardDebtToolbarProps = {
  copy: DebtDialogCopy
  idPrefix: string
  dueFilter: DebtDueFilter
  onDueFilterChange: (value: DebtDueFilter) => void
  onPageSizeChange: (value: number) => void
  onSearchQueryChange: (value: string) => void
  onSortDirectionChange: (value: UsersSortDirection) => void
  pageSize: number
  searchQuery: string
  sortDirection: UsersSortDirection
}

export function DashboardDebtToolbar({
  copy,
  dueFilter,
  idPrefix,
  onDueFilterChange,
  onPageSizeChange,
  onSearchQueryChange,
  onSortDirectionChange,
  pageSize,
  searchQuery,
  sortDirection,
}: DashboardDebtToolbarProps) {
  return (
    <>
      <InputField
        id={`${idPrefix}-search`}
        name="search"
        placeholder={copy.searchPlaceholder}
        value={searchQuery}
        onChange={(event) => onSearchQueryChange(event.target.value)}
        containerClassName="w-full xl:max-w-xl"
        prefixIcon={<SearchIcon className="size-4 text-muted-foreground" />}
      />

      <div className="flex w-full flex-wrap items-center gap-3 xl:w-auto">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-muted-foreground">
            {copy.dueFilter}:
          </span>
          <Select
            value={dueFilter}
            onValueChange={(value) => {
              if (value && isDebtDueFilter(value)) onDueFilterChange(value)
            }}
          >
            <SelectTrigger
              className="h-8 min-w-32 bg-background px-2.5"
              aria-label={copy.dueFilter}
            >
              <SelectValue>
                {() => {
                  if (dueFilter === "all") return copy.allDueDates
                  if (dueFilter === "due") return copy.dueNow
                  return getDueWindowLabel(
                    copy,
                    Number(
                      dueFilter.replace("within-", "")
                    ) as (typeof DUE_WINDOW_OPTIONS)[number]
                  )
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">{copy.allDueDates}</SelectItem>
              <SelectItem value="due">{copy.dueNow}</SelectItem>
              {DUE_WINDOW_OPTIONS.map((days) => (
                <SelectItem key={days} value={`within-${days}`}>
                  {getDueWindowLabel(copy, days)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-medium text-muted-foreground">
            {copy.showing}:
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => value && onPageSizeChange(Number(value))}
          >
            <SelectTrigger
              className="h-8 min-w-16 bg-background px-2.5"
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
              if (value === "asc" || value === "desc") {
                onSortDirectionChange(value)
              }
            }}
          >
            <SelectTrigger
              className="h-8 min-w-24 bg-background px-2.5"
              aria-label={copy.sort}
            >
              <SelectValue>
                {(value: UsersSortDirection) =>
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
