"use client"

import { DashboardDebtToolbar } from "../../components/dashboard-debt-toolbar"
import type { UsersSortDirection } from "@/lib/types"
import type { DebtDueFilter } from "../../components/debt-feature-types"
import type { ReceivableDialogCopy } from "./receivable-dialog-copy"

type DashboardReceivableToolbarProps = {
  copy: ReceivableDialogCopy
  dueFilter: DebtDueFilter
  onDueFilterChange: (value: DebtDueFilter) => void
  onPageSizeChange: (value: number) => void
  onSearchQueryChange: (value: string) => void
  onSortDirectionChange: (value: UsersSortDirection) => void
  pageSize: number
  searchQuery: string
  sortDirection: UsersSortDirection
}

export function DashboardReceivableToolbar(
  props: DashboardReceivableToolbarProps
) {
  return <DashboardDebtToolbar {...props} idPrefix="receivables" />
}
