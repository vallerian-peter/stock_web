"use client"

import { useState, type FormEvent } from "react"
import { toast } from "sonner"

import { getApiErrorMessage } from "@/lib/api/request"
import type { CategoryResponseDTO } from "@/lib/dtos/category_dtos"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InputField } from "@/components/ui/input-field"

import type { CategoryDialogCopy } from "./category-dialog-copy"
import {
  createCategorySchema,
  getCategoryFormErrors,
  type CategoryFormErrors,
  type CategoryFormMode,
  type CategoryFormValues,
} from "./category-schema"

type CategoryFormDialogProps = {
  mode: CategoryFormMode
  copy: CategoryDialogCopy
  category?: CategoryResponseDTO
  onClose: () => void
  onSubmit: (values: CategoryFormValues) => Promise<void> | void
}

function initialValues(category?: CategoryResponseDTO): CategoryFormValues {
  return {
    name: category?.name ?? "",
  }
}

export function CategoryFormDialog({
  mode,
  copy,
  category,
  onClose,
  onSubmit,
}: CategoryFormDialogProps) {
  const [values, setValues] = useState<CategoryFormValues>(() =>
    initialValues(category)
  )
  const [errors, setErrors] = useState<CategoryFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = createCategorySchema(copy.validation).safeParse(values)

    if (!result.success) {
      setErrors(getCategoryFormErrors(result.error))
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit(result.data)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const isEditing = mode === "edit"

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? copy.editTitle : copy.addTitle}</DialogTitle>
          <DialogDescription>
            {isEditing ? copy.editDescription : copy.addDescription}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <InputField
            autoFocus
            required
            labelText={copy.name}
            placeholder={copy.namePlaceholder}
            value={values.name}
            errorText={errors.name}
            disabled={isSubmitting}
            onChange={(event) => {
              setValues({ name: event.target.value })
              setErrors({})
            }}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {copy.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? copy.save : copy.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
