"use client"

import Image from "next/image"

import type { PartResponseDTO } from "@/lib/dtos/part_dtos"
import { formatCurrencyTZS, toHumanForm } from "@/lib/formatters"
import type { AppLocale } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import type { ProductDialogCopy } from "./product-dialog-copy"

type ProductViewDialogProps = {
  copy: ProductDialogCopy
  locale: AppLocale
  part: PartResponseDTO
  onClose: () => void
}

function resolveStatusLabel(copy: ProductDialogCopy, status: PartResponseDTO["status"]) {
  if (status === "low_stock") return copy.lowStock
  if (status === "out_of_stock") return copy.outOfStock
  return copy.inStock
}

export function ProductViewDialog({
  copy,
  locale,
  part,
  onClose,
}: ProductViewDialogProps) {
  const details = [
    [copy.partName, part.partName],
    [copy.partNumber, part.partNumber],
    [copy.quantity, part.quantity.toString()],
    [copy.price, formatCurrencyTZS(part.price, locale)],
    [copy.category, part.categoryName ?? copy.uncategorized],
    [copy.status, resolveStatusLabel(copy, part.status)],
    [copy.createdAt, toHumanForm(part.createdAt, locale)],
  ]

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{copy.viewTitle}</DialogTitle>
          <DialogDescription>{copy.viewDescription}</DialogDescription>
        </DialogHeader>

        {part.imageUrl ? (
          <div className="relative h-44 w-full overflow-hidden rounded-lg border">
            <Image
              src={part.imageUrl}
              alt={part.partName}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        ) : null}

        <dl className="grid gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div key={label} className="space-y-1">
              <dt className="text-[13px] text-muted-foreground">{label}</dt>
              <dd className="break-words text-[15px] font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {copy.close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
