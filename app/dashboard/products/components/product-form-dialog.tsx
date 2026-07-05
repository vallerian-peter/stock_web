"use client"

import Image from "next/image"
import { useEffect, useMemo, useState, type FormEvent } from "react"
import { toast } from "sonner"

import type { CategoryResponseDTO } from "@/lib/dtos/category_dtos"
import type { PartResponseDTO } from "@/lib/dtos/part_dtos"
import { getApiErrorMessage } from "@/lib/api/request"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputField } from "@/components/ui/input-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { ProductDialogCopy } from "./product-dialog-copy"
import {
  createProductSchema,
  getProductFormErrors,
  type ProductFormErrors,
  type ProductFormMode,
  type ProductFormValues,
} from "./product-schema"

type ProductFormDialogProps = {
  mode: ProductFormMode
  copy: ProductDialogCopy
  categories: CategoryResponseDTO[]
  part?: PartResponseDTO
  onClose: () => void
  onSubmit: (
    values: ProductFormValues,
    imageFile: File | null
  ) => Promise<void> | void
}

function initialValues(part?: PartResponseDTO): ProductFormValues {
  return {
    partName: part?.partName ?? "",
    partNumber: part?.partNumber ?? "",
    quantity: part?.quantity?.toString() ?? "",
    price: part?.price ?? "",
    categoryId: part?.categoryId?.toString() ?? "none",
    status: part?.status ?? "in_stock",
  }
}

export function ProductFormDialog({
  mode,
  copy,
  categories,
  part,
  onClose,
  onSubmit,
}: ProductFormDialogProps) {
  const [values, setValues] = useState<ProductFormValues>(() =>
    initialValues(part)
  )
  const [errors, setErrors] = useState<ProductFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const previewUrl = useMemo(() => {
    if (!imageFile) {
      return part?.imageUrl ?? null
    }

    return URL.createObjectURL(imageFile)
  }, [imageFile, part?.imageUrl])

  useEffect(() => {
    if (!previewUrl?.startsWith("blob:")) {
      return
    }

    return () => {
      URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function updateField<Field extends keyof ProductFormValues>(
    field: Field,
    value: ProductFormValues[Field]
  ) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = createProductSchema(copy.validation).safeParse(values)

    if (!result.success) {
      setErrors(getProductFormErrors(result.error))
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit(result.data, imageFile)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const isEditing = mode === "edit"

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg">
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
            labelText={copy.partName}
            placeholder={copy.partNamePlaceholder}
            value={values.partName}
            errorText={errors.partName}
            disabled={isSubmitting}
            onChange={(event) => updateField("partName", event.target.value)}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              required
              labelText={copy.partNumber}
              placeholder={copy.partNumberPlaceholder}
              value={values.partNumber}
              errorText={errors.partNumber}
              disabled={isSubmitting}
              onChange={(event) => updateField("partNumber", event.target.value)}
            />
            <InputField
              required
              type="number"
              min="0"
              labelText={copy.quantity}
              placeholder={copy.quantityPlaceholder}
              value={values.quantity}
              errorText={errors.quantity}
              disabled={isSubmitting}
              onChange={(event) => updateField("quantity", event.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              required
              type="number"
              min="0"
              step="0.01"
              labelText={copy.price}
              placeholder={copy.pricePlaceholder}
              value={values.price}
              errorText={errors.price}
              disabled={isSubmitting}
              onChange={(event) => updateField("price", event.target.value)}
            />

            <Field>
              <FieldLabel>{copy.category}</FieldLabel>
              <Select
                value={values.categoryId}
                onValueChange={(value) => {
                  if (value) {
                    updateField("categoryId", value)
                  }
                }}
              >
                <SelectTrigger className="h-9 w-full" disabled={isSubmitting}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{copy.uncategorized}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field>
            <FieldLabel>{copy.image}</FieldLabel>
            <Input
              type="file"
              accept="image/*"
              disabled={isSubmitting}
              onChange={(event) => {
                setImageFile(event.target.files?.[0] ?? null)
              }}
            />
            <p className="text-xs text-muted-foreground">{copy.imageHelper}</p>
            {previewUrl ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  {copy.currentImage}
                </p>
                <div className="relative h-28 w-full overflow-hidden rounded-md border">
                  <Image
                    src={previewUrl}
                    alt={values.partName || copy.partName}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
            ) : null}
          </Field>

          <Field data-invalid={Boolean(errors.status)}>
            <FieldLabel>{copy.status}</FieldLabel>
            <Select
              value={values.status}
              onValueChange={(value) => {
                if (
                  value === "in_stock" ||
                  value === "low_stock" ||
                  value === "out_of_stock"
                ) {
                  updateField("status", value)
                }
              }}
            >
              <SelectTrigger
                className="h-9 w-full"
                aria-invalid={Boolean(errors.status)}
                disabled={isSubmitting}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_stock">{copy.inStock}</SelectItem>
                <SelectItem value="low_stock">{copy.lowStock}</SelectItem>
                <SelectItem value="out_of_stock">{copy.outOfStock}</SelectItem>
              </SelectContent>
            </Select>
            <FieldError errors={[{ message: errors.status }]} />
          </Field>

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
