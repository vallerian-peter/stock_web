"use client"

import { DashboardDebtToolbar } from "../../components/dashboard-debt-toolbar"
import type { UsersSortDirection } from "@/lib/types"
import type { DebtDueFilter } from "../../components/debt-feature-types"
import type { PayableDialogCopy } from "./payable-dialog-copy"

type DashboardPayableToolbarProps = {
  copy: PayableDialogCopy
  dueFilter: DebtDueFilter
  onDueFilterChange: (value: DebtDueFilter) => void
  onPageSizeChange: (value: number) => void
  onSearchQueryChange: (value: string) => void
  onSortDirectionChange: (value: UsersSortDirection) => void
  pageSize: number
  searchQuery: string
  sortDirection: UsersSortDirection
}

export function DashboardPayableToolbar(props: DashboardPayableToolbarProps) {
  return <DashboardDebtToolbar {...props} idPrefix="payables" />
}
