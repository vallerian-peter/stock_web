"use client"

import type { ReceivableResponseDTO } from "@/api/receivables_api"
import { DebtViewDialog } from "../../components/debt-view-dialog"
import { toReceivableView } from "./dashboard-receivable-table"
import type { ReceivableDialogCopy } from "./receivable-dialog-copy"

type ReceivableViewDialogProps = {
  copy: ReceivableDialogCopy
  numberLocale: string
  onClose: () => void
  record: ReceivableResponseDTO
}

export function ReceivableViewDialog({ record, ...props }: ReceivableViewDialogProps) {
  return <DebtViewDialog {...props} record={toReceivableView(record)} />
}
