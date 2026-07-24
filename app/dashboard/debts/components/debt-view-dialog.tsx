"use client"

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
import { cn } from "@/lib/utils"

import type { DebtDialogCopy, DebtRecordView } from "./debt-feature-types"

type DebtViewDialogProps = {
  copy: DebtDialogCopy
  numberLocale: string
  onClose: () => void
  record: DebtRecordView
}

export function DebtViewDialog({
  copy,
  numberLocale,
  onClose,
  record,
}: DebtViewDialogProps) {
  const statusStyles = {
    PAID: "bg-green-500/15 text-green-700 dark:text-green-300",
    PARTIAL: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
    PENDING: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  }
  const statusLabels = {
    PAID: copy.statusPaid,
    PARTIAL: copy.statusPartial,
    PENDING: copy.statusPending,
  }
  const details = [
    [copy.partyName, record.partyName],
    [copy.partyPhone, record.partyPhone || "—"],
    [copy.referenceNumber, record.referenceNumber || "—"],
    [copy.source, record.sourceId ? `#${record.sourceId}` : copy.manualEntry],
    [copy.debtDate, record.debtDate ? new Date(`${record.debtDate}T00:00:00`).toLocaleDateString(numberLocale) : "—"],
    [copy.dueDate, record.dueDate ? new Date(`${record.dueDate}T00:00:00`).toLocaleDateString(numberLocale) : "—"],
    [copy.createdBy, record.createdByName || "—"],
    [copy.createdAt, new Date(record.createdAt).toLocaleString(numberLocale)],
  ]

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] w-[95vw] overflow-y-auto rounded-2xl p-4 sm:w-full sm:max-w-[40rem] sm:p-6">
        <DialogHeader>
          <DialogTitle>{copy.viewTitle}</DialogTitle>
          <DialogDescription>{copy.viewDescription}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          <div className="rounded-2xl border border-border bg-neutral-950 p-5 text-neutral-100 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                  {copy.balanceAmount}
                </p>
                <p className="mt-1 text-2xl font-bold text-orange-400">
                  TZS {Number(record.balanceAmount).toLocaleString(numberLocale)}
                </p>
              </div>
              <Badge className={cn("border-0", statusStyles[record.status])}>
                {statusLabels[record.status]}
              </Badge>
            </div>

            <div className="mt-5 grid gap-4 border-t border-white/10 pt-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-neutral-400">{copy.totalAmount}</p>
                <p className="font-semibold">
                  TZS {Number(record.totalAmount).toLocaleString(numberLocale)}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">{copy.amountPaid}</p>
                <p className="font-semibold">
                  TZS {Number(record.amountPaid).toLocaleString(numberLocale)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-x-8 gap-y-4 rounded-xl border border-border bg-background/50 p-4 text-sm sm:grid-cols-2">
            {details.map(([label, value]) => (
              <div key={label}>
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <p className="mt-1 font-medium text-foreground">{value}</p>
              </div>
            ))}
            {record.notes ? (
              <div className="border-t border-border pt-4 sm:col-span-2">
                <p className="text-xs font-medium text-muted-foreground">{copy.notes}</p>
                <p className="mt-1 whitespace-pre-wrap leading-relaxed">{record.notes}</p>
              </div>
            ) : null}
          </div>
        </div>

        <DialogFooter className="border-t border-border pt-4">
          <Button onClick={onClose} className="bg-orange-500 text-white hover:bg-orange-600">
            {copy.close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
