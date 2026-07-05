import { z } from "zod"

import type { CategoryDialogCopy } from "./category-dialog-copy"

export type CategoryFormMode = "add" | "edit"

export function createCategorySchema(
  messages: CategoryDialogCopy["validation"]
) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, messages.nameRequired)
      .min(2, messages.nameLength),
  })
}

export type CategoryFormValues = z.infer<
  ReturnType<typeof createCategorySchema>
>

export type CategoryFormErrors = Partial<Record<keyof CategoryFormValues, string>>

export function getCategoryFormErrors(
  error: z.ZodError<CategoryFormValues>
): CategoryFormErrors {
  const errors: CategoryFormErrors = {}

  for (const issue of error.issues) {
    const field = issue.path[0] as keyof CategoryFormValues | undefined

    if (field && !errors[field]) {
      errors[field] = issue.message
    }
  }

  return errors
}
