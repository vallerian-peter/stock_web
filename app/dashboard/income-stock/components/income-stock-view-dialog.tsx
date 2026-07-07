"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { IncomingStockResponseDTO } from "@/api/incoming_stocks_api"
import type { IncomeStockDialogCopy } from "./income-stock-dialog-copy"

type IncomeStockViewDialogProps = {
  copy: IncomeStockDialogCopy
  intake: IncomingStockResponseDTO
  onClose: () => void
}

export function IncomeStockViewDialog({
  copy,
  intake,
  onClose,
}: IncomeStockViewDialogProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] w-[90vw] max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {copy.viewTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {copy.viewDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-background/50 p-4 text-xs">
            <div>
              <span className="font-semibold text-muted-foreground">{copy.supplierName}: </span>
              <span className="font-medium text-foreground ml-1">{intake.supplierName || "—"}</span>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">{copy.invoiceNumber}: </span>
              <span className="font-mono text-foreground ml-1">{intake.invoiceNumber || "—"}</span>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">{copy.receivedAt}: </span>
              <span className="font-medium text-foreground ml-1">
                {new Date(intake.receivedAt).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">{copy.loggedBy}: </span>
              <span className="font-medium text-foreground ml-1">{intake.receivedByName || "—"}</span>
            </div>
            {intake.notes && (
              <div className="col-span-2 border-t border-border/40 pt-2 mt-2">
                <span className="font-semibold text-muted-foreground">{copy.notes}: </span>
                <p className="mt-1 text-foreground whitespace-pre-wrap leading-relaxed">
                  {intake.notes}
                </p>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="rounded-xl border border-border bg-background overflow-x-auto">
            <Table className="w-full min-w-[600px]">
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Part Name</TableHead>
                  <TableHead className="w-24 text-right">{copy.qtyLabel}</TableHead>
                  <TableHead className="w-32 text-right">{copy.unitCostLabel}</TableHead>
                  <TableHead className="w-36 text-right">{copy.subtotalLabel}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {intake.items.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center font-medium text-muted-foreground text-xs">
                      {idx + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-xs">{item.partName}</span>
                        <span className="text-[9px] text-muted-foreground">No: {item.partNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs">{item.quantity}</TableCell>
                    <TableCell className="text-right text-xs">
                      TZS {Number(item.unitCost).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-xs text-foreground">
                      TZS {Number(item.subtotal).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Total amount of parts: {intake.items.reduce((acc, i) => acc + i.quantity, 0)}
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-muted-foreground">Grand Total: </span>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400 ml-1.5">
                TZS {Number(intake.totalAmount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border pt-4">
          <Button onClick={onClose} className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white">
            {copy.close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
