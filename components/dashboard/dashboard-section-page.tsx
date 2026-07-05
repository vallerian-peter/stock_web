import type { ComponentProps, ReactNode } from "react"

import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { cn } from "@/lib/utils"

export function DashboardSectionPage({
  actions,
  className,
  children,
  ...props
}: ComponentProps<"section"> & { actions?: ReactNode }) {
  return (
    <DashboardPage actions={actions}>
      <section className={cn("min-w-0", className)} {...props}>
        {children}
      </section>
    </DashboardPage>
  )
}
