"use client"

import { useEffect, useState, type FormEvent } from "react"
import { CheckCircle2Icon, PencilIcon, PlusIcon, Trash2Icon, UnlinkIcon } from "lucide-react"
import { toast } from "sonner"

import { getParts } from "@/api/parts_api"
import type { OutgoingStockRequestDTO } from "@/api/outgoing_stocks_api"
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
import { Checkbox } from "@/components/ui/checkbox"
import { DateTimeInputField } from "@/components/ui/date-input-field"
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
  onSubmit: (values: OutgoingStockRequestDTO) => Promise<void> | void
}

interface OutgoingInlineRow {
  localId: string
  partId: string
  partSearchText: string
  quantity: number
  unitPrice: number // for SALES
  showDropdown: boolean
}

function createDispatchNumber() {
  return Date.now().toString()
}

export function OutgoingFormDialog({
  copy,
  onClose,
  onSubmit,
}: OutgoingFormDialogProps) {
  const { locale } = useLandingLocale()
  const numberLocale = locale === "sw" ? "sw-TZ" : "en-TZ"
  const [showSaleDialog, setShowSaleDialog] = useState(false)
  const [isSaleLinked, setIsSaleLinked] = useState(false)

  const [dispatchNumber, setDispatchNumber] = useState(() => createDispatchNumber())
  const [isManualDispatchNumber, setIsManualDispatchNumber] = useState(false)
  const [purpose, setPurpose] = useState("DAMAGED")
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
  const [customerPhone, setCustomerPhone] = useState("")
  const [isDebt, setIsDebt] = useState(false)
  const [debtDueDate, setDebtDueDate] = useState("")
  const [saleNumber, setSaleNumber] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("PAID")
  const [paymentMethod, setPaymentMethod] = useState("CASH")
  const [amountPaid, setAmountPaid] = useState<number | "">("")
  const [additionalAmount, setAdditionalAmount] = useState(0)
  const [saleSoldAt, setSaleSoldAt] = useState("")

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
  const linkedSaleTotal = grandTotal + additionalAmount

  function localizePaymentStatus(status: string) {
    const statuses: Record<string, string> = {
      PAID: copy.statusPaid,
      PENDING: copy.statusPending,
      PARTIAL: copy.statusPartial,
    }
    return statuses[status.toUpperCase()] || status
  }

  function localizePaymentMethod(method: string) {
    const methods: Record<string, string> = {
      CASH: copy.methodCash,
      MOBILE_MONEY: copy.methodMobileMoney,
      BANK_TRANSFER: copy.methodBankTransfer,
    }
    return methods[method.toUpperCase()] || method
  }

  function unlinkSale() {
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
    setCustomerPhone("")
    setIsDebt(false)
    setDebtDueDate("")
    setSaleNumber("")
    setPaymentStatus("PAID")
    setPaymentMethod("CASH")
    setAmountPaid("")
    setAdditionalAmount(0)
    setSaleSoldAt("")
  }

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
        toast.error(copy.validation.unitPriceRequired)
        return
      }

      // Check stock limit
      const catalogItem = catalogParts.find((p) => p.id === parsed.partId)
      if (catalogItem && catalogItem.quantity < parsed.quantity) {
        toast.error(
          `${copy.insufficientStock} "${catalogItem.partName}". ${copy.available}: ${catalogItem.quantity.toLocaleString(numberLocale)}`
        )
        return
      }
    }

    const resolvedDispatchNumber = dispatchNumber.trim() || createDispatchNumber()

    const payload: OutgoingStockRequestDTO = {
      dispatchNumber: resolvedDispatchNumber,
      purpose,
      dispatchedAt: new Date(dispatchedAt).toISOString(),
      notes: notes.trim() || undefined,
      items: parsedItems,
    }

    if (isSale) {
      payload.customerName = customerName.trim() || undefined
      payload.customerPhone = isDebt ? customerPhone.trim() || undefined : undefined
      payload.isDebt = isDebt
      payload.debtDueDate = isDebt && debtDueDate ? debtDueDate : undefined
      payload.paymentStatus = paymentStatus
      payload.paymentMethod = paymentMethod
      payload.amountPaid = amountPaid === "" ? linkedSaleTotal : Number(amountPaid)
      payload.additionalAmount = additionalAmount
      payload.saleNumber = saleNumber.trim() || undefined
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
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field>
                <FieldLabel>{copy.purpose}</FieldLabel>
                <Select value={purpose} onValueChange={(val) => val && setPurpose(val)}>
                  <SelectTrigger className="h-9 w-full rounded-xl bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SALE">{copy.purposeSale}</SelectItem>
                    <SelectItem value="DAMAGED">{copy.purposeDamaged}</SelectItem>
                    <SelectItem value="RETURN">{copy.purposeReturn}</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {isManualDispatchNumber ? (
                <InputField
                  labelText={copy.dispatchNumber}
                  placeholder={copy.dispatchNumberPlaceholder}
                  value={dispatchNumber}
                  disabled={isSubmitting}
                  onChange={(e) => setDispatchNumber(e.target.value)}
                />
              ) : null}

              <DateTimeInputField
                labelText={copy.dispatchedAt}
                value={dispatchedAt}
                required
                disabled={isSubmitting}
                onValueChange={setDispatchedAt}
              />
            </div>

            <label className="flex items-start gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2 text-xs">
              <Checkbox
                checked={isManualDispatchNumber}
                disabled={isSubmitting}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true
                  setIsManualDispatchNumber(isChecked)
                  if (!isChecked) {
                    setDispatchNumber(createDispatchNumber())
                  }
                }}
                className="mt-0.5"
              />
              <span className="space-y-0.5">
                <span className="block font-medium text-foreground">
                  {copy.manualDispatchNumberLabel}
                </span>
                <span className="block text-muted-foreground">
                  {copy.manualDispatchNumberDescription}
                </span>
              </span>
            </label>
          </div>

          {/* Conditional Linked Sale Fields */}
          {isSale && (
            isSaleLinked ? (
              <section className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-sm">
                <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                      <CheckCircle2Icon className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white">{copy.saleTitle}</h3>
                      <p className="text-[11px] text-zinc-400">{copy.saleLinkedSuccess}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 border-zinc-700 bg-zinc-900 px-3 text-zinc-200 hover:bg-zinc-800 hover:text-white"
                      onClick={() => setShowSaleDialog(true)}
                    >
                      <PencilIcon className="size-3.5" />
                      {copy.editSaleRecordBtn}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      onClick={unlinkSale}
                    >
                      <UnlinkIcon className="size-3.5" />
                      {copy.unlinkSaleRecordBtn}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    [copy.customerName, customerName || copy.walkInCustomer],
                    [copy.paymentStatus, localizePaymentStatus(paymentStatus)],
                    [copy.paymentMethod, localizePaymentMethod(paymentMethod)],
                    [
                      copy.amountPaid,
                      `TZS ${Number(amountPaid === "" ? linkedSaleTotal : amountPaid).toLocaleString(numberLocale)}`,
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="min-w-0 bg-zinc-950 px-4 py-3"
                    >
                      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                        {label}
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-zinc-100">{value}</p>
                    </div>
                  ))}
                </div>

                {notes ? (
                  <div className="border-t border-white/10 px-4 py-3">
                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                      {copy.notes}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-zinc-300">
                      {notes}
                    </p>
                  </div>
                ) : null}
              </section>
            ) : (
              <div className="space-y-4 rounded-xl border border-border bg-background/50 p-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{copy.saleTitle}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{copy.saleLinkInstructions}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-dashed border-orange-500 text-orange-600 hover:bg-orange-500/10 rounded-xl py-5 font-semibold"
                  onClick={() => setShowSaleDialog(true)}
                >
                  <PlusIcon className="size-4 mr-2" />
                  {copy.createSaleRecordBtn}
                </Button>
              </div>
            )
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
                                  {copy.skuLabel}: {matchingPart.partNumber} | {copy.available}:{" "}
                                  {matchingPart.quantity.toLocaleString(numberLocale)}
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
                                        {copy.partNumberLabel}: {part.partNumber} | {copy.currentStock}:{" "}
                                        {part.quantity.toLocaleString(numberLocale)}
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
                          TZS {(row.quantity * row.unitPrice).toLocaleString(numberLocale)}
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
                            aria-label={copy.removePart}
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
                <span className="text-xs text-muted-foreground">{copy.grandTotal}: </span>
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400 ml-1.5">
                  TZS {linkedSaleTotal.toLocaleString(numberLocale)}
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
        initialValues={
          isSaleLinked
            ? {
                saleNumber,
                customerName,
                customerPhone,
                isDebt,
                debtDueDate,
                paymentStatus,
                paymentMethod,
                amountPaid: Number(
                  amountPaid === "" ? linkedSaleTotal : amountPaid
                ),
                additionalAmount,
                soldAt: saleSoldAt,
                notes: notes || undefined,
                items: items.map((item) => ({
                  partId: Number(item.partId),
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                })),
              }
            : undefined
        }
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
          setCustomerPhone(saleValues.customerPhone || "")
          setIsDebt(saleValues.isDebt)
          setDebtDueDate(saleValues.debtDueDate || "")
          setSaleNumber(saleValues.saleNumber || "")
          setPaymentStatus(saleValues.paymentStatus || "PAID")
          setPaymentMethod(saleValues.paymentMethod || "CASH")
          setAmountPaid(saleValues.amountPaid)
          setAdditionalAmount(saleValues.additionalAmount || 0)
          setSaleSoldAt(saleValues.soldAt)
          setNotes(saleValues.notes || "")
          setIsSaleLinked(true)
          setShowSaleDialog(false)
          toast.success(copy.saleLinkedSuccess)
        }}
      />
    ) : null}
    </>
  )
}
