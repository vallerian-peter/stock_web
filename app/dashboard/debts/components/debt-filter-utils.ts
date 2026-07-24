import type {
  DebtDueFilter,
  DebtStatus,
  DueWindowDays,
} from "./debt-feature-types"

type DebtSummaryRecord = {
  balanceAmount: string
  dueDate: string | null
  status: DebtStatus
}

const DAY_IN_MS = 24 * 60 * 60 * 1000

function dateTimestamp(value: string) {
  return new Date(`${value.slice(0, 10)}T00:00:00`).getTime()
}

function todayTimestamp() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today.getTime()
}

function isOutstanding(record: DebtSummaryRecord) {
  return record.status !== "PAID" && Number(record.balanceAmount) > 0
}

function isDue(record: DebtSummaryRecord) {
  if (!isOutstanding(record) || !record.dueDate) return false
  return dateTimestamp(record.dueDate) <= todayTimestamp()
}

function isDueWithin(record: DebtSummaryRecord, days: DueWindowDays) {
  if (!isOutstanding(record) || !record.dueDate) return false

  const difference = dateTimestamp(record.dueDate) - todayTimestamp()
  return difference > 0 && difference <= days * DAY_IN_MS
}

export function matchesDebtDueFilter(
  record: DebtSummaryRecord,
  filter: DebtDueFilter
) {
  if (filter === "all") return true
  if (filter === "due") return isDue(record)

  return isDueWithin(
    record,
    Number(filter.replace("within-", "")) as DueWindowDays
  )
}

export function calculateDebtStats(
  records: DebtSummaryRecord[],
  dueWindow: DueWindowDays
) {
  return records.reduce(
    (stats, record) => {
      if (record.status === "PAID" || Number(record.balanceAmount) <= 0) {
        stats.paid += 1
      } else {
        stats.notPaid += 1
      }

      if (isDue(record)) stats.due += 1
      if (isDueWithin(record, dueWindow)) stats.dueWithin += 1

      return stats
    },
    { paid: 0, notPaid: 0, due: 0, dueWithin: 0 }
  )
}
