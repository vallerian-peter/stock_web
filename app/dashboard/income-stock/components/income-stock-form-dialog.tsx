"use client"

import { useEffect, useState, type FormEvent } from "react"
import { PlusIcon, Trash2Icon, InfoIcon } from "lucide-react"
import { toast } from "sonner"

import { createPart, getParts } from "@/api/parts_api"
import { getCategories } from "@/api/categories_api"
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
import { Field, FieldLabel } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DateInputField,
  DateTimeInputField,
} from "@/components/ui/date-input-field"
import { InputField } from "@/components/ui/input-field"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { PartRequestDTO, PartResponseDTO } from "@/lib/dtos/part_dtos"
import type { CategoryResponseDTO } from "@/lib/dtos/category_dtos"
import { useLandingLocale } from "@/components/landing-locale-provider"
import { ProductFormDialog } from "@/app/dashboard/products/components/product-form-dialog"
import { productDialogCopy } from "@/app/dashboard/products/components/product-dialog-copy"
import type { ProductFormValues } from "@/app/dashboard/products/components/product-schema"
import type { IncomeStockDialogCopy } from "./income-stock-dialog-copy"
import { type IncomeStockFormValues } from "./income-stock-schema"
import { Spinner } from "@/components/ui/spinner"

function mapFormValuesToRequest(
  values: ProductFormValues,
  imageFile: File | null
): PartRequestDTO {
  const nextImageLastModifiedAt = imageFile?.lastModified ?? null

  return {
    partName: values.partName.trim(),
    partNumber: values.partNumber.trim(),
    quantity: Number(values.quantity),
    price: Number(values.price),
    image: imageFile,
    imageLastModifiedAt: nextImageLastModifiedAt,
    categoryId: values.categoryId === "none" ? null : Number(values.categoryId),
    status: values.status,
  }
}

type IncomeStockFormDialogProps = {
  copy: IncomeStockDialogCopy
  onClose: () => void
  onSubmit: (values: IncomeStockFormValues) => Promise<void> | void
}

interface InlineRow {
  localId: string
  partId: string // numeric ID as string
  partSearchText: string
  quantity: number
  unitCost: number
  showDropdown: boolean
}

