"use client"

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

import type { CategoryDialogCopy } from "./category-dialog-copy"

type CategoryViewDialogProps = {
  copy: CategoryDialogCopy
  category: CategoryResponseDTO
  onClose: () => void
}

export function CategoryViewDialog({
  copy,
  category,
  onClose,
}: CategoryViewDialogProps) {
  const details = [
    [copy.name, category.name],
    [copy.createdAt, category.createdAt],
  ]

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{copy.viewTitle}</DialogTitle>
          <DialogDescription>{copy.viewDescription}</DialogDescription>
        </DialogHeader>

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
