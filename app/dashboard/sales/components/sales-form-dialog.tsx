// "use client"

// import { useEffect, useState, type FormEvent } from "react"
// import { PlusIcon, Trash2Icon } from "lucide-react"
// import { toast } from "sonner"

// import { getParts } from "@/api/parts_api"
// import { getApiErrorMessage } from "@/lib/api/request"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Field, FieldLabel } from "@/components/ui/field"
// import { InputField } from "@/components/ui/input-field"
// import { Textarea } from "@/components/ui/textarea"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import type { PartResponseDTO } from "@/lib/dtos/part_dtos"
// import type { SalesDialogCopy } from "./sales-dialog-copy"
// import { Spinner } from "@/components/ui/spinner"

// type SalesFormDialogProps = {
//   copy: SalesDialogCopy
//   onClose: () => void
//   onSubmit: (values: any) => Promise<void> | void
// }

// interface SaleInlineRow {
//   localId: string
//   partId: string
//   partSearchText: string
//   quantity: number
//   unitPrice: number
//   showDropdown: boolean
// }

// export function SalesFormDialog({
//   copy,
//   onClose,
//   onSubmit,
// }: SalesFormDialogProps) {
//   const [saleNumber, setSaleNumber] = useState("")
//   const [customerName, setCustomerName] = useState("")
//   const [paymentStatus, setPaymentStatus] = useState("PAID")
//   const [paymentMethod, setPaymentMethod] = useState("CASH")
//   const [amountPaid, setAmountPaid] = useState<number | "">("")
//   const [soldAt, setSoldAt] = useState(() => {
//     const now = new Date()
//     now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
//     return now.toISOString().slice(0, 16)
//   })
//   const [notes, setNotes] = useState("")
//   const [items, setItems] = useState<SaleInlineRow[]>([
//     {
//       localId: "initial-row",
//       partId: "",
//       partSearchText: "",
//       quantity: 1,
//       unitPrice: 0,
//       showDropdown: false,
//     },
//   ])

//   const [catalogParts, setCatalogParts] = useState<PartResponseDTO[]>([])
//   const [isLoadingParts, setIsLoadingParts] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   // Fetch Parts Catalog on mount
//   useEffect(() => {
//     async function loadCatalog() {
//       try {
//         setIsLoadingParts(true)
//         const res = await getParts({ page: 1, perPage: 250 })
//         setCatalogParts(res.data)
//       } catch (err) {
//         toast.error(getApiErrorMessage(err))
//       } finally {
//         setIsLoadingParts(false)
//       }
//     }
//     void loadCatalog()
//   }, [])

//   function addRow() {
//     setItems((curr) => [
//       ...curr,
//       {
//         localId: Math.random().toString(36).substring(7),
//         partId: "",
//         partSearchText: "",
//         quantity: 1,
//         unitPrice: 0,
//         showDropdown: false,
//       },
//     ])
//   }

//   function removeRow(localId: string) {
//     if (items.length <= 1) {
//       toast.warning(copy.emptyPartsWarning)
//       return
//     }
//     setItems((curr) => curr.filter((row) => row.localId !== localId))
//   }

//   function updateRow<Field extends keyof SaleInlineRow>(
//     localId: string,
//     field: Field,
//     value: SaleInlineRow[Field]
//   ) {
//     setItems((curr) =>
//       curr.map((row) => (row.localId === localId ? { ...row, [field]: value } : row))
//     )
//   }

//   const grandTotal = items.reduce((acc, row) => acc + row.quantity * row.unitPrice, 0)

//   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault()

//     if (!soldAt) {
//       toast.error(copy.validation.soldAtRequired)
//       return
//     }

//     // Validate items
//     const parsedItems = items.map((row) => ({
//       partId: Number(row.partId),
//       quantity: Number(row.quantity),
//       unitPrice: Number(row.unitPrice),
//     }))

