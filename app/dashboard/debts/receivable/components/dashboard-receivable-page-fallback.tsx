"use client"

import { useLandingLocale } from "@/components/landing-locale-provider"
import { DashboardDebtPageFallback } from "../../components/dashboard-debt-page-fallback"
import { receivableDialogCopy } from "./receivable-dialog-copy"

export function DashboardReceivablePageFallback() {
  const { locale } = useLandingLocale()
  return <DashboardDebtPageFallback addLabel={receivableDialogCopy[locale].addBtn} />
}
