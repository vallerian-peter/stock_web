import type {
  DebtDialogCopy,
  DebtDueFilter,
  DueWindowDays,
} from "./debt-feature-types"

export const DUE_WINDOW_OPTIONS: DueWindowDays[] = [1, 3, 7, 31, 186, 366]

export function getDueWindowLabel(copy: DebtDialogCopy, days: DueWindowDays) {
  const labels: Record<DueWindowDays, string> = {
    1: copy.within1Day,
    3: copy.within3Days,
    7: copy.within7Days,
    31: copy.within31Days,
    186: copy.within186Days,
    366: copy.within366Days,
  }

  return labels[days]
}

export function isDebtDueFilter(value: string): value is DebtDueFilter {
  if (value === "all" || value === "due") return true
  if (!value.startsWith("within-")) return false

  return DUE_WINDOW_OPTIONS.includes(
    Number(value.replace("within-", "")) as DueWindowDays
  )
}
