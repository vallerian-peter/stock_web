import type { ComponentProps, ReactNode } from "react"

import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header"
import { cn } from "@/lib/utils"

type DashboardPageProps = ComponentProps<"div"> & {
  actions?: ReactNode
}

export function DashboardPage({
  actions,
  children,
  className,
  ...props
}: DashboardPageProps) {
  return (
    <>
      <DashboardPageHeader actions={actions} />
      <div
        className={cn("min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-5", className)}
        {...props}
      >
        {children}
      </div>
    </>
  )
}
