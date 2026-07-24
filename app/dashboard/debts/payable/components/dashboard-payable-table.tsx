"use client"

import type { PayableResponseDTO } from "@/api/payables_api"
import { DashboardDebtTable } from "../../components/dashboard-debt-table"
import type { DebtRecordView } from "../../components/debt-feature-types"
import type { PayableDialogCopy } from "./payable-dialog-copy"

export function toPayableView(record: PayableResponseDTO): DebtRecordView {
  return {
    ...record,
    sourceId: record.incomingStockId,
    partyName: record.creditorName,
    partyPhone: record.creditorPhone,
  }
}

type DashboardPayableTableProps = {
  copy: PayableDialogCopy
  formatDate: (value: string) => string
  numberLocale: string
  onDelete: (record: PayableResponseDTO) => void
  onView: (record: PayableResponseDTO) => void
  pageStartIndex: number
  visibleRecords: PayableResponseDTO[]
}

export function DashboardPayableTable({
  onDelete,
  onView,
  visibleRecords,
  ...props
}: DashboardPayableTableProps) {
  const recordsById = new Map(visibleRecords.map((record) => [record.id, record]))
  return (
    <DashboardDebtTable
      {...props}
      visibleRecords={visibleRecords.map(toPayableView)}
      onDelete={(record) => onDelete(recordsById.get(record.id)!)}
      onView={(record) => onView(recordsById.get(record.id)!)}
    />
  )
}
