import type { LandingLocale } from "@/lib/landing-content"

export type DebtStatus = "PENDING" | "PARTIAL" | "PAID"
export type DueWindowDays = 1 | 3 | 7 | 31 | 186 | 366
export type DebtDueFilter = "all" | "due" | `within-${DueWindowDays}`

export type DebtRecordView = {
  id: number
  sourceId: number | null
  partyName: string
  partyPhone: string | null
  referenceNumber: string | null
  totalAmount: string
  amountPaid: string
  balanceAmount: string
  status: DebtStatus
  debtDate: string | null
  dueDate: string | null
  notes: string | null
  createdByName: string | null
  createdAt: string
}

export type DebtFormValues = {
  partyName: string
  partyPhone?: string
  referenceNumber?: string
  totalAmount: number
  amountPaid?: number
  debtDate: string
  dueDate?: string
  notes?: string
}

export type DebtDialogCopy = {
  addTitle: string
  addBtn: string
  addDescription: string
  searchPlaceholder: string
  showing: string
  sort: string
  ascending: string
  descending: string
  loadingTitle: string
  loadingDescription: string
  loadErrorTitle: string
  emptyTitle: string
  emptyDescription: string
  noResultsTitle: string
  noResultsDescription: string
  statsPaid: string
  statsNotPaid: string
  statsDue: string
  statsDueWithin: string
  dueFilter: string
  allDueDates: string
  dueNow: string
  within1Day: string
  within3Days: string
  within7Days: string
  within31Days: string
  within186Days: string
  within366Days: string
  viewTitle: string
  viewDescription: string
  partyName: string
  partyNamePlaceholder: string
  partyPhone: string
  partyPhonePlaceholder: string
  referenceNumber: string
  referenceNumberPlaceholder: string
  totalAmount: string
  amountPaid: string
  balanceAmount: string
  status: string
  debtDate: string
  debtDateTodayToggle: string
  debtDateTodayDescription: string
  dueDate: string
  source: string
  manualEntry: string
  notes: string
  notesPlaceholder: string
  createdBy: string
  createdAt: string
  statusPending: string
  statusPartial: string
  statusPaid: string
  cancel: string
  create: string
  close: string
  actions: string
  openActions: string
  createSuccess: string
  deleteTitle: string
  deleteDescription: string
  confirmDelete: string
  deleteSuccess: string
  deleteError: string
  validation: {
    partyRequired: string
    totalRequired: string
    amountPaidInvalid: string
    debtDateRequired: string
    dueDateBeforeDebtDate: string
  }
}

export type LocalizedDebtCopy = Record<LandingLocale, DebtDialogCopy>
