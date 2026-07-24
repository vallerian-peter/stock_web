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
import { Badge } from "@/components/ui/badge"
import { useLandingLocale } from "@/components/landing-locale-provider"
import type { OutgoingStockResponseDTO } from "@/api/outgoing_stocks_api"
import type { OutgoingDialogCopy } from "./outgoing-dialog-copy"

type OutgoingViewDialogProps = {
  copy: OutgoingDialogCopy
  dispatch: OutgoingStockResponseDTO
  onClose: () => void
}

export function OutgoingViewDialog({
  copy,
  dispatch,
  onClose,
}: OutgoingViewDialogProps) {
  const { locale } = useLandingLocale()
  const numberLocale = locale === "sw" ? "sw-TZ" : "en-TZ"

  function localizePurpose(purpose: string) {
    const purposes: Record<string, string> = {
      SALE: copy.purposeSale,
      DAMAGED: copy.purposeDamaged,
      RETURN: copy.purposeReturn,
    }
    return purposes[purpose.toUpperCase()] || purpose
  }

  function localizePaymentStatus(status: string) {
    const statuses: Record<string, string> = {
      PAID: copy.statusPaid,
      PENDING: copy.statusPending,
      PARTIAL: copy.statusPartial,
    }
    return statuses[status.toUpperCase()] || status
  }

  function localizePaymentMethod(method?: string | null) {
    if (!method) return "—"

    const methods: Record<string, string> = {
      CASH: copy.methodCash,
      MOBILE_MONEY: copy.methodMobileMoney,
      BANK_TRANSFER: copy.methodBankTransfer,
    }
    return methods[method.toUpperCase()] || method
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[92vh] overflow-y-auto rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-xl">
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
              <span className="font-semibold text-muted-foreground">{copy.purpose}: </span>
              <Badge className="ml-1 bg-orange-500/10 text-orange-700 dark:text-orange-300 border-0">
                {localizePurpose(dispatch.purpose)}
              </Badge>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">{copy.dispatchNumber}: </span>
              <span className="font-mono text-foreground ml-1">{dispatch.dispatchNumber || "—"}</span>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">{copy.dispatchedAt}: </span>
              <span className="font-medium text-foreground ml-1">
                {new Date(dispatch.dispatchedAt).toLocaleString(numberLocale)}
              </span>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">{copy.loggedBy}: </span>
              <span className="font-medium text-foreground ml-1">{dispatch.dispatchedByName || "—"}</span>
            </div>
            {dispatch.notes && (
              <div className="col-span-2 border-t border-border/40 pt-2 mt-2">
                <span className="font-semibold text-muted-foreground">{copy.notes}: </span>
                <p className="mt-1 text-foreground whitespace-pre-wrap leading-relaxed">
                  {dispatch.notes}
                </p>
              </div>
            )}
          </div>

          {/* Conditional Linked Sale block */}
          {dispatch.sale && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 space-y-2 text-xs">
              <h3 className="font-semibold text-green-800 dark:text-green-300 text-sm">
                {copy.saleTitle}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-semibold text-muted-foreground">{copy.paymentStatus}: </span>
                  <Badge className="ml-1 bg-green-500/25 text-green-800 dark:text-green-300 border-0">
                    {localizePaymentStatus(dispatch.sale.paymentStatus)}
                  </Badge>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">{copy.paymentMethod}: </span>
                  <span className="font-medium text-foreground ml-1">
                    {localizePaymentMethod(dispatch.sale.paymentMethod)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">{copy.amountPaid}: </span>
                  <span className="font-semibold text-foreground ml-1">
                    TZS {Number(dispatch.sale.amountPaid).toLocaleString(numberLocale)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">{copy.totalSaleValue}: </span>
                  <span className="font-bold text-green-700 dark:text-green-400 ml-1">
                    TZS {Number(dispatch.sale.totalAmount).toLocaleString(numberLocale)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="rounded-xl border border-border bg-background overflow-x-auto">
            <Table className="w-full min-w-[600px]">
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>{copy.partNameLabel}</TableHead>
                  <TableHead className="w-24 text-right">{copy.qtyLabel}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dispatch.items.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center font-medium text-muted-foreground text-xs">
                      {idx + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-xs">{item.partName}</span>
                        <span className="text-[9px] text-muted-foreground">
                          {copy.partNumberLabel}: {item.partNumber}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs">{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="text-xs text-muted-foreground">
            {copy.totalPartsDispatchedByQuantity}:{" "}
            {dispatch.items.reduce((acc, item) => acc + item.quantity, 0).toLocaleString(numberLocale)}
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