//     for (const parsed of parsedItems) {
//       if (Number.isNaN(parsed.partId) || parsed.partId <= 0) {
//         toast.error(copy.validation.partRequired)
//         return
//       }
//       if (Number.isNaN(parsed.quantity) || parsed.quantity < 1) {
//         toast.error(copy.validation.qtyRequired)
//         return
//       }
//       if (Number.isNaN(parsed.unitPrice) || parsed.unitPrice < 0) {
//         toast.error(copy.validation.priceRequired)
//         return
//       }

//       // Check stock limit
//       const catalogItem = catalogParts.find((p) => p.id === parsed.partId)
//       if (catalogItem && catalogItem.quantity < parsed.quantity) {
//         toast.error(
//           `Insufficient stock for "${catalogItem.partName}". Available: ${catalogItem.quantity}`
//         )
//         return
//       }
//     }

//     const payload = {
//       saleNumber: saleNumber.trim() || undefined,
//       customerName: customerName.trim() || "Walk-in Customer",
//       paymentStatus,
//       paymentMethod,
//       amountPaid: amountPaid === "" ? grandTotal : Number(amountPaid),
//       soldAt: new Date(soldAt).toISOString(),
//       notes: notes.trim() || undefined,
//       items: parsedItems,
//     }

//     try {
//       setIsSubmitting(true)
//       await onSubmit(payload)
//     } catch (err) {
//       toast.error(getApiErrorMessage(err))
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Dialog open onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="max-h-[92vh] w-full overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-semibold text-foreground">
//             {copy.addTitle}
//           </DialogTitle>
//           <DialogDescription className="text-sm text-muted-foreground">
//             {copy.addDescription}
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="mt-4 space-y-6" noValidate>
//           {/* Header Metadata fields */}
//           <div className="grid gap-4 sm:grid-cols-4">
//             <InputField
//               labelText={copy.customerName}
//               placeholder={copy.customerPlaceholder}
//               value={customerName}
//               disabled={isSubmitting}
//               onChange={(e) => setCustomerName(e.target.value)}
//             />

//             <Field>
//               <FieldLabel>{copy.paymentStatus}</FieldLabel>
//               <Select value={paymentStatus} onValueChange={(val) => val && setPaymentStatus(val)}>
//                 <SelectTrigger className="h-9 w-full rounded-xl bg-background border-border">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="PAID">PAID</SelectItem>
//                   <SelectItem value="PENDING">PENDING</SelectItem>
//                   <SelectItem value="PARTIAL">PARTIAL</SelectItem>
//                 </SelectContent>
//               </Select>
//             </Field>

//             <Field>
//               <FieldLabel>{copy.paymentMethod}</FieldLabel>
//               <Select value={paymentMethod} onValueChange={(val) => val && setPaymentMethod(val)}>
//                 <SelectTrigger className="h-9 w-full rounded-xl bg-background border-border">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="CASH">CASH</SelectItem>
//                   <SelectItem value="M-PESA">M-PESA</SelectItem>
//                   <SelectItem value="BANK">BANK TRANSFER</SelectItem>
//                 </SelectContent>
//               </Select>
//             </Field>

//             <InputField
//               type="number"
//               labelText={copy.amountPaid}
//               placeholder={`Default: TZS ${grandTotal.toLocaleString()}`}
//               value={amountPaid}
//               disabled={isSubmitting}
//               onChange={(e) => setAmountPaid(e.target.value ? Number(e.target.value) : "")}
//             />
//           </div>

//           <div className="grid gap-4 sm:grid-cols-2">
//             <InputField
//               labelText={copy.saleNumber}
//               placeholder={copy.saleNumberPlaceholder}
//               value={saleNumber}
//               disabled={isSubmitting}
//               onChange={(e) => setSaleNumber(e.target.value)}
//             />

//             <InputField
//               type="datetime-local"
//               labelText={copy.soldAt}
//               value={soldAt}
//               required
//               disabled={isSubmitting}
//               onChange={(e) => setSoldAt(e.target.value)}
//             />
//           </div>