export function IncomeStockFormDialog({
  copy,
  onClose,
  onSubmit,
}: IncomeStockFormDialogProps) {
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [supplierName, setSupplierName] = useState("")
  const [isDebt, setIsDebt] = useState(false)
  const [supplierPhone, setSupplierPhone] = useState("")
  const [debtDueDate, setDebtDueDate] = useState("")
  const [debtAmountPaid, setDebtAmountPaid] = useState<number | "">(0)
  const [receivedAt, setReceivedAt] = useState(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16) // Format YYYY-MM-DDTHH:MM
  })
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState<InlineRow[]>([
    {
      localId: "initial-row",
      partId: "",
      partSearchText: "",
      quantity: 1,
      unitCost: 0,
      showDropdown: false,
    },
  ])

  const [catalogParts, setCatalogParts] = useState<PartResponseDTO[]>([])
  const [categories, setCategories] = useState<CategoryResponseDTO[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeNewPartRowLocalId, setActiveNewPartRowLocalId] = useState<string | null>(null)
  const { locale } = useLandingLocale()
  const numberLocale = locale === "sw" ? "sw-TZ" : "en-TZ"

  // Fetch Parts Catalog and Categories on mount
  useEffect(() => {
    async function loadCatalogAndCategories() {
      try {
        const [partsRes, categoriesRes] = await Promise.all([
          getParts({ page: 1, perPage: 250 }),
          getCategories({ page: 1, perPage: 100 })
        ])
        setCatalogParts(partsRes.data)
        setCategories(categoriesRes.data)
      } catch (err) {
        toast.error(getApiErrorMessage(err))
      }
    }
    void loadCatalogAndCategories()
  }, [])

  function addRow() {
    setItems((curr) => [
      ...curr,
      {
        localId: Math.random().toString(36).substring(7),
        partId: "",
        partSearchText: "",
        quantity: 1,
        unitCost: 0,
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

  function updateRow<Field extends keyof InlineRow>(
    localId: string,
    field: Field,
    value: InlineRow[Field]
  ) {
    setItems((curr) =>
      curr.map((row) => (row.localId === localId ? { ...row, [field]: value } : row))
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Validate metadata
    if (!supplierName.trim()) {
      toast.error(copy.validation.supplierRequired)
      return
    }

    if (!receivedAt) {
      toast.error(copy.validation.receivedAtRequired)
      return
    }

    // Validate items
    const parsedItems = items.map((row) => ({
      partId: Number(row.partId),
      quantity: Number(row.quantity),
      unitCost: Number(row.unitCost),
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
      if (Number.isNaN(parsed.unitCost) || parsed.unitCost < 0) {
        toast.error(copy.validation.costRequired)
        return
      }
    }

    const amountPaid = Number(debtAmountPaid || 0)
    if (isDebt && !supplierPhone.trim()) {
      toast.error(copy.validation.debtPhoneRequired)
      return
    }

    if (
      isDebt &&
      (!Number.isFinite(amountPaid) || amountPaid < 0 || amountPaid >= grandTotal)
    ) {
      toast.error(copy.validation.debtAmountInvalid)
      return
    }

    const payload = {
      invoiceNumber: invoiceNumber.trim() || undefined,
      supplierName: supplierName.trim(),
      supplierPhone: isDebt ? supplierPhone.trim() : undefined,
      isDebt,
      debtDueDate: isDebt && debtDueDate ? debtDueDate : undefined,
      amountPaid: isDebt ? amountPaid : undefined,
      receivedAt: new Date(receivedAt).toISOString(),
      notes: notes.trim() || undefined,
      items: parsedItems,
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

  // Helper: Find similar parts in database based on current text input (alerting feature)
  function getSimilarParts(row: InlineRow): PartResponseDTO[] {
    const text = row.partSearchText.trim().toLowerCase()
    if (!text || row.partId) return []

    return catalogParts.filter(
      (part) =>
        part.partName.toLowerCase().includes(text) ||
        part.partNumber.toLowerCase().includes(text)
    )
  }

  const grandTotal = items.reduce((acc, row) => acc + row.quantity * row.unitCost, 0)

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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InputField
              labelText={copy.supplierName}
              placeholder={copy.supplierNamePlaceholder}
              value={supplierName}
              required
              disabled={isSubmitting}
              onChange={(e) => setSupplierName(e.target.value)}
            />
            <InputField
              labelText={copy.invoiceNumber}
              placeholder={copy.invoiceNumberPlaceholder}
              value={invoiceNumber}
              disabled={isSubmitting}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />
            <DateTimeInputField
              labelText={copy.receivedAt}
              value={receivedAt}
              required
              disabled={isSubmitting}
              onValueChange={setReceivedAt}
            />
          </div>

          <div className="rounded-xl border border-dashed border-border bg-muted/30 px-3 py-3 text-xs">
            <label className="flex items-start gap-2">
              <Checkbox
                checked={isDebt}
                disabled={isSubmitting}
                onCheckedChange={(checked) => {
                  const nextIsDebt = checked === true
                  setIsDebt(nextIsDebt)
                  if (!nextIsDebt) {
                    setSupplierPhone("")
                    setDebtDueDate("")
                    setDebtAmountPaid(0)
                  }
                }}
                className="mt-0.5"
              />
              <span className="space-y-0.5">
                <span className="block font-medium text-foreground">{copy.debtToggle}</span>
                <span className="block text-muted-foreground">{copy.debtDescription}</span>
              </span>
            </label>

            {isDebt ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <InputField
                  type="tel"
                  labelText={copy.supplierPhone}
                  placeholder={copy.supplierPhonePlaceholder}
                  value={supplierPhone}
                  required
                  disabled={isSubmitting}
                  onChange={(event) => setSupplierPhone(event.target.value)}
                />
                <DateInputField
                  labelText={copy.debtDueDate}
                  value={debtDueDate}
                  disabled={isSubmitting}
                  onValueChange={setDebtDueDate}
                />
                <InputField
                  type="number"
                  min="0"
                  max={grandTotal}
                  step="0.01"
                  labelText={copy.debtAmountPaid}
                  value={debtAmountPaid}
                  disabled={isSubmitting}
                  onChange={(event) =>
                    setDebtAmountPaid(event.target.value ? Number(event.target.value) : 0)
                  }
                />
              </div>
            ) : null}
          </div>

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
              <Table className="w-full min-w-[600px]">
                <TableHeader className="bg-muted/40 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead className="min-w-[280px]">{copy.partLabel}</TableHead>
                  <TableHead className="w-24 text-right">{copy.qtyLabel}</TableHead>
                  <TableHead className="w-32 text-right">{copy.unitCostLabel}</TableHead>
                  <TableHead className="w-36 text-right">{copy.subtotalLabel}</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((row, index) => {
                  const similar = getSimilarParts(row)
                  const matchingPart = catalogParts.find((p) => String(p.id) === row.partId)

                  return (
                    <TableRow key={row.localId} className="hover:bg-muted/10">
                      <TableCell className="text-center font-medium text-muted-foreground text-xs">
                        {index + 1}
                      </TableCell>
                      <TableCell className="relative">
                        {/* Part Autocomplete Selection */}
                        <div className="flex flex-col gap-1">
                          {matchingPart ? (
                            <div className="flex items-center justify-between rounded-lg border border-orange-500/20 bg-orange-500/5 px-2.5 py-1 text-xs">
                              <div className="flex flex-col">
                                <span className="font-semibold text-foreground">
                                  {matchingPart.partName}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {copy.skuLabel}: {matchingPart.partNumber}
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
                                  updateRow(row.localId, "quantity", 1)
                                  updateRow(row.localId, "unitCost", 0)
                                }}
                              >
                                {copy.changeBtn}
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 w-full">
                              <Popover 
                                open={row.showDropdown} 
                                onOpenChange={(open) => {
                                  if (!open) updateRow(row.localId, "showDropdown", false)
                                }}
                              >
                                <PopoverTrigger render={<div className="relative flex-1 w-full" />} nativeButton={false}>
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
                                </PopoverTrigger>
                                <PopoverContent 
                                  align="start" 
                                  className="w-[300px] p-1 max-h-48 overflow-y-auto flex flex-col"
                                  initialFocus={false}
                                >
                                  <div className="flex-1 overflow-y-auto">
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
                                            updateRow(row.localId, "quantity", Number(part.quantity))
                                            // prefill catalog price as a good default for cost
                                            updateRow(row.localId, "unitCost", Number(part.price) * 0.7) // estimate buying cost as 70% of sale price
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
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <Button
                                type="button"
                                variant="outline"
                                className="h-9 px-2.5 rounded-lg border-orange-500/30 hover:bg-orange-500/10 text-orange-600 hover:text-orange-700 shrink-0 font-medium text-xs"
                                onClick={() => {
                                  setActiveNewPartRowLocalId(row.localId)
                                  updateRow(row.localId, "showDropdown", false)
                                }}
                              >
                                {copy.newPartLabel}
                              </Button>
                            </div>
                          )}

                          {/* Similarity Alerting Feature */}
                          {similar.length > 0 && (
                            <div className="flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400">
                              <span>{copy.similarPartAlert}</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger render={
                                    <button type="button" className="inline-flex cursor-pointer p-0.5">
                                      <InfoIcon className="size-3" />
                                    </button>
                                  } />
                                  <TooltipContent side="right" className="rounded-xl border bg-card p-3 text-[11px] text-foreground shadow-md">
                                    <div className="space-y-1.5">
                                      <span className="font-semibold text-amber-600">
                                        {copy.matchingProducts}:
                                      </span>
                                      {similar.slice(0, 3).map((p) => (
                                        <div
                                          key={p.id}
                                          className="flex items-center justify-between gap-4 border-b border-border/40 pb-1 last:border-b-0"
                                        >
                                          <div className="flex flex-col">
                                            <span className="font-medium text-foreground">{p.partName}</span>
                                            <span className="text-[9px] text-muted-foreground">
                                              {copy.partNumberLabel}: {p.partNumber} | {copy.stockLabel}:{" "}
                                              {p.quantity.toLocaleString(numberLocale)}
                                            </span>
                                          </div>
                                          <Button
                                            type="button"
                                            size="xs"
                                            className="h-5 px-1.5 text-[9px] bg-amber-500 hover:bg-amber-600 text-white"
                                            onClick={() => {
                                              updateRow(row.localId, "partId", String(p.id))
                                              updateRow(row.localId, "showDropdown", false)
                                              updateRow(row.localId, "quantity", Number(p.quantity))
                                              updateRow(row.localId, "unitCost", Number(p.price) * 0.7)
                                            }}
                                          >
                                            {copy.select}
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <input
                          type="number"
                          min="1"
                          required
                          disabled={isSubmitting}
                          className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-right text-xs focus:border-orange-500 focus:outline-hidden"
                          value={row.quantity}
                          onChange={(e) => updateRow(row.localId, "quantity", Number(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="number"
                          min="0"
                          required
                          disabled={isSubmitting}
                          className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-right text-xs focus:border-orange-500 focus:outline-hidden"
                          value={row.unitCost}
                          onChange={(e) => updateRow(row.localId, "unitCost", Number(e.target.value))}
                        />
                      </TableCell>
                      <TableCell className="text-right font-semibold text-xs text-foreground py-4 px-3">
                        TZS {(row.quantity * row.unitCost).toLocaleString(numberLocale)}
                      </TableCell>
                      <TableCell className="text-center">
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
            <div className="text-right">
              <span className="text-xs text-muted-foreground">{copy.grandTotal}: </span>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400 ml-1.5">
                TZS {grandTotal.toLocaleString(numberLocale)}
              </span>
            </div>
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

    {activeNewPartRowLocalId ? (
      <ProductFormDialog
        mode="add"
        copy={productDialogCopy[locale]}
        categories={categories}
        onClose={() => setActiveNewPartRowLocalId(null)}
        onSubmit={async (values, imageFile) => {
          try {
            const createdPart = await createPart(mapFormValuesToRequest(values, imageFile))
            setCatalogParts((prev) => [...prev, createdPart])
            updateRow(activeNewPartRowLocalId, "partId", String(createdPart.id))
            updateRow(activeNewPartRowLocalId, "partSearchText", createdPart.partName)
            updateRow(activeNewPartRowLocalId, "quantity", Number(createdPart.quantity))
            updateRow(activeNewPartRowLocalId, "unitCost", Number(createdPart.price) * 0.7)
            setActiveNewPartRowLocalId(null)
            toast.success(productDialogCopy[locale].createSuccess(values.partName))
          } catch (err) {
            toast.error(getApiErrorMessage(err))
          }
        }}
      />
    ) : null}
    </>
  )
}
