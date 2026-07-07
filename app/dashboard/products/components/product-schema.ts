import { z } from "zod"

import type { ProductDialogCopy } from "./product-dialog-copy"

export type ProductFormMode = "add" | "edit"

export function createProductSchema(messages: ProductDialogCopy["validation"]) {
  return z.object({
    partName: z
      .string()
      .trim()
      .min(1, messages.partNameRequired)
      .min(2, messages.partNameLength),
    partNumber: z
      .string()
      .trim()
      .min(1, messages.partNumberRequired),
    quantity: z
      .string()
      .trim()
      .min(1, messages.quantityRequired)
      .regex(/^\d+$/, messages.quantityInvalid),
    price: z
      .string()
      .trim()
      .min(1, messages.priceRequired)
      .regex(/^\d+(\.\d{1,2})?$/, messages.priceInvalid),
    categoryId: z.string(),
    status: z.enum(["in_stock", "low_stock", "out_of_stock"]),
  })
}

export type ProductFormValues = z.infer<ReturnType<typeof createProductSchema>>

export type ProductFormErrors = Partial<Record<keyof ProductFormValues | "image", string>>

export function getProductFormErrors(
  error: z.ZodError<ProductFormValues>
): ProductFormErrors {
  const errors: ProductFormErrors = {}

  for (const issue of error.issues) {
    const field = issue.path[0] as keyof ProductFormValues | undefined

    if (field && !errors[field]) {
      errors[field] = issue.message
    }
  }

  return errors
}
