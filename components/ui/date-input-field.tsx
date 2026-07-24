"use client"

import { useState } from "react"

import {
  InputField,
  type InputFieldProps,
} from "@/components/ui/input-field"
import { useUiCopy } from "@/components/ui/ui-copy"

type DateInputFieldProps = Omit<
  InputFieldProps,
  | "inputMode"
  | "max"
  | "min"
  | "onBlur"
  | "onChange"
  | "placeholder"
  | "type"
  | "value"
> & {
  onValueChange: (isoDate: string) => void
  value: string
}

type DateTimeInputFieldProps = DateInputFieldProps

function isoToDisplay(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  return match ? `${match[3]}/${match[2]}/${match[1]}` : ""
}

function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8)
  const day = digits.slice(0, 2)
  const month = digits.slice(2, 4)
  const year = digits.slice(4, 8)

  return [day, month, year].filter(Boolean).join("/")
}

function displayToIso(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
  if (!match) return null

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }

  return `${match[3]}-${match[2]}-${match[1]}`
}

function isoDateTimeToDisplay(value: string) {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value)
  return match
    ? `${match[3]}/${match[2]}/${match[1]} ${match[4]}:${match[5]}`
    : ""
}

function formatDateTimeInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 12)
  const date = formatDateInput(digits.slice(0, 8))
  const hour = digits.slice(8, 10)
  const minute = digits.slice(10, 12)

  if (!hour) return date
  return `${date} ${hour}${minute ? `:${minute}` : ""}`
}

function displayDateTimeToIso(value: string) {
  const match =
    /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/.exec(value)
  if (!match) return null

  const isoDate = displayToIso(`${match[1]}/${match[2]}/${match[3]}`)
  const hour = Number(match[4])
  const minute = Number(match[5])

  if (!isoDate || hour > 23 || minute > 59) return null
  return `${isoDate}T${match[4]}:${match[5]}`
}

export function DateInputField({
  errorText,
  helperText,
  onValueChange,
  value,
  ...props
}: DateInputFieldProps) {
  const copy = useUiCopy()
  const [displayValue, setDisplayValue] = useState(() => isoToDisplay(value))
  const [hasInvalidDate, setHasInvalidDate] = useState(false)

  return (
    <InputField
      {...props}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      placeholder="dd/mm/yyyy"
      value={displayValue}
      helperText={helperText}
      errorText={errorText ?? (hasInvalidDate ? copy.invalidDate : undefined)}
      onChange={(event) => {
        const nextDisplayValue = formatDateInput(event.target.value)
        const nextIsoValue = displayToIso(nextDisplayValue)

        setDisplayValue(nextDisplayValue)
        setHasInvalidDate(false)
        onValueChange(nextIsoValue ?? "")
      }}
      onBlur={() => {
        setHasInvalidDate(
          displayValue.length > 0 && displayToIso(displayValue) === null
        )
      }}
    />
  )
}

export function DateTimeInputField({
  errorText,
  helperText,
  onValueChange,
  value,
  ...props
}: DateTimeInputFieldProps) {
  const copy = useUiCopy()
  const [displayValue, setDisplayValue] = useState(() =>
    isoDateTimeToDisplay(value)
  )
  const [hasInvalidDateTime, setHasInvalidDateTime] = useState(false)

  return (
    <InputField
      {...props}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      placeholder="dd/mm/yyyy HH:mm"
      value={displayValue}
      helperText={helperText}
      errorText={
        errorText ??
        (hasInvalidDateTime ? copy.invalidDateTime : undefined)
      }
      onChange={(event) => {
        const nextDisplayValue = formatDateTimeInput(event.target.value)
        const nextIsoValue = displayDateTimeToIso(nextDisplayValue)

        setDisplayValue(nextDisplayValue)
        setHasInvalidDateTime(false)
        onValueChange(nextIsoValue ?? "")
      }}
      onBlur={() => {
        setHasInvalidDateTime(
          displayValue.length > 0 &&
            displayDateTimeToIso(displayValue) === null
        )
      }}
    />
  )
}
