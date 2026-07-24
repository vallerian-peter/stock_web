"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function SettingsToggle({
  checked,
  label,
  disabled,
  onCheckedChange,
}: {
  checked: boolean
  label: string
  disabled?: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full border transition focus-visible:ring-2 focus-visible:ring-orange-500/30 focus-visible:outline-none disabled:opacity-50",
        checked ? "border-orange-500 bg-orange-500" : "border-border bg-muted"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-4.5 rounded-full bg-white shadow-sm transition-transform",
          checked && "translate-x-5"
        )}
      />
    </button>
  )
}

export function SettingsRow({
  label,
  description,
  badge,
  children,
}: {
  label: string
  description?: string
  badge?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-16 items-center justify-between gap-5 border-b border-border/55 py-3 last:border-b-0">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[12px] font-medium">{label}</p>
          {badge ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
              {badge}
            </span>
          ) : null}
        </div>
        {description ? (
          <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export function SettingsSelect({
  value,
  label,
  disabled,
  children,
  onChange,
}: {
  value: string | number
  label: string
  disabled?: boolean
  children: React.ReactNode
  onChange: (value: string) => void
}) {
  return (
    <div className="relative">
      <select
        value={value}
        aria-label={label}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 appearance-none rounded-xl border border-border bg-background py-1 pr-8 pl-3 text-[11px] font-medium shadow-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/15 disabled:opacity-50"
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

export function SettingsFormField({
  label,
  error,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string
  error?: string
}) {
  const id = React.useId()

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[11px]">
        {label}
      </Label>
      <Input
        {...props}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-9 rounded-xl bg-background px-3 text-[12px]"
      />
      {error ? (
        <p id={`${id}-error`} className="text-[10px] text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function SettingsPanelFallback() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="h-16 rounded-xl" />
      ))}
    </div>
  )
}

export function SettingsSectionHeading({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="mb-4">
      <h3 className="text-[13px] font-semibold">{title}</h3>
      <p className="mt-1 text-[11px] text-muted-foreground">{description}</p>
    </div>
  )
}
