"use client"

import type { ReceivableRequestDTO } from "@/api/receivables_api"
import { DebtFormDialog } from "../../components/debt-form-dialog"
import type { DebtFormValues } from "../../components/debt-feature-types"
import type { ReceivableDialogCopy } from "./receivable-dialog-copy"

type ReceivableFormDialogProps = {
  copy: ReceivableDialogCopy
  onClose: () => void
  onSubmit: (values: ReceivableRequestDTO) => Promise<void> | void
}

export function ReceivableFormDialog({
  copy,
  onClose,
  onSubmit,
}: ReceivableFormDialogProps) {
  function mapValues(values: DebtFormValues): ReceivableRequestDTO {
    const { partyName, partyPhone, ...rest } = values
    return { ...rest, customerName: partyName, customerPhone: partyPhone }
  }

  return (
    <DebtFormDialog
      copy={copy}
      onClose={onClose}
      onSubmit={(values) => onSubmit(mapValues(values))}
    />
  )
}