//           <Field>
//             <FieldLabel>{copy.notes}</FieldLabel>
//             <Textarea
//               placeholder={copy.notesPlaceholder}
//               value={notes}
//               disabled={isSubmitting}
//               onChange={(e) => setNotes(e.target.value)}
//               className="min-h-16 rounded-xl border-border bg-background"
//             />
//           </Field>

//           {/* Inline Batch Input Table */}
//           <div className="rounded-xl border border-border bg-background/50 overflow-x-auto">
//             <Table className="w-full min-w-[700px]">
//               <TableHeader className="bg-muted/40">
//                 <TableRow>
//                   <TableHead className="w-10">#</TableHead>
//                   <TableHead className="min-w-[280px]">{copy.partSearchPlaceholder}</TableHead>
//                   <TableHead className="w-24 text-right">{copy.qtyLabel}</TableHead>
//                   <TableHead className="w-32 text-right">{copy.priceLabel}</TableHead>
//                   <TableHead className="w-36 text-right">{copy.subtotalLabel}</TableHead>
//                   <TableHead className="w-12"></TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {items.map((row, index) => {
//                   const matchingPart = catalogParts.find((p) => String(p.id) === row.partId)

//                   return (
//                     <TableRow key={row.localId} className="hover:bg-muted/10">
//                       <TableCell className="text-center font-medium text-muted-foreground text-xs">
//                         {index + 1}
//                       </TableCell>
//                       <TableCell className="relative">
//                         <div className="flex flex-col gap-1">
//                           {matchingPart ? (
//                             <div className="flex items-center justify-between rounded-lg border border-orange-500/20 bg-orange-500/5 px-2.5 py-1 text-xs">
//                               <div className="flex flex-col">
//                                 <span className="font-semibold text-foreground">
//                                   {matchingPart.partName}
//                                 </span>
//                                 <span className="text-[10px] text-muted-foreground">
//                                   SKU: {matchingPart.partNumber} | Available: {matchingPart.quantity}
//                                 </span>
//                               </div>
//                               <Button
//                                 type="button"
//                                 variant="ghost"
//                                 size="xs"
//                                 className="h-6 w-12 text-[10px] hover:bg-orange-500/10 hover:text-orange-600"
//                                 onClick={() => {
//                                   updateRow(row.localId, "partId", "")
//                                   updateRow(row.localId, "partSearchText", "")
//                                 }}
//                               >
//                                 Change
//                               </Button>
//                             </div>
//                           ) : (
//                             <div className="relative">
//                               <input
//                                 type="text"
//                                 placeholder={copy.partSearchPlaceholder}
//                                 className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs focus:border-orange-500 focus:outline-hidden"
//                                 value={row.partSearchText}
//                                 onChange={(e) => {
//                                   updateRow(row.localId, "partSearchText", e.target.value)
//                                   updateRow(row.localId, "showDropdown", true)
//                                 }}
//                                 onFocus={() => updateRow(row.localId, "showDropdown", true)}
//                               />
//                               {row.showDropdown && row.partSearchText.trim().length > 0 && (
//                                 <div className="absolute left-0 top-10 z-50 max-h-48 w-full overflow-y-auto rounded-lg border border-border bg-popover py-1 shadow-lg">
//                                   {catalogParts
//                                     .filter(
//                                       (part) =>
//                                         part.partName
//                                           .toLowerCase()
//                                           .includes(row.partSearchText.toLowerCase()) ||
//                                         part.partNumber
//                                           .toLowerCase()
//                                           .includes(row.partSearchText.toLowerCase())
//                                     )
//                                     .map((part) => (
//                                       <button
//                                         type="button"
//                                         key={part.id}
//                                         className="flex w-full flex-col px-3 py-1.5 text-left text-xs transition hover:bg-muted"
//                                         onClick={() => {
//                                           updateRow(row.localId, "partId", String(part.id))
//                                           updateRow(row.localId, "showDropdown", false)
//                                           updateRow(row.localId, "unitPrice", Number(part.price))
//                                         }}
//                                       >
//                                         <span className="font-semibold text-foreground">
//                                           {part.partName}
//                                         </span>
//                                         <span className="text-[10px] text-muted-foreground">
//                                           No: {part.partNumber} | Current Stock: {part.quantity}
//                                         </span>
//                                       </button>
//                                     ))}
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <input
//                           type="number"
//                           min="1"
//                           required
//                           disabled={isSubmitting}
//                           className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-right text-xs focus:border-orange-500 focus:outline-hidden"
//                           value={row.quantity}
//                           onChange={(e) => updateRow(row.localId, "quantity", Number(e.target.value))}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <input
//                           type="number"
//                           min="0"
//                           required
//                           disabled={isSubmitting}
//                           className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-right text-xs focus:border-orange-500 focus:outline-hidden"
//                           value={row.unitPrice}
//                           onChange={(e) => updateRow(row.localId, "unitPrice", Number(e.target.value))}
//                         />
//                       </TableCell>
//                       <TableCell className="text-right font-semibold text-xs text-foreground py-4 px-3">
//                         TZS {(row.quantity * row.unitPrice).toLocaleString()}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="icon"
//                           className="size-8 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-600"
//                           onClick={() => removeRow(row.localId)}
//                         >
//                           <Trash2Icon className="size-4" />
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   )
//                 })}
//               </TableBody>
//             </Table>
//           </div>

