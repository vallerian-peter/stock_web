"use client"

import Image from "next/image"

import type { PartResponseDTO } from "@/lib/dtos/part_dtos"
import { formatCurrencyTZS, toHumanForm } from "@/lib/formatters"
import type { AppLocale } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
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

function resolveStatusBadge(copy: ProductDialogCopy, status: PartResponseDTO["status"]) {
  if (status === "low_stock") {
    return <Badge className="bg-amber-500/20 text-amber-800 dark:text-amber-300">{copy.lowStock}</Badge>
  }

  if (status === "out_of_stock") {
    return <Badge variant="destructive">{copy.outOfStock}</Badge>
  }

  return <Badge className="bg-green-500/20 text-green-800 dark:text-green-300">{copy.inStock}</Badge>
}

export function ProductViewDialog({
  copy,
  locale,
  part,
  onClose,
}: ProductViewDialogProps) {
  const details: [string, React.ReactNode][] = [
    [copy.partName, part.partName],
    [copy.partNumber, part.partNumber],
    [copy.quantity, part.quantity.toString()],
    [copy.price, formatCurrencyTZS(part.price, locale)],
    [copy.category, part.categoryName ?? <span className="dark:text-white/40 text-black/40 italic">{copy.uncategorized}</span>],
    [copy.status, resolveStatusBadge(copy, part.status)],
    [copy.createdAt, toHumanForm(part.createdAt, locale)],
  ]

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{copy.viewTitle}</DialogTitle>
          <DialogDescription>{copy.viewDescription}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-row items-start gap-4">
          {part.imageUrl ? (
            <div className="relative h-full w-40 shrink-0 overflow-hidden rounded-lg border bg-muted/30">
              <Image
                src={part.imageUrl}
                alt={part.partName}
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          ) : null}

          <dl className="grid flex-1 gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2">
            {details.map(([label, value]) => (
              <div key={label as string} className="space-y-1">
                <dt className="text-[13px] text-muted-foreground">{label}</dt>
                <dd className="break-words text-[15px] font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {copy.close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
