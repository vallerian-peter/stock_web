import { z } from "zod"

import type { OutgoingDialogCopy } from "./outgoing-dialog-copy"

export function createOutgoingSchema(messages: OutgoingDialogCopy["validation"]) {
  return z
    .object({
      dispatchNumber: z.string().trim().optional(),
      recipientName: z.string().trim().optional(),
      purpose: z.string().min(1, messages.purposeRequired),
      dispatchedAt: z.string().min(1, messages.dispatchedAtRequired),
      notes: z.string().trim().optional(),
      items: z
        .array(
          z.object({
            partId: z.number({ message: messages.partRequired }),
            quantity: z.number().int().min(1, messages.qtyRequired),
            unitPrice: z.number().min(0).optional(), // optional unless purpose === 'SALE'
          })
        )
        .min(1),
      
      // Sales options
      paymentStatus: z.string().optional(),
      paymentMethod: z.string().optional(),
      amountPaid: z.number().min(0).optional(),
    })
    .superRefine((data, ctx) => {
      const isSale = data.purpose.toUpperCase() === "SALE"
      if (isSale) {
        if (!data.paymentStatus) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.paymentStatusRequired,
            path: ["paymentStatus"],
          })
        }
        if (!data.paymentMethod) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.paymentMethodRequired,
            path: ["paymentMethod"],
          })
        }
      }
    })
}

export type OutgoingFormValues = z.infer<ReturnType<typeof createOutgoingSchema>>
