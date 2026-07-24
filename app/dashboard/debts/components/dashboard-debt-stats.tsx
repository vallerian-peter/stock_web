"use client"

import {
  CalendarClockIcon,
  CircleCheckBigIcon,
  Clock3Icon,
  TriangleAlertIcon,
} from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useLandingLocale } from "@/components/landing-locale-provider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { DUE_WINDOW_OPTIONS, getDueWindowLabel } from "./debt-filter-copy"
import type { DebtDialogCopy, DueWindowDays } from "./debt-feature-types"

type DashboardDebtStatsProps = {
  copy: DebtDialogCopy
  dueWindow: DueWindowDays
  onDueWindowChange: (value: DueWindowDays) => void
  stats: {
    due: number
    dueWithin: number
    notPaid: number
    paid: number
  }
}

export function DashboardDebtStats({
  copy,
  dueWindow,
  onDueWindowChange,
  stats,
}: DashboardDebtStatsProps) {
  const { locale } = useLandingLocale()
  const numberLocale = locale === "sw" ? "sw-TZ" : "en-TZ"
  const cards = [
    {
      label: copy.statsPaid,
      value: stats.paid,
      Icon: CircleCheckBigIcon,
      colorClass:
        "border-green-200/70 bg-green-50 text-green-600 dark:border-green-900 dark:bg-green-950/40",
    },
    {
      label: copy.statsNotPaid,
      value: stats.notPaid,
      Icon: Clock3Icon,
      colorClass:
        "border-zinc-200/70 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900",
    },
    {
      label: copy.statsDue,
      value: stats.due,
      Icon: TriangleAlertIcon,
      colorClass:
        "border-red-200/70 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/40",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((item) => (
        <Card
          key={item.label}
          className="justify-between gap-3 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm"
        >
          <CardHeader className="flex flex-row items-start justify-between px-5 pt-5 pb-0">
            <p className="text-[12px] font-medium text-muted-foreground">
              {item.label}
            </p>
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-xl border ${item.colorClass}`}
            >
              <item.Icon className="size-4" />
            </span>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <p className="text-xl font-semibold tracking-tight text-foreground">
              {item.value.toLocaleString(numberLocale)}
            </p>
          </CardContent>
        </Card>
      ))}

      <Card className="justify-between gap-3 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between px-5 pt-5 pb-0">
          <p className="text-[12px] font-medium text-muted-foreground">
            {copy.statsDueWithin}
          </p>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-amber-200/70 bg-amber-50 text-amber-600 dark:border-amber-900 dark:bg-amber-950/40">
            <CalendarClockIcon className="size-4" />
          </span>
        </CardHeader>
        <CardContent className="flex items-end justify-between gap-3 px-5 pb-5">
          <p className="text-xl font-semibold tracking-tight text-foreground">
            {stats.dueWithin.toLocaleString(numberLocale)}
          </p>
          <Select
            value={String(dueWindow)}
            onValueChange={(value) => {
              if (!value) return
              const days = Number(value) as DueWindowDays
              if (DUE_WINDOW_OPTIONS.includes(days)) {
                onDueWindowChange(days)
              }
            }}
          >
            <SelectTrigger
              className="h-8 max-w-36 bg-background px-2 text-xs"
              aria-label={copy.dueFilter}
            >
              <SelectValue>
                {() => getDueWindowLabel(copy, dueWindow)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              {DUE_WINDOW_OPTIONS.map((days) => (
                <SelectItem key={days} value={String(days)}>
                  {getDueWindowLabel(copy, days)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  )
}
