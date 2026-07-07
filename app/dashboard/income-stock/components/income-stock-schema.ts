import { z } from "zod"

import type { IncomeStockDialogCopy } from "./income-stock-dialog-copy"

export function createIncomeStockSchema(messages: IncomeStockDialogCopy["validation"]) {
  return z.object({
    invoiceNumber: z.string().trim().optional(),
    supplierName: z.string().trim().min(1, messages.supplierRequired),
    receivedAt: z.string().min(1, messages.receivedAtRequired),
    notes: z.string().trim().optional(),
    items: z
      .array(
        z.object({
          partId: z.number({ message: messages.partRequired }),
          quantity: z.number().int().min(1, messages.qtyRequired),
          unitCost: z.number().min(0, messages.costRequired),
        })
      )
      .min(1),
  })
}

export type IncomeStockFormValues = z.infer<ReturnType<typeof createIncomeStockSchema>>
