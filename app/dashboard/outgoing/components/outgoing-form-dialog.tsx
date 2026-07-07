"use client"

import { useEffect, useState, type FormEvent } from "react"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { getParts } from "@/api/parts_api"
import { getApiErrorMessage } from "@/lib/api/request"
import { Button } from "@/components/ui/button"
import { useLandingLocale } from "@/components/landing-locale-provider"
import { SalesFormDialog } from "@/app/dashboard/sales/components/sales-form-dialog"
import { salesDialogCopy } from "@/app/dashboard/sales/components/sales-dialog-copy"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { InputField } from "@/components/ui/input-field"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { PartResponseDTO } from "@/lib/dtos/part_dtos"
import type { OutgoingDialogCopy } from "./outgoing-dialog-copy"
import { Spinner } from "@/components/ui/spinner"

type OutgoingFormDialogProps = {
  copy: OutgoingDialogCopy
  onClose: () => void
  onSubmit: (values: Record<string, unknown>) => Promise<void> | void
}

interface OutgoingInlineRow {
  localId: string
  partId: string
  partSearchText: string
  quantity: number
  unitPrice: number // for SALES
  showDropdown: boolean
}

export function OutgoingFormDialog({
  copy,
  onClose,
  onSubmit,
}: OutgoingFormDialogProps) {
  const { locale } = useLandingLocale()
  const [showSaleDialog, setShowSaleDialog] = useState(false)
  const [isSaleLinked, setIsSaleLinked] = useState(false)

  const [dispatchNumber, setDispatchNumber] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [purpose, setPurpose] = useState("TECHNICIAN") // Default to TECHNICIAN
  const [dispatchedAt, setDispatchedAt] = useState(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  })
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState<OutgoingInlineRow[]>([
    {
      localId: "initial-row",
      partId: "",
      partSearchText: "",
      quantity: 1,
      unitPrice: 0,
      showDropdown: false,
    },
  ])

  // Sales specific fields
  const [customerName, setCustomerName] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("PAID")
  const [paymentMethod, setPaymentMethod] = useState("CASH")
  const [amountPaid, setAmountPaid] = useState<number | "">("")

  const [catalogParts, setCatalogParts] = useState<PartResponseDTO[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await getParts({ page: 1, perPage: 250 })
        setCatalogParts(res.data)
      } catch (err) {
        toast.error(getApiErrorMessage(err))
      }
    }
    void loadCatalog()
  }, [])

  const isSale = purpose.toUpperCase() === "SALE"

  function addRow() {
    setItems((curr) => [
      ...curr,
      {
        localId: Math.random().toString(36).substring(7),
        partId: "",
        partSearchText: "",
        quantity: 1,
        unitPrice: 0,
        showDropdown: false,
      },
    ])
  }

  function removeRow(localId: string) {
    if (items.length <= 1) {
      toast.warning(copy.emptyPartsWarning)
      return
    }
    setItems((curr) => curr.filter((row) => row.localId !== localId))
  }

  function updateRow<Field extends keyof OutgoingInlineRow>(
    localId: string,
    field: Field,
    value: OutgoingInlineRow[Field]
  ) {
    setItems((curr) =>
      curr.map((row) => (row.localId === localId ? { ...row, [field]: value } : row))
    )
  }

  const grandTotal = items.reduce((acc, row) => acc + row.quantity * row.unitPrice, 0)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Validate purpose
    if (!purpose) {
      toast.error(copy.validation.purposeRequired)
      return
    }

    if (isSale && !isSaleLinked) {
      toast.error(copy.saleRequiredError)
      return
    }

    if (!dispatchedAt) {
      toast.error(copy.validation.dispatchedAtRequired)
      return
    }

    // Validate items
    const parsedItems = items.map((row) => ({
      partId: Number(row.partId),
      quantity: Number(row.quantity),
      unitPrice: isSale ? Number(row.unitPrice) : undefined,
    }))

    for (const parsed of parsedItems) {
      if (Number.isNaN(parsed.partId) || parsed.partId <= 0) {
        toast.error(copy.validation.partRequired)
        return
      }
      if (Number.isNaN(parsed.quantity) || parsed.quantity < 1) {
        toast.error(copy.validation.qtyRequired)
        return
      }
      if (isSale && (parsed.unitPrice === undefined || Number.isNaN(parsed.unitPrice) || parsed.unitPrice < 0)) {
        toast.error("Unit price is required for counter sales.")
        return
      }

      // Check stock limit
      const catalogItem = catalogParts.find((p) => p.id === parsed.partId)
      if (catalogItem && catalogItem.quantity < parsed.quantity) {
        toast.error(
          `Insufficient stock for "${catalogItem.partName}". Available: ${catalogItem.quantity}`
        )
        return
      }
    }

    const payload: Record<string, unknown> = {
      dispatchNumber: dispatchNumber.trim() || undefined,
      recipientName: isSale ? (customerName.trim() || recipientName.trim()) : recipientName.trim(),
      purpose,
      dispatchedAt: new Date(dispatchedAt).toISOString(),
      notes: notes.trim() || undefined,
      items: parsedItems,
    }

    if (isSale) {
      payload.customerName = customerName.trim() || recipientName.trim() || "Walk-in Customer"
      payload.paymentStatus = paymentStatus
      payload.paymentMethod = paymentMethod
      payload.amountPaid = amountPaid === "" ? grandTotal : Number(amountPaid)
      payload.saleNumber = dispatchNumber.trim() || undefined
    }

    try {
      setIsSubmitting(true)
      await onSubmit(payload)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[92vh] overflow-y-auto rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {copy.addTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {copy.addDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 min-w-0 w-full space-y-6" noValidate>
          {/* Header Metadata fields — stack on mobile, expand at breakpoints */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field>
              <FieldLabel>{copy.purpose}</FieldLabel>
              <Select value={purpose} onValueChange={(val) => val && setPurpose(val)}>
                <SelectTrigger className="h-9 w-full rounded-xl bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SALE">{copy.purposeSale}</SelectItem>
                  <SelectItem value="TECHNICIAN">{copy.purposeTechnician}</SelectItem>
                  <SelectItem value="DAMAGED">{copy.purposeDamaged}</SelectItem>
                  <SelectItem value="RETURN">{copy.purposeReturn}</SelectItem>
                  <SelectItem value="TRANSFER">{copy.purposeTransfer}</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <InputField
              labelText={isSale ? copy.customerName : copy.recipientName}
              placeholder={isSale ? copy.customerName : copy.recipientPlaceholder}
              value={isSale ? customerName : recipientName}
              disabled={isSubmitting}
              onChange={(e) => {
                if (isSale) setCustomerName(e.target.value)
                else setRecipientName(e.target.value)
              }}
            />

            <InputField
              labelText={copy.dispatchNumber}
              placeholder={copy.dispatchNumberPlaceholder}
              value={dispatchNumber}
              disabled={isSubmitting}
              onChange={(e) => setDispatchNumber(e.target.value)}
            />

            <InputField
              type="datetime-local"
              labelText={copy.dispatchedAt}
              value={dispatchedAt}
              required
              disabled={isSubmitting}
              onChange={(e) => setDispatchedAt(e.target.value)}
            />
          </div>

          {/* Conditional Linked Sale Fields */}
          {isSale && (
            <div className="rounded-xl border border-dashed border-orange-500/30 bg-orange-500/5 p-4 space-y-4">
              <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-300">
                {copy.saleTitle}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isSaleLinked ? copy.saleLinkedSuccess : copy.saleLinkInstructions}
              </p>

              {isSaleLinked ? (
                <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-xs space-y-2">
                  <div className="flex flex-wrap gap-x-6 gap-y-1 font-medium text-foreground">
                    <span>
                      <strong>{copy.customerName}:</strong> {customerName || "Walk-in Customer"}
                    </span>
                    <span>
                      <strong>{copy.paymentStatus}:</strong> {paymentStatus}
                    </span>
                    <span>
                      <strong>{copy.paymentMethod}:</strong> {paymentMethod}
                    </span>
                    <span>
                      <strong>{copy.amountPaid}:</strong> TZS {Number(amountPaid || grandTotal).toLocaleString()}
                    </span>
                  </div>
                  {notes && (
                    <div className="text-[11px] text-muted-foreground border-t border-green-500/10 pt-1.5 mt-1.5 font-normal">
                      <strong>{copy.notes}:</strong> {notes}
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-lg text-red-500 hover:bg-red-500/10 hover:text-red-600 font-medium"
                      onClick={() => {
                        setIsSaleLinked(false)
                        setItems([
                          {
                            localId: "initial-row",
                            partId: "",
                            partSearchText: "",
                            quantity: 1,
                            unitPrice: 0,
                            showDropdown: false,
                          },
                        ])
                        setCustomerName("")
                        setPaymentStatus("PAID")
                        setPaymentMethod("CASH")
                        setAmountPaid("")
                      }}
                    >
                      {copy.changeBtn} (Unlink)
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-dashed border-orange-500 text-orange-600 hover:bg-orange-500/10 rounded-xl py-5 font-semibold"
                  onClick={() => setShowSaleDialog(true)}
                >
                  <PlusIcon className="size-4 mr-2" />
                  {copy.createSaleRecordBtn}
                </Button>
              )}
            </div>
          )}

          <Field>
            <FieldLabel>{copy.notes}</FieldLabel>
            <Textarea
              placeholder={copy.notesPlaceholder}
              value={notes}
              disabled={isSubmitting}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-16 rounded-xl border-border bg-background"
            />
          </Field>

          {/* Inline Batch Input Table — self-contained card, scrolls internally on small screens */}
          <div className="w-full min-w-0 rounded-xl border border-border bg-background/50 overflow-hidden">
            <div className="w-full overflow-x-auto [&_[data-slot=table-container]]:max-h-[320px] [&_[data-slot=table-container]]:overflow-y-auto">
              <Table className="w-full min-w-[700px]">
                <TableHeader className="bg-muted/40 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead className="min-w-[280px]">{copy.partSearchPlaceholder}</TableHead>
                  <TableHead className="w-24 text-right">{copy.qtyLabel}</TableHead>
                  {isSale && <TableHead className="w-32 text-right">{copy.salePriceLabel}</TableHead>}
                  {isSale && <TableHead className="w-36 text-right">{salesDialogCopy[locale].subtotalLabel}</TableHead>}
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((row, index) => {
                  const matchingPart = catalogParts.find((p) => String(p.id) === row.partId)

                  return (
                    <TableRow key={row.localId} className="hover:bg-muted/10">
                      <TableCell className="text-center font-medium text-muted-foreground text-xs">
                        {index + 1}
                      </TableCell>
                      <TableCell className="relative">
                        <div className="flex flex-col gap-1">
                          {matchingPart ? (
                            <div className="flex items-center justify-between rounded-lg border border-orange-500/20 bg-orange-500/5 px-2.5 py-1 text-xs">
                              <div className="flex flex-col">
                                <span className="font-semibold text-foreground">
                                  {matchingPart.partName}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  SKU: {matchingPart.partNumber} | Available: {matchingPart.quantity}
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="xs"
                                className="h-6 w-12 text-[10px] hover:bg-orange-500/10 hover:text-orange-600"
                                onClick={() => {
                                  updateRow(row.localId, "partId", "")
                                  updateRow(row.localId, "partSearchText", "")
                                }}
                              >
                                {copy.changeBtn}
                              </Button>
                            </div>
                          ) : (
                            <Popover 
                              open={row.showDropdown && row.partSearchText.trim().length > 0} 
                              onOpenChange={(open) => {
                                if (!open) updateRow(row.localId, "showDropdown", false)
                              }}
                            >
                              <PopoverTrigger>
                                <div className="relative w-full">
                                  <input
                                    type="text"
                                    placeholder={copy.partSearchPlaceholder}
                                    className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs focus:border-orange-500 focus:outline-hidden"
                                    value={row.partSearchText}
                                    onChange={(e) => {
                                      updateRow(row.localId, "partSearchText", e.target.value)
                                      updateRow(row.localId, "showDropdown", true)
                                    }}
                                    onFocus={() => updateRow(row.localId, "showDropdown", true)}
                                  />
                                </div>
                              </PopoverTrigger>
                              <PopoverContent 
                                align="start" 
                                className="w-[300px] p-1 max-h-48 overflow-y-auto"
                                initialFocus={false}
                              >
                                {catalogParts
                                  .filter(
                                    (part) =>
                                      part.partName
                                        .toLowerCase()
                                        .includes(row.partSearchText.toLowerCase()) ||
                                      part.partNumber
                                        .toLowerCase()
                                        .includes(row.partSearchText.toLowerCase())
                                  )
                                  .map((part) => (
                                    <button
                                      type="button"
                                      key={part.id}
                                      className="flex w-full flex-col px-3 py-1.5 text-left text-xs transition hover:bg-muted rounded-md"
                                      onClick={() => {
                                        updateRow(row.localId, "partId", String(part.id))
                                        updateRow(row.localId, "showDropdown", false)
                                        updateRow(row.localId, "unitPrice", Number(part.price))
                                      }}
                                    >
                                      <span className="font-semibold text-foreground">
                                        {part.partName}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground">
                                        No: {part.partNumber} | Current Stock: {part.quantity}
                                      </span>
                                    </button>
                                  ))}
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <input
                          type="number"
                          min="1"
                          required
                          disabled={isSubmitting || isSale}
                          className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-right text-xs focus:border-orange-500 focus:outline-hidden disabled:opacity-80 disabled:cursor-not-allowed"
                          value={row.quantity}
                          onChange={(e) => updateRow(row.localId, "quantity", Number(e.target.value))}
                        />
                      </TableCell>
                      {isSale && (
                        <TableCell>
                          <input
                            type="number"
                            min="0"
                            required
                            disabled={isSubmitting || isSale}
                            className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-right text-xs focus:border-orange-500 focus:outline-hidden disabled:opacity-80 disabled:cursor-not-allowed"
                            value={row.unitPrice}
                            onChange={(e) => updateRow(row.localId, "unitPrice", Number(e.target.value))}
                          />
                        </TableCell>
                      )}
                      {isSale && (
                        <TableCell className="text-right font-semibold text-xs text-foreground py-4 px-3">
                          TZS {(row.quantity * row.unitPrice).toLocaleString()}
                        </TableCell>
                      )}
                      <TableCell className="text-center">
                        {!isSale && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-600"
                            onClick={() => removeRow(row.localId)}
                          >
                            <Trash2Icon className="size-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl border-dashed text-left w-auto!"
              onClick={addRow}
              disabled={isSubmitting}
            >
              <PlusIcon className="size-4 mr-1.5" />
              {copy.addRowBtn}
            </Button>
            {isSale && (
              <div className="text-right">
                <span className="text-xs text-muted-foreground">Grand Total: </span>
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400 ml-1.5">
                  TZS {grandTotal.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <DialogFooter className="flex w-full flex-row items-center justify-end border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl"
            >
              {copy.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white">
              {isSubmitting ? <Spinner /> : copy.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    {showSaleDialog ? (
      <SalesFormDialog
        copy={salesDialogCopy[locale]}
        onClose={() => setShowSaleDialog(false)}
        onSubmit={(saleValues) => {
          // Auto link it!
          // 1. Map saleValues.items to parent items
          const mappedItems = (saleValues.items as Array<{ partId: number; quantity: number; unitPrice: number }>).map((item) => {
            const catalogItem = catalogParts.find((p) => p.id === item.partId)
            return {
              localId: Math.random().toString(36).substring(7),
              partId: String(item.partId),
              partSearchText: catalogItem ? catalogItem.partName : "",
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              showDropdown: false,
            };
          })
          setItems(mappedItems)

          // 2. Set sale fields
          setCustomerName(saleValues.customerName || "")
          setPaymentStatus(saleValues.paymentStatus || "PAID")
          setPaymentMethod(saleValues.paymentMethod || "CASH")
          setAmountPaid(saleValues.amountPaid)
          if (saleValues.saleNumber) {
            setDispatchNumber(saleValues.saleNumber)
          }
          if (saleValues.notes) {
            setNotes(saleValues.notes)
          }
          setIsSaleLinked(true)
          setShowSaleDialog(false)
          toast.success(copy.saleLinkedSuccess)
        }}
      />
    ) : null}
    </>
  )
}
