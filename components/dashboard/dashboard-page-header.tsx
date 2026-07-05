"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import { useLandingLocale } from "@/components/landing-locale-provider"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getDashboardSectionFromPath } from "@/lib/auth/role-access"
import { dashboardContent } from "@/lib/dashboard-content"

type DashboardPageHeaderProps = {
  actions?: ReactNode
}

export function DashboardPageHeader({ actions }: DashboardPageHeaderProps) {
  const pathname = usePathname()
  const { locale } = useLandingLocale()
  const copy = dashboardContent[locale]
  const sectionKey = getDashboardSectionFromPath(pathname)
  const pageTitle = copy.nav[sectionKey]
  const isDashboard = pathname === "/dashboard"
  const isDebtPage = pathname.startsWith("/dashboard/debts/")

  return (
    <div className="flex flex-row flex-wrap items-center justify-between border-b border-border/60 px-4 py-4 sm:px-6">
      <div className="flex flex-col items-start justify-center">
        <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {pageTitle}
        </h1>
        <Breadcrumb className="mt-1.5">
          <BreadcrumbList>
            <BreadcrumbItem>
              {isDashboard ? (
                <BreadcrumbPage>{copy.nav.dashboard}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<Link href="/dashboard" />}>
                  {copy.nav.dashboard}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {isDebtPage ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span>{copy.shell.debtsLabel}</span>
                </BreadcrumbItem>
              </>
            ) : null}

            {!isDashboard ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : null}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {actions ? (
        <div className="flex flex-row flex-wrap items-center justify-end gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  )
}
