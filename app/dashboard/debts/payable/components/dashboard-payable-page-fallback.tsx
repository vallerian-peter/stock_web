"use client"

import { useLandingLocale } from "@/components/landing-locale-provider"
import { DashboardDebtPageFallback } from "../../components/dashboard-debt-page-fallback"
import { payableDialogCopy } from "./payable-dialog-copy"

export function DashboardPayablePageFallback() {
  const { locale } = useLandingLocale()
  return <DashboardDebtPageFallback addLabel={payableDialogCopy[locale].addBtn} />
}
