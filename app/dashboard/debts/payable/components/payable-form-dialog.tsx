"use client"

import type { PayableRequestDTO } from "@/api/payables_api"
import { DebtFormDialog } from "../../components/debt-form-dialog"
import type { DebtFormValues } from "../../components/debt-feature-types"
import type { PayableDialogCopy } from "./payable-dialog-copy"

type PayableFormDialogProps = {
  copy: PayableDialogCopy
  onClose: () => void
  onSubmit: (values: PayableRequestDTO) => Promise<void> | void
}

export function PayableFormDialog({ copy, onClose, onSubmit }: PayableFormDialogProps) {
  function mapValues(values: DebtFormValues): PayableRequestDTO {
    const { partyName, partyPhone, ...rest } = values
    return { ...rest, creditorName: partyName, creditorPhone: partyPhone }
  }

  return (
    <DebtFormDialog
      copy={copy}
      onClose={onClose}
      onSubmit={(values) => onSubmit(mapValues(values))}
    />
  )
}
