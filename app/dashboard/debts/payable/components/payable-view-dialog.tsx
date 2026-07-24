"use client"

import type { PayableResponseDTO } from "@/api/payables_api"
import { DebtViewDialog } from "../../components/debt-view-dialog"
import { toPayableView } from "./dashboard-payable-table"
import type { PayableDialogCopy } from "./payable-dialog-copy"

type PayableViewDialogProps = {
  copy: PayableDialogCopy
  numberLocale: string
  onClose: () => void
  record: PayableResponseDTO
}

export function PayableViewDialog({ record, ...props }: PayableViewDialogProps) {
  return <DebtViewDialog {...props} record={toPayableView(record)} />
}
