"use client"

import { useState, type FormEvent } from "react"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import type { CategoryResponseDTO } from "@/lib/dtos/category_dtos"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import type { ProductDialogCopy } from "./product-dialog-copy"
import type { ProductFormValues } from "./product-schema"

type ProductBulkFormDialogProps = {
  copy: ProductDialogCopy
  categories: CategoryResponseDTO[]
  onClose: () => void
  onSubmit: (
    items: Array<{ values: ProductFormValues; imageFile: File | null }>
  ) => Promise<void> | void
}

interface BulkRow {
  localId: string
  partName: string
  partNumber: string
  quantity: string
  price: string
  categoryId: string
  status: "in_stock" | "low_stock" | "out_of_stock"
}

export function ProductBulkFormDialog({
  copy,
  categories,
  onClose,
  onSubmit,
}: ProductBulkFormDialogProps) {
  const [rows, setRows] = useState<BulkRow[]>([
    {
      localId: "initial-row-1",
      partName: "",
      partNumber: "",
      quantity: "1",
      price: "",
      categoryId: "none",
      status: "in_stock",
    },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  function addRow() {
    setRows((curr) => [
      ...curr,
      {
        localId: Math.random().toString(36).substring(7),
        partName: "",
        partNumber: "",
        quantity: "1",
        price: "",
        categoryId: "none",
        status: "in_stock",
      },
    ])
  }

  function removeRow(localId: string) {
    if (rows.length <= 1) {
      toast.warning("Please keep at least one product row.")
      return
    }
    setRows((curr) => curr.filter((r) => r.localId !== localId))
  }

  function updateRowField<Field extends keyof BulkRow>(
    localId: string,
    field: Field,
    value: BulkRow[Field]
  ) {
    setRows((curr) =>
      curr.map((r) => {
        if (r.localId === localId) {
          const nextRow = { ...r, [field]: value }
          if (field === "quantity") {
            const qty = Number(value)
            if (!Number.isNaN(qty)) {
              if (qty <= 0) {
                nextRow.status = "out_of_stock"
              } else if (qty <= 15) {
                nextRow.status = "low_stock"
              } else {
                nextRow.status = "in_stock"
              }
            }
          }
          return nextRow
        }
        return r
      })
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Validate all rows
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const rowNum = i + 1

      if (!row.partName.trim()) {
        toast.error(`Row ${rowNum}: ${copy.validation.partNameRequired}`)
        return
      }
      if (row.partName.trim().length < 2) {
        toast.error(`Row ${rowNum}: ${copy.validation.partNameLength}`)
        return
      }
      if (!row.partNumber.trim()) {
        toast.error(`Row ${rowNum}: ${copy.validation.partNumberRequired}`)
        return
      }
      if (!row.quantity.trim() || Number.isNaN(Number(row.quantity)) || Number(row.quantity) < 0) {
        toast.error(`Row ${rowNum}: ${copy.validation.quantityRequired}`)
        return
      }
      if (!row.price.trim() || Number.isNaN(Number(row.price)) || Number(row.price) < 0) {
        toast.error(`Row ${rowNum}: ${copy.validation.priceRequired}`)
        return
      }
    }

    const payload = rows.map((row) => ({
      values: {
        partName: row.partName,
        partNumber: row.partNumber,
        quantity: row.quantity,
        price: row.price,
        categoryId: row.categoryId,
        status: row.status,
      },
      imageFile: null,
    }))

    try {
      setIsSubmitting(true)
      await onSubmit(payload)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-xl flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-semibold text-foreground">
            {copy.bulkAddTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {copy.bulkAddDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-1 flex-col gap-6 overflow-hidden" noValidate>
          {/* Scrollable table container */}
          <div className="rounded-xl border border-border bg-background/50 overflow-hidden flex-1 [&_[data-slot=table-container]]:max-h-[380px] [&_[data-slot=table-container]]:overflow-y-auto">
            <Table className="w-full min-w-[800px]">
              <TableHeader className="bg-muted/40 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead className="min-w-[180px]">{copy.partName}</TableHead>
                  <TableHead className="w-44">{copy.partNumber}</TableHead>
                  <TableHead className="w-24 text-right">{copy.quantity}</TableHead>
                  <TableHead className="w-32 text-right">{copy.price}</TableHead>
                  <TableHead className="w-44">{copy.category}</TableHead>
                  <TableHead className="w-36">{copy.status}</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={row.localId} className="hover:bg-muted/10">
                    <TableCell className="text-center font-medium text-muted-foreground text-xs">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        placeholder={copy.partNamePlaceholder}
                        className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs focus:border-orange-500 focus:outline-hidden"
                        value={row.partName}
                        onChange={(e) =>
                          updateRowField(row.localId, "partName", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        placeholder={copy.partNumberPlaceholder}
                        className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs focus:border-orange-500 focus:outline-hidden"
                        value={row.partNumber}
                        onChange={(e) =>
                          updateRowField(row.localId, "partNumber", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="number"
                        min="0"
                        required
                        disabled={isSubmitting}
                        className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-right text-xs focus:border-orange-500 focus:outline-hidden"
                        value={row.quantity}
                        onChange={(e) =>
                          updateRowField(row.localId, "quantity", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        disabled={isSubmitting}
                        className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-right text-xs focus:border-orange-500 focus:outline-hidden"
                        value={row.price}
                        onChange={(e) =>
                          updateRowField(row.localId, "price", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={row.categoryId}
                        onValueChange={(value) => {
                          if (value) {
                            updateRowField(row.localId, "categoryId", value)
                          }
                        }}
                      >
                        <SelectTrigger className="h-9 w-full" disabled={isSubmitting}>
                          <SelectValue placeholder={copy.uncategorized} />
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
                    </TableCell>
                    <TableCell>
                      <Select
                        value={row.status}
                        onValueChange={(value) => {
                          if (
                            value === "in_stock" ||
                            value === "low_stock" ||
                            value === "out_of_stock"
                          ) {
                            updateRowField(row.localId, "status", value)
                          }
                        }}
                      >
                        <SelectTrigger className="h-9 w-full" disabled={isSubmitting}>
                          <SelectValue placeholder={copy.inStock} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in_stock">
                            {copy.inStock}
                          </SelectItem>
                          <SelectItem value="low_stock">
                            {copy.lowStock}
                          </SelectItem>
                          <SelectItem value="out_of_stock">
                            {copy.outOfStock}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-600"
                        onClick={() => removeRow(row.localId)}
                        disabled={isSubmitting}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-start shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl border-dashed"
              onClick={addRow}
              disabled={isSubmitting}
            >
              <PlusIcon className="size-4 mr-1.5" />
              {copy.addRow}
            </Button>
          </div>

          <DialogFooter className="border-t border-border pt-4 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl"
            >
              {copy.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium"
            >
              {isSubmitting ? <Spinner /> : copy.bulkCreate}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