//           <div className="flex items-center justify-between">
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               className="rounded-xl border-dashed"
//               onClick={addRow}
//               disabled={isSubmitting}
//             >
//               <PlusIcon className="size-4 mr-1.5" />
//               {copy.addRowBtn}
//             </Button>
//             <div className="text-right">
//               <span className="text-xs text-muted-foreground">Grand Total: </span>
//               <span className="text-lg font-bold text-orange-600 dark:text-orange-400 ml-1.5">
//                 TZS {grandTotal.toLocaleString()}
//               </span>
//             </div>
//           </div>

//           <DialogFooter className="border-t border-border pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onClose}
//               disabled={isSubmitting}
//               className="rounded-xl"
//             >
//               {copy.cancel}
//             </Button>
//             <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white">
//               {isSubmitting ? <Spinner /> : copy.create}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }


"use client"

import { useEffect, useState, type FormEvent } from "react"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { getParts } from "@/api/parts_api"
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
import type { SalesDialogCopy } from "./sales-dialog-copy"
import { Spinner } from "@/components/ui/spinner"

type SalesFormDialogProps = {
  copy: SalesDialogCopy
  onClose: () => void
  onSubmit: (values: any) => Promise<void> | void
}

interface SaleInlineRow {
  localId: string
  partId: string
  partSearchText: string
  quantity: number
  unitPrice: number
  showDropdown: boolean
}

