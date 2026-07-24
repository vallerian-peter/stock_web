"use client"

import { useState, type FormEvent } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DateInputField } from "@/components/ui/date-input-field"
import { useLandingLocale } from "@/components/landing-locale-provider"
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
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { getApiErrorMessage } from "@/lib/api/request"

import type { DebtDialogCopy, DebtFormValues } from "./debt-feature-types"

type DebtFormDialogProps = {
  copy: DebtDialogCopy
  onClose: () => void
  onSubmit: (values: DebtFormValues) => Promise<void> | void
}

function getTodayDateValue() {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 10)
}

export function DebtFormDialog({ copy, onClose, onSubmit }: DebtFormDialogProps) {
  const { locale } = useLandingLocale()
  const numberLocale = locale === "sw" ? "sw-TZ" : "en-TZ"
  const [partyName, setPartyName] = useState("")
  const [partyPhone, setPartyPhone] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [totalAmount, setTotalAmount] = useState<number | "">("")
  const [amountPaid, setAmountPaid] = useState<number | "">(0)
  const [debtDateIsToday, setDebtDateIsToday] = useState(true)
  const [debtDate, setDebtDate] = useState(getTodayDateValue)
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const total = Number(totalAmount || 0)
  const paid = Number(amountPaid || 0)
  const balance = Math.max(0, total - paid)
  const resolvedDebtDate = debtDateIsToday ? getTodayDateValue() : debtDate
  const dateRangeError =
    resolvedDebtDate && dueDate && dueDate < resolvedDebtDate
      ? copy.validation.dueDateBeforeDebtDate
      : undefined

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!partyName.trim()) {
      toast.error(copy.validation.partyRequired)
      return
    }

    if (!Number.isFinite(total) || total <= 0) {
      toast.error(copy.validation.totalRequired)
      return
    }

    if (!Number.isFinite(paid) || paid < 0 || paid > total) {
      toast.error(copy.validation.amountPaidInvalid)
      return
    }

    if (!resolvedDebtDate) {
      toast.error(copy.validation.debtDateRequired)
      return
    }

    if (dateRangeError) {
      toast.error(dateRangeError)
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit({
        partyName: partyName.trim(),
        partyPhone: partyPhone.trim() || undefined,
        referenceNumber: referenceNumber.trim() || undefined,
        totalAmount: total,
        amountPaid: paid,
        debtDate: resolvedDebtDate,
        dueDate: dueDate || undefined,
        notes: notes.trim() || undefined,
      })
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] w-[95vw] overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-xl sm:w-full sm:max-w-[40rem] sm:p-6">
        <DialogHeader>
          <DialogTitle>{copy.addTitle}</DialogTitle>
          <DialogDescription>{copy.addDescription}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              labelText={copy.partyName}
              placeholder={copy.partyNamePlaceholder}
              value={partyName}
              required
              disabled={isSubmitting}
              onChange={(event) => setPartyName(event.target.value)}
            />
            <InputField
              type="tel"
              labelText={copy.partyPhone}
              placeholder={copy.partyPhonePlaceholder}
              value={partyPhone}
              disabled={isSubmitting}
              onChange={(event) => setPartyPhone(event.target.value)}
            />
            <InputField
              labelText={copy.referenceNumber}
              placeholder={copy.referenceNumberPlaceholder}
              value={referenceNumber}
              disabled={isSubmitting}
              onChange={(event) => setReferenceNumber(event.target.value)}
            />
            <InputField
              type="number"
              min="0.01"
              step="0.01"
              labelText={copy.totalAmount}
              value={totalAmount}
              required
              disabled={isSubmitting}
              onChange={(event) =>
                setTotalAmount(event.target.value ? Number(event.target.value) : "")
              }
            />
            <InputField
              type="number"
              min="0"
              step="0.01"
              max={total || undefined}
              labelText={copy.amountPaid}
              value={amountPaid}
              disabled={isSubmitting}
              containerClassName="sm:col-span-2"
              onChange={(event) =>
                setAmountPaid(event.target.value ? Number(event.target.value) : 0)
              }
            />
          </div>

          <div className="rounded-xl border border-dashed border-border bg-muted/30 px-3 py-3 text-xs">
            <label className="flex items-start gap-2">
              <Checkbox
                checked={debtDateIsToday}
                disabled={isSubmitting}
                onCheckedChange={(checked) => {
                  const isToday = checked === true
                  setDebtDateIsToday(isToday)
                  if (isToday) {
                    setDebtDate(getTodayDateValue())
                  }
                }}
                className="mt-0.5"
              />
              <span className="space-y-0.5">
                <span className="block font-medium text-foreground">
                  {copy.debtDateTodayToggle}
                </span>
                <span className="block text-muted-foreground">
                  {copy.debtDateTodayDescription}
                </span>
              </span>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {!debtDateIsToday ? (
              <DateInputField
                labelText={copy.debtDate}
                value={debtDate}
                required
                disabled={isSubmitting}
                errorText={!debtDate ? copy.validation.debtDateRequired : undefined}
                onValueChange={setDebtDate}
              />
            ) : null}
            <DateInputField
              labelText={copy.dueDate}
              value={dueDate}
              disabled={isSubmitting}
              errorText={dateRangeError}
              containerClassName={debtDateIsToday ? "sm:col-span-2" : undefined}
              onValueChange={setDueDate}
            />
          </div>

          <Field>
            <FieldLabel>{copy.notes}</FieldLabel>
            <Textarea
              value={notes}
              placeholder={copy.notesPlaceholder}
              disabled={isSubmitting}
              onChange={(event) => setNotes(event.target.value)}
              className="min-h-24 rounded-xl"
            />
          </Field>

          <div className="flex justify-end">
            <div className="text-right">
              <span className="text-xs text-muted-foreground">
                {copy.balanceAmount}:{" "}
              </span>
              <span className="ml-1.5 text-lg font-bold text-orange-600 dark:text-orange-400">
                TZS {balance.toLocaleString(numberLocale)}
              </span>
            </div>
          </div>

          <DialogFooter className="border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              {copy.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              {isSubmitting ? <Spinner /> : copy.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
