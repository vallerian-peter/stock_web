"use client"

import type { ReceivableResponseDTO } from "@/api/receivables_api"
import { DashboardDebtTable } from "../../components/dashboard-debt-table"
import type { DebtRecordView } from "../../components/debt-feature-types"
import type { ReceivableDialogCopy } from "./receivable-dialog-copy"

export function toReceivableView(record: ReceivableResponseDTO): DebtRecordView {
  return {
    ...record,
    sourceId: record.saleId,
    partyName: record.customerName,
    partyPhone: record.customerPhone,
  }
}

type DashboardReceivableTableProps = {
  copy: ReceivableDialogCopy
  formatDate: (value: string) => string
  numberLocale: string
  onDelete: (record: ReceivableResponseDTO) => void
  onView: (record: ReceivableResponseDTO) => void
  pageStartIndex: number
  visibleRecords: ReceivableResponseDTO[]
}

export function DashboardReceivableTable({
  onDelete,
  onView,
  visibleRecords,
  ...props
}: DashboardReceivableTableProps) {
  const recordsById = new Map(visibleRecords.map((record) => [record.id, record]))
  return (
    <DashboardDebtTable
      {...props}
      visibleRecords={visibleRecords.map(toReceivableView)}
      onDelete={(record) => onDelete(recordsById.get(record.id)!)}
      onView={(record) => onView(recordsById.get(record.id)!)}
    />
  )
}