export function SalesFormDialog({
  copy,
  onClose,
  onSubmit,
}: SalesFormDialogProps) {
  const [saleNumber, setSaleNumber] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("PAID")
  const [paymentMethod, setPaymentMethod] = useState("CASH")
  const [amountPaid, setAmountPaid] = useState<number | "">("")
  const [soldAt, setSoldAt] = useState(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  })
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState<SaleInlineRow[]>([
    {
      localId: "initial-row",
      partId: "",
      partSearchText: "",
      quantity: 1,
      unitPrice: 0,
      showDropdown: false,
    },
  ])

  const [catalogParts, setCatalogParts] = useState<PartResponseDTO[]>([])
  const [isLoadingParts, setIsLoadingParts] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch Parts Catalog on mount
  useEffect(() => {
    async function loadCatalog() {
      try {
        setIsLoadingParts(true)
        const res = await getParts({ page: 1, perPage: 250 })
        setCatalogParts(res.data)
      } catch (err) {
        toast.error(getApiErrorMessage(err))
      } finally {
        setIsLoadingParts(false)
      }
    }
    void loadCatalog()
  }, [])

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

  function updateRow<Field extends keyof SaleInlineRow>(
    localId: string,
    field: Field,
    value: SaleInlineRow[Field]
  ) {
    setItems((curr) =>
      curr.map((row) => (row.localId === localId ? { ...row, [field]: value } : row))
    )
  }

  const grandTotal = items.reduce((acc, row) => acc + row.quantity * row.unitPrice, 0)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!soldAt) {
      toast.error(copy.validation.soldAtRequired)
      return
    }

    // Validate items
    const parsedItems = items.map((row) => ({
      partId: Number(row.partId),
      quantity: Number(row.quantity),
      unitPrice: Number(row.unitPrice),
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
      if (Number.isNaN(parsed.unitPrice) || parsed.unitPrice < 0) {
        toast.error(copy.validation.priceRequired)
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

    const payload = {
      saleNumber: saleNumber.trim() || undefined,
      customerName: customerName.trim() || "Walk-in Customer",
      paymentStatus,
      paymentMethod,
      amountPaid: amountPaid === "" ? grandTotal : Number(amountPaid),
      soldAt: new Date(soldAt).toISOString(),
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

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {copy.addTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {copy.addDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6" noValidate>
          {/* Header Metadata fields */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InputField
              labelText={copy.customerName}
              placeholder={copy.customerPlaceholder}
              value={customerName}
              disabled={isSubmitting}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <Field>
              <FieldLabel>{copy.paymentStatus}</FieldLabel>
              <Select value={paymentStatus} onValueChange={(val) => val && setPaymentStatus(val)}>
                <SelectTrigger className="h-9 w-full rounded-xl bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAID">PAID</SelectItem>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="PARTIAL">PARTIAL</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>{copy.paymentMethod}</FieldLabel>
              <Select value={paymentMethod} onValueChange={(val) => val && setPaymentMethod(val)}>
                <SelectTrigger className="h-9 w-full rounded-xl bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">CASH</SelectItem>
                  <SelectItem value="MOBILE_MONEY">MOBILE MONEY</SelectItem>
                  <SelectItem value="BANK_TRANSFER">BANK TRANSFER</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <InputField
              type="number"
              labelText={copy.amountPaid}
              placeholder={`Default: TZS ${grandTotal.toLocaleString()}`}
              value={amountPaid}
              disabled={isSubmitting}
              onChange={(e) => setAmountPaid(e.target.value ? Number(e.target.value) : "")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              labelText={copy.saleNumber}
              placeholder={copy.saleNumberPlaceholder}
              value={saleNumber}
              disabled={isSubmitting}
              onChange={(e) => setSaleNumber(e.target.value)}
            />

            <InputField
              type="datetime-local"
              labelText={copy.soldAt}
              value={soldAt}
              required
              disabled={isSubmitting}
              onChange={(e) => setSoldAt(e.target.value)}
            />
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

          {/* Inline Batch Input Table */}
          <div className="rounded-xl border border-border bg-background/50 overflow-hidden [&_[data-slot=table-container]]:max-h-[320px] [&_[data-slot=table-container]]:overflow-y-auto">
            <Table className="w-full min-w-[700px]">
              <TableHeader className="bg-muted/40 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead className="min-w-[280px]">{copy.partSearchPlaceholder}</TableHead>
                  <TableHead className="w-24 text-right">{copy.qtyLabel}</TableHead>
                  <TableHead className="w-32 text-right">{copy.priceLabel}</TableHead>
                  <TableHead className="w-36 text-right">{copy.subtotalLabel}</TableHead>
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
                                Change
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
                          value={row.unitPrice}
                          onChange={(e) => updateRow(row.localId, "unitPrice", Number(e.target.value))}
                        />
                      </TableCell>
                      <TableCell className="text-right font-semibold text-xs text-foreground py-4 px-3">
                        TZS {(row.quantity * row.unitPrice).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-600"
                          onClick={() => removeRow(row.localId)}
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

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl border-dashed"
              onClick={addRow}
              disabled={isSubmitting}
            >
              <PlusIcon className="size-4 mr-1.5" />
              {copy.addRowBtn}
            </Button>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">Grand Total: </span>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400 ml-1.5">
                TZS {grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <DialogFooter className="border-t border-border pt-4">
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
  )
}